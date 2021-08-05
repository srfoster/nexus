#lang at-exp racket

#|
  This file's job is to maintain a web socket server for browsers to connect to.
  It acts as a bridge between the browser and Unreal.

  This server takes racket code (sent across the web socket by the browser)
  and evals it.  In many cases, this will trigger Unreal.js code to be produced and sent to Unreal.  However, any valid Racket code can be sent: e.g. "(hash 'hello \"World\")".

  This web socket server will send back a JSON encoded version whatever Racket value is produced by the evaled code.

|#

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
  (define unreal-response
    (unreal-eval-js 
    @unreal-value{
  var C = Root.ResolveClass('JSVoxelManager');
  var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
  return o.BuildSphere(@(->unreal-value pos), @(->unreal-value r))
  }))
  
  unreal-response)

(define (check-voxels . vecs)
  ;Why string-join?  Why can't ->unreal-value handle a list?
  (define unreal-response
    (unreal-eval-js 
    @unreal-value{
  var C = Root.ResolveClass('JSVoxelManager');
  var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
  return o.VoxelsFromPositions(@(->unreal-value vecs))
  }))
 
  unreal-response)
 

(define (close-ui)
  (unreal-eval-js 
   @unreal-value{
 var BrowserLoader = Root.ResolveClass('BrowserLoader');
 var browserLoader = GWorld.GetAllActorsOfClass(BrowserLoader).OutActors[0]
 browserLoader.CloseBrowser()
 }))

(define (should-spawn-orb? s)
  (string-contains? s "in-orb"))

(define (in-orb code)
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
                  (read (open-input-string (~a "(let ()" code ")")))
                  '()))
                
    ret)

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
                  (let loop ()
                    (displayln "Waiting for message")
                    
                    (define msg (ws-recv c #:payload-type 'text))
                    (displayln (~a "Got: " msg))
                    
                      (when (not (eof-object? msg))
                        (let() 
                          (with-handlers 
                          ([exn:fail? (lambda (e) 
                            (displayln e)
                          )])

                              (define ret 
                                (with-handlers ([exn:fail? (lambda (e)
                                  (hash 'error (~a e)))])

                                  (eval (read (open-input-string (~a "(let ()" msg ")"))) ns))
                                )

                              (ws-send! c (jsexpr->string 
                                (hash 
                                  'responseFor msg 
                                  'response ret))))))
                  
                  (when (not (eof-object? msg))
                    (loop)))
                )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop)))
