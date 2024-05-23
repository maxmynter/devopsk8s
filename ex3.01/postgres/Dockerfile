FROM postgres:16

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y nodejs npm

COPY . /usr/src/app 

RUN npm install

RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
