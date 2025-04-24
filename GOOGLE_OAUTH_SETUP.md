# Google OAuth Setup for NextAuth.js

This guide will help you set up Google OAuth for your Next.js application using NextAuth.js.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top of the page and select "New Project".
3. Give your project a name and click "Create".
4. Select your new project from the project dropdown.

## Step 2: Configure the OAuth Consent Screen

1. In the Google Cloud Console, navigate to "APIs & Services" > "OAuth consent screen".
2. Select "External" as the user type (unless you're developing for a Google Workspace organization).
3. Fill in the required fields:
   - App name
   - User support email
   - Developer contact information
4. Click "Save and Continue".
5. Add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
   - `openid`
6. Click "Save and Continue".
7. You can add test users if you want, or skip this step.
8. Click "Save and Continue" to complete the consent screen setup.

## Step 3: Create OAuth Credentials

1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials".
2. Click "Create Credentials" and select "OAuth client ID".
3. Set the application type to "Web application".
4. Give your client a name.
5. Add the following authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
6. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click "Create".

You will now see your Client ID and Client Secret. These will be used in your `.env.local` file.

## Step 4: Update Environment Variables

In your `.env.local` file, update the following variables with your Google credentials:

```
GOOGLE_CLIENT_ID=your-client-id-from-google-cloud-console
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-cloud-console
NEXTAUTH_SECRET=generate-a-secure-random-string-minimum-32-characters
```

To generate a secure `NEXTAUTH_SECRET`, you can use the following command in your terminal:

```bash
openssl rand -base64 32
```

## Step 5: Verify Your Setup

1. Start your Next.js application (`npm run dev`).
2. Visit `http://localhost:3000`.
3. Click on the "Sign in with Google" button.
4. You should be redirected to Google's authentication page.
5. After successful authentication, you should be redirected back to your application.

## Troubleshooting

- **Error: "redirect_uri_mismatch"**: Make sure the redirect URI in your Google Cloud Console credentials matches exactly what NextAuth.js is using. The default is `/api/auth/callback/google`.
- **Error: "invalid_client"**: Double-check your client ID and client secret in the `.env.local` file.
- **Error: "access_denied"**: This usually means the user declined to give permission to your app, or there's an issue with your OAuth consent screen configuration.

For more information, refer to the [NextAuth.js documentation](https://next-auth.js.org/providers/google) and the [Google Identity documentation](https://developers.google.com/identity/protocols/oauth2). 