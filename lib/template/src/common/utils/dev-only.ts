import connectLiveReload from 'connect-livereload';
import type { Express } from 'express';
import livereload from 'livereload';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Development only: refresh the browser when front-end files change, and
 * after `tsx watch` restarts the server for a TypeScript change.
 *
 * Must be registered before the routes that serve html so the reload script
 * gets injected into those pages.
 */
export function setupLiveReload(app: Express, watchDirs: string[]): void {
  const server = livereload.createServer();
  server.watch(watchDirs);
  // A new process means the backend just restarted; reload once the browser
  // reconnects so it picks up the new server code.
  server.server.once('connection', () => {
    setTimeout(() => server.refresh('/'), 100);
  });
  app.use(connectLiveReload());
}
