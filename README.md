# Taskify – MERN Stack Task Management Application

Taskify is a full-stack task management web application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It allows users to securely register, log in, manage their tasks (add, edit, delete, toggle status), and log out.

This project was developed as part of a **Frontend Developer Intern assignment**, focusing on frontend–backend integration, authentication, security, and scalability.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login using **JWT authentication**
- Secure password hashing with **bcrypt**
- Authentication via **HTTP-only cookies**
- Protected routes (dashboard accessible only after login)
- Logout functionality

### 📝 Task Management
- Create new tasks
- Edit existing tasks
- Delete tasks
- Toggle task completion status
- Fetch user-specific tasks
- Search and filter tasks

### 🛡 Security
- JWT authentication middleware
- HTTP-only cookies
- Secure cookie handling for production
- Server-side validation and error handling

### 🎨 Frontend
- Built with **React.js**
- Context API for global state management
- Axios for API communication
- Responsive and clean UI

### ⚙️ Backend
- RESTful APIs using **Node.js & Express.js**
- MongoDB for data persistence
- Modular and scalable code structure

---

## 🧰 Tech Stack

**Frontend**
- React.js
- Axios
- Context API
- CSS / Tailwind CSS / Bootstrap

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Authentication & Security**
- JWT (JSON Web Tokens)
- bcrypt
- HTTP-only cookies

---

Make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

---

## 🔧 Backend Setup & Run

Step 1: Navigate to backend folder
- cd server

Step 2: Install backend dependencies
- npm install

Step 3: Create .env file inside server folder
Copy code
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- NODE_ENV=production

Step 4: Start backend server
- node server.js
  or
- npm run server

## 🎨 Frontend Setup & Run
Step 1: Navigate to frontend folder
- cd client

Step 2: Install frontend dependencies
- npm install

Step 3: Create .env file inside client folder
- VITE_BACKEND_URL=http://localhost:5000

Step 4: Start frontend application
- npm run dev


