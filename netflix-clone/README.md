# Netflix Clone - Full Stack Web Application

A comprehensive Netflix clone built with modern web technologies, featuring responsive design, user authentication, video streaming capabilities, and a complete backend API. This project demonstrates advanced full-stack development skills including React.js, Node.js, MongoDB, Firebase authentication, and responsive UI/UX design.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **User Authentication**: Secure login/signup with Firebase Authentication
- **Video Streaming**: Background video playback with audio synchronization
- **Interactive UI Components**: 
  - Mobile-optimized card widgets with like/dislike/add to list functionality
  - Dropdown navigation menus for mobile devices
  - Dynamic content sliders
  - Professional Netflix-style footer with social media integration
- **State Management**: Redux Toolkit for efficient state handling
- **Modern Routing**: React Router for seamless navigation
- **Styled Components**: CSS-in-JS architecture for maintainable styling

### Backend Features
- **RESTful API**: Node.js and Express.js backend server
- **Database**: MongoDB integration for user data and preferences
- **CORS Support**: Cross-origin resource sharing configuration
- **Real-time Updates**: Dynamic content management
- **Error Handling**: Comprehensive error management with fallback mechanisms

### Pages & Components
- **Landing Page**: Hero video background with authentication options
- **Main Dashboard**: Netflix-style interface with movie categories
- **Movies Page**: Dedicated movie browsing with hero sections
- **TV Shows Page**: Television content with responsive layouts
- **My List**: Personal user content management
- **Mobile Widgets**: Touch-optimized interaction components

## 🛠️ Technology Stack

### Frontend
- **React.js 19.1.0**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Styled Components 6.1.19**: CSS-in-JS styling solution
- **Redux Toolkit 2.8.2**: State management
- **React Router DOM 7.7.0**: Client-side routing
- **Firebase 11.10.0**: Authentication and backend services
- **Axios 1.10.0**: HTTP client for API requests
- **React Icons 5.5.0**: Icon library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js 5.1.0**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose 8.17.1**: MongoDB object modeling
- **CORS 2.8.5**: Cross-origin resource sharing
- **Nodemon 3.1.10**: Development server auto-restart

### Development Tools
- **ESLint**: Code linting and formatting
- **Vite**: Development server and build tool
- **Git**: Version control system

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 16.0 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **MongoDB** - [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd netflix-clone
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd netflix-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd netflix-api

# Install dependencies
npm install

# Start backend server
npm start
```

### 4. Environment Configuration

#### Frontend Environment Variables
Create a `.env` file in the frontend root directory:
```env
# Firebase Configuration (Get from Firebase Console: https://console.firebase.google.com/)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend Environment Variables
Create a `.env` file in the backend directory:
```env
# MongoDB Configuration (Get from MongoDB Atlas: https://cloud.mongodb.com/)
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Required External Services Setup

#### Firebase Authentication
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication in the Firebase console
4. Configure sign-in methods (Email/Password recommended)
5. Copy configuration keys to your `.env` file

#### MongoDB Database
1. Visit [MongoDB Atlas](https://cloud.mongodb.com/) for cloud database
2. Create a free cluster
3. Set up database user and network access
4. Copy connection string to your `.env` file

Alternative: Install MongoDB locally from [MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)

## 🚀 Running the Application

### Development Mode
1. **Start Backend Server**:
   ```bash
   cd netflix-api
   npm start
   ```
   Backend will run on: `http://localhost:5000`

2. **Start Frontend Development Server**:
   ```bash
   cd netflix-clone
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

### Production Build
```bash
# Build frontend for production
cd netflix-clone
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Responsiveness

The application is fully optimized for various screen sizes:

- **Desktop**: Full-featured Netflix-like experience
- **Tablet** (768px - 1024px): Adapted layouts with optimized spacing
- **Mobile** (320px - 767px): 
  - Compact navigation with dropdown menus
  - Touch-optimized card interactions
  - Mobile-specific widgets for like/dislike functionality
  - Responsive typography and spacing

## 🎯 Key Learning Outcomes

This project demonstrates proficiency in:

1. **Full-Stack Development**: Complete frontend and backend integration
2. **Modern React Patterns**: Hooks, context, and component composition
3. **Responsive Design**: Mobile-first approach with CSS-in-JS
4. **State Management**: Redux Toolkit for complex application state
5. **Authentication**: Firebase integration for secure user management
6. **API Development**: RESTful API design and implementation
7. **Database Integration**: MongoDB with Mongoose ODM
8. **Build Tools**: Modern development workflow with Vite
9. **Code Quality**: ESLint configuration and best practices

## 🔗 Useful Resources

- **React Documentation**: [https://react.dev/](https://react.dev/)
- **Firebase Documentation**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **MongoDB Documentation**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Styled Components**: [https://styled-components.com/](https://styled-components.com/)
- **Redux Toolkit**: [https://redux-toolkit.js.org/](https://redux-toolkit.js.org/)
- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)

## 📄 Project Structure

```
netflix-clone/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Card.jsx      # Interactive movie cards
│   │   ├── Footer.jsx    # Netflix-style footer
│   │   ├── Navbar.jsx    # Navigation component
│   │   └── Slider.jsx    # Content carousel
│   ├── pages/            # Application pages
│   │   ├── Login.jsx     # Authentication page
│   │   ├── Netflix.jsx   # Main dashboard
│   │   ├── Movies.jsx    # Movies catalog
│   │   ├── Signup.jsx    # User registration
│   │   ├── TVShows.jsx   # TV shows catalog
│   │   └── UserMyList.jsx # Personal content list
│   ├── store/            # Redux state management
│   ├── assets/           # Media files and resources
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── netflix-api/          # Backend server
│   ├── controllers/      # API route handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   └── server.js         # Server configuration
└── package.json          # Project dependencies
```

## 🤝 Contributing

This project was developed as a learning exercise in full-stack web development. Feel free to explore the code and use it as a reference for your own projects.

## 📝 License

This project is created for educational purposes. All Netflix-related assets and branding are property of Netflix, Inc.

---

**Developed with ❤️ as a Full-Stack Development Learning Project**
