# 📋 Deployment Checklist

## Pre-Deployment Setup

### Local Setup
- [ ] Clone repository
- [ ] Install Node.js 18+
- [ ] Run `npm install`
- [ ] Test locally: `npm run dev`
- [ ] Build locally: `npm run build`

### Azure Setup
- [ ] Create Azure account (if needed)
- [ ] Install Azure CLI
- [ ] Run `az login` to authenticate
- [ ] Choose deployment method:
  - [ ] Option A: Use setup script (recommended)
    - [ ] Run `./scripts/setup-azure-deployment.sh` (macOS/Linux)
    - [ ] Run `./scripts/setup-azure-deployment.ps1` (Windows)
  - [ ] Option B: Manual creation via Azure Portal
  - [ ] Option C: Manual creation via Azure CLI

### GitHub Setup
- [ ] Go to repository Settings
- [ ] Navigate to: **Secrets and variables** > **Actions**
- [ ] Add secret: `AZURE_APP_NAME`
  - [ ] Value: Your App Service name
- [ ] Add secret: `AZURE_PUBLISH_PROFILE`
  - [ ] Value: Content from publish profile (.PublishSettings)
  - [ ] ⚠️ Do NOT include XML wrapper tags

## Azure Configuration

### Resource Group
- [ ] Resource group created
- [ ] Correct region selected
- [ ] Note the name: `_________________`

### App Service
- [ ] App Service created with name: `_________________`
- [ ] Runtime: Node 18-lts
- [ ] Operating System: Linux
- [ ] Pricing plan: Free/B1
- [ ] Configurations applied:
  - [ ] `WEBSITE_NODE_DEFAULT_VERSION`: 18.17.1
  - [ ] `SCM_DO_BUILD_DURING_DEPLOYMENT`: true

## First Deployment

### Code Preparation
- [ ] Code committed to local main branch
- [ ] No uncommitted changes
- [ ] Review workflow files created:
  - [ ] `.github/workflows/deploy.yml`
  - [ ] `.github/workflows/deploy-advanced.yml` (optional)

### Push and Deploy
- [ ] Push to main branch: `git push origin main`
- [ ] Go to GitHub **Actions** tab
- [ ] Watch workflow execution
- [ ] Check for any errors

### Verification
- [ ] Workflow completed successfully ✅
- [ ] No red X marks in Actions
- [ ] Visit deployment URL: `https://<app-name>.azurewebsites.net`
- [ ] Page loads correctly
- [ ] Navigation works (click "Add New Todo")
- [ ] Forms respond to input

## Troubleshooting Checklist

If deployment fails:

### Build Step Failed
- [ ] Check Node.js version: `npm -v`
- [ ] Check for syntax errors: `npm run lint`
- [ ] Verify dependencies: `npm ci`
- [ ] Check GitHub Actions logs for specific error

### Deployment Failed
- [ ] Verify publish profile is valid (not expired)
- [ ] Check App Service exists in Azure
- [ ] Verify secret names are exact (case-sensitive)
- [ ] Check Azure App Service deployment logs

### App Shows Blank/404
- [ ] Verify `SCM_DO_BUILD_DURING_DEPLOYMENT` = true
- [ ] Check App Service configuration
- [ ] Review application insights logs
- [ ] Check Kudu console: `https://<app-name>.scm.azurewebsites.net`

### Need to Redeploy
- [ ] Manual redeploy:
  ```bash
  az webapp deployment source config-zip \
    --resource-group <rg> \
    --name <app-name> \
    --src-path dist.zip
  ```

## Ongoing Maintenance

### Regular Tasks
- [ ] Monitor deployment frequency
- [ ] Check GitHub Actions logs monthly
- [ ] Review Azure costs
- [ ] Update Node.js runtime when new LTS available
- [ ] Monitor application performance

### Updates to Workflow
- [ ] Test changes in feature branch first
- [ ] Create pull request for review
- [ ] Merge to main to trigger deployment

### Scaling
- [ ] If app is slow: upgrade App Service plan
- [ ] Add Application Insights for monitoring
- [ ] Consider Azure CDN for static assets
- [ ] Set up auto-scaling if needed

## Documentation

- [ ] Keep DEPLOYMENT.md updated
- [ ] Document any custom configurations
- [ ] Share access with team members
- [ ] Document secret rotation schedule

## Support Resources

| Issue | Documentation |
|-------|---|
| General setup | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Quick reference | [QUICKSTART-DEPLOYMENT.md](./QUICKSTART-DEPLOYMENT.md) |
| GitHub Actions | [GitHub Docs](https://docs.github.com/en/actions) |
| Azure App Service | [Azure Docs](https://learn.microsoft.com/en-us/azure/app-service/) |

## 🎉 Success Criteria

Your deployment is successful when:

✅ Workflow shows green checkmark in GitHub Actions
✅ App Service shows "Running" in Azure Portal
✅ Live URL responds with your app content
✅ Todo list displays welcome message
✅ Can create new todos
✅ Can mark todos complete/incomplete
✅ Can delete todos

---

**Need help?** Check the troubleshooting section in [DEPLOYMENT.md](./DEPLOYMENT.md)
