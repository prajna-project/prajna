FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . .
COPY .npmrc ./
COPY test/browser-test/.npmrc ./test/browser-test/
RUN npm install --registry=https://registry.npm.taobao.org -g webpack
RUN npm install --registry=https://registry.npm.taobao.org -g karma
RUN npm install  --registry=https://registry.npm.taobao.org
RUN cd test/browser-test && npm install  --registry=https://registry.npm.taobao.org --@dp:registry=http://r.npm.sankuai.com && cd -
ENTRYPOINT ["./init.sh"]
