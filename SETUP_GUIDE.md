# WanderLust Setup Guide

## To Get Your Full Project Working with Database:

### Option 1: Use MongoDB Atlas (FREE & EASIEST)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/wanderlust`)
5. Update `.env` file with:
   ```
   ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust
   ```
6. Restart the app: `node app.js`

### Option 2: Install MongoDB Locally

1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install it
3. Start MongoDB (mongod.exe)
4. The app will auto-connect to `mongodb://127.0.0.1:27017/wanderlust`

---

## Current Status:
✓ App is running on http://localhost:8080
✓ All code is clean and ready
✓ Just need database connection!

Choose Option 1 or 2 above and let me know when you have the connection string!
