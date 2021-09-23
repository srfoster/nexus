#lang racket

(require file-watchers)

(define should-restart (make-channel))

(thread (thunk
         (let loop ()
           (define-values (s in err out) (subprocess #f #f #f "racket web-ui.rkt"))
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