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
         fmt
         unreal
         (only-in unreal/libs/actors find-actor locate)
         unreal/libs/basic-types
         unreal/external-runtime/main
         json
         errortrace
         "lib/voxels/base.rkt"
         "lib/voxels/rooms.rkt"
         )

(define (get-docs)
  (list
   (hash
    'name "sphere"
    'use (format-racket-code "(sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel] builder?)")
    'parameter (list "radius" "material")
    'type (list "(between/c 0 1000)" "(or/c 'voxel 'air)")
    'optional (list #f #t)
    'parameterDesc (list "Radius of the sphere. Must be between 0 and 1000." "Material of the sphere. Available materials are 'air and 'sphere")
    'desc "Returns a sphere builder, which when passed into `build` instantiates a voxel sphere into the world."
    'example (list "(build (sphere 1000))" "(build (sphere 500 'air))" )
    'returns "builder?"
   )
   (hash
    'name "sphere"
    'use (format-racket-code "(sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel] builder?)")
    'parameter (list "radius" "material")
    'type (list "(between/c 0 1000)" "(or/c 'voxel 'air)")
    'optional (list #f #t)
    'parameterDesc (list "Radius of the sphere. Must be between 0 and 1000." "Material of the sphere. Available materials are 'air and 'sphere")
    'desc "Returns a sphere builder, which when passed into `build` instantiates a voxel sphere into the world."
    'example (list "(build (sphere 1000))" "(build (sphere 500 'air))" )
    'returns "builder?"
   )
   ))

(define (format-racket-code code)
  (program-format code
                  standard-formatter-map
                  #:width 40))

(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

;For puzzle checking
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

(define (apply-transformer f stx)
  (define parts (and (syntax? stx) (syntax->list stx)))
  
  (if (not (list? parts)) (f stx)
      (map (curry apply-transformer f)
           parts)))

;OMG.  This is ugly and doesn't even catch a lot of errors (e.g. syntax errors).
;  We should ask on the Racket list/discord?
;  But if we must fall back to this, we'll need to do this to (at least) our API: build-sphere, dig-sphere, etc.  
(define (handle-errors-intelligently lineNumber f)
  (lambda (a . args)
    (with-continuation-mark 'lineNumber lineNumber
      (apply f a args))))

;Change start-ui name to start-websocket-server
(define (start-ui)
  ;(displayln "spell-language-module...")
  ;(spell-language-module 'orb-game-1/run-lang-external)
  ;(displayln "preload-spell-sandbox")
  ;(preload-spell-sandbox)
  ;(displayln "ws-serve")
  (ws-serve* #:port 8082 
             (ws-service-mapper
              ["/test" 
               [(#f) ; if client did not request any subprotocol
                (lambda (c) 
                  ;(displayln "Connection established")
                  (let loop ()
                    ;(displayln "Waiting for message")
                    
                    (define msg (ws-recv c #:payload-type 'text))
                    ;(displayln (~a "Got: " msg))
                    
                      (when (not (eof-object? msg))
                        (let() 
                          (with-handlers 
                              ([exn:fail? (lambda (e)
                                            (void) 
                                            ;(displayln e)
                                            )])
                            
                            (define ret 
                              (with-handlers ([exn:fail? (lambda (e)
                                                           
                                                           ;(displayln e)
                                                           
                                                           (define blockId
                                                             (continuation-mark-set-first   
                                                              (exn-continuation-marks e) 
                                                              'blockId
                                                              #f))
                                                           (define error-message 
                                                             (string-append (exn-message e)
                                                                            (with-output-to-string (thunk (print-error-trace (current-output-port) e)))))
                                                           (define lineNumber (string->number 
                                                                               (second 
                                                                                (regexp-match  
                                                                                                       #px"NexusUserCode:([0-9]+)"
                                                                                                       error-message 
                                                                                                       )))) 
                                                           (hash 'error  
                                                                 error-message
                                                                 'blockId blockId
                                                                 'lineNumber lineNumber))])
                                
                                (define in (open-input-string (string-append "(let () " msg ")")))
                                (port-count-lines! in)
                                
                                (define stx (read-syntax 'NexusUserCode in))
                                
                                (eval stx ns)
                                ))
                            
                            (ws-send! c (jsexpr->string 
                                         (hash 
                                          'responseFor msg 
                                          'response (if (void? ret )
                                                        'null
                                                        ret)))))))
                    
                    (when (not (eof-object? msg))
                      (loop)))
                  )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop)))
