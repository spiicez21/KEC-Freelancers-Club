# 🎓 KEC Freelancers Club Platform

A **full-stack** premium portfolio platform for college freelancers to showcase their work, connect with clients, and manage their professional identity. Built with modern technologies including **Discord-style** profile layouts, **Glassmorphism** UI, and powered by **Google Sheets** as the database with **Google Drive** for file storage.

![Discord Style Profile](Frontend/src/assets/preview.png) *(Note: Add your own project screenshot here)*

## ✨ Key Features

- **🚀 High-Impact Hero Section**: Engaging landing page with modern animations and clear call-to-actions
- **🤝 Members Explorer**: Search and filter through elite student talent
- **🎨 Discord-Style Profiles**: Bold, high-contrast profile cards with glassmorphic details
- **📁 Projects Showcase**: Unified gallery of work across all members
- **✍️ Profile Management**: Comprehensive profile editing with image uploads
- **🆕 Onboarding Flow**: Seamless multi-step onboarding for new members
- **🛡️ Admin Dashboard**: Secure interface for reviewing and approving applications
- **🔐 JWT Authentication**: Secure user authentication with password hashing
- **☁️ Cloud Storage**: Google Drive integration for profile images and files
- **📊 Google Sheets Database**: Serverless database solution with real-time sync
- **🌙 Dark Mode Optimized**: Fully responsive design with native dark/light mode

## 🛠️ Tech Stack

### Frontend
- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcryptjs)
- **Database**: [Google Sheets API](https://developers.google.com/sheets/api)
- **File Storage**: [Google Drive API](https://developers.google.com/drive/api)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- Google Cloud account with Sheets & Drive APIs enabled
- Service account credentials (see [SETUP_GUIDE.md](SETUP_GUIDE.md))

### Installation

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

Quick start:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/spiicez21/freelancers-website.git
   cd freelancers-website
   ```

2. **Set up Backend**:
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your Google Cloud credentials
   # Add service-account-key.json to Backend directory
   npm run dev
   ```

3. **Set up Frontend** (in a new terminal):
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📂 Project Structure

```text
freelancers-website/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Google API configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Sheets & Drive services
│   │   ├── utils/          # JWT & password utilities
│   │   └── server.ts       # Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md           # Backend documentation
├── Frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext with API integration
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── index.css       # Global styles
│   └── package.json
├── SETUP_GUIDE.md          # Detailed setup instructions
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all approved users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/complete-onboarding` - Complete onboarding

### Admin
- `GET /api/admin/pending-users` - Get pending applications
- `POST /api/admin/approve/:id` - Approve user
- `POST /api/admin/reject/:id` - Reject user

### Upload
- `POST /api/upload/profile-image` - Upload profile image
- `POST /api/upload/banner-image` - Upload banner image
- `POST /api/upload/project-image` - Upload project image

## 🔐 Authentication Flow

1. User signs up with email and password
2. Backend hashes password and stores user in Google Sheets
3. User completes onboarding (profile info, projects, images)
4. Admin reviews and approves/rejects application
5. Approved users can log in and access the platform

## 📊 Database Schema

Data is stored in Google Sheets with the following structure:

- **Users Sheet**: User profiles, credentials, and metadata
- **Projects Sheet**: User projects and portfolio items
- **Applications Sheet**: Application tracking and review history

See [Backend/README.md](Backend/README.md) for detailed schema.

## 🌐 Deployment

### Backend
- Deploy to Railway, Heroku, or similar Node.js hosting
- Set environment variables in hosting platform
- Upload service account key securely

### Frontend
- Deploy to Vercel, Netlify, or similar static hosting
- Set `VITE_API_URL` to your backend URL
- Build command: `npm run build`

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the KEC Freelancers Club Team.
