#lang racket

(provide start-ui)

(require net/rfc6455)

(define (start-ui)
  (ws-serve* #:port 8082 
   (ws-service-mapper
            ["/test" ; the URL path (regular expression)
             [(#f) ; if client did not request any subprotocol
              (lambda (c) 
                (displayln "Connection established")
                (ws-send! c "Welcome")
                (let loop ()
                  (displayln "Waiting for message")
                  
                  (define msg (ws-recv c #:payload-type 'text))
                  (displayln (~a "Got: " msg))
                  (ws-send! c msg)
                  
                  (displayln c)
                  
                  (when (not (eof-object? msg))
                    (loop)))
                )]])))

(module+ main
  (start-ui)
  (sleep 10000))

#|
(require web-server/servlet
         web-server/servlet-env)

(define (start req)
  (response/xexpr
   `(html (head (title "Hello world!"))
          (body (p "Hey out there!")))))

(define (start-ui)
  (serve/servlet start
                 #:port 8082))
|#