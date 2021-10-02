#lang at-exp racket

(require unreal
         unreal/tcp/server)

(provide on-projectile-hit)

(define (on-projectile-hit f)
  (subscribe-to-unreal-event "projectile-hit" f))
