import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Make a Pick - Random Decision Maker',
    short_name: 'Make a Pick',
    description: 'A privacy-focused app to help you make random decisions from your custom options',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#16a34a',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    },
    launch_handler: {
      client_mode: 'navigate-existing'
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}