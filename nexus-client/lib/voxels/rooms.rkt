#lang at-exp racket

(require 
         "./base.rkt"
)

(provide floor wall/wide wall/deep room)

(define s (sphere 200))

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
   (above 
     (floor w d)
     (empty (* (width s) (- w 1))
            (* (depth s) (- d 1))
            (* (height s) (- h 1)))
     (floor w d))
   (beside/deep 
     (wall/wide w h)
     (empty (* (width s) (- w 1))
            (* (depth s) (- d 1))
            (* (height s) (- h 1)))
     (wall/wide w h))
   (beside/wide 
     (wall/deep d h)
     (empty (* (width s) (- w 1))
            (* (depth s) (- d 1))
            (* (height s) (- h 1)))
     (wall/deep d h))))