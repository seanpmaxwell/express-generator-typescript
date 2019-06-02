#!/usr/bin/env bash

rm -rf ./project1/
rm -rf ./express-gen-ts

node ../express-generator-typescript project1
node ../express-generator-typescript
