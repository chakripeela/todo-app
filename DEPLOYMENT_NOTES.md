# Deployment Notes

## Azure App Service Configuration

After deploying via GitHub Actions, ensure the following App Service configuration:

### 1. Runtime Stack

- **Runtime**: Node.js
- **Version**: 22 LTS

### 2. Startup Command (Critical)

Configure the startup command in Azure Portal:

- Navigate to **App Service → Configuration → General settings**
- Set **Startup Command** to: `npm start`

Alternatively, set via Azure CLI:

```bash
az webapp config appsettings set --resource-group YOUR_RG --name YOUR_APP_NAME --settings SCM_COMMAND_LINE_LOGGING=1
az webapp config set --resource-group YOUR_RG --name YOUR_APP_NAME --linux-fx-version "NODE|22-lts" --startup-file "npm start"
```

### 3. App Service Plan Configuration

- **Always On**: Enabled (recommended for production)
- **Platform**: 64-bit

### 4. Application Files

The deployment includes:

- `dist/` - Built React static files
- `app.js` - Express server that serves the SPA
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file
- `web.config` - IIS configuration for SPA routing

### 5. How It Works

1. App Service detects `package.json`
2. Runs `npm install` to install Express and dependencies
3. Runs `npm start` which executes `node app.js`
4. Express server serves the React app from `dist/` folder
5. All routes fallback to `index.html` for SPA routing

## Deployment Process

### Via GitHub Actions

Push to the appropriate branch or trigger workflow manually:

1. Workflow builds the React app (`npm run build`)
2. Copies necessary files to deployment package
3. Deploys to Azure App Service via publish profile

### Manual Deployment

```bash
npm run build
# Then use Azure CLI or VS Code Azure extension to deploy
```

## Troubleshooting

### Blank Page Issue

If you see a blank page:

1. Verify startup command is set to `npm start`
2. Check App Service logs: `az webapp log tail --resource-group YOUR_RG --name YOUR_APP_NAME`
3. Verify Express server is running: Check for "Server is running on port" message in logs

### Port Configuration

- Express server uses `process.env.PORT || 3000`
- Azure App Service automatically sets the PORT environment variable to 8080 or the appropriate port
- No manual port configuration needed

### Dependencies Not Installing

If you see "Cannot find module 'express'":

1. Verify `package.json` is in deployment
2. Check that `package-lock.json` is deployed
3. App Service should auto-run `npm install`; if not, verify Node.js runtime is selected
