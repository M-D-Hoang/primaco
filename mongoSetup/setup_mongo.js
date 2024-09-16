const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'mydb'; 
const collectionName = 'timestamps'; 

async function setupMongoDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);

        const collection = db.collection(collectionName);

        const sampleDocument = { name: 'Sample Document', createdAt: new Date() };
        const result = await collection.insertOne(sampleDocument);

        console.log('Sample document inserted with ID:', result.insertedId);

        const documents = await collection.find({}).toArray();
        console.log('Documents in collection:', documents);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

setupMongoDB();
