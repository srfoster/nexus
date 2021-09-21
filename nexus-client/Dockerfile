FROM racket/racket:8.1

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
RUN raco pkg install --deps search-auto

EXPOSE 8082
EXPOSE 8888
CMD [ "racket", "web-ui.rkt" ]