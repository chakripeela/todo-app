#!/bin/bash

# GitHub Actions Deployment Setup Script
# This script helps set up Azure and GitHub for CI/CD deployment

set -e

echo "🚀 Todo App - Azure Deployment Setup"
echo "======================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git."
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Get user inputs
read -p "📝 Azure Resource Group name: " RESOURCE_GROUP
read -p "📝 App Service name: " APP_NAME
read -p "📝 Azure region (e.g., eastus): " REGION
read -p "📝 GitHub repository (format: owner/repo): " GITHUB_REPO

echo ""
echo "🔧 Setting up Azure resources..."

# Create resource group if it doesn't exist
if ! az group exists -n "$RESOURCE_GROUP" | grep -q true; then
    echo "Creating resource group: $RESOURCE_GROUP"
    az group create -n "$RESOURCE_GROUP" -l "$REGION"
fi

# Create App Service plan
echo "Creating App Service plan..."
az appservice plan create \
    --resource-group "$RESOURCE_GROUP" \
    --name "${APP_NAME}-plan" \
    --sku B1 \
    --is-linux

# Create App Service
echo "Creating App Service: $APP_NAME"
az webapp create \
    --resource-group "$RESOURCE_GROUP" \
    --plan "${APP_NAME}-plan" \
    --name "$APP_NAME" \
    --runtime "NODE|18-lts"

# Configure App Service
echo "Configuring App Service..."
az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --settings \
        WEBSITE_NODE_DEFAULT_VERSION=18.17.1 \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true

echo ""
echo "📦 Getting publish profile..."

# Get publish profile
PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query "[0].{publishUrl: publishUrl, userName: userName, userPWD: userPWD}" \
    -o json | jq -r 'to_entries | map("\(.key)=\(.value)") | join("&")')

# Create XML publish profile
PROFILE_XML=$(az webapp deployment list-publishing-profiles \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --xml)

echo ""
echo "✅ Azure resources created!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/$GITHUB_REPO/settings/secrets/actions"
echo ""
echo "2. Add these GitHub Secrets:"
echo "   - Name: AZURE_APP_NAME"
echo "   - Value: $APP_NAME"
echo ""
echo "3. Add another secret:"
echo "   - Name: AZURE_PUBLISH_PROFILE"
echo "   - Value: (copy the content below, between the markers)"
echo ""
echo "========== PUBLISH PROFILE START =========="
echo "$PROFILE_XML"
echo "========== PUBLISH PROFILE END =========="
echo ""
echo "4. Commit and push to 'main' branch to trigger deployment"
echo ""
echo "🎉 Setup complete!"
