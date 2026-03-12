# 🧠 AI-Powered E-Commerce Platform

A modern AI-driven E-commerce application built with the **MERN stack**, featuring advanced caching strategies, global state management, intelligent product recommendations, and high-performance data fetching.

This project uses **Cloudinary** for storing and managing images such as product images and user profile pictures.

## 🛠 Tech Stack

🖥 Frontend
- **React**
- **UI Components: shadcn/ui**
- **TanStack Query**
- **Zustand**
- **TypeScript**

⚙ Backend
- **Express.js**
- **MongoDB**
- **Caching & Queue: Redis**
- **Upstash**
- **Stripe**
- **OpenAI**

### 🔐 Environment Variables

Create a `.env` file:

```env
PORT=
CLIENT_URL=
MONGO_URI=
JWT_TOKEN=

ADMIN_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

OPENAI_API_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

🛠 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ZinHt9tHlaing/ai-ecommerce.git
cd ai-ecommerce
```

2️⃣ Install dependencies

Backend

```bash
cd server
npm install
```

Frontend

```bash
cd client
npm install
```

3️⃣ Run the application

Start Backend

```bash
npm run dev
```

Start Frontend

```bash
npm run dev
```

