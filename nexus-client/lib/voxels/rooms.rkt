#lang at-exp racket

(require 
         "./base.rkt")

(provide floor wall/wide wall/deep room)

;TODO: Parameterize this
(define s (sphere 100))

(define (divisible-by-brick-size? x)
    (= (modulo x (width s)) 0))

(define/contract (floor w d) 
  (-> divisible-by-brick-size? divisible-by-brick-size? builder?)
    (define ss (map (thunk* s) (range (/ w (width s)))))
    (define log (apply beside/wide ss))
    (define logs (map (thunk* log) (range (/ d (depth s)))))
    (apply beside/deep logs))

(define/contract (wall/wide w h)    
  (-> divisible-by-brick-size? divisible-by-brick-size? builder?)
    (define ss (map (thunk* s) (range (/ h (height s)))))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range (/ w (width s)))))
    (apply beside/wide logs))

(define/contract (wall/deep d h)    
  (-> divisible-by-brick-size? divisible-by-brick-size? builder?)
    (define ss (map (thunk* s) (range (/ h (height s)))))
    (define log (apply above ss))
    (define logs (map (thunk* log) (range (/ d (depth s)))))
    (apply beside/deep logs))

(define/contract (room w d h)
  (-> divisible-by-brick-size? divisible-by-brick-size? divisible-by-brick-size? builder?)
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