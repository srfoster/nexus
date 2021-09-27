#lang at-exp racket

(require 
         "./base.rkt")

(provide floor wall/wide wall/deep room)

;TODO: Parameterize this
(define s (sphere 100))

(define (divisible-by-200? x)
    (= (modulo x 200) 0))

(define/contract (floor w d) 
  (-> divisible-by-200? divisible-by-200? builder?)
    (define ss (map (thunk* s) (range (/ w 200))))
    (define log (apply beside/wide ss))
    (define logs (map (thunk* log) (range (/ d 200))))
    (apply beside/deep logs))

(define/contract (wall/wide w h)    
  (-> divisible-by-200? divisible-by-200? builder?)
    (define ss (map (thunk* s) (range (/ h 200))))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range (/ w 200))))
    (apply beside/wide logs))

(define/contract (wall/deep d h)    
  (-> divisible-by-200? divisible-by-200? builder?)
    (define ss (map (thunk* s) (range (/ h 200))))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range (/ d 200))))
    (apply beside/deep logs))

(define/contract (room w d h)
  (-> divisible-by-200? divisible-by-200? divisible-by-200? builder?)
  (define _ (empty (- w (width s))
            (- d (width s))
            (- h (width s))))
  (overlay
   (above 
     (floor w d)
     _
     (floor w d))
   (beside/deep 
     (wall/wide w h)
     _ 
     (wall/wide w h))
   (beside/wide 
     (wall/deep d h)
     _ 
     (wall/deep d h))))