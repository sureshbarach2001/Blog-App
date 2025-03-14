# MERN Stack Personal Blog (Blog-App)

A full-stack personal blog application built using the MERN Stack (MongoDB, Express.js, Next.js, Node.js). This blog allows users to create, read, update, and delete (CRUD) blog posts, manage authentication using JWT, and ensures optimized performance with Next.js features like server-side rendering and static site generation.

## 🚀 Tech Stack & Tools Used

### Frontend:
- **Next.js** (with App Router for navigation and server-side rendering)
- **Tailwind CSS** (for styling)
- **Framer Motion** (for animations)
- **React Hot Toast** (for notifications)

### Backend:
- **Node.js & Express.js** (for handling API routes)
- **JWT** (for authentication)
- **MongoDB & Mongoose** (for database)
- **Redis** (for caching)

### Development & Deployment:
- **Webpack Dev Server** (for live reloading)
- **Babel** (for modern JavaScript support)
- **Git & GitHub** (for version control)

## 💡 Features

- ✅ **User Authentication (JWT)**
- ✅ **Create, Edit, Delete Blog Posts**
- ✅ **Optimized Routing using React Router**
- ✅ **Server-Side Rendering and Static Site Generation with Next.js**
- ✅ **MongoDB for scalable database storage**
- ✅ **Redis for caching and performance boost**

## 📂 Project Setup & Installation for Back-end:
### 1️⃣ Clone the repository:

```bash
git clone https://github.com/sureshbarach2001/Blog-App.git
cd mern-personal-blog
cd backend
```
### 2️⃣ Install dependencies:
```bash
npm install
```
### 3️⃣ Set up environment variables:
Create a .env file in the root directory and add the following:
````env
PORT=5000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
MONGO_URI=your-mongo-uri
REDIS_URL=your-redis-url
````
Replace your-access-secret, your-refresh-secret, your-mongo-uri, and your-redis-url with your actual values.

### 4️⃣ Start the Back-end server:
```bash
npm start
```
###  5️⃣ This will start the Back-end server on port 5000.
---
---
---
---
---
---
## 📂 Project Setup & Installation for Front-end:
### 1️⃣ Clone the repository:

```bash
git clone https://github.com/sureshbarach2001/Blog-App.git
cd mern-personal-blog
cd frontend
```
### 2️⃣ Install dependencies:
```bash
npm install
```
### 3️⃣ Start the development server:
```bash
npm run dev
```
### 4️⃣ This will start the frontend on http://localhost:3000


### 🚀 Access the application:
- Open your browser and navigate to http://localhost:3000 to view the blog.
- The backend API will be running at http://localhost:5000/api.

## 📢 How to Push to GitHub
To push changes to GitHub, follow these steps:
```bash
git init
git remote add origin https://github.com/sureshbarach2001/Blog-App.git
git add .
git commit -m "Initial commit - MERN Personal Blog"
git branch -b Your-Branch-Name
git push -u origin Your-Branch-Name
```

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Acknowledgments
This project was created with the help of various online resources. Special thanks to the Next.js documentation, MERN stack documentation, and MongoDB documentation for their excellent guides.

## 📂 Tags
#mern #nextjs #express #nodejs #mongodb #fullstack #blog #webdev #jwt #redis #tailwindcss

This `README.md` will serve as a comprehensive guide for users to understand, install, and contribute to your MERN Stack Personal Blog-App project.
