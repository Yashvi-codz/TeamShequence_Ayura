// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayura';
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Mock database for development without MongoDB
export const mockDB = {
  users: [],
  quizResponses: [],
  doctorProfiles: [],
};

export async function getDatabase() {
  try {
    const client = await clientPromise;
    return client.db('ayura');
  } catch (error) {
    console.log('Using mock database');
    return {
      collection: (name) => ({
        findOne: async (query) => mockDB[name]?.find(item => 
          Object.keys(query).every(key => item[key] === query[key])
        ),
        insertOne: async (doc) => {
          const id = Date.now().toString();
          const newDoc = { ...doc, _id: id };
          if (!mockDB[name]) mockDB[name] = [];
          mockDB[name].push(newDoc);
          return { insertedId: id };
        },
        updateOne: async (query, update) => {
          const index = mockDB[name]?.findIndex(item =>
            Object.keys(query).every(key => item[key] === query[key])
          );
          if (index > -1) {
            mockDB[name][index] = { ...mockDB[name][index], ...update.$set };
          }
          return { modifiedCount: index > -1 ? 1 : 0 };
        },
        find: () => ({
          toArray: async () => mockDB[name] || []
        })
      })
    };
  }
}
