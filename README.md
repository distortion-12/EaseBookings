# EaseBookings (AppointEase)

A simple appointment booking platform consisting of a Next.js client and an Express/MongoDB server.

This repository was imported and pushed to GitHub: https://github.com/distortion-12/EaseBookings

## Contents

- `client/` — Next.js frontend
- `server/` — Express backend

## Prerequisites

- Node.js (v18+ preferred)
- npm (comes with Node)
- MongoDB (local or a hosted connection string)

## Setup

### 1) Install dependencies
Open two terminals (one for client, one for server) or run sequentially:

```powershell
# From project root
cd server; npm install; cd ..
cd client; npm install; cd ..
```

### 2) Configure environment variables
- Client:
	- Copy client/.env.example to `.env.local`
	- Adjust `NEXT_PUBLIC_API_BASE_URL` if needed
- Server:
	- Copy server/.env.example to `.env`
	- Set `MONGO_URI`, `JWT_SECRET`, and SMTP settings

### 3) Run in development
- Client (Next.js):
```powershell
cd client
npm run dev
```
- Server (Express):
```powershell
cd server
npm run dev
```

By default, client runs on http://localhost:3000 and server on http://localhost:5000.

## Build and run production

Client:
```powershell
cd client
npm run build
npm run start
```

Server:
```powershell
cd server
npm start
```

## Troubleshooting
- You may see npm audit warnings; run `npm audit fix`. Use `--force` cautiously.
- Ensure MongoDB is running and `MONGO_URI` is correct.


