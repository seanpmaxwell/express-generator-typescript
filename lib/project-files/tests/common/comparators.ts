import { IUser } from '@src/models/User';

/******************************************************************************
                                Types
******************************************************************************/

type TUserArray = IUser[] | readonly IUser[];

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Compare to user arrays. Order does not matter and this assumes the email
 * field is unique
 */
export function compareUserArrays(a: TUserArray, b: TUserArray): boolean {
  if (a.length !== b.length) return false;
  const aSorted = sortByEmail(a),
    bSorted = sortByEmail(b);
  for (let i = 0; i < aSorted.length; i++) {
    const a = aSorted[i],
      b = bSorted[i];
    if (a.email !== b.email || a.name !== b.name) {
      return false;
    }
  }
  return true;
}

/**
 * Sort user array by email.
 */
function sortByEmail(arr: TUserArray): IUser[] {
  return [...arr].sort((x, y) => {
    return x.email.localeCompare(y.email);
  });
}
