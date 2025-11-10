# InternTrack Server (dev)

This folder contains a small Node/Express + Mongoose mock backend for development. It provides simple endpoints for authentication and managing internship applications.

Setup

1. Copy `.env.example` to `.env` and update values (MongoDB URI and JWT secret).

2. Install dependencies from the `server/` folder:

   ```powershell
   cd server
   npm install
   ```

3. Start the server:

   ```powershell
   npm run start
   # or for development with file reload (install nodemon first): npm run dev
   ```

Default endpoints

- `POST /api/auth/register` { username, password } -> { token }
- `POST /api/auth/login` { username, password } -> { token }
- `GET /api/applications` (auth required)
- `POST /api/applications` (auth required)
- `PUT /api/applications/:id` (auth required)
- `DELETE /api/applications/:id` (auth required)

Notes

- This is a simple dev server for local development only. It stores data in MongoDB.
- Protect the `JWT_SECRET` and use strong secrets in real deployments.

Using MongoDB Atlas

- If you created an Atlas cluster, copy the connection string from Atlas (choose the standard connection string, replace the <password> and any `<dbname>` placeholders).
- In the `server/` folder copy `.env.example` to `.env` and set `MONGODB_URI` to the Atlas connection string. Example:

  ```text
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/interntrack_dev?retryWrites=true&w=majority
  JWT_SECRET=your-jwt-secret
  PORT=4001
  ```

- Make sure you added your IP address to the Atlas cluster Network Access list (or allow access from your current IP). See Atlas "Network Access" in the UI.

Seeding demo data

- There's a convenience seed script to create a demo user and two sample applications. From the `server/` folder run:

  ```powershell
  npm run seed
  ```

  The script prints a JWT token you can use to test the protected endpoints (Authorization: Bearer <token>) and inserts sample documents into the configured database.
