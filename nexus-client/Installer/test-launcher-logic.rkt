#lang racket 

(require net/http-easy)

(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

(eval (read (open-input-string  (file->string "./what-to-do-next.rkt"))) ns)