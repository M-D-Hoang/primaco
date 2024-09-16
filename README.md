# Store a Timestamp

## Info

Store a timestamp of the chosen timezone, along with a note.

Data from worldtimeapi.org, stored in a local MongoDB instance, displayed on a React App.

## Setup

**Run MongoDB from docker:**

Install docker, open docker run:

```
docker pull mongo
```

```
docker run --name mongodb -d -p 27017:27017 mongo
```

Cd into /mongoSetup, run:

```
node setup_mongo.js
```

**Run Server:**

Cd into /backend, run:

```
node server.js
```

**Run Client:**

Cd into /frontend, run:

```
npm start
```

A React app will open on http://localhost:3000/
