const http = require('http');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { URL } = require('url');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'timedb';
const collectionName = 'timestamps';

const TIMESTAMP_API_URL = 'https://worldtimeapi.org/api/timezone/';

async function fetchTimestamp(timezone, note) {
    try {
        const response = await axios.get(`${TIMESTAMP_API_URL}${timezone}`);
        const currentTime = response.data.datetime;

        // Connect to MongoDB and save the timestamp
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne({ timestamp: currentTime, timezone: timezone, note: note });

        console.log('Timestamp saved:', currentTime + ' ' + timezone + ' ' + note);
        return { timestamp: currentTime };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to retrieve all stored timestamps
async function getAllTimestamps() {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.find({}).toArray();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to delete all stored timestamps
async function deleteAllTimestamps() {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.deleteMany({});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Create HTTP server
http.createServer(async (req, res) => {
    // Handle CORS request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/get-timestamps' && req.method === 'GET') {
        try {
            await client.connect();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const timestamps = await getAllTimestamps();
            res.end(JSON.stringify(timestamps));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve timestamps' }));
        } finally {
            await client.close();
        }
    } else if (req.url === '/fetch-timestamp' && req.method === 'POST') {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const { timezone, note } = JSON.parse(body);                
                await client.connect();
                const time = await fetchTimestamp(timezone, note);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(time));
                await client.close();
            });
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch timestamp' }));
        }
    } else if (req.url === '/delete-all-timestamps' && req.method === 'DELETE') {
        try {
            await client.connect();
            const result = await deleteAllTimestamps();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete all timestamps' }));
        } finally {
            await client.close();
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}).listen(8080);

console.log('Server running at http://localhost:8080');
