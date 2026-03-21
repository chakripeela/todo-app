# GitHub Actions Deployment Setup Script (PowerShell)
# This script helps set up Azure and GitHub for CI/CD deployment

Write-Host "🚀 Todo App - Azure Deployment Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $azVersion = az --version 2>&1 | Select-Object -First 1
    Write-Host "✅ Azure CLI found: $azVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Get user inputs
$RESOURCE_GROUP = Read-Host "📝 Azure Resource Group name"
$APP_NAME = Read-Host "📝 App Service name"
$REGION = Read-Host "📝 Azure region (e.g., eastus)"
$GITHUB_REPO = Read-Host "📝 GitHub repository (format: owner/repo)"

Write-Host ""
Write-Host "🔧 Setting up Azure resources..." -ForegroundColor Yellow

# Check if resource group exists
$rgExists = az group exists -n $RESOURCE_GROUP | ConvertFrom-Json
if (-not $rgExists) {
    Write-Host "Creating resource group: $RESOURCE_GROUP" -ForegroundColor Cyan
    az group create -n $RESOURCE_GROUP -l $REGION
}

# Create App Service plan
Write-Host "Creating App Service plan..." -ForegroundColor Cyan
az appservice plan create `
    --resource-group $RESOURCE_GROUP `
    --name "$APP_NAME-plan" `
    --sku B1 `
    --is-linux

# Create App Service
Write-Host "Creating App Service: $APP_NAME" -ForegroundColor Cyan
az webapp create `
    --resource-group $RESOURCE_GROUP `
    --plan "$APP_NAME-plan" `
    --name $APP_NAME `
    --runtime "NODE|18-lts"

# Configure App Service
Write-Host "Configuring App Service..." -ForegroundColor Cyan
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --settings `
        WEBSITE_NODE_DEFAULT_VERSION=18.17.1 `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true

Write-Host ""
Write-Host "📦 Getting publish profile..." -ForegroundColor Yellow

# Get publish profile
$PROFILE_XML = az webapp deployment list-publishing-profiles `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --xml

Write-Host ""
Write-Host "✅ Azure resources created!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/$GITHUB_REPO/settings/secrets/actions" -ForegroundColor White
Write-Host ""
Write-Host "2. Add these GitHub Secrets:" -ForegroundColor White
Write-Host "   - Name: AZURE_APP_NAME" -ForegroundColor Gray
Write-Host "   - Value: $APP_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add another secret:" -ForegroundColor White
Write-Host "   - Name: AZURE_PUBLISH_PROFILE" -ForegroundColor Gray
Write-Host "   - Value: (copy the content below, between the markers)" -ForegroundColor Gray
Write-Host ""
Write-Host "========== PUBLISH PROFILE START ==========" -ForegroundColor DarkYellow
Write-Host $PROFILE_XML
Write-Host "========== PUBLISH PROFILE END ==========" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "4. Commit and push to 'main' branch to trigger deployment" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
