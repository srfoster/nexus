#lang at-exp racket

(provide start-ui)

(require net/rfc6455
         (prefix-in unreal: orb-game-1/lang)
         unreal
         unreal/libs/actors
         unreal/libs/basic-types
         unreal/external-runtime/main
         
         orb-game-1/lang)

(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

(define (close-ui)
  (unreal-eval-js 
   @unreal-value{
 var BrowserLoader = Root.ResolveClass('BrowserLoader');
 var browserLoader = GWorld.GetAllActorsOfClass(BrowserLoader).OutActors[0]
 browserLoader.CloseBrowser()
 }))

(define (should-spawn-orb? s)
  (not (string-contains? s "close-ui")))

;Change start-ui name to start-websocket-server
(define (start-ui)
  (spell-language-module 'orb-game-1/run-lang-external)
  (preload-spell-sandbox)
  (ws-serve* #:port 8082 
             (ws-service-mapper
              ["/test" 
               [(#f) ; if client did not request any subprotocol
                (lambda (c) 
                  (displayln "Connection established")
                  (ws-send! c "Welcome")
                  (let loop ()
                    (displayln "Waiting for message")
                    
                    (define msg (ws-recv c #:payload-type 'text))
                    (displayln (~a "Got: " msg))
                    
                    (if (not (should-spawn-orb? msg))
                        (let()
                          (eval (read (open-input-string (~a "(let ()" msg ")")))     ns))
                        (let () 
                          
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
                                     (read (open-input-string (~a "(let ()" msg ")")))
                                     '()))
                          
                          )
                        
                        
                        (ws-send! c msg)
                  
                  (when (not (eof-object? msg))
                    (loop)))
                )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop)))
