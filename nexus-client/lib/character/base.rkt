#lang at-exp racket

(require unreal)

(provide on-projectile-hit)

(define (on-projectile-hit f)
    (unreal-eval-js 
     @unreal-value{
        setTimeout(()=>{
           this.SendMessage("{\"name\": \"Hello\" }") 
        },2000)
        return true
     }
    )
)
