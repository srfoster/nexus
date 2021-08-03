#lang at-exp racket

(provide start-ui)

(require net/rfc6455
         (prefix-in unreal: orb-game-1/lang)
         unreal
         unreal/libs/actors
         unreal/libs/basic-types
         unreal/external-runtime/main
         
         orb-game-1/lang
         
         json)

(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

(define (build-sphere pos r)
  (unreal-eval-js 
   @unreal-value{
 var C = Root.ResolveClass('JSVoxelManager');
 var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
 return o.BuildSphere(@(->unreal-value pos), @(->unreal-value r))
 }))

(define (check-voxels [pos1 (vec -484 1818 6166)] [pos2 (vec -484 1818 9166)])
  (unreal-eval-js 
   @unreal-value{
 var C = Root.ResolveClass('JSVoxelManager');
 var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
 return o.VoxelsFromPositions(@(->unreal-value pos1), @(->unreal-value pos2))
 }))

(define (close-ui)
  (unreal-eval-js 
   @unreal-value{
 var BrowserLoader = Root.ResolveClass('BrowserLoader');
 var browserLoader = GWorld.GetAllActorsOfClass(BrowserLoader).OutActors[0]
 browserLoader.CloseBrowser()
 }))

(define (should-spawn-orb? s)
  (and 
   (not (string-contains? s "close-ui"))
   (not (string-contains? s "build-sphere"))
   (not (string-contains? s "check-voxels"))
   ))

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
                    
                    (when (not (eof-object? msg))
                        (if (not (should-spawn-orb? msg))
                            (let() 
                              (with-handlers ([exn:fail? (lambda (e) (displayln e))])
                                  (define ret 
                                    (eval (read (open-input-string (~a "(let ()" msg ")"))) ns))
                                  
                                  (ws-send! c (jsexpr->string ret))))
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
                              
                              (define ret
                                (run-spell (hash-ref other 'id)
                                           (read (open-input-string (~a "(let ()" msg ")")))
                                           '()))
                                         
                              (ws-send! c ret)
                                         )
                            
                            ))
                        
                        
                  
                  (when (not (eof-object? msg))
                    (loop)))
                )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop)))
