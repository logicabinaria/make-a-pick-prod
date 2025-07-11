# Version Management System

## Overview

This project uses a **completely client-side** version management system that requires **zero server resources** on Cloudflare Pages. The system automatically detects when new versions are deployed and prompts users to refresh for the latest updates.

## How It Works

### Client-Side Architecture
- **No API endpoints**: Uses static file fetching instead of server-side processing
- **Static version.json**: Contains version info served as a static asset
- **Automatic detection**: Periodically checks for version updates
- **Seamless updates**: Shows progress overlay and auto-refreshes when new version detected

### Files Involved

1. **`src/utils/versionManager.ts`** - Main version management logic
2. **`public/version.json`** - Static version information file
3. **`scripts/update-version.mjs`** - Script to update versions before deployment

### Version Update Process

1. **Development**: Run `npm run version:patch` (or `version:minor`/`version:major`)
2. **Script Updates**: Both TypeScript and JSON files are updated simultaneously
3. **Build**: Run `npm run build` to create production build
4. **Deploy**: Deploy to Cloudflare Pages (static files only)
5. **User Experience**: Users automatically get notified of updates

### User Experience Flow

1. **Current Version**: User browses normally
2. **New Deployment**: Developer deploys new version
3. **Background Check**: App checks `/version.json` every 30 seconds
4. **Update Detected**: Shows elegant progress overlay
5. **Auto Refresh**: Clears caches and reloads with new version

## Benefits

✅ **Zero Server Cost**: No Edge Runtime or server functions needed
✅ **Fast Performance**: Static file serving is extremely fast
✅ **Reliable**: No server dependencies or potential API failures
✅ **User-Friendly**: Seamless update experience with progress indication
✅ **Developer-Friendly**: Simple version management with npm scripts

## Commands

```bash
# Update patch version (1.0.0 → 1.0.1)
npm run version:patch

# Update minor version (1.0.0 → 1.1.0)
npm run version:minor

# Update major version (1.0.0 → 2.0.0)
npm run version:major

# Manual version update
npm run version:update
```

## Configuration

The version check interval can be adjusted in `public/version.json`:

```json
{
  "version": "1.0.7",
  "buildTime": "2025-07-11T12:18:53.159Z",
  "checkInterval": 30000  // 30 seconds
}
```

## Deployment Notes

- **Cloudflare Pages**: Perfect fit - serves static files with global CDN
- **No Edge Runtime**: Eliminates server usage and associated costs
- **Cache Busting**: Automatic cache clearing ensures users get latest version
- **Progressive Enhancement**: Works even if JavaScript is disabled (manual refresh needed)