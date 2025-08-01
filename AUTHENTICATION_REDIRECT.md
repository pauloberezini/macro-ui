# Angular Authentication Redirect Implementation

## Overview

The Angular application now automatically redirects users from protected pages (like `/app-profile`) to the main page when a 401 Unauthorized response is received from the backend.

## Implementation Details

### 1. JWT Interceptor (`jwt.interceptor.ts`)

**File:** `src/app/login/interceptors/jwt.interceptor.ts`

The interceptor now:
- Adds Authorization headers to requests when a token exists
- Catches 401 Unauthorized responses
- Clears all authentication data from localStorage
- Redirects to main page (`/`)
- Re-throws the error for component-level handling

### 2. Profile Component Error Handling

**File:** `src/app/pages/profile/profile.component.ts`

Updated error handling to:
- Not show error messages for 401 responses (interceptor handles redirect)
- Continue showing errors for other HTTP status codes
- Maintain proper loading states

### 3. How It Works

1. **User visits `/app-profile`** - Profile component loads
2. **API calls are made** - getCurrentUser(), getUserFavoriteStocks(), etc.
3. **Backend returns 401** - User is not authenticated
4. **JWT interceptor catches 401** - Clears auth data and redirects
5. **User is redirected** - Automatically sent to main page (`/`)

## API Endpoints Affected

All API calls that require authentication will trigger the redirect:

- `GET /api/ai-profile/user` - Get current user info
- `GET /api/ai-profile/profile` - Get AI profile data
- `POST /api/ai-profile/refresh` - Refresh AI profile
- `GET /api/ai-profile/ticker/{ticker}/insights` - Get ticker insights
- `GET /api/ai-profile/portfolio/analysis` - Get portfolio analysis
- `GET /api/ai-profile/ticker/{ticker}/news` - Get ticker news
- All user favorites endpoints

## User Experience

### Before (Problem)
- User visits `/app-profile` without being logged in
- Page shows loading spinners indefinitely
- User gets stuck on the page with no clear way to login

### After (Solution)
- User visits `/app-profile` without being logged in
- Backend returns 401 Unauthorized
- JWT interceptor automatically redirects to main page (`/`)
- User can login and then access the profile page

## Testing

### Manual Testing
1. Clear localStorage (remove token)
2. Navigate to `/app-profile`
3. Should automatically redirect to main page (`/`)

### Unit Testing
- JWT interceptor tests verify 401 handling
- Profile component tests verify error handling
- All tests pass successfully

## Benefits

1. **Better UX**: Users are automatically redirected to login
2. **Security**: Prevents unauthorized access to protected pages
3. **Consistency**: All protected routes handle auth errors uniformly
4. **Maintainability**: Centralized auth handling in interceptor
5. **Reliability**: Works for all API calls automatically

## Configuration

The interceptor is automatically applied to all HTTP requests through the Angular HTTP client. No additional configuration is needed.

## Troubleshooting

If redirects are not working:
1. Check that the JWT interceptor is properly registered in `app.config.ts`
2. Verify that the Router is properly injected
3. Check browser console for any JavaScript errors
4. Ensure the backend is returning proper 401 status codes 