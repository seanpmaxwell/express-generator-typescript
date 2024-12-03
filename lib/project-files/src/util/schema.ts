import jetSchema from 'jet-schema';
import { isBool, isNum, isStr } from './validators';


export default jetSchema({
  globals: [
    { vf: isNum, default: 0 },
    { vf: isStr, default: '' },
    { vf: isBool, default: false },
  ],
});
