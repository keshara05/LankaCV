import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add MONGODB_URI to .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDB() {
  const connection = await clientPromise;
  return connection.db();
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
