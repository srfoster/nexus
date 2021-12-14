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
         unreal/tcp/server
         (only-in unreal/libs/actors find-actor locate)
         unreal/libs/basic-types
         unreal/external-runtime/main
         json
         errortrace
         rackunit
         "lib/base.rkt"
         "lib/voxels/base.rkt"
         "lib/voxels/rooms.rkt"
         "lib/events/base.rkt"
         "lib/spawning/base.rkt"
         "docs/main.rkt"
         "import-magic.rkt"
         "lib/importing/util.rkt"
         )

; Secret Stuff...
(define HOLE1
  identity)

(define HOLE2
  identity)

(define HOLE3
  identity)

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



; UI Stuff

(define (close-ui)
  (unreal-eval-js 
   @unreal-value{
 var BrowserLoader = Root.ResolveClass('BrowserLoader');
 var browserLoader = GWorld.GetAllActorsOfClass(BrowserLoader).OutActors[0]
 browserLoader.CloseBrowser()
 return null;
 }))

(define (forward-events-to-react type connection)
  (subscribe-to-unreal-event type
                             (lambda (data)
                               (displayln (~a "Sending " type "..."))
                               (ws-send! connection (jsexpr->string
                                                     (hash
                                                      'response (if (void? data)
                                                                    'null
                                                                    data)
                                                      'racketResponse (format-racket-code (~v data))
                                                      'eventType type
                                                      ))))
                             #:group "High Priority"))


(define eval-threads (hash))

;Should probably also remove the keys from the hash
(define (kill-spell-thread id)
  (kill-thread (hash-ref eval-threads id)))

(define (kill-all-spell-threads)
  (map kill-spell-thread (hash-keys eval-threads)))

(struct null-value ())


(define accumulated-strings
  (hash))

(define (get-accumulated-string react-port)
  (get-output-string (hash-ref accumulated-strings react-port)))

(define orig-out (current-output-port))

(define (make-react-port connection event-type program-name)
  (define output-string (open-output-string))

  (define ret
    (make-output-port
     'react-port
     always-evt
     (lambda (s start end non-block? breakable?)
       (define to-send
         (bytes->string/utf-8 (subbytes s start end)))

       (display to-send output-string)

       (when (string-suffix? to-send "\n")
         (ws-send! connection
                   (jsexpr->string
                    (hash
                     'response (get-output-string output-string)
                     'racketResponse (get-output-string output-string)
                     'programName program-name
                     'eventType event-type
                     )))
         (define new-output-string (open-output-string))
         (set! accumulated-strings
               (hash-set accumulated-strings
                         ret new-output-string))
         (set! output-string new-output-string))

       (- end start))

     void))


  (set! accumulated-strings
        (hash-set accumulated-strings
                  ret output-string))

  ret
  )

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
                  ; (one-time-setup c)
                  ; (thread (thunk (sleep 3) (unreal-eval-js (current-location))))
                  (forward-events-to-react "projectile-hit" c)
                  (forward-events-to-react "zone-enter" c)
                  

                  (let loop ()
                    ;(displayln "Waiting for message")

                    (define msg (ws-recv c #:payload-type 'text))
                    (displayln (~a "Got: " msg))
                    
                    (when (not (eof-object? msg))
                      (define code (hash-ref (string->jsexpr msg) 'code))
                      (define event-type (hash-ref (string->jsexpr msg) 'eventType))
                      (define options (hash-ref (string->jsexpr msg) 'options))
                      (displayln (list "OPTIONS: " options))
                      (let()
                        (with-handlers
                              ([exn? (lambda (e)
                                            (void) 
                                            (displayln e)
                                            )])
                          (define ret (null-value)) 
                          (define thread-e (make-react-port c
                                                            "std-err"
                                                            (hash-ref options 'programName "No name")))
                          (define thread-o (make-react-port c
                                                            "std-out"
                                                            (hash-ref options 'programName "No name")))
                          (define eval-thread
                            (thread
                             (thunk
                              (set! ret
                                    (with-handlers ([exn? (lambda (e)

                                                                 (displayln e)
                                                                 (displayln e thread-e)

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
                                      (define in (open-input-string 
                                                  (string-append "(let () " code "\n)")))
                                      (port-count-lines! in)

                                      (define stx (read-syntax 'NexusUserCode in))
                                        (parameterize ([current-error-port thread-e]
                                                       [current-output-port thread-o])
                                          (eval stx ns))
                                      )))))
                            
                            ; wait until there's something in ret, or a certain
                            ; amount of time has passed
                            (for ([i (in-range 50)]) #:break (not (null-value? ret))
                              (sleep .05))
                            (when (null-value? ret)
                              (define thread-id (random))
                              (set! eval-threads (hash-set eval-threads thread-id eval-thread))
                              (set! ret (hash 'threadId thread-id 
                                              'message (~a "Call (stop-magic " thread-id ") to stop this spell.")
                                              'customReactComponent "SpellThreadManager"))
                              (displayln "Starting thread to send std-out...")

                                        


                                        )
                            (displayln ret)

                            (ws-send! c (jsexpr->string 
                                         (hash 
                                          'responseFor msg 
                                          'response (if (void? ret)
                                                        'null
                                                        (if (jsexpr? ret) ret (~v ret)))
                                          'racketResponse (format-racket-code (~v ret))
                                          'output (get-accumulated-string thread-o)
                                          'error  (get-accumulated-string thread-e)
                                          'eventType event-type
                                                        ))))))
                    
                    #;(when (not (eof-object? msg))
                      (loop))
                      (when (eof-object? msg)
                        (displayln "Waiting for websocket connection....")
                        (sleep 1))
                      (loop))
                  )]])))

(module+ main
  (start-ui)
  
  (let loop ()
    (sleep 10000)
    (loop)))
