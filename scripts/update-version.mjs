#!/usr/bin/env node

/**
 * Version Update Script
 * 
 * This script automatically updates the version number in versionManager.ts
 * Run this before each deployment to ensure version checking works properly.
 * 
 * Usage:
 *   node scripts/update-version.js [version]
 *   
 * If no version is provided, it will auto-increment the patch version.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the version manager file
const VERSION_FILE = path.join(__dirname, '..', 'src', 'utils', 'versionManager.ts');

// Get version from command line or auto-increment
function getNewVersion() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    return args[0];
  }
  
  // Auto-increment patch version
  try {
    const content = fs.readFileSync(VERSION_FILE, 'utf8');
    const versionMatch = content.match(/version: '([0-9]+\.[0-9]+\.[0-9]+)'/);
    
    if (versionMatch) {
      const currentVersion = versionMatch[1];
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      return `${major}.${minor}.${patch + 1}`;
    }
  } catch (_error) {
    console.warn('Could not read current version, using default');
  }
  
  // Default version if can't read current
  return '1.0.1';
}

// Update version in the file
function updateVersion(newVersion) {
  try {
    let content = fs.readFileSync(VERSION_FILE, 'utf8');
    
    // Update version
    content = content.replace(
      /version: '[0-9]+\.[0-9]+\.[0-9]+'/,
      `version: '${newVersion}'`
    );
    
    // Update build time
    content = content.replace(
      /buildTime: '[^']*'/,
      `buildTime: '${new Date().toISOString()}'`
    );
    
    fs.writeFileSync(VERSION_FILE, content, 'utf8');
    
    console.log(`✅ Version updated to ${newVersion}`);
    console.log(`📅 Build time: ${new Date().toISOString()}`);
    console.log(`📁 File: ${VERSION_FILE}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update version:', error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🔄 Updating version for deployment...');
  
  const newVersion = getNewVersion();
  console.log(`🎯 Target version: ${newVersion}`);
  
  if (updateVersion(newVersion)) {
    console.log('\n🚀 Ready for deployment!');
    console.log('\n💡 Next steps:');
    console.log('   1. Build the project: npm run build');
    console.log('   2. Deploy to production');
    console.log('   3. Users will automatically get the new version!');
  } else {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { updateVersion, getNewVersion };