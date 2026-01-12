# Freelancers Backend API

Backend server for the College Freelancers Portfolio Platform, built with Node.js, Express, and TypeScript. Uses Google Sheets as the database and Google Drive for file storage.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud project with Sheets and Drive APIs enabled
- Service account credentials JSON file

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Google Cloud** (see detailed instructions below)

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your configuration.

4. **Add service account credentials**:
   - Download your service account key JSON from Google Cloud Console
   - Open the JSON file and copy its entire content
   - In your `.env` file, paste the JSON as a single line in `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Example: `GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 🔧 Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Freelancers Platform") and click "Create"

### Step 2: Enable APIs

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for and enable:
   - **Google Sheets API**
   - **Google Drive API**

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the details:
   - Name: `freelancers-backend`
   - Description: "Backend service for freelancers platform"
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Download the file and save it as `service-account-key.json` in the Backend directory

### Step 5: Create Google Sheet

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
3. Share the sheet with your service account email:
   - Click "Share" in the top right
   - Paste the service account email (found in the JSON file as `client_email`)
   - Give it "Editor" permissions

### Step 6: Create Google Drive Folder

1. Create a new folder in Google Drive for file uploads
2. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
3. Share the folder with your service account email (Editor permissions)

### Step 7: Update Environment Variables

Edit your `.env` file:

```env
GOOGLE_SHEETS_ID=your-sheet-id-from-step-5
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-step-6
```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── google.ts          # Google API configuration
│   ├── controllers/
│   │   ├── auth.controller.ts # Authentication logic
│   │   ├── user.controller.ts # User management
│   │   ├── admin.controller.ts # Admin operations
│   │   └── upload.controller.ts # File uploads
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT authentication
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   ├── user.routes.ts     # User endpoints
│   │   ├── admin.routes.ts    # Admin endpoints
│   │   └── upload.routes.ts   # Upload endpoints
│   ├── services/
│   │   ├── sheets.service.ts  # Google Sheets CRUD
│   │   └── drive.service.ts   # Google Drive operations
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── password.ts        # Password hashing
│   └── server.ts              # Express server
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires auth)

### Users

- `GET /api/users` - Get all approved users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile (requires auth)
- `POST /api/users/:id/complete-onboarding` - Complete onboarding (requires auth)

### Admin

- `GET /api/admin/pending-users` - Get pending applications (requires admin)
- `POST /api/admin/approve/:id` - Approve user (requires admin)
- `POST /api/admin/reject/:id` - Reject user (requires admin)

### Upload

- `POST /api/upload/profile-image` - Upload profile image (requires auth)
- `POST /api/upload/banner-image` - Upload banner image (requires auth)
- `POST /api/upload/project-image` - Upload project image (requires auth)

## 📊 Google Sheets Schema

### Users Sheet

| Column | Type | Description |
|--------|------|-------------|
| id | string | Unique user ID (UUID) |
| name | string | User's full name |
| email | string | User's email |
| password_hash | string | Bcrypt hashed password |
| role | string | 'user' or 'admin' |
| status | string | 'incomplete', 'pending', 'approved', 'rejected' |
| tagline | string | Professional tagline |
| bio | string | User biography |
| tech_stack | string | Comma-separated tech skills |
| profile_image_url | string | Google Drive URL |
| banner_image_url | string | Google Drive URL |
| availability | string | 'Available', 'Busy', 'Open' |
| rate | string | Hourly rate |
| experience | string | Years of experience |
| github | string | GitHub URL |
| linkedin | string | LinkedIn URL |
| portfolio | string | Portfolio URL |
| created_at | string | ISO timestamp |
| updated_at | string | ISO timestamp |

### Projects Sheet

| Column | Type | Description |
|--------|------|-------------|
| id | string | Unique project ID (UUID) |
| user_id | string | Owner's user ID |
| title | string | Project title |
| link | string | Project URL |
| description | string | Project description |
| image_url | string | Google Drive URL |
| created_at | string | ISO timestamp |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User signs up or logs in
2. Server returns a JWT token
3. Client stores token (localStorage)
4. Client sends token in `Authorization: Bearer <token>` header
5. Server verifies token for protected routes

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## 🔒 Security Notes

- **Never commit** `service-account-key.json` or `.env` files
- Use strong JWT secrets in production
- Implement rate limiting for production
- Use HTTPS in production
- Validate and sanitize all user inputs

## 🐛 Troubleshooting

### "Google Sheets not configured" error

- Ensure `service-account-key.json` exists in the Backend directory
- Check that `GOOGLE_SHEETS_ID` is set in `.env`
- Verify the sheet is shared with the service account email

### "Permission denied" errors

- Make sure the Google Sheet is shared with the service account email
- Check that the service account has "Editor" permissions
- Verify the APIs are enabled in Google Cloud Console

### File upload fails

- Ensure `GOOGLE_DRIVE_FOLDER_ID` is set in `.env`
- Verify the Drive folder is shared with the service account
- Check file size limits (default: 5MB)

## 📝 License

MIT
