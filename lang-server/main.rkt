#lang racket

(provide doc! 
        documented-function
        run-server)

(require web-server/http
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


(define (run-server)

  (doc!
   (documented-function "force"
                        (list 
                         (hash 'name "x" 'type "number?")
                         (hash 'name "y" 'type "number?")
                         (hash 'name "z" 'type "number?"))
                        "void?"
                        "Force is a function that applies a force to an orb in a direction given by a vector with `x`, `y`, and `z` components. 
                        
                        Code Examples: 
                        * `(force 500 200 800)`
                        * ```(force (random -100 100)
                                    (random -100 100)
                                    (random -100 100))```"))

  (doc!
   (documented-function "anchor"
                        (list 
                         (hash  'name "name-or-ref" 
                                'type "(or/c string? actor?)"))
                        "void?"
                        "Anchor is a function that allows an orb to anchor to an orb of a given name or referenced directly. 
                        
                        Code Examples: 
                        * `(anchor \"laurond\")`
                        * `(anchor (with-name \"trithir\"))`
                        "))
  
  (doc!
   (documented-function "color"
                        (list 
                         (hash  'name "name-or-hex" 
                                'type "string?"))
                        "void?"
                        "Color is a function that allows an orb to change colors. Colors can be specified by hex code (e.g. #FF1155) or by referencing one of a small selection of named colors (green, blue, red, and orange.) 
                        
                        Code Examples: 
                        * `(color \"green\")`
                        * `(color \"#FF5577\")`
                        "))

  (doc!
   (documented-function "de-anchor"
                        (list )
                        "void?"
                        "De-anchor removes all anchors currently attached to your orb.
                        
                        Code Example:
                        * `(de-anchor)`"))

  (serve/servlet my-app
                 #:port 8090
                 #:listen-ip #f
                 #:launch-browser? #f
                 #:servlet-path "/api"))