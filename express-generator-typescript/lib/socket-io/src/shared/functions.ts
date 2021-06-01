import logger from './Logger';


// Print an error if the error message in truthy
export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};


// Get a random number between 1 and 1,000,000,000,000
export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};
