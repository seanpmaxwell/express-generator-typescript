
















# edit-json-file

Edit a json file with ease.




## Installation

```sh
$ npm i edit-json-file
```









## Example






```js
"use strict";

const editJsonFile = require("edit-json-file");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/foo.json`);

// Set a couple of fields
file.set("planet", "Earth");
file.set("city\\.name", "anytown");
file.set("name.first", "Johnny");
file.set("name.last", "B.");
file.set("is_student", false);


// Output the content
console.log(file.get());
// { planet: 'Earth',
//   city.name: 'anytown',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false }

// Save the data to the disk
file.save();

// Reload it from the disk
file = editJsonFile(`${__dirname}/foo.json`, {
    autosave: true
});

// Get one field
console.log(file.get("name.first"));
// => Johnny

// This will save it to disk
file.set("a.new.field.as.object", {
    hello: "world"
});

// Output the whole thing
console.log(file.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }

```






## Documentation





### `JsonEditor(path, options)`

#### Params
- **String** `path`: The path to the JSON file.
- **Object** `options`: An object containing the following fields:
 - `stringify_width` (Number): The JSON stringify indent width (default: `2`).
 - `stringify_fn` (Function): A function used by `JSON.stringify`.
 - `stringify_eol` (Boolean): Wheter to add the new line at the end of the file or not (default: `false`)
 - `autosave` (Boolean): Save the file when setting some data in it.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `set(path, value)`
Set a value in a specific path.

#### Params
- **String** `path`: The object path.
- **Anything** `value`: The value.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `get(path)`
Get a value in a specific path.

#### Params
- **String** `path`:

#### Return
- **Value** The object path value.

### `unset(path)`
Remove a path from a JSON object.

#### Params
- **String** `path`: The object path.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `read(cb)`
Read the JSON file.

#### Params
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **Object** The object parsed as object or an empty object by default.

### `read(The, cb)`
write
Write the JSON file.

#### Params
- **String** `The`: file content.
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `empty(cb)`
Empty the JSON file content.

#### Params
- **Function** `cb`: The callback function.

### `save(cb)`
Save the file back to disk.

#### Params
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `toObject()`

#### Return
- **Object** The data object.

### `editJsonFile(path, options)`
Edit a json file.

#### Params
- **String** `path`: The path to the JSON file.
- **Object** `options`: An object containing the following fields:

#### Return
- **JsonEditor** The `JsonEditor` instance.






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
