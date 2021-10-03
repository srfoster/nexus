#lang at-exp racket

(require unreal
         unreal/tcp/server)

(provide on-projectile-hit
         cancel-on-projectile-hit)

(define (on-projectile-hit f)
  (subscribe-to-unreal-event "projectile-hit" f))

(define (cancel-on-projectile-hit f)
  (unsubscribe-from-unreal-event "projectile-hit" f))