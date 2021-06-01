#lang racket

(provide doc! documented-function)

(require web-server/http/json
        web-server/servlet
        web-server/servlet-env)

(define documented-functions (make-parameter '()))

(define (documented-function name params return-type content)
  (hash 'name name 'parameters params 'returnType return-type 'content content))


(define (doc! df)
  (documented-functions 
   (append (documented-functions)
           (list df))))


(define (my-app req)
  (response/jsexpr
   #:headers (list (header #"Access-Control-Allow-Origin" #"*")
                   (header #"Access-Control-Allow-Headers" #"X-PINGOTHER, Content-Type"))
   (documented-functions)))


(module+ main

  (doc!
   (documented-function "force"
                        (list 
                         (hash 'name "x" 'type "number?")
                         (hash 'name "y" 'type "number?")
                         (hash 'name "z" 'type "number?"))
                        "void?"
                        "Force is a function that applies a force to an orb in a direction given by a vector with `x`, `y`, and `z` components."))

  (doc!
   (documented-function "anchor"
                        (list 
                         (hash  'name "name-or-ref" 
                                'type "(or/c string? actor?)"))
                        "void?"
                        "Anchor is a function that allows an orb to anchor to an orb of a given name or referenced directly."))

  (doc!
   (documented-function "deanchor"
                        (list )
                        "void?"
                        "Removes all anchors currently attached to the orb."))

  (serve/servlet my-app
                 #:port 8090
                 #:listen-ip #f
                 #:launch-browser? #f
                 #:servlet-path "/api"))