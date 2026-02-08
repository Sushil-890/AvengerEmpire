# CORS Fix for Separate Frontend/Backend Deployment

## Problem
When frontend and backend are deployed separately, CORS blocks image uploads and API requests because the backend doesn't allow requests from the frontend domain.

## Solution Applied

### 1. Backend CORS Configuration (server/index.js)
Updated CORS to use environment variables for allowed origins:

```javascript
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
```

### 2. Environment Variable Setup

Add to your backend `.env` file on Render:

```env
FRONTEND_URL=https://avengerempires.onrender.com
```

For multiple frontend URLs (e.g., staging + production):
```env
FRONTEND_URL=https://avengerempires.onrender.com,https://staging.avengerempires.onrender.com
```

## Deployment Steps

### On Render (Backend)

1. Go to your backend service dashboard on Render
2. Navigate to **Environment** section
3. Add new environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://avengerempires.onrender.com`
4. Click **Save Changes**
5. Render will automatically redeploy your backend

### Verify the Fix

1. Wait for backend redeployment to complete
2. Clear browser cache or use incognito mode
3. Try uploading an image again
4. Check browser console - CORS error should be gone

## Additional Notes

### If Still Not Working

1. **Check backend logs** on Render for any startup errors
2. **Verify environment variable** is set correctly (no typos)
3. **Check frontend API URL** - ensure it points to `https://avengerempire.onrender.com` (your backend)
4. **Try OPTIONS request** manually to verify CORS headers:
   ```bash
   curl -X OPTIONS https://avengerempire.onrender.com/api/upload \
     -H "Origin: https://avengerempires.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```

### Expected Response Headers
You should see these headers in the response:
```
Access-Control-Allow-Origin: https://avengerempires.onrender.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## File Upload Considerations

### Current Setup
- Files are uploaded to `uploads/` directory on the backend server
- Files are served via `/uploads` static route

### Production Recommendation
For production, consider using cloud storage:
- **Cloudinary** (free tier available)
- **AWS S3**
- **Google Cloud Storage**

This prevents file loss when Render restarts your service (ephemeral filesystem).

## Testing Locally

To test CORS locally with separate ports:

1. Backend: `http://localhost:5000`
2. Frontend: `http://localhost:5173`
3. Set `.env`: `FRONTEND_URL=http://localhost:5173`

## Common Issues

### Issue: "ERR_FAILED 520"
This is a Cloudflare error indicating the backend server is down or unreachable.
- Check if backend service is running on Render
- Check backend logs for crashes
- Verify backend URL is correct

### Issue: Still getting CORS error
- Clear browser cache completely
- Check if environment variable is actually set (check Render dashboard)
- Verify backend redeployed after adding env var
- Check for typos in domain names

## Quick Fix Checklist

- [ ] Updated `server/index.js` with new CORS config
- [ ] Added `FRONTEND_URL` to backend `.env.example`
- [ ] Set `FRONTEND_URL` environment variable on Render
- [ ] Backend redeployed successfully
- [ ] Cleared browser cache
- [ ] Tested image upload
- [ ] Verified CORS headers in browser network tab
