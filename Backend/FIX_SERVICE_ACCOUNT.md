# Quick Fix Guide for Service Account Configuration

## Problem
You're getting a JSON parsing error when the server tries to read your service account credentials from the `.env` file.

## Solution: Use Base64 Encoding

Since you already have `service-account-key.json` file, let's use base64 encoding to avoid JSON formatting issues.

### Step 1: Rename your file (if needed)
Make sure your file is named exactly: `service-account-key.json` (not `service-account-key.json.json`)

If it's named `service-account-key.json.json`, rename it to `service-account-key.json`

### Step 2: Run the conversion script

```bash
cd Backend
node convert-to-base64.js
```

### Step 3: Copy the output
You'll see something like:
```
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50...
```

### Step 4: Update your .env file

1. Open `Backend/.env`
2. **Remove or comment out** the `GOOGLE_SERVICE_ACCOUNT_KEY=` line
3. **Add the new line** from Step 3

Your `.env` should look like:
```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

GOOGLE_SHEETS_ID=your-google-sheets-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com

GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id-here

# Use base64 encoded credentials (easier than raw JSON)
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50...

FRONTEND_URL=http://localhost:5173
```

### Step 5: Restart the server

```bash
npm run dev
```

You should see:
```
📦 Decoding base64 credentials...
✅ Service account credentials loaded successfully
```

---

## If the script still doesn't work

Manually convert to base64:

### Windows PowerShell:
```powershell
$json = Get-Content service-account-key.json -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [Convert]::ToBase64String($bytes)
Write-Output "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=$base64"
```

### Or use an online tool:
1. Go to: https://www.base64encode.org/
2. Copy your entire `service-account-key.json` content
3. Paste and click "Encode"
4. Copy the result
5. In your `.env` file: `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=<paste here>`

---

## Common Issues

**File named wrong**: Make sure it's `service-account-key.json` not `service-account-key.json.json`

**Wrong directory**: The file should be in `Backend/` directory, not `Backend/src/config/`

**Spaces in .env**: Make sure there are NO spaces around the `=` sign in your `.env` file
