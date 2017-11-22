#!/bin/bash

npm run build
cd test/browser-test
npm run build-test-context
npm run test

$@