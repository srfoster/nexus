#lang at-exp racket

(require unreal
         (prefix-in unreal: unreal/libs/actors)
         unreal/libs/basic-types
)

(provide current-location)

(define/contract (current-location)
  (-> vec?)
  
  (unreal-eval-js 
   (unreal:location (character))))

(define (character)
  (get-actor-by-exported-class-name "OrbCharacter"))

(define (valid-javascript-variable-name? var)
  (regexp-match #px"^\\w+$" var))

; Should this be get-actorS-by-class-name? What if there are multiple??
(define (get-actor-by-exported-class-name cn)
  (when (not (valid-javascript-variable-name? cn))
    (raise-user-error "You must pass a valid javascript class name to get-actor-by-class-name."))
  @unreal-value{
 return GWorld.GetAllActorsOfClass(Root.ResolveClass(@(->unreal-value cn))).OutActors[0]
 })
