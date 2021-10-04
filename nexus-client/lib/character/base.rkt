#lang at-exp racket

(require unreal
         unreal/tcp/server)

(provide on-projectile-hit
         clear-projectile-functions
         cancel-on-projectile-hit)

(define (on-projectile-hit f #:group [group #f])
  (subscribe-to-unreal-event "projectile-hit" f #:group group))

(define (cancel-on-projectile-hit f)
  (unsubscribe-from-unreal-event "projectile-hit" f))

(define (clear-projectile-functions #:group [group #f])
  (unsubscribe-all-from-unreal-event "projectile-hit" #:group group))