# Environment Setup Guide

## 🔐 Security Best Practices

This application uses Angular's built-in `fileReplacements` feature to securely manage API keys and sensitive configuration.

## 📁 Environment Files

### Development (`src/environments/environment.dev.ts`)
- Used for local development
- Contains real development API keys
- **Excluded from Git** (in `.gitignore`)

### Production (`src/environments/environment.prod.ts`)
- Used for production deployment
- Contains placeholder API keys
- **Included in Git** (safe to commit)

## 🚀 Development Setup

### 1. Development Environment

The development environment file (`src/environments/environment.dev.ts`) already contains your development API keys:

```typescript
// NowPayments API Keys - Development keys
nowpaymentsApiKey: '',
nowpaymentsPublicKey: ''
```

### 2. Start Development Server

```bash
# Start with development environment
npm start
```

This automatically uses the development environment with real API keys.

## 🚀 Production Setup

### 1. Update Production Environment

Edit `src/environments/environment.prod.ts` and replace the placeholders:

```typescript
// Replace these placeholders with your actual production keys
nowpaymentsApiKey: 'your_actual_production_api_key',
nowpaymentsPublicKey: 'your_actual_production_public_key'
```

### 2. Build for Production

```bash
# Build with production environment
npm run build
```

This will:
1. Use Angular's `fileReplacements` to replace `environment.ts` with `environment.prod.ts`
2. Build the application with production keys
3. Create optimized production bundle

## 🔧 Docker Deployment

The Docker setup automatically uses the production build process:

```bash
# Build and run with production environment
./build-and-run.sh
```

## 🛡️ Security Checklist

- [x] `environment.dev.ts` exists with real development API keys
- [x] `environment.dev.ts` is in `.gitignore`
- [x] `environment.prod.ts` contains placeholders (safe to commit)
- [x] No API keys hardcoded in source code
- [x] Uses Angular's native file replacement system
- [x] Development and production use different keys

## 📝 Current API Keys

**Development:**
- API Key: ``
- Public Key: ``

**Production:**
- API Key: `[Set in environment.prod.ts]`
- Public Key: `[Set in environment.prod.ts]`

## 🔄 Build Process

1. **Development**: Uses `environment.dev.ts` with real development keys
2. **Production**: Uses `environment.prod.ts` with real production keys
3. **Docker**: Automatically uses production build process 
