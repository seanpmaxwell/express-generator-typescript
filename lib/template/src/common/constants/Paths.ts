import jetPaths from 'jet-paths';

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default jetPaths({
  $path: '/api',
  Users: {
    $path: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const);
