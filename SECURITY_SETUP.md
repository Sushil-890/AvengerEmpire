# 🔒 Security Setup Guide

## ⚠️ CRITICAL: .env Files Are Now Protected

All `.env` files are now properly excluded from git tracking. **NEVER commit these files!**

## 📋 Setup Instructions

### 1. Remove .env Files from Git History (If Already Committed)

If you've already committed .env files, they're still in git history. Remove them:

```bash
# Remove from git tracking but keep local files
git rm --cached client/.env
git rm --cached server/.env
git rm --cached MobileApp/.env

# Commit the removal
git commit -m "Remove .env files from tracking"

# Push to remote
git push
```

**⚠️ WARNING:** The files are still in git history! If they contain real secrets:

```bash
# Use git filter-branch or BFG Repo-Cleaner to remove from history
# OR create a new repository and migrate code without history
```

### 2. Rotate All Secrets Immediately

Since your secrets were exposed, generate new ones:

#### A. Generate Strong JWT Secret
```bash
# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Mac/Linux:
openssl rand -base64 32
```

#### B. Razorpay Keys
1. Log into Razorpay Dashboard
2. Go to Settings → API Keys
3. Regenerate keys
4. Update both `server/.env` and `client/.env`

#### C. Change Courier Credentials
**TODO:** Move courier auth to database with hashed passwords

### 3. Set Up Environment Files

Copy the example files and fill in your values:

```bash
# Client
cp client/.env.example client/.env
# Edit client/.env with your Razorpay public key

# Server
cp server/.env.example server/.env
# Edit server/.env with all your secrets

# Mobile App
cp MobileApp/.env.example MobileApp/.env
# Edit MobileApp/.env with your API configuration
```

### 4. Verify .env Files Are Ignored

```bash
# This should show your .env files are ignored:
git check-ignore -v client/.env server/.env MobileApp/.env

# This should NOT show .env files:
git status
```

## 🔐 Production Secrets Checklist

Before deploying to production:

- [ ] Generate new, strong JWT_SECRET (32+ random characters)
- [ ] Use production Razorpay keys (not test keys)
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB URI (MongoDB Atlas recommended)
- [ ] Never use the same secrets across environments
- [ ] Store secrets in environment variables (not .env files in production)
- [ ] Use secret management service (AWS Secrets Manager, Azure Key Vault, etc.)

## 🚨 What to Do If Secrets Are Exposed

1. **Immediately rotate all secrets**
2. **Check for unauthorized access** (database, payment gateway)
3. **Review git history** for exposed credentials
4. **Consider creating a new repository** if history is compromised
5. **Enable 2FA** on all services
6. **Set up monitoring** for suspicious activity

## 📚 Best Practices

### Development
- Use `.env.local` for personal overrides (also gitignored)
- Never share .env files via Slack, email, etc.
- Use different secrets for each developer if needed

### Production
- Use environment variables provided by hosting platform
- Use secret management services
- Rotate secrets regularly (every 90 days)
- Audit access to secrets
- Enable logging for secret access

### Team Collaboration
- Share `.env.example` files (safe, no real secrets)
- Document what each variable does
- Use a password manager for team secret sharing
- Onboard new developers with security training

## 🔍 Monitoring

Set up alerts for:
- Failed authentication attempts
- Unusual payment activity
- Database access from unknown IPs
- API rate limit violations

## 📞 Emergency Contacts

If you suspect a security breach:
1. Rotate all secrets immediately
2. Contact your hosting provider
3. Contact payment gateway support
4. Review access logs
5. Consider taking services offline temporarily

---

**Remember:** Security is not a one-time setup. Regularly review and update your security practices.
