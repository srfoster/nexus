#lang racket

(require reloadable)
(define websocket-server (reloadable-entry-point->procedure
               (make-reloadable-entry-point 'start-ui "web-ui.rkt")))
(reload!)
(websocket-server)
(let loop ()
    (sleep 10000)
    (loop))
