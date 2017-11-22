FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . ./
RUN git fetch origin
RUN git merge origin/master
RUN cd test/browser-test && npm install && cd -
ENTRYPOINT ["./init.sh"]
