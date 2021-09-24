#lang at-exp racket

(require 
         "./base.rkt"
)

(provide floor wall/wide wall/deep room)

(define s (sphere 100))

(define (floor w d)    
    (define ss (map (thunk* s) (range w)))
    (define log (apply beside/wide ss))
    (define logs (map (thunk* log) (range d)))
    (apply beside/deep logs))

(define (wall/wide w h)    
    (define ss (map (thunk* s) (range h)))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range w)))
    (apply beside/wide logs))

(define (wall/deep d h)    
    (define ss (map (thunk* s) (range h)))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range d)))
    (apply beside/deep logs))

(define (room w d h)
  (overlay
   (above (floor w d)
          (sphere (/ h 2) 'air)
          #;(empty (- w (width s))
                   (- d (depth s))
                   (- h (height s)))
          (floor w d))
   (beside/deep (wall/wide w h)
                (sphere (/ w 2) 'air)
                #;(empty (- w (width s))
                         (- d (depth s))
                         (- h (height s)))
                (wall/wide w h))
   (beside/wide (wall/deep d h)
                (sphere (/ d 2) 'air)
                #;(empty (- w (width s))
                         (- d (depth s))
                         (- h (height s)))
                (wall/deep d h))
   ))