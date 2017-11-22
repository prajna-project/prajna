FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . ./
RUN npm install --registry=https://registry.npm.taobao.org -g webpack
RUN npm install --registry=https://registry.npm.taobao.org -g karma
RUN npm install
RUN cd test/browser-test && npm install && cd -
ENTRYPOINT ["./init.sh"]
