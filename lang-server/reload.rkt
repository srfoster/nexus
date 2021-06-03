#lang racket

(require reloadable)
(define main (reloadable-entry-point->procedure
              (make-reloadable-entry-point 'run-server "main.rkt")))
(reload!)
(main)