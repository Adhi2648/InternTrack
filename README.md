# InternTrack 📋

A modern internship application tracking system built with React, TypeScript, and Node.js. Track your internship applications, manage resumes, and stay organized throughout your job search journey.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)

## ✨ Features

- 📊 **Dashboard** - Overview of your application statistics and progress
- 📝 **Application Tracking** - Add, edit, and manage internship applications
- 📄 **Resume Management** - Store and organize multiple resumes
- 📅 **Calendar View** - Track upcoming interviews and deadlines
- 🔐 **Authentication** - Secure login and signup functionality
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for server state management
- **React Hook Form** + **Zod** for form handling and validation
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** package manager
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Adhi2648/InternTrack.git
cd InternTrack
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up the Backend

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/interntrack_dev
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4001
```

#### Using MongoDB Atlas (Cloud Database)

If you prefer MongoDB Atlas:

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string from the Atlas dashboard
3. Add your IP address to the Network Access list
4. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/interntrack_dev?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4001
```

### 5. Seed Demo Data (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
```

This creates a demo user and sample applications for testing.

### 6. Start the Development Servers

You'll need to run both the frontend and backend servers.

**Terminal 1 - Start the Backend Server:**

```bash
cd server
npm run dev
# or for production
npm run start
```

The backend will run on `http://localhost:4001`

**Terminal 2 - Start the Frontend Development Server:**

```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:5173`

### 7. Open the Application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
InternTrack/
├── public/                 # Static assets
├── server/                 # Backend API
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── scripts/        # Utility scripts
│   └── package.json
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── pages/              # Page components
├── package.json
└── vite.config.ts
```

## 🔧 Available Scripts

### Frontend (Root Directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend (Server Directory)

| Command | Description |
|---------|-------------|
| `npm run start` | Start production server |
| `npm run dev` | Start with hot reload (nodemon) |
| `npm run seed` | Seed database with demo data |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Applications (Protected)
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Resumes (Protected)
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Upload resume
- `DELETE /api/resumes/:id` - Delete resume

> **Note:** Protected routes require `Authorization: Bearer <token>` header

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by [Adhi2648](https://github.com/Adhi2648)
