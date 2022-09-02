# set-value [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=W8YFZ425KND68) [![NPM version](https://img.shields.io/npm/v/set-value.svg?style=flat)](https://www.npmjs.com/package/set-value) [![NPM monthly downloads](https://img.shields.io/npm/dm/set-value.svg?style=flat)](https://npmjs.org/package/set-value) [![NPM total downloads](https://img.shields.io/npm/dt/set-value.svg?style=flat)](https://npmjs.org/package/set-value) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/set-value.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/set-value)

> Create nested values and any intermediaries using dot notation (`'a.b.c'`) paths.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save set-value
```

## Heads up!

[Please update](https://github.com/update/update) to version 3.0.1 or later, a critical bug was fixed in that version.

## Usage

```js
const set = require('set-value');
set(object, prop, value);
```

### Params

* `object` **{object}**: The object to set `value` on
* `prop` **{string}**: The property to set. Dot-notation may be used.
* `value` **{any}**: The value to set on `object[prop]`

## Examples

Updates and returns the given object:

```js
const obj = {};
set(obj, 'a.b.c', 'd');
console.log(obj);
//=> { a: { b: { c: 'd' } } }
```

### Escaping

**Escaping with backslashes**

Prevent set-value from splitting on a dot by prefixing it with backslashes:

```js
console.log(set({}, 'a\\.b.c', 'd'));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, 'a\\.b\\.c', 'd'));
//=> { 'a.b.c': 'd' }
```

## Benchmarks

_(benchmarks were run on a MacBook Pro 2.5 GHz Intel Core i7, 16 GB 1600 MHz DDR3)_.

set-value is more reliable and has more features than dot-prop, without sacrificing performance.

```
# deep (194 bytes)
  deep-object x 629,744 ops/sec ±0.85% (88 runs sampled)
  deep-property x 1,470,427 ops/sec ±0.94% (89 runs sampled)
  deep-set x 1,401,089 ops/sec ±1.02% (91 runs sampled)
  deephas x 590,005 ops/sec ±1.73% (86 runs sampled)
  dot-prop x 1,261,408 ops/sec ±0.94% (90 runs sampled)
  dot2val x 1,672,729 ops/sec ±1.12% (89 runs sampled)
  es5-dot-prop x 1,313,018 ops/sec ±0.79% (91 runs sampled)
  lodash-set x 1,074,464 ops/sec ±0.97% (93 runs sampled)
  object-path-set x 961,198 ops/sec ±2.07% (74 runs sampled)
  object-set x 258,438 ops/sec ±0.69% (90 runs sampled)
  set-value x 1,976,843 ops/sec ±2.07% (89 runs sampled)

  fastest is set-value (by 186% avg)

# medium (98 bytes)
  deep-object x 3,249,287 ops/sec ±1.04% (93 runs sampled)
  deep-property x 3,409,307 ops/sec ±1.28% (88 runs sampled)
  deep-set x 3,240,776 ops/sec ±1.13% (93 runs sampled)
  deephas x 960,504 ops/sec ±1.39% (89 runs sampled)
  dot-prop x 2,776,388 ops/sec ±0.80% (94 runs sampled)
  dot2val x 3,889,791 ops/sec ±1.28% (91 runs sampled)
  es5-dot-prop x 2,779,604 ops/sec ±1.32% (91 runs sampled)
  lodash-set x 2,791,304 ops/sec ±0.75% (90 runs sampled)
  object-path-set x 2,462,084 ops/sec ±1.51% (91 runs sampled)
  object-set x 838,569 ops/sec ±0.87% (90 runs sampled)
  set-value x 4,767,287 ops/sec ±1.21% (91 runs sampled)

  fastest is set-value (by 181% avg)

# shallow (101 bytes)
  deep-object x 4,793,168 ops/sec ±0.75% (88 runs sampled)
  deep-property x 4,669,218 ops/sec ±1.17% (90 runs sampled)
  deep-set x 4,648,247 ops/sec ±0.73% (91 runs sampled)
  deephas x 1,246,414 ops/sec ±1.67% (92 runs sampled)
  dot-prop x 3,913,694 ops/sec ±1.23% (89 runs sampled)
  dot2val x 5,428,829 ops/sec ±0.76% (92 runs sampled)
  es5-dot-prop x 3,897,931 ops/sec ±1.19% (92 runs sampled)
  lodash-set x 6,128,638 ops/sec ±0.95% (87 runs sampled)
  object-path-set x 5,429,978 ops/sec ±3.31% (87 runs sampled)
  object-set x 1,529,485 ops/sec ±2.37% (89 runs sampled)
  set-value x 7,150,921 ops/sec ±1.58% (89 runs sampled)

  fastest is set-value (by 172% avg)

```

### Running the benchmarks

Clone this library into a local directory:

```sh
$ git clone https://github.com/jonschlinkert/set-value.git
```

Then install devDependencies and run benchmarks:

```sh
$ npm install && node benchmark
```

## Comparisons to other libs, or _"the list of shame"_

These are just a few of the duplicate libraries on NPM.

* [bury](https://github.com/kalmbach/bury) fails all of the tests. I even wrapped it to have it return the object instead of the value, but with all of that work it still fails the vast majority of tests.
* [deep-get-set](https://github.com/acstll/deep-get-set) fails 22 of 26 unit tests.
* [deep-object](https://github.com/ayushgp/deep-object) fails 25 of 26 unit tests, completely butchered given objects.
* [deep-property](https://github.com/mikattack/node-deep-property) fails 17 of 26 unit tests.
* [deep-set](https://github.com/klaemo/deep-set) fails 13 of 26 unit tests.
* [deephas](https://github.com/sharpred/deepHas) fails 17 of 26 unit tests.
* [dot-prop](https://github.com/sindresorhus/dot-prop) fails 9 of 26 unit tests.
* [dot2val](https://github.com/yangg/dot2val) fails 17 of 26 unit tests.
* [es5-dot-prop](https://github.com/sindresorhus/dot-prop) fails 15 of 26 unit tests.
* [getsetdeep](https://github.com/bevry/getsetdeep) fails all unit tests due to `this` being used improperly in the methods. I was able to patch it by binding the (plain) object to the methods, but it still fails 17 of 26 unit tests.
* [lodash.set](https://lodash.com/) fails 11 of 26 unit tests.
* [object-path-set](https://github.com/skratchdot/object-path-set) fails 12 of 26 unit tests.
* [object-path](https://github.com/mariocasciaro/object-path) fails 16 of 26 unit tests.
* [object-set](https://github.com/gearcase/object-set) fails 13 of 26 unit tests.
* [set-nested-prop](https://github.com/tiaanduplessis/set-nested-prop) fails 24 of 26 unit tests.
* [setvalue](https://github.com/blakeembrey/setvalue) (this library is almost identical to a previous version of this library)
* Many dozens of others

**Others that do the same thing, but use a completely different API**

* [deep-set-in](https://github.com/KulikovskyIgor/deep-set-in)
* [set-deep](https://github.com/radubrehar/set-deep)
* [set-deep-prop](https://github.com/mmckelvy/set-deep-prop)
* [bury](https://github.com/kalmbach/bury)
* Many dozens of others

## History

### v3.0.0

* Added support for a custom `split` function to be passed on the options.
* Removed support for splitting on brackets, since a [custom function](https://github.com/jonschlinkert/split-string) can be passed to do this now.

### v2.0.0

* Adds support for escaping with double or single quotes. See [escaping](#escaping) for examples.
* Will no longer split inside brackets or braces. See [bracket support](#bracket-support) for examples.

If there are any regressions please create a [bug report](../../issues/new). Thanks!

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [assign-value](https://www.npmjs.com/package/assign-value): Assign a value or extend a deeply nested property of an object using object path… [more](https://github.com/jonschlinkert/assign-value) | [homepage](https://github.com/jonschlinkert/assign-value "Assign a value or extend a deeply nested property of an object using object path notation.")
* [get-value](https://www.npmjs.com/package/get-value): Use property paths like 'a.b.c' to get a nested value from an object. Even works… [more](https://github.com/jonschlinkert/get-value) | [homepage](https://github.com/jonschlinkert/get-value "Use property paths like 'a.b.c' to get a nested value from an object. Even works when keys have dots in them (no other dot-prop library can do this!).")
* [has-value](https://www.npmjs.com/package/has-value): Returns true if a value exists, false if empty. Works with deeply nested values using… [more](https://github.com/jonschlinkert/has-value) | [homepage](https://github.com/jonschlinkert/has-value "Returns true if a value exists, false if empty. Works with deeply nested values using object paths.")
* [merge-value](https://www.npmjs.com/package/merge-value): Similar to assign-value but deeply merges object values or nested values using object path/dot notation. | [homepage](https://github.com/jonschlinkert/merge-value "Similar to assign-value but deeply merges object values or nested values using object path/dot notation.")
* [omit-value](https://www.npmjs.com/package/omit-value): Omit properties from an object or deeply nested property of an object using object path… [more](https://github.com/jonschlinkert/omit-value) | [homepage](https://github.com/jonschlinkert/omit-value "Omit properties from an object or deeply nested property of an object using object path notation.")
* [set-value](https://www.npmjs.com/package/set-value): Create nested values and any intermediaries using dot notation (`'a.b.c'`) paths. | [homepage](https://github.com/jonschlinkert/set-value "Create nested values and any intermediaries using dot notation (`'a.b.c'`) paths.")
* [union-value](https://www.npmjs.com/package/union-value): Set an array of unique values as the property of an object. Supports setting deeply… [more](https://github.com/jonschlinkert/union-value) | [homepage](https://github.com/jonschlinkert/union-value "Set an array of unique values as the property of an object. Supports setting deeply nested properties using using object-paths/dot notation.")
* [unset-value](https://www.npmjs.com/package/unset-value): Delete nested properties from an object using dot notation. | [homepage](https://github.com/jonschlinkert/unset-value "Delete nested properties from an object using dot notation.")

### Contributors

| **Commits** | **Contributor** |  
| --- | --- |  
| 71 | [jonschlinkert](https://github.com/jonschlinkert) |  
| 2  | [mbelsky](https://github.com/mbelsky) |  
| 1  | [vadimdemedes](https://github.com/vadimdemedes) |  
| 1  | [wtgtybhertgeghgtwtg](https://github.com/wtgtybhertgeghgtwtg) |  

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2019, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on June 19, 2019._