#!/bin/bash


npm install -g webpack
npm install
npm run build

cd test/browser-test

npm install

npm run build-test-context

npm run test

$@