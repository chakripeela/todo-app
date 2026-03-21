# Deployment Guide - Azure App Service

This guide explains how to set up and deploy the Todo App to Azure App Service using GitHub Actions.

## Prerequisites

- Azure Subscription
- GitHub repository access
- Azure CLI installed locally (for initial setup)

## Step 1: Create Azure App Service

### Option A: Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" and search for "App Service"
3. Create a new App Service with these settings:
   - **Resource Group**: Create new or use existing
   - **Name**: `todo-app-prod` (or your preferred name)
   - **Runtime stack**: Node 18 (LTS)
   - **Operating System**: Linux
   - **Pricing plan**: Free or B1 (minimum for production)

### Option B: Using Azure CLI

```bash
# Create resource group
az group create --name todo-app-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name todo-app-plan \
  --resource-group todo-app-rg \
  --sku B1 \
  --is-linux

# Create App Service
az webapp create \
  --resource-group todo-app-rg \
  --plan todo-app-plan \
  --name todo-app-prod \
  --runtime "NODE|18-lts"
```

## Step 2: Configure App Service for Node.js/React

1. In Azure Portal, go to your App Service
2. Navigate to **Configuration** > **Application settings**
3. Add these settings:
   - `WEBSITE_NODE_DEFAULT_VERSION`: `18.17.1`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT`: `true`

## Step 3: Get Publish Profile

1. In Azure Portal, go to your App Service
2. Click **Get publish profile** (top right)
3. Save the downloaded `.PublishSettings` file

## Step 4: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add these secrets:
   - **AZURE_APP_NAME**: Your App Service name (e.g., `todo-app-prod`)
   - **AZURE_PUBLISH_PROFILE**: Copy the entire content of the `.PublishSettings` file

## Step 5: Verify Deployment Workflow

1. Commit and push code to the `main` branch
2. Go to **Actions** tab in GitHub
3. Watch the "Deploy to Azure App Service" workflow run
4. Once complete, visit `https://<app-name>.azurewebsites.net`

## Troubleshooting

### Build fails with module not found
- Ensure `npm ci` runs to install exact dependencies
- Check Node.js version compatibility

### App shows 404 error
- Verify App Service has `SCM_DO_BUILD_DURING_DEPLOYMENT` set to `true`
- Check Application Insights for detailed logs

### Deployment seems stuck
- Check GitHub Actions logs for build errors
- Verify publish profile hasn't expired
- Check Azure App Service logs in Kudu

### View Live Logs

Access logs in Azure Portal:
1. Go to App Service
2. **Monitoring** > **Log stream**
3. Or use Azure CLI:
```bash
az webapp log tail --resource-group <resource-group> --name <app-name>
```

## Environment Configuration

For production deployments, you may need to set environment variables:

```bash
az webapp config appsettings set \
  --resource-group <resource-group> \
  --name <app-name> \
  --settings KEY=VALUE
```

## CI/CD Pipeline Details

The GitHub Actions workflow:

1. **Trigger**: On push to `main` branch
2. **Build**: 
   - Sets up Node.js 18
   - Installs dependencies with `npm ci`
   - Builds with `npm run build`
3. **Deploy**: Uses Azure webapps-deploy action
   - Deploys from the `dist/` directory
   - Uses publish profile for authentication

## Performance Optimization

1. **Enable compression**: Settings > Configuration > Enable "Always On"
2. **Use App Service Plan with auto-scale** for production
3. **Monitor performance** in Application Insights
4. **Cache static assets** with Azure CDN

## Security Best Practices

- ✅ Use Service Principal or publish profile authentication
- ✅ Store secrets in GitHub Secrets, never commit them
- ✅ Use HTTPS only (enabled by default)
- ✅ Enable authentication/authorization if needed
- ✅ Regularly update Node.js runtime
- ✅ Monitor logs for suspicious activity

## Manual Deployment

If you prefer manual deployment:

```bash
# Build locally
npm run build

# Deploy using Azure CLI
az webapp deploy \
  --resource-group <resource-group> \
  --name <app-name> \
  --src-path dist/ \
  --type zip
```

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Node.js on App Service](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs)
