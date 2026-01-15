# Implementation 

## Environment Setup
### Required Software
* Node.js (v18+)
* PostgreSQL
* npm

## Navigate Project Directory
```bash
cd ai-study-tool
```

## Install Project Dependencies
#### Backend
```bash
cd server
npm install
```
### Frontend
```bash
cd ../client
npm install
```
## Data Storage Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE shortly;
```
2. Run Schema:
```bash
psql shortly < server/db/schema.sql
```
3. Create `server/.env`
```env
DATABASE_URL=postgres://username:password@localhost:5432/shortly
SESSION_SECRET=your_secret_here
OPENAI_API_KEY=your_openai_api_key
```

## How to Start the Application
### Backend
```bash
cd server
node index.js
```
### Frontend
```bash
cd client
npm run dev
```

## Troubleshooting
### 401 Unauthorized
* User is not logged in
* Session cookie missing or expired

### Saved notes not appearing
* User not authenticated
* Database not populated correctly

### OpenAI errors
* Invalid or missing API key
* API quota exceeded
   



