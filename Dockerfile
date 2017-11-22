FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . .
COPY .npmrc ./
COPY test/browser-test/.npmrc ./test/browser-test/
RUN npm install -g webpack
RUN npm install -g karma
RUN npm install
RUN cd test/browser-test && npm install && cd -
ENTRYPOINT ["./init.sh"]
