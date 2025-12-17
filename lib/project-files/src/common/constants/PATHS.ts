import jetPaths from 'jet-paths';

const PATHS = {
  _: '/api',
  Users: {
    _: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;

export const JET_PATHS = jetPaths(PATHS);
export default PATHS;
