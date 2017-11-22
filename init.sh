#!/bin/bash

npm install
npm run build

chdir('test/browser-test')

npm install

npm run build-test-context

npm run test