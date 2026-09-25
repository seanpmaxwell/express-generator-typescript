import jetPaths from 'jet-paths';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const Paths = {
  _: '/api',
  Users: {
    _: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export const JetPaths = jetPaths(Paths);
export default Paths;
