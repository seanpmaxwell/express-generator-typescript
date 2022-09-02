import dotenv from 'dotenv';


const result2 = dotenv.config({
  path: `./src/pre-start/env/test.env`,
});

if (result2.error) {
  throw result2.error;
}
