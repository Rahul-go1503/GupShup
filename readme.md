# 💬 GupShup

> _Seamless. Secure. Social._  
> Your go-to real-time chat app — built for instant connection, collaboration, and cool vibes.

---

## ✨ Features That Slap

- 🔐 **JWT Auth** – Sign up / Log in securely with email verification & token-based auth
- 💬 **1-on-1 & Group Chat** – Real-time convos, anytime, anywhere
- 👥 **Group Management** – Add/remove members, manage admins like a boss
- ⚡ **Socket.io Magic** – Real-time messaging with typing indicators & online status
- 📁 **File Sharing** – Upload media via **AWS S3** with pre-signed URLs (secure af)
- 📱 **Fully Responsive** – Smooth UI across mobile, tablet & desktop
- 🧠 **Zustand** – Lightweight state management that just works
- 🔍 **User Search & Discovery** – Find your people in a snap
- 🧩 **Modular & Scalable** – Clean code structure for easy updates and maintenance

---

## 🧰 Tech Stack

### 🖼 Frontend

- **React** + **Vite**
- **TailwindCSS**
- **Zustand**
- **Socket.io-client**
- **Vercel** – Hosting

### 🔧 Backend

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.io**
- **AWS S3** – Media/file upload via pre-signed URLs
- **Nodemailer** – Email verification/password reset

---

## 🧪 Getting Started

### ✅ Prerequisites

Make sure you have:

- Node.js installed
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- SMTP server (e.g. [Brevo](https://www.brevo.com) - free and easy)
- AWS S3 bucket configured (for file uploads)

---

## 🚀 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/gupshup.git
cd gupshup
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd ../backend
cp .env.example .env
npm install
npm run dev
```

## 📸 Screenshots / Demo

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to improve.
Let’s make something awesome together 💥

### 🧠 Fun Fact

> \_ **_GupShup (गप्पशप्प)_** literally means casual conversation or chatter in Hindi — and this app is here to bring the same vibe > to your screen 😄
