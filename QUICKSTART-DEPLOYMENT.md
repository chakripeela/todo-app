# Quick Start - GitHub Actions Deployment

## 🚀 Fastest Setup (60 seconds)

### Step 1: Create Azure App Service
```bash
# Windows PowerShell
.\scripts\setup-azure-deployment.ps1

# macOS/Linux
bash scripts/setup-azure-deployment.sh
```

### Step 2: Copy GitHub Secrets
1. Visit: `https://github.com/YOUR_USERNAME/TODO_REPO/settings/secrets/actions`
2. Add `AZURE_APP_NAME` secret
3. Add `AZURE_PUBLISH_PROFILE` secret (from script output)

### Step 3: Deploy!
```bash
git push origin main
```

---

## 📋 What Gets Deployed

✅ **Workflow**: `.github/workflows/deploy.yml`
- Triggers on pushes to `main` branch
- Builds React app with Vite
- Deploys to Azure App Service

---

## 🔍 Monitor Deployment

### In GitHub
- Go to **Actions** tab
- Click the latest workflow run
- Watch build progress in real-time

### In Azure
- Go to **Deployment Center**
- View deployment history
- Check **Log stream** for live output

---

## 🎯 Deployment Flowchart

```
Push to main
    ↓
GitHub Actions Trigger
    ↓
Install Dependencies (npm ci)
    ↓
Build App (npm run build)
    ↓
Upload Artifacts (dist/)
    ↓
Deploy to Azure App Service
    ↓
✅ Live at: https://YOUR_APP_NAME.azurewebsites.net
```

---

## 🔒 Security Features

- ✅ No credentials in code
- ✅ GitHub Secrets encryption
- ✅ Service Principal authentication
- ✅ HTTPS enabled by default

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node version (should be 18) |
| App shows 404 | Set `SCM_DO_BUILD_DURING_DEPLOYMENT=true` |
| Deployment stuck | Check GitHub Actions logs |
| Can't find secrets | Ensure you're in repo Settings, not Organization |

---

## 📚 Advanced Options

### Staging & Production
Use **`.github/workflows/deploy-advanced.yml`** for separate environments:
```yaml
main branch     → Production
staging branch  → Staging
```

Requires additional secrets:
- `AZURE_APP_NAME_PRODUCTION`
- `AZURE_PUBLISH_PROFILE_PRODUCTION`
- `AZURE_APP_NAME_STAGING`
- `AZURE_PUBLISH_PROFILE_STAGING`

### Environment Protection
Add GitHub environment requirements:
1. Go to **Settings** > **Environments**
2. Create "production" environment
3. Add required reviewers for deployments

---

## 🔄 Continuous Deployments

Once set up, every push to `main` automatically:
1. ✅ Installs dependencies
2. ✅ Builds application
3. ✅ Runs linter (optional)
4. ✅ Deploys to Azure
5. ✅ Notifies on completion

---

## 📖 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Detailed setup instructions
- Azure CLI alternative
- Manual deployment steps
- Performance optimization
- Security best practices

---

## 🎓 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure App Service Docs](https://learn.microsoft.com/en-us/azure/app-service/)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [React Deployment Guide](https://react.dev/learn/deployment)
