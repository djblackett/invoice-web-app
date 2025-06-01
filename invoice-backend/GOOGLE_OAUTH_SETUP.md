# Google OAuth Authentication Setup

This document explains how to set up and use Google OAuth authentication alongside the existing Auth0 implementation.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Session Configuration
SESSION_SECRET=your_session_secret_here

# JWT Configuration (for login resolver)
JWT_SECRET=your_jwt_secret_here

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

## Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set the authorized redirect URIs to include your callback URL (e.g., `http://localhost:4000/auth/google/callback`)
6. Copy the Client ID and Client Secret to your environment variables

## Authentication Flows

### 1. Google OAuth Flow (Recommended for web applications)

**Step 1:** Direct users to the Google OAuth endpoint:
```
GET /auth/google
```

**Step 2:** Google redirects back to your callback URL with user data:
```
GET /auth/google/callback
```

**Step 3:** On successful authentication, users are redirected to:
```
http://localhost:3000/auth/success?user=<encoded_user_data>
```

### 2. GraphQL Login Mutation (For Auth0 or demo users)

```graphql
mutation Login($username: String!, $password: String!, $provider: String) {
  login(username: $username, password: $password, provider: $provider) {
    user {
      id
      username
    }
    token
  }
}
```

**Examples:**

Demo user login:
```graphql
mutation {
  login(username: "demo@example.com", password: "demo") {
    user { id username }
    token
  }
}
```

Google authentication (will return error directing to OAuth flow):
```graphql
mutation {
  login(username: "", password: "", provider: "google") {
    user { id username }
    token
  }
}
```

## Token Verification

The system supports multiple token types:

1. **Auth0 JWT tokens** - Verified using JWKS
2. **Google JWT tokens** - Basic verification (enhance for production)
3. **Demo tokens** - For testing purposes

## Security Notes

⚠️ **Important for Production:**

1. The current Google token verification is simplified for demo purposes
2. In production, you should:
   - Verify Google JWT signatures against Google's public keys
   - Validate token expiration and audience
   - Implement proper error handling
   - Use HTTPS for all OAuth flows
   - Store session secrets securely

## Testing

### Demo Tokens
- `demo-token` - Regular user
- `demo-token-admin` - Admin user

### Demo Login
- Username: `demo@example.com`
- Password: `demo`

## Integration with Frontend

Your frontend should handle the OAuth flow by:

1. Redirecting users to `/auth/google` for Google login
2. Handling the success callback with user data
3. Storing authentication state appropriately
4. Using the existing Auth0 flow for Auth0 users

## Logout

```
GET /auth/logout
```

This will clear the session and redirect to the home page.
