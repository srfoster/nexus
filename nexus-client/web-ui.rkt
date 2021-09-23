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
         unreal
         unreal/libs/actors
         unreal/libs/basic-types
         unreal/external-runtime/main
         json
         errortrace)


(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

(define/contract (current-location)
  (-> vec?)
  
  (unreal-eval-js 
   (location (character))))

(define (character)
  (get-actor-by-exported-class-name "OrbCharacter"))

(define (valid-javascript-variable-name? var)
  (regexp-match #px"^\\w+$" var))

; Should this be get-actorS-by-class-name? What if there are multiple??
(define (get-actor-by-exported-class-name cn)
  (when (not (valid-javascript-variable-name? cn))
    (raise-user-error "You must pass a valid javascript class name to get-actor-by-class-name."))
  @unreal-value{
 return GWorld.GetAllActorsOfClass(Root.ResolveClass(@(->unreal-value cn))).OutActors[0]
 })

#|
Begin functional API for Voxel Worlds:

(above (sphere 5) (sphere 10))

|#

(struct builder (t p w d h c))

(define (builder-translate b v)
  (struct-copy builder b [p (+vec v (builder-p b))]))

(define (above . bs)
  (combine-all above_ bs))

(define (beside . bs)
  (combine-all beside_ bs))

(define (before . bs)
  (combine-all before_ bs))

(define (combine-all f bs)
  (if (= (length bs) 1)
      (first bs)
      ;(above_ (first bs) (apply above (rest bs)))
      (combine-all f (cons
                      (f (first bs) (second bs))
                      (drop bs 2)))
      ))

(define (above_ b1 b2)
  (define recenter (vec 0
                        0
                        (/ (- 
                            (builder-h b2) 
                            (builder-h b1))
                           2)))
  (builder 'above 
           (vec 0 0 0) 
           (max (builder-w b1) (builder-w b2))
           (max (builder-d b1) (builder-d b2))
           (+ (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec 0 0 (/ (builder-h b1) 2)))) 
                 (builder-translate b2 (+vec recenter (vec 0 0 (/ (builder-h b2) -2)))))))

(define (beside_ b1 b2)
  (define recenter (vec (/ (- 
                            (builder-w b2) 
                            (builder-w b1))
                           2)
                        0 0 ))
  (builder 'beside 
           (vec 0 0 0) 
           (+ (builder-w b1) (builder-w b2))
           (max (builder-d b1) (builder-d b2))
           (max (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec (/ (builder-w b1) 2) 0 0)))
                 (builder-translate b2 (+vec recenter (vec (/ (builder-w b2) -2) 0 0))))))

(define (before_ b1 b2)
  (define recenter (vec 0
                        (/ (- 
                            (builder-d b2) 
                            (builder-d b1))
                           2)
                        0 ))
  (builder 'before 
           (vec 0 0 0) 
           (max (builder-w b1) (builder-w b2))
           (+ (builder-d b1) (builder-d b2))
           (max (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec 0 (/ (builder-d b1) 2) 0)))
                 (builder-translate b2 (+vec recenter (vec 0 (/ (builder-d b2) -2) 0))))))

(define (empty w d h)
  (builder 'empty (vec 0 0 0) w d h #f))

(define (hexagon w d h)
  (builder 'empty (vec 0 0 0) w d h #f))

(define (sphere r)
  (builder 'sphere (vec 0 0 0) (* 2 r) (* 2 r) (* 2 r) #f))

(define (build-builder b [at (current-location)])
  (define at-rel (+vec at (builder-p b)))

  (match (builder-t b)
    ['sphere (build-sphere at-rel (/ (builder-w b) 2))] 
    ['empty  (void)] 
    [else (map (curryr build-builder at-rel) 
               (builder-c b))]))

(define/contract (build-sphere pos r)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.  
  (-> vec? (between/c 0 1000) any/c)
  
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
 var BS = Root.ResolveClass('VoxelAddEffect');

 let sphere = new BS(GWorld, @(->unreal-value pos))  
 
 var sphere_bounds = GameplayStatics.GetActorArrayBounds([sphere], false); 
 var sphere_radius = sphere_bounds.BoxExtent.Z
 var scaling_factor = @(->unreal-value r) / sphere_radius

 sphere.SetActorScale3D({X:scaling_factor, Y:scaling_factor, Z:scaling_factor})

  setTimeout(()=>{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.BuildSphere(@(->unreal-value pos), @(->unreal-value r))
  }, 200)

 setTimeout(()=>{
  sphere.DestroyActor()
  }, 400)

 return true
 }))
  
  unreal-response)

(require syntax/parse)

(define/contract (dig-sphere pos r)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.  
  (-> vec? (between/c 0 2000) hash?)
  
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
 var C = Root.ResolveClass('JSVoxelManager');
 var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
 return o.DigSphere(@(->unreal-value pos), @(->unreal-value r))
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
