#!/bin/bash

# 将主干代码拉下来执行
git fetch origin
git merge -m "合并master" origin/master

npm install --registry=https://registry.npm.taobao.org --@dp:registry=http://r.npm.sankuai.com
npm run build

cd test/browser-test
npm install --registry=https://registry.npm.taobao.org --@dp:registry=http://r.npm.sankuai.com
npm run build-test-context
npm run test

$@
