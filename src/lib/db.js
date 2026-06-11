import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

let client;
let clientPromise = null;

// Memory/File-based DB fallback for local development
const MOCK_DB_FILE = path.join(process.cwd(), 'src/lib/mock_db.json');

function readMockDB() {
  try {
    if (fs.existsSync(MOCK_DB_FILE)) {
      return JSON.parse(fs.readFileSync(MOCK_DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to read mock db:', err);
  }
  return { cvs: {}, transactions: {} };
}

function writeMockDB(data) {
  try {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write mock db:', err);
  }
}

class MockCollection {
  constructor(name) {
    this.name = name;
  }

  async findOne(query) {
    const db = readMockDB();
    const items = db[this.name] || {};
    if (query._id) {
      return items[query._id] || null;
    }
    for (const id in items) {
      let match = true;
      for (const key in query) {
        if (items[id][key] !== query[key]) match = false;
      }
      if (match) return items[id];
    }
    return null;
  }

  async updateOne(query, update, options = {}) {
    const db = readMockDB();
    if (!db[this.name]) db[this.name] = {};
    const items = db[this.name];
    const id = query._id;
    if (!id) throw new Error('Query must contain _id');

    let doc = items[id];
    if (!doc && options.upsert) {
      doc = { _id: id, createdAt: new Date() };
      if (update.$setOnInsert) {
        Object.assign(doc, update.$setOnInsert);
      }
    }

    if (doc) {
      if (update.$set) {
        Object.assign(doc, update.$set);
      }
      items[id] = doc;
      writeMockDB(db);
    }
    return { acknowledged: true, modifiedCount: 1 };
  }

  async insertOne(doc) {
    const db = readMockDB();
    if (!db[this.name]) db[this.name] = {};
    const id = doc._id || 'tx-' + Math.random().toString(36).substring(2, 11);
    doc._id = id;
    db[this.name][id] = doc;
    writeMockDB(db);
    return { acknowledged: true, insertedId: id };
  }

  async aggregate(pipeline) {
    const db = readMockDB();
    const txs = db.transactions || {};
    const cvs = db.cvs || {};

    const results = Object.values(txs).map(tx => {
      const cv = cvs[tx.cv_id] || {};
      return {
        id: tx._id,
        cv_id: tx.cv_id,
        bank_name: tx.bank_name,
        payment_slip: tx.payment_slip,
        whatsapp_number: tx.whatsapp_number,
        status: tx.status,
        created_at: tx.createdAt,
        full_name: cv.fullName,
        email: cv.email,
        language: cv.language
      };
    });

    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      toArray: async () => results
    };
  }
}

class MockDB {
  collection(name) {
    return new MockCollection(name);
  }
}

function getClientPromise() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('xxxxxx')) {
    // Treat placeholder URI as missing so we instantly fall back to mock
    console.warn('⚠️ MONGODB_URI is a placeholder or missing.');
    return null;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  } catch (err) {
    console.error('Failed to create MongoClient:', err);
    return null;
  }
}

let useMock = false;

export async function getDB() {
  if (useMock) {
    return new MockDB();
  }

  try {
    const promise = getClientPromise();
    if (!promise) {
      console.warn('⚠️ MongoDB URI missing or invalid. Using local file mock database.');
      useMock = true;
      return new MockDB();
    }
    const connection = await promise;
    // Fast ping to verify connection is alive
    await connection.db().command({ ping: 1 });
    return connection.db();
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Falling back to local file mock database. Error:', err.message);
    useMock = true;
    return new MockDB();
  }
}

export async function saveCV(id, cvData) {
  const db = await getDB();
  const collection = db.collection('cvs');

  const document = {
    _id: id,
    templateId: cvData.templateId || '1',
    themeColor: cvData.themeColor || '#1e3a8a',
    language: cvData.language || 'en',
    fullName: cvData.fullName || '',
    email: cvData.email || '',
    phone: cvData.phone || '',
    nicNumber: cvData.nicNumber || '',
    address: cvData.address || '',
    linkedinUrl: cvData.linkedinUrl || '',
    githubUrl: cvData.githubUrl || '',
    websiteUrl: cvData.websiteUrl || '',
    dob: cvData.dob || '',
    gender: cvData.gender || 'Male',
    civilStatus: cvData.civilStatus || 'Single',
    nationality: cvData.nationality || 'Sri Lankan',
    summary: cvData.summary || '',
    profilePhoto: cvData.profilePhoto || '',
    education: cvData.education || [],
    experience: cvData.experience || [],
    skills: cvData.skills || [],
    references: cvData.references || [],
    updatedAt: new Date()
  };

  // Upsert CV details
  await collection.updateOne(
    { _id: id },
    { 
      $set: document,
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
  return id;
}

export async function getCV(id) {
  const db = await getDB();
  const collection = db.collection('cvs');
  const doc = await collection.findOne({ _id: id });
  if (!doc) return null;

  return {
    id: doc._id,
    templateId: doc.templateId,
    themeColor: doc.themeColor,
    language: doc.language,
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    nicNumber: doc.nicNumber,
    address: doc.address,
    linkedinUrl: doc.linkedinUrl,
    githubUrl: doc.githubUrl,
    websiteUrl: doc.websiteUrl,
    dob: doc.dob,
    gender: doc.gender,
    civilStatus: doc.civilStatus,
    nationality: doc.nationality,
    summary: doc.summary,
    profilePhoto: doc.profilePhoto,
    education: doc.education,
    experience: doc.experience,
    skills: doc.skills,
    references: doc.references,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createTransaction(txId, cvId, bankName, paymentSlip, whatsappNumber) {
  const db = await getDB();
  const collection = db.collection('transactions');

  const doc = {
    _id: txId,
    cv_id: cvId,
    bank_name: bankName,
    payment_slip: paymentSlip,
    whatsapp_number: whatsappNumber,
    status: 'pending',
    createdAt: new Date()
  };

  await collection.insertOne(doc);
  return txId;
}

export async function getTransactions() {
  const db = await getDB();
  const collection = db.collection('transactions');

  const pipeline = [
    {
      $lookup: {
        from: 'cvs',
        localField: 'cv_id',
        foreignField: '_id',
        as: 'cv'
      }
    },
    {
      $unwind: '$cv'
    },
    {
      $project: {
        id: '$_id',
        cv_id: 1,
        bank_name: 1,
        payment_slip: 1,
        whatsapp_number: 1,
        status: 1,
        created_at: '$createdAt',
        full_name: '$cv.fullName',
        email: '$cv.email',
        language: '$cv.language'
      }
    },
    {
      $sort: { created_at: -1 }
    }
  ];

  return await collection.aggregate(pipeline).toArray();
}

export async function getTransaction(id) {
  const db = await getDB();
  const collection = db.collection('transactions');
  const doc = await collection.findOne({ _id: id });
  if (!doc) return null;
  
  return {
    id: doc._id,
    cv_id: doc.cv_id,
    bank_name: doc.bank_name,
    payment_slip: doc.payment_slip,
    whatsapp_number: doc.whatsapp_number,
    status: doc.status,
    createdAt: doc.createdAt
  };
}

export async function updateTransactionStatus(id, status) {
  const db = await getDB();
  const collection = db.collection('transactions');
  await collection.updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } }
  );
  return true;
}
