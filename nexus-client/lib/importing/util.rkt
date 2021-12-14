#lang racket

(require racket/runtime-path
         net/http-easy
         racket/rerequire
)

(provide should-download-file?
         download-file
         user/spell-name->path)

(define-runtime-path required-spells-folder "required-spells")

(define files->requested-at-times
  (hash))
  
(define (more-than-1-seconds-ago? time)
  (define milli-diff (- (current-milliseconds) time))
  (> (/ milli-diff 1000) 1))

(define (should-download-file? user/spell-name)
    (define username (first (string-split user/spell-name "/")))
    (define spell-name (second (string-split user/spell-name "/")))
  ; If it's been more than 1 second since we
  ; last called this function OR if we have never
  ; downloaded the file before, return #t
  (define request-at-time? 
    (hash-ref files->requested-at-times user/spell-name #f))
  
  (define ret
    (or (not request-at-time?)
        (more-than-1-seconds-ago? request-at-time?)))
  
  ; Always update the download time in files->requested-at-times
  (set! files->requested-at-times 
        (hash-set files->requested-at-times
                  user/spell-name (current-milliseconds)))
  ret
)

(define (download-file user/spell-name)
    (define username (first (string-split user/spell-name "/")))
    (define spell-name (second (string-split user/spell-name "/")))
    (define program-string (hash-ref
                            (response-json
                             (get (~a "https://nexus-api.codespells.org/spells/"
                                      user/spell-name)))
                            'text))
    (with-output-to-file (build-path required-spells-folder (~a username "-" spell-name))
      (lambda () (displayln program-string))
      	#:exists 'replace)
    (with-output-to-string (lambda ()
                             (dynamic-rerequire (build-path required-spells-folder (~a username "-" spell-name))
                                                #:verbosity 'none)))
)

(define (user/spell-name->path user/spell-name)
  (define username (first (string-split user/spell-name "/")))
  (define spell-name (second (string-split user/spell-name "/")))
  (build-path required-spells-folder (~a username "-" spell-name))
)
