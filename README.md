# Kubik – Ride Booking Application

**Kubik** is a modern ride-booking platform that allows users to book rides with verified drivers (captains) for convenient and reliable transportation. Built with **React** and **Node.js**, it offers real-time tracking, secure payments, and a seamless booking experience.

## 🚀 Features

### 👤 For Users
- Easy ride booking with location search and autocomplete
- Real-time ride tracking with live driver location
- Multiple vehicle categories
- Fare estimation before booking
- Secure online payment via Razorpay
- Ride history and digital receipts
- User profile management

### 🚗 For Drivers (Captains)
- Real-time ride request notifications
- Navigation assistance with Google Maps
- Ride management dashboard
- Earnings tracking and history
- Profile and vehicle management
- Location sharing with users
- Ride status updates
- Payment collection system

## 🛠 Tech Stack

### Frontend
- React.js with Vite
- React Router (navigation)
- Tailwind CSS (responsive design)
- GSAP (animations)
- Socket.io (real-time communication)
- Google Maps API (location services)
- Razorpay (secure payment integration)

### Backend
- Node.js with Express
- MongoDB (database)
- Socket.io (real-time communication)
- JWT (authentication)
- Google Maps API (geolocation)
- Razorpay API (payment processing)

## ⚙️ Prerequisites

Before starting, ensure you have:
- Node.js (v14 or higher)
- MongoDB
- Google Maps API key
- Razorpay API keys

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/kubik.git
cd kubik
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment variables

#### Backend `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend `.env`
```env
VITE_BASE_URL=http://localhost:5000
VITE_RAZORPAY_API_KEY=your_razorpay_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🧪 Running the Application

### Start backend server
```bash
cd backend
npm run dev
```

### Start frontend development server
```bash
cd frontend
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
kubik/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context providers
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app entry
│   └── package.json
├── backend/
│   ├── controllers/           # Business logic
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middlewares
│   ├── utils/                 # Helper functions
│   └── server.js              # Server entry point
└── README.md
```

## 🚕 Ride Booking Flow

1. User enters pickup and destination
2. Vehicle options with fare estimates are shown
3. User selects a vehicle and confirms booking
4. System finds nearby drivers
5. A driver accepts the ride
6. Real-time tracking begins
7. Payment is processed securely upon ride completion

## 🔁 Real-time Features

- Live user-driver location tracking
- Ride status updates
- Chat between user and driver
- Payment status notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Google Maps API** – Navigation and geolocation
- **Razorpay** – Payment gateway
- **Socket.io** – Real-time communication
- All contributors and open-source libraries that made this project possible

## 📬 Contact

**Kunal Gupta**  
📧 kunal.gupta.91165@gmail.com  
�� Project: [GitHub - Kubik](https://github.com/Kunal-Gupta28/kubik)
