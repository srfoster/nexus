#lang at-exp racket

(require unreal/libs/basic-types)

(provide (struct-out builder)
         make-basic-builder)

(struct builder (t p w d h c))

(define (make-basic-builder t [w 300] [d w] [h w])
  (builder t (vec 0 0 0) w d h #f))