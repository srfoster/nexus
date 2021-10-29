#lang at-exp racket

(require unreal
         unreal/tcp/server)

(provide on-projectile-hit
         clear-projectile-hit-functions
         cancel-on-projectile-hit
         on-zone-enter
         cancel-on-zone-enter
         clear-zone-enter-functions
         event-location
         event-name
         event-other-actor
         )

(define (on-projectile-hit f #:group [group #f])
  (subscribe-to-unreal-event "projectile-hit" f #:group group))

(define (cancel-on-projectile-hit f)
  (unsubscribe-from-unreal-event "projectile-hit" f))

(define (clear-projectile-hit-functions #:group [group #f])
  (unsubscribe-all-from-unreal-event "projectile-hit" #:group group))

(define (on-zone-enter f #:group [group #f])
  (subscribe-to-unreal-event "zone-enter" f #:group group))

(define (cancel-on-zone-enter f)
  (unsubscribe-from-unreal-event "zone-enter" f))

(define (clear-zone-enter-functions #:group [group #f])
  (unsubscribe-all-from-unreal-event "zone-enter" #:group group))

(define (event-location e)
  (hash-ref e 'location))

(define (event-name e)
  (hash-ref e 'name))

(define (event-other-actor e)
  (hash-ref e 'otherActor))