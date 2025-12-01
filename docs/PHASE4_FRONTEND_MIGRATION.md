# Phase 4: Frontend Migration - Implementation Complete

## Overview

Phase 4 implements the frontend authentication system that integrates with the backend OAuth infrastructure created in Phases 1-3. The system supports both the legacy Auth0 authentication and the new self-hosted OAuth system, allowing for a smooth migration path.

## Architecture

### Authentication Modes

The system supports three authentication modes via the `VITE_AUTH_SYSTEM` environment variable:

- **`auth0`** (default): Uses only Auth0 - backward compatible with existing setup
- **`new`**: Uses only the new self-hosted OAuth system
- **`dual`**: Supports both systems during migration period

### Key Components

#### 1. Authentication Context & Providers

**NewAuthProvider** ([NewAuthContext.tsx](../invoice-frontend/src/features/auth/contexts/NewAuthContext.tsx))
- Manages authentication state for the new OAuth system
- Stores access tokens in memory (never localStorage)
- Handles automatic token refresh before expiration
- Supports email/password and OAuth provider logins
- Implements token family tracking for security

**UnifiedAuthProvider** ([UnifiedAuthProvider.tsx](../invoice-frontend/src/features/auth/components/UnifiedAuthProvider.tsx))
- Wrapper that selects appropriate auth provider based on `VITE_AUTH_SYSTEM`
- Maintains backward compatibility with Auth0
- Respects demo mode settings

#### 2. Authentication API Service

**auth.api.ts** ([auth.api.ts](../invoice-frontend/src/features/auth/services/auth.api.ts))
- Handles all HTTP communication with backend auth endpoints
- Implements email/password registration and login
- Manages token refresh via httpOnly cookies
- Provides OAuth provider URLs
- Handles OAuth callback token extraction

**Key Functions:**
```typescript
register(data: RegisterRequest): Promise<AuthResponse>
login(data: LoginRequest): Promise<AuthResponse>
refreshAccessToken(): Promise<RefreshTokenResponse>
logout(): Promise<void>
getOAuthLoginUrl(provider): string
extractOAuthTokenFromUrl(): { accessToken, isNewUser, error }
```

#### 3. UI Components

**LoginForm** ([LoginForm.tsx](../invoice-frontend/src/features/auth/components/LoginForm.tsx))
- Email/password login interface
- OAuth provider buttons
- Switch to registration view
- Error handling and validation

**RegisterForm** ([RegisterForm.tsx](../invoice-frontend/src/features/auth/components/RegisterForm.tsx))
- User registration with email/password
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- OAuth provider buttons
- Switch to login view

**OAuthButtons** ([OAuthButtons.tsx](../invoice-frontend/src/features/auth/components/OAuthButtons.tsx))
- Branded buttons for Google, Microsoft, and Apple OAuth
- Consistent styling and hover effects
- Disabled state during loading

**ProtectedRoute** ([ProtectedRoute.tsx](../invoice-frontend/src/features/auth/components/ProtectedRoute.tsx))
- Wrapper component for protected routes
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

#### 4. Pages

**NewLogin** ([NewLogin.tsx](../invoice-frontend/src/features/auth/pages/NewLogin.tsx))
- Main login page with toggle between login/register
- Gradient background styling
- Redirects authenticated users to `/invoices`

**OAuthCallback** ([OAuthCallback.tsx](../invoice-frontend/src/features/auth/pages/OAuthCallback.tsx))
- Handles OAuth provider redirects
- Extracts token from URL parameters
- Shows loading state while processing
- Displays errors if OAuth fails
- Auto-redirects to `/invoices` on success

#### 5. Hooks

**useUnifiedAuth** ([useUnifiedAuth.ts](../invoice-frontend/src/features/auth/hooks/useUnifiedAuth.ts))
- Unified interface for authentication
- Automatically selects Auth0 or new system based on config
- Returns consistent API regardless of backend

**useNewAuth** (from NewAuthContext.tsx)
- Hook for accessing new auth context
- Provides user, tokens, and auth methods

## Token Management

### Access Tokens
- **Storage**: Memory only (never localStorage/sessionStorage)
- **Lifetime**: 15 minutes
- **Format**: JWT signed with RS256
- **Refresh**: Automatic refresh 2 minutes before expiration
- **Usage**: Sent in `Authorization: Bearer <token>` header

### Refresh Tokens
- **Storage**: httpOnly, secure, SameSite cookies
- **Lifetime**: 30 days
- **Format**: Opaque token (bcrypt hashed)
- **Rotation**: New token issued on each refresh
- **Family Tracking**: Prevents token reuse attacks

### Token Refresh Flow

```typescript
// In NewAuthContext.tsx
useEffect(() => {
  if (!tokenExpiresAt || !accessToken) return;

  // Refresh 2 minutes before expiration
  const timeUntilRefresh = tokenExpiresAt - Date.now() - 120000;

  if (timeUntilRefresh <= 0) {
    refreshToken();
    return;
  }

  const timeoutId = setTimeout(() => {
    refreshToken();
  }, timeUntilRefresh);

  return () => clearTimeout(timeoutId);
}, [tokenExpiresAt, accessToken, refreshToken]);
```

## OAuth Flow

### Google/Microsoft OAuth Flow

1. User clicks "Continue with Google" button
2. Frontend redirects to: `${API_BASE_URL}/oauth/google`
3. Backend redirects to Google OAuth consent screen
4. User authenticates with Google
5. Google redirects to: `${API_BASE_URL}/oauth/google/callback`
6. Backend:
   - Validates OAuth token
   - Creates/links user account
   - Generates access + refresh tokens
   - Sets refresh token in httpOnly cookie
   - Redirects to: `${FRONTEND_URL}/auth/callback?token={accessToken}&new={isNewUser}`
7. Frontend OAuthCallback page:
   - Extracts token from URL
   - Stores in NewAuthContext
   - Clears URL parameters
   - Redirects to `/invoices`

### Apple OAuth Flow

Same as above, but uses POST endpoints per Apple requirements:
- Initiate: `POST /oauth/apple`
- Callback: `POST /oauth/apple/callback`

## Apollo Client Integration

Updated [useApolloClient.ts](../invoice-frontend/src/features/shared/hooks/useApolloClient.ts) to use `useUnifiedAuth`:

```typescript
const { getAccessToken, user } = useUnifiedAuth();

const authLink = setContext(async (_, { headers }) => {
  try {
    let token;
    if (isDemoMode) {
      token = "demo-token" + (user?.role === 1 ? "-admin" : "");
    } else {
      token = await getAccessToken(); // Uses new auth or Auth0
    }
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  } catch (error) {
    console.error("Error fetching access token:", error);
    return { headers };
  }
});
```

## Security Features

### Frontend Security

1. **No Token Storage in localStorage**
   - Access tokens only in memory
   - Refresh tokens only in httpOnly cookies
   - Prevents XSS token theft

2. **Automatic Token Refresh**
   - Proactive refresh before expiration
   - Prevents duplicate refresh calls
   - Graceful fallback on failure

3. **CORS Protection**
   - `credentials: 'include'` for cookie transmission
   - Backend validates origin

4. **Password Validation**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number, special character
   - Client-side validation before submission

### OAuth Security

1. **State Parameter**
   - Prevents CSRF attacks
   - Handled automatically by Passport strategies

2. **httpOnly Cookies**
   - JavaScript cannot access refresh tokens
   - Mitigates XSS attacks

3. **Secure + SameSite Cookies**
   - `secure: true` in production (HTTPS only)
   - `sameSite: 'strict'` prevents CSRF

## Configuration

### Environment Variables

Add to `.env` file:

```bash
# Authentication System Selection
# Options: "auth0" (default), "new" (self-hosted OAuth), "dual" (migration mode)
VITE_AUTH_SYSTEM=auth0

# Existing Auth0 vars (only needed if VITE_AUTH_SYSTEM is "auth0" or "dual")
VITE_DOMAIN=your-tenant.auth0.com
VITE_AUDIENCE=https://invoice-web-app/
VITE_CLIENT_ID=your-client-id
VITE_SCOPE="openid profile email offline_access role"
VITE_REDIRECT_URI=https://localhost:5173/invoice-web-app/

# New OAuth System
# Backend URL is automatically derived from VITE_BACKEND_URL
# OAuth callback URL: /auth/callback
```

### Switching Auth Systems

**To use new authentication:**
```bash
VITE_AUTH_SYSTEM=new
```

**To support both (migration mode):**
```bash
VITE_AUTH_SYSTEM=dual
```

**To use Auth0 only (default):**
```bash
VITE_AUTH_SYSTEM=auth0
```

## Migration Path

### Step 1: Test New Auth (Recommended)
Set `VITE_AUTH_SYSTEM=new` in development and test:
- Email/password registration and login
- All three OAuth providers (Google, Microsoft, Apple)
- Token refresh functionality
- Protected routes

### Step 2: Dual Mode (Gradual Migration)
Set `VITE_AUTH_SYSTEM=dual` to support both systems:
- New users can use either system
- Existing Auth0 users continue working
- Monitor usage and errors
- Migrate users gradually

### Step 3: Full Migration
Once all users migrated, set `VITE_AUTH_SYSTEM=new`:
- Remove Auth0 dependency
- Clean up Auth0-specific code
- Reduce bundle size

## Files Created

### Core Authentication
- `src/features/auth/contexts/NewAuthContext.tsx` - New auth context and provider
- `src/features/auth/services/auth.api.ts` - Backend API communication
- `src/features/auth/hooks/useUnifiedAuth.ts` - Unified auth hook

### UI Components
- `src/features/auth/components/LoginForm.tsx` - Login form
- `src/features/auth/components/RegisterForm.tsx` - Registration form
- `src/features/auth/components/OAuthButtons.tsx` - OAuth provider buttons
- `src/features/auth/components/ProtectedRoute.tsx` - Route protection
- `src/features/auth/components/UnifiedAuthProvider.tsx` - Unified provider wrapper

### Pages
- `src/features/auth/pages/NewLogin.tsx` - New login page
- `src/features/auth/pages/OAuthCallback.tsx` - OAuth callback handler

### Modified Files
- `src/app/AppWrapper.tsx` - Uses UnifiedAuthProvider
- `src/features/shared/hooks/useApolloClient.ts` - Uses unified auth for tokens
- `.env.example` - Added VITE_AUTH_SYSTEM configuration

## Testing Checklist

### Email/Password Flow
- [ ] Register new account with valid password
- [ ] Register fails with weak password
- [ ] Login with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Access token automatically refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect to login when logged out

### OAuth Flows
- [ ] Google OAuth registration (new user)
- [ ] Google OAuth login (existing user)
- [ ] Microsoft OAuth registration
- [ ] Microsoft OAuth login
- [ ] Apple OAuth registration
- [ ] Apple OAuth login
- [ ] OAuth error handling (user denies)
- [ ] OAuth callback with invalid token

### Token Management
- [ ] Access token stored only in memory
- [ ] Refresh token stored as httpOnly cookie
- [ ] Token automatically refreshes before expiration
- [ ] Expired refresh token redirects to login
- [ ] Multiple tabs share refresh token cookie

### Integration
- [ ] GraphQL queries include auth token
- [ ] GraphQL subscriptions authenticate
- [ ] Apollo Client handles token refresh
- [ ] Demo mode still works
- [ ] Auth0 mode still works (backward compatibility)

## Troubleshooting

### "NewAuthContext is not available" Error
**Cause**: `useUnifiedAuth` called but `UnifiedAuthProvider` not in component tree
**Fix**: Ensure `AppWrapper.tsx` uses `UnifiedAuthProvider`

### OAuth Callback Shows Error
**Cause**: Backend OAuth configuration incorrect
**Fix**: Check backend OAuth provider credentials in `.env`

### Token Refresh Fails
**Cause**: Refresh token cookie not being sent
**Fix**: Ensure `credentials: 'include'` in fetch calls and CORS allows credentials

### GraphQL Queries Return 401
**Cause**: Access token not being included or expired
**Fix**: Check Apollo Client authLink, verify token refresh logic

### Infinite Redirect Loop
**Cause**: Protected route redirects to login, but login redirects back
**Fix**: Check `isAuthenticated` logic in NewAuthContext initialization

## Next Steps

After Phase 4 is complete and tested:

**Phase 5: User Migration**
- Implement user migration scripts
- Add "Link Auth0 Account" functionality
- Bulk migrate existing users
- Email notifications

**Phase 6: Testing & Security**
- Comprehensive E2E tests
- Security audit
- Penetration testing
- Rate limiting verification
- Token rotation testing

**Phase 7: Deployment**
- Staging environment deployment
- Production deployment strategy
- Rollback plan
- Monitoring and alerts

**Phase 8: Auth0 Deprecation**
- Remove Auth0 dependencies
- Clean up legacy code
- Update documentation
- Archive migration code

## Support

For issues or questions:
1. Check this documentation
2. Review backend Phase 1-3 documentation
3. Check error logs in browser console
4. Verify environment variables
5. Test with network tab open to see API calls
