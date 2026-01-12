# Quick Test Instructions

The backend is crashing when you try to signup. Here's how to diagnose:

## Step 1: Make sure the Google Sheet is shared

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1JsscNBiVmoiY_4yASSnCU3rREjleiqNlhH4LbS6Xwt8/edit
2. Click "Share" button
3. Add this email: `kfc-131@qualified-world-484010-a1.iam.gserviceaccount.com`
4. Give it "Editor" permissions
5. Click "Send"

## Step 2: Restart the backend

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 3: Watch for initialization messages

You should see:
```
✅ Service account credentials loaded successfully
✅ Google Sheets initialized successfully
   - Created sheet: Users
   - Created sheet: Projects  
   - Created sheet: Applications
```

If you see errors about permissions, the sheet isn't shared correctly.

## Step 4: Test signup

Try signing up from the frontend. If it crashes, check the backend terminal for the detailed error message.

## Common Issues

**"Permission denied"**: Sheet not shared with service account
**"Spreadsheet not found"**: Wrong GOOGLE_SHEETS_ID in .env
**"Invalid credentials"**: Service account key is wrong

## Still not working?

Run this to see the actual error:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

The error will be printed in the backend terminal.
