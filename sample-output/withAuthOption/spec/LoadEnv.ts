// Set the env file
import dotenv from 'dotenv';

const result2 = dotenv.config({
    path: `./env/test.env`,
});

if (result2.error) {
    throw result2.error;
}
