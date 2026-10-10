import { ep, pp } from './helpers';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const BASE = '/api';
const USERS_BASE = '/users';
const USERS = BASE + USERS_BASE;

const Paths = {
  PATH: BASE,
  Users: {
    PATH: USERS_BASE,
    Get: ep(USERS, '/all', 'GET'),
    Add: ep(USERS, '/add', 'POST'),
    Update: ep(USERS, '/update', 'PUT'),
    Delete: {
      ...ep(USERS, `/delete/:id`, 'DELETE'),
      format: (id: string) => `${USERS}/delete/${pp(id)}`,
    },
  },
} as const;

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default Paths;
