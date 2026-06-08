import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client;
let clientPromise;

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

async function getDb() {
  const conn = await clientPromise;
  return conn.db();
}

export async function saveCV(id, cvData) {
  const db = await getDb();
  const collection = db.collection('cv_data');

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
    summary: cvData.summary || '',
    profilePhoto: cvData.profilePhoto || '',
    education: cvData.education || [],
    experience: cvData.experience || [],
    skills: cvData.skills || [],
    references: cvData.references || [],
    updatedAt: new Date()
  };

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
  const db = await getDb();
  const collection = db.collection('cv_data');
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
    summary: doc.summary,
    profilePhoto: doc.profilePhoto,
    education: doc.education || [],
    experience: doc.experience || [],
    skills: doc.skills || [],
    references: doc.references || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createTransaction(txId, cvId, bankName, paymentSlip, whatsappNumber) {
  const db = await getDb();
  const collection = db.collection('transactions');
  await collection.insertOne({
    _id: txId,
    cvId: cvId,
    bankName: bankName,
    paymentSlip: paymentSlip,
    whatsappNumber: whatsappNumber || '',
    status: 'pending',
    createdAt: new Date()
  });
  return txId;
}

export async function getTransactions() {
  const db = await getDb();
  const collection = db.collection('transactions');

  const list = await collection.aggregate([
    {
      $lookup: {
        from: 'cv_data',
        localField: 'cvId',
        foreignField: '_id',
        as: 'cv'
      }
    },
    {
      $unwind: {
        path: '$cv',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]).toArray();

  return list.map(tx => ({
    id: tx._id,
    cv_id: tx.cvId,
    bank_name: tx.bankName,
    payment_slip: tx.paymentSlip,
    whatsapp_number: tx.whatsappNumber,
    status: tx.status,
    created_at: tx.createdAt,
    full_name: tx.cv?.fullName || '',
    email: tx.cv?.email || '',
    language: tx.cv?.language || 'en'
  }));
}

export async function getTransaction(id) {
  const db = await getDb();
  const collection = db.collection('transactions');
  const tx = await collection.findOne({ _id: id });
  if (!tx) return null;
  return {
    id: tx._id,
    cv_id: tx.cvId,
    bank_name: tx.bankName,
    payment_slip: tx.paymentSlip,
    whatsapp_number: tx.whatsappNumber,
    status: tx.status,
    created_at: tx.createdAt
  };
}

export async function updateTransactionStatus(id, status) {
  const db = await getDb();
  const collection = db.collection('transactions');
  await collection.updateOne(
    { _id: id },
    { $set: { status: status } }
  );
  return true;
}
