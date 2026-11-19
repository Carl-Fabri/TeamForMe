import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Event detail depends on the id and on live backend data (and Leaflet is browser-only):
  // rendered in the client instead of being prerendered at build time.
  {
    path: 'eventos/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
