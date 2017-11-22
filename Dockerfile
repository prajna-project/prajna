FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . ./
RUN git fetch origin
RUN git merge origin/master
RUN npm install -g webpack
RUN npm install -g karma
RUN npm install
RUN cd test/browser-test && npm install && cd -
ENTRYPOINT ["./init.sh"]
