# 🚗 Kuber - Ride Sharing Application

Kuber is a modern ride-sharing application built with React, featuring real-time tracking, smooth animations, and a user-friendly interface. The application connects riders with drivers, providing a seamless experience from booking to arrival.

## 📋 Detailed Features

### 1. 🗺️ Location & Navigation
- **Smart Location Search**
  - Google Maps integration
  - Location suggestions
  - Current location detection
  - Address validation
  - Route optimization

- **Real-time Tracking**
  - Live location updates
  - Route visualization
  - ETA calculation
  - Distance tracking
  - Turn-by-turn navigation

### 2. 🚘 Vehicle Management
- **Multiple Vehicle Options**
  - KUberGo (Standard)
  - MOTO (Motorcycle)
  - Premier (Premium)
  - KUberAuto (Auto-rickshaw)

- **Vehicle Details**
  - Capacity information
  - Fare calculation
  - Vehicle images
  - Driver details
  - ETA information

### 3. 💳 Payment System
- **Secure Payments**
  - Razorpay integration
  - Multiple payment methods
  - Fare calculation
  - Payment verification
  - Transaction history

### 4. 👥 User Management
- **Rider Features**
  - User registration/login
  - Profile management
  - Ride history
  - Favorite locations
  - Rating system

- **Driver Features**
  - Driver registration/login
  - Vehicle management
  - Earnings tracking
  - Ride acceptance
  - Navigation support

### 5. 🔄 Real-time Features
- **Live Updates**
  - Socket.io integration
  - Real-time ride status
  - Driver location tracking
  - Ride matching
  - Instant notifications

### 6. 🌗 UI/UX Features
- **Responsive Design**
  - Mobile-first approach
  - Dark/Light mode
  - Smooth animations
  - Intuitive interface
  - Loading states

### 7. 🔐 Security
- **Authentication**
  - JWT implementation
  - Secure routes
  - Role-based access
  - Session management
  - Data encryption

## 🛠️ Tech Stack

### Frontend
- React.js
- GSAP for animations
- Tailwind CSS
- Socket.io client
- Google Maps API
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT
- Razorpay API

## 🏗️ Project Structure

```
kuber/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── backend/
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes

```

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- Google Maps API key
- Razorpay account

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/kuber.git
cd kuber

# 2. Install dependencies
cd frontend
npm install

cd ../backend
npm install

# 3. Set up environment variables
# Frontend (.env)
VITE_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RAZORPAY_API_KEY=your_razorpay_api_key

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps API
- Razorpay
- Socket.io
- GSAP
- React.js community

---

## 🔗 Demo

[🔗 Live Demo](https://your-kuber-clone-url.com)

![Dashboard Screenshot](./screenshots/dashboard.png)

---

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS or Material UI
- Chart.js / Recharts
- Context API / Redux (for state)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication

**Deployment:**
- Frontend: Vercel / Netlify
- Backend: Render / Railway / Heroku

---

## 🧑‍💻 Installation

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/kuber-clone.git
cd kuber-clone

# 2. Install backend dependencies
npm install

# 3. Set up environment variables
touch .env
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development