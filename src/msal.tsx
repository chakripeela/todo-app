import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// TODO: Replace with your actual Entra (Azure AD) app registration values

const getRedirectUri = () => {
  const { hostname } = window.location;
  if (hostname === "localhost") {
    return "http://localhost:5173/";
  }
  if (hostname === "todo-app-ui.azurewebsites.net") {
    return "https://todo-app-ui.azurewebsites.net/";
  }
  return window.location.origin + "/";
};

const msalConfig = {
  auth: {
    clientId: "628261c4-27bc-4c21-87f4-6ee5cf01cb06", // Application (client) ID from Entra ID
    authority:
      "https://login.microsoftonline.com/d1757f34-71b6-46de-96c4-53d7e63ac048", // Directory (tenant) ID
    redirectUri: getRedirectUri(),
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export function withMsalProvider(children: React.ReactNode) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
