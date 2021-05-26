#lang at-exp racket

(provide start-ui)

(require net/rfc6455
         (prefix-in unreal: orb-game-1/lang)
         unreal
         unreal/libs/actors
         unreal/libs/basic-types
         orb-game-1/lang
         orb-game-1/runner/main)

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
                    
                    (define (r)
                      (random -100 100))
                    
                    (define (random-vec)
                      (vec (r) (r) (r)))
                    
                    (define character 
                      (unreal-eval-js (find-actor ".*OrbCharacter.*")))
                    
                    (define character-location 
                      (unreal-eval-js (locate character)))
                    
                    (define loc
                      (+vec (random-vec)
                            character-location))  
                    
                    (define (spawn-other-orb loc)
                      @unreal-value{
                                    var Spawn = Root.ResolveClass('PickupMini');
                                        var spawn = new Spawn(GWorld, @(->unreal-value loc));
                                        spawn.SetText("");
                                        
                                        return spawn;
                                        })
                    
                    (define other (unreal-eval-js (spawn-other-orb loc)))
                    
                    (add-spawn! (hash-ref other 'id) other)
                    
                    (run-spell (hash-ref other 'id)
                               (read (open-input-string msg))
                               '())
                  
                  (ws-send! c msg)
                  
                  (when (not (eof-object? msg))
                    (loop)))
                )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop))
  )

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