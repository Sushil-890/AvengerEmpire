# Deployment Checklist

## Before Deploying

- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Using production MongoDB URI
- [ ] Using live Razorpay keys (not test keys)
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] FRONTEND_URL set to production web URL
- [ ] WEB_APP_URL set to production web URL
- [ ] MOBILE_APP_SCHEME set to production scheme (e.g., `avengerempire://`)

## Production Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=<strong-random-secret>
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=<live-secret>
FRONTEND_URL=https://yourdomain.com
WEB_APP_URL=https://yourdomain.com
MOBILE_APP_SCHEME=avengerempire://
CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
```

## After Deploying

- [ ] Test API endpoint: `curl https://your-api.com/api/test`
- [ ] Test web payment flow
- [ ] Test mobile payment flow
- [ ] Verify CORS works from web app
- [ ] Check server logs for errors
- [ ] Monitor for 24 hours

## Rollback Plan

If issues occur:
1. Revert to previous deployment
2. Check logs for errors
3. Verify environment variables
4. Test locally first
5. Redeploy when fixed

## Support

- Check logs first
- Review ENV_SETUP.md
- Test with curl/Postman
- Verify environment variables
