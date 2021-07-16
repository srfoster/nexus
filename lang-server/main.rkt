#lang racket

(require reloadable)
(define server (reloadable-entry-point->procedure
               (make-reloadable-entry-point 'run-server "server.rkt")))
(reload!)
(server)