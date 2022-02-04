
// User schema
export interface IUser {
    id: number;
    name: string;
    email: string;
}


/**
 * Get a new User object.
 * 
 * @returns 
 */
function getNew() {
    return {
        id: -1,
        email: '',
        name: '',
    };
}


// Export default
export default {
    new: getNew,
}
