#lang at-exp racket

(require unreal
         unreal/tcp/server
         "../base.rkt")

(provide spawn zone)

(define (spawn s [pos (current-location)])
  (unreal-eval-js 
    @unreal-value{
 var toSpawn = Root.ResolveClass(@(->unreal-value (spawner-class-name s)));

 let spawn = new toSpawn(GWorld, @(->unreal-value pos)) 
 spawn.SetName(@(->unreal-value (spawner-name s)))
 return spawn 
    }))

(struct spawner (class-name name))

(define (zone #:name name)
  (spawner "MagicCircleZone" name))