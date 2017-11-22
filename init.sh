#!/bin/bash

# 将主干代码拉下来执行
git fetch origin
git merge origin/master

npm install --registry=https://registry.npm.taobao.org -g webpack
npm install --registry=https://registry.npm.taobao.org -g karma
npm install
npm run build

cd test/browser-test

npm install

npm run build-test-context

npm run test

$@