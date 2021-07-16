FROM racket/racket:8.1

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
RUN raco pkg install --deps search-auto web-server reloadable
COPY . .

EXPOSE 8090
CMD [ "racket", "main.rkt" ]