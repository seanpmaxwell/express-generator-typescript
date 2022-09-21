/**
 * Get a random number between 1 and 1,000,000,000,000
 */
function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}


// **** Export default **** //

export default {
  getRandomInt,
} as const;
