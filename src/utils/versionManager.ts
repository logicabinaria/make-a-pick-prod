// Simple version management system for automatic app updates

export interface VersionInfo {
  version: string;
  buildTime: string;
  checkInterval: number; // in milliseconds
}

// Current app version - update this with each deployment
export const CURRENT_VERSION = {
  version: '1.0.6',
  buildTime: '2025-07-11T12:10:24.629Z',
  checkInterval: 30000 // Check every 30 seconds
};

// Version check endpoint (will be created as API route)
const VERSION_ENDPOINT = '/api/version';

class VersionManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private isChecking = false;
  private lastKnownVersion = CURRENT_VERSION.version;

  constructor() {
    this.lastKnownVersion = this.getStoredVersion() || CURRENT_VERSION.version;
  }

  // Start automatic version checking
  startVersionCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, CURRENT_VERSION.checkInterval);

    // Initial check
    setTimeout(() => this.checkForUpdates(), 5000);
  }

  // Stop version checking
  stopVersionCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check for new version
  private async checkForUpdates(): Promise<void> {
    if (this.isChecking) return;
    
    this.isChecking = true;
    
    try {
      const response = await fetch(VERSION_ENDPOINT, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const serverVersion: VersionInfo = await response.json();
        
        if (this.isNewVersionAvailable(serverVersion.version)) {
          console.log(`New version available: ${serverVersion.version}`);
          this.handleNewVersion(serverVersion);
        }
      }
    } catch (error) {
      console.warn('Version check failed:', error);
    } finally {
      this.isChecking = false;
    }
  }

  // Check if new version is available
  private isNewVersionAvailable(serverVersion: string): boolean {
    return serverVersion !== this.lastKnownVersion;
  }

  // Handle new version detection
  private handleNewVersion(versionInfo: VersionInfo): void {
    this.stopVersionCheck();
    this.storeVersion(versionInfo.version);
    this.showUpdateProgress();
  }

  // Show update progress and refresh
  private showUpdateProgress(): void {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'version-update-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(17, 24, 39, 0.95);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create content
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 400px; padding: 20px;">
        <div style="font-size: 24px; margin-bottom: 16px;">🔄</div>
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">New Version Available!</h2>
        <p style="margin: 0 0 24px 0; color: #9CA3AF; font-size: 14px;">Loading the latest version of Make A Pick...</p>
        
        <!-- Progress Bar -->
        <div style="width: 100%; height: 4px; background: #374151; border-radius: 2px; overflow: hidden; margin-bottom: 16px;">
          <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #10B981, #059669); width: 0%; transition: width 0.3s ease;"></div>
        </div>
        
        <p style="margin: 0; color: #6B7280; font-size: 12px;">Please wait while we update the app...</p>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress increment
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Force full page refresh after progress completes
          setTimeout(() => {
            this.forceAppRefresh();
          }, 500);
        }
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }, 200);
    }
  }

  // Force complete app refresh
  private forceAppRefresh(): void {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }

    // Clear browser storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      console.warn('Could not clear storage');
    }

    // Force hard refresh
    window.location.reload();
  }

  // Store version in localStorage
  private storeVersion(version: string): void {
    try {
      localStorage.setItem('app_version', version);
    } catch {
      console.warn('Could not store version');
    }
  }

  // Get stored version
  private getStoredVersion(): string | null {
    try {
      return localStorage.getItem('app_version');
    } catch {
      return null;
    }
  }

  // Manual version check (for testing)
  async checkNow(): Promise<void> {
    await this.checkForUpdates();
  }
}

// Export singleton instance
export const versionManager = new VersionManager();

// Auto-start version checking when module loads
if (typeof window !== 'undefined') {
  // Start checking after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      versionManager.startVersionCheck();
    });
  } else {
    versionManager.startVersionCheck();
  }
}