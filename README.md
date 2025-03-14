# NIVOX - A Quantum-Inspired Personal Blog Platform

<img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/logo.jpg" alt="NIVOX Logo" width="100" height="100">

**NIVOX** is a sleek, full-stack personal blog application built using the MERN Stack (MongoDB, Express.js, React via Next.js, Node.js). It empowers users to create, read, update, and delete (CRUD) blog posts with a futuristic, quantum-inspired design. Featuring secure JWT authentication, optimized performance with Next.js server-side rendering (SSR), and a professional aesthetic powered by Tailwind CSS and custom animations, NIVOX blends cutting-edge technology with creative expression.

## 🚀 Tech Stack & Tools Used

### Frontend:

- **Next.js** (App Router for navigation, SSR, and static site generation)
- **Tailwind CSS** (Utility-first styling with custom colors: depth-black, lumen-white, lumen-cyan, lumen-magenta)
- **React Hook Form & Zod** (Form handling and validation for blog posts)
- **Tanstack Query** (Data fetching and state management for blog CRUD)
- **Custom Animations** (Quantum-inspired effects like fluxPulse, orbit, quantumPulse)

---

### Backend:

- **Node.js & Express.js** (for handling API routes)
- **JWT** (for authentication)
- **MongoDB & Mongoose** (for database)
- **Redis** (for caching)

---

### Development & Deployment:

- **Webpack Dev Server** (Live reloading via Next.js)
- **Babel** (Modern JavaScript support via Next.js)
- **Git & GitHub** (Version control)
- **Vercel** (Optional deployment platform for Next.js)

---

## 💡 Features

- ✅ **User Authentication:** Secure login/register with JWT.
- ✅ **CRUD Operations:** Create, edit, delete, and view blog posts.
- ✅ **Quantum-Inspired Design:** Infinite-depth lattice backgrounds, glowing effects, and orbiting particles in the navbar.
- ✅ **Copy/Paste Restrictions:** Disabled globally except on create/edit pages to protect content.
- ✅ **Server-Side Rendering:** Optimized performance with Next.js SSR.
- ✅ **Responsive Design:** Mobile-friendly layout with Tailwind CSS.
- ✅ **Dynamic Animations:** Custom effects like latticeDrift, depthGlow, and paneRise for a futuristic UI.
- ✅ **Error Handling:** Robust form validation and user feedback.
- ✅ **MongoDB for scalable database storage**
- ✅ **Redis for caching and performance boost**

---

## 📸 Screenshots

- **Logo**:  
  <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/logo.jpg" alt="NIVOX Logo" width="50" height="50">
- **Homepage**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/hoem.png" alt="Homepage" width="200">
- **All Blogs**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/blogs.png" alt="Navbar" width="200">
- **Create Post**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/createblog.png" alt="Create Post" width="200">

# 📂 Project Setup & Installation

### Prerequisites:
- **Node.js** (v16+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Git** (For cloning the repository)

### Backend Setup:

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/sureshbarach2001/NIVOX-Personal-Blog-Platform.git
cd NIVOX-Personal-Blog-Platform
cd backend
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Set up environment variables:

**Set Up Environment Variables:** Create a .env file in the backend directory and add:

```env
PORT=5000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
MONGO_URI=your-mongo-uri
REDIS_URL=your-redis-url
```

- Replace your-access-secret and your-refresh-secret with secure random strings (e.g., generate with openssl rand -hex 32).
- Replace your-mongo-uri with your MongoDB connection string (e.g., mongodb://localhost:27017/nivox or a MongoDB Atlas URI).

### 4️⃣ Start the Back-end server:

```bash
npm start
```

- The backend API will run on http://localhost:5000.

---

---

### Frontend Setup

### 1️⃣ Navigate to Frontend:

- Open New Terminal

```bash
cd NIVOX-Personal-Blog-Platform
cd frontend
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Configure next.config.js:

- Create or update frontend/next.config.js to allow the external logo:

```bash
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.grok.com"],
  },
};
module.exports = nextConfig;
```

### 3️⃣ Start the development server:

```bash
npm run dev
```

### 4️⃣ This will start the frontend on http://localhost:3000

### 🚀 Access the application:

- **Frontend:** Open your browser and navigate to http://localhost:3000.
- **Backend API:** Accessible at http://localhost:5000/api.

# 🚀 API Endpoints

- Blogs:

  - **GET /api/blogs:** Fetch all blog posts.
  - **GET /api/blogs/:id:** Fetch a single blog post.
  - **POST /api/blogs:** Create a blog post (JWT required).
  - **PUT /api/blogs/:id:** Update a blog post (JWT required).
  - **DELETE /api/blogs/:id:** Delete a blog post (JWT required).

- Authentication:
  - **POST /api/auth/register:** Register a new user.
  - **POST /api/auth/login:** Login and receive JWT tokens.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Acknowledgments

- **Next.js Documentation:** For SSR and App Router guidance.
- **Tailwind CSS:** For rapid, beautiful styling.
- **MongoDB & Mongoose:** For robust database support.

## 📢 How to Push to GitHub

To push changes to GitHub, follow these steps:

```bash
git init
git remote add origin https://github.com/sureshbarach2001/NIVOX-Personal-Blog-Platform.git
git add .
git commit -m "Initial commit - NIVOX-Personal-Blog-Platform"
git branch -b Your-Branch-Name
git push -u origin Your-Branch-Name
```

## 📂 Tags

#mern #nextjs #express #nodejs #mongodb #fullstack #blog #webdev #jwt #tailwindcss #react #quantumdesign #nivox

## 🎨 Design Highlights

- **Navbar:** Features orbiting particles that follow mouse movement, with glowing lumen-cyan accents.
- **Background:** Infinite-depth lattice animation with lumen-white particles pulsing across a depth-black canvas.
- **Forms:** Glowing edges and subtle animations (paneRise, depthEdge) for a futuristic feel.
- **Security:** Copy/paste and right-click disabled outside create/edit pages to protect content.

## 🔧 Future Enhancements

- **Caching:** Integrate Redis for performance boosts.
- **Notifications:** Add React Hot Toast for user feedback.
- **Deployment:** Deploy to Vercel or Netlify for a live demo.
- **Rich Text Editor:** Upgrade the blog content field with a WYSIWYG editor (e.g., TinyMCE or Quill).

# 📞 Contact
- [**Portfolio**](https://sureshbarach2001.vercel.app/)
- [**GitHub:**](https://github.com/sureshbarach2001)
- [**Email:**](mailto:sainnk4831@gmail.com)
