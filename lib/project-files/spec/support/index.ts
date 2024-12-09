import { isValidDate } from 'jet-validators';
import { traverseObject } from 'jet-validators/utils';


/**
 * Send a date object over an API will convert it to a string, so for jasmine
 * tests to pass we need to convert them back to date objects.
 */
export function convertValidDates(toConvert: string | string[]) {
  if (!Array.isArray(toConvert)) {
    toConvert = [toConvert];
  }
  return traverseObject((prop, value, parentObj) => {
    if (toConvert.includes(prop) && isValidDate(value)) {
      parentObj[prop] = new Date(value);
    }
  });
}
