#lang racket

(provide documented-function
         run-server)

(require web-server/http
        web-server/servlet
        web-server/servlet-env)


(define (documented-function name params return-type content)
  (hash 'name name 'parameters params 'returnType return-type 'content content))

(define (documented-functions) (list
                              (documented-function "force"
                                                  (list 
                                                   (hash 'name "x" 'type "number?")
                                                   (hash 'name "y" 'type "number?")
                                                   (hash 'name "z" 'type "number?"))
                                                  "void?"
                                                  "Force is a function that applies a force to an orb in a direction given by a vector with `x`, `y`, and `z` components. 
                        
### Code Examples: 
<ul><li>`(force 500 200 800)`</li>
<li>```(force (random -100 100)
(random -100 100)
(random -100 100))```</li></ul>")
                              
                              (documented-function "anchor"
                                                  (list 
                                                   (hash  'name "name-or-ref" 
                                                        'type "(or/c string? actor?)"))
                                                  "void?"
                                                  "Anchor is a function that allows an orb to anchor to an orb of a given name or referenced directly. 
                        
### Code Examples: 
<ul><li>`(anchor \"laurond\")`</li>
<li>`(anchor (with-name \"trithir\"))`</li></ul>
")
                              
                              (documented-function "color"
                                                  (list 
                                                   (hash  'name "name-or-hex" 
                                                        'type "string?"))
                                                  "void?"
                                                  "Color is a function that allows an orb to change colors. Colors can be specified by hex code (e.g. #FF1155) or by referencing one of a small selection of named colors (green, blue, red, and orange.) 
                        
### Code Examples: 
<ul><li>`(color \"green\")`</li>
<li>`(color \"#FF5577\")`</li>
</ul>")
                              
                              (documented-function "de-anchor"
                                                  (list )
                                                  "void?"
                                                  "De-anchor removes all anchors currently attached to your orb.
                        
### Code Example:
<ul><li>`(de-anchor)`</li></ul>")
                              ))


(define (my-app req)
  (response/jsexpr
   #:headers (list (header #"Access-Control-Allow-Origin" #"*")
                   (header #"Access-Control-Allow-Headers" #"X-PINGOTHER, Content-Type"))
   (documented-functions)))

(define (run-server)


  (serve/servlet my-app
                 #:port 8090
                 #:listen-ip #f
                 #:launch-browser? #f
                 #:servlet-path "/api"))


(module+ main
        (run-server))