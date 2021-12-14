#lang racket

(require "lib/importing/util.rkt")
(require (for-syntax "lib/importing/util.rkt"))
(require (for-syntax racket/format))
(require (for-syntax racket/list
                     racket/string
                     json
                     racket/port
                     ))

(provide import-magic
         import-all-magic)

(define-syntax (import-magic stx)
  (syntax-case stx ()
    [(_ user/spell-name-id identifier-name)
     (let ()
       (define user/spell-name (~a (syntax->datum #'user/spell-name-id)))
       (define path (user/spell-name->path user/spell-name))
       #`(begin
           (when (should-download-file? #,user/spell-name)
             (download-file #,user/spell-name))
           (define identifier-name
             (dynamic-require #,path
                              'identifier-name))
           ))]))

(define-syntax (import-all-magic stx)
  (syntax-case stx ()
    ((_ user/spell-name-id)
     (let ([user/spell-name (~a (syntax->datum #'user/spell-name-id))]) 
       
       (when (should-download-file? user/spell-name)
           (download-file user/spell-name))
       (define-values (variables exported-syntax)
           (module->exports (user/spell-name->path user/spell-name)))
       (define exported-variables (map car (rest (first variables))))
       (define import-magics (map (lambda (i)
                                    (when (string-prefix? (~a i) "struct:")
                                      (set! i (string->symbol (string-replace (~a i) "struct:" ""))))
                                    `(import-magic ,user/spell-name ,i)) 
                                    exported-variables))
       (datum->syntax stx `(begin ,@import-magics))
       ))
    ))