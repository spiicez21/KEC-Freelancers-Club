# 🚀 Full-Stack Setup Guide

This guide will walk you through setting up both the backend and frontend of the KEC Freelancers Club Portfolio Platform.

## Prerequisites

- **Node.js** (v18 or higher)
- **Google Cloud Account** (for Sheets & Drive APIs)
- **Git** (optional, for version control)

## Part 1: Google Cloud Setup (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `freelancers-platform`
4. Click "Create" 

### Step 2: Enable APIs

1. In Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable:
   - **Google Sheets API**
   - **Google Drive API**

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `freelancers-backend`
4. Click "Create and Continue" → "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose **JSON** format
5. Download and save as `service-account-key.json`

### Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it: `Freelancers Platform Database`
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
5. Click "Share" → Paste service account email (from JSON file: `client_email`)
6. Give "Editor" permissions → Send

### Step 6: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder: `Freelancers Platform Files`
3. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
4. Share with service account email (Editor permissions)

## Part 2: Backend Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and fill in:

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

GOOGLE_SHEETS_ID=your-sheet-id-from-part-1-step-5
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email

GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-part-1-step-6

FRONTEND_URL=http://localhost:5173
```

### Step 3: Add Service Account Key to Environment

1. Open the `service-account-key.json` file you downloaded
2. Copy the **entire JSON content** (it should start with `{` and end with `}`)
3. Open your `Backend/.env` file
4. Find the line `GOOGLE_SERVICE_ACCOUNT_KEY=`
5. Paste the JSON content as a **single line** after the `=`

**Example:**
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"freelancers-platform","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"freelancers-backend@...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

> **Note**: The entire JSON must be on one line with no line breaks

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Google Sheets initialized successfully
✅ Server running on http://localhost:5000
```

## Part 3: Frontend Setup (3 minutes)

### Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

### Step 2: Configure Environment (Optional)

The frontend is pre-configured to connect to `http://localhost:5000/api`. If your backend runs on a different port, create a `.env` file:

```bash
cp .env.example .env
```

Edit if needed:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Part 4: Create Admin Account

To access the admin panel, you need to manually create an admin user in your Google Sheet:

1. Open your Google Sheet
2. Go to the "Users" tab
3. Add a new row with these values:

| id | name | email | password_hash | role | status | ... |
|----|------|-------|---------------|------|--------|-----|
| admin-1 | Admin User | admin@example.com | $2a$10$... | admin | approved | ... |

**For password hash**, you can use this Node.js script:

```bash
cd Backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

Copy the output and paste it in the `password_hash` column.

Fill remaining columns with empty strings or appropriate values.

## Part 5: Test the Application

### Test User Signup

1. Go to `http://localhost:5173/join`
2. Fill in the signup form
3. Complete the onboarding process
4. Check your Google Sheet - the user should appear in "Users" tab with status "pending"

### Test Admin Approval

1. Go to `http://localhost:5173/login`
2. Login with admin credentials (`admin@example.com` / `admin123`)
3. Go to Admin Dashboard
4. You should see the pending user
5. Click "Approve"
6. Check Google Sheet - status should change to "approved"

### Test File Upload

1. During onboarding, upload a profile image
2. Check your Google Drive folder - the image should appear there
3. The image URL should be stored in the Google Sheet

## Troubleshooting

### Backend won't start

- **Error**: "Google Sheets not configured"
  - Solution: Ensure `service-account-key.json` exists in Backend directory
  - Check that `GOOGLE_SHEETS_ID` is set in `.env`

- **Error**: "Permission denied"
  - Solution: Make sure you shared the Sheet/Drive folder with the service account email

### Frontend can't connect to backend

- **Error**: "Network Error" or "CORS error"
  - Solution: Ensure backend is running on port 5000
  - Check that `FRONTEND_URL` in backend `.env` matches your frontend URL

### File uploads fail

- **Error**: "Failed to upload image"
  - Solution: Verify `GOOGLE_DRIVE_FOLDER_ID` is correct
  - Ensure Drive folder is shared with service account

## Next Steps

✅ **Production Deployment**
- Deploy backend to Railway, Heroku, or similar
- Deploy frontend to Vercel, Netlify, or similar
- Update environment variables for production URLs
- Use strong JWT secrets

✅ **Security**
- Never commit `.env` or `service-account-key.json`
- Use HTTPS in production
- Implement rate limiting
- Add input validation

✅ **Features**
- Add email notifications
- Implement search and filtering
- Add analytics dashboard
- Create mobile app

## Support

If you encounter issues:
1. Check the Backend/README.md for detailed API documentation
2. Review the console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure Google Cloud APIs are enabled

Happy coding! 🎉
