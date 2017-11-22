FROM node:6.9.0
WORKDIR /opt/jjvein/prajna
COPY . ./

ENTRYPOINT ["./init.sh"]
