# EaseBookings (AppointEase)

A simple appointment booking platform consisting of a Next.js client and an Express/MongoDB server.

This repository was imported and pushed to GitHub: https://github.com/distortion-12/EaseBookings

## Contents

- `client/` — Next.js frontend
- `server/` — Express backend

## Prerequisites

- Node.js (v16+ recommended, 18+ preferred)
- npm (comes with Node)
- MongoDB (local or a hosted connection string)

## Environment variables

Create a `.env` file in the `server/` directory with at least the following values (names are conventional; adjust if your server code expects different names):

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-secret-string>
PORT=5000
# Optional: email settings used by the server if configured
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

**Environment variables**
- `MONGO_URI` - MongoDB connection string for server.
- `JWT_SECRET` - Secret for signing JWTs.
- `OPENAI_API_KEY` - (optional) OpenAI API key used by the AI assistant endpoint.
- `NEXT_PUBLIC_API_URL` - (client) URL to the server API (defaults to `http://localhost:8000/api`).

**Notes**
- The project includes an AI assistant endpoint at `/api/ai/chat` that forwards messages to OpenAI. Set `OPENAI_API_KEY` for it to work.

Note: I inferred common names above. If your server expects different env names, update accordingly.

## Install dependencies

Open two terminals (one for client, one for server) or run the commands sequentially from project root.

PowerShell example from project root (`C:\Users\ramch\Desktop\AppointmentEase\1.0`):

```powershell
# Install server deps
cd server; npm install; cd ..
# Install client deps
cd client; npm install; cd ..
```

## Run in development

Client (Next.js):
```powershell
cd client
npm run dev
```

Server (Express):
```powershell
cd server
# If you have nodemon installed (dev), use:
npm run dev
# Or run directly with Node:
npm start
```

Open the Next.js app (usually at http://localhost:3000) and ensure your server is running on the port set in your `.env` (commonly 5000).

## Build and run production

Client:
```powershell
cd client
npm run build
npm run start
```

Server: run `npm start` in `server/` (ensure `NODE_ENV=production` and proper env vars set).

## Useful git notes

This project has been pushed to GitHub at:

https://github.com/distortion-12/EaseBookings

To set a global Git identity (so commits are authored correctly):

```powershell
git config --global user.name "Your Full Name"
git config --global user.email "you@example.com"
```

For HTTPS pushes, prefer using a Personal Access Token (PAT) for authentication, or configure SSH keys.

## Next steps / Suggestions

- Add a `README` section describing how to seed the database (if you have seed data).
- Add `.env.example` to document required environment variables.
- Add a `README` badge or a simple GitHub Action for running lint/tests.

---

If you'd like, I can also:
- Add a `.env.example` file with placeholders.
- Add a short CONTRIBUTING.md and CODE_OF_CONDUCT.
- Create a basic GitHub Actions workflow to run lint/build on push.

