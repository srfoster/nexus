#lang racket

(require file-watchers)

(displayln "Running main.rkt")

;(system "racket ./web-ui.rkt")

; (define-values (s out in err) (subprocess #f #f #f "/usr/bin/racket" "web-ui.rkt"))
; (printf "stdout:\n~a" (port->string out))
; (printf "stderr:\n~a" (port->string err))
; ; (close-input-port out)
; ; (close-output-port in)
; ; (close-input-port err)
; (subprocess-wait s)

(define should-restart (make-channel))

(thread (thunk
         (let loop ()
           (define-values (s out in err) (subprocess #f #f #f "/usr/bin/racket" "web-ui.rkt"))
           (displayln "Racket bridge running...")
           (channel-get should-restart)
           (subprocess-kill s #f) 
           (loop)
           )))

(define watcher (watch (list (build-path "web-ui.rkt"))
                       (lambda (l)
                         (channel-put should-restart #t))))

(thread-wait watcher)


#|


(require reloadable)
(define websocket-server (reloadable-entry-point->procedure
               (make-reloadable-entry-point 'start-ui "web-ui.rkt")))
(reload!)
(websocket-server)
(let loop ()
    (sleep 10000)
    (loop))
|#