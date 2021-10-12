#lang at-exp racket

(require unreal
         unreal/tcp/server
         "../base.rkt")

(provide spawn zone 
        dragon spit-fire
        projectile shoot)

(define (spawn s [pos (current-location)])
  (unreal-eval-js 
    @unreal-value{
 var toSpawn = Root.ResolveClass(@(->unreal-value (spawner-class-name s)));

 let spawn = new toSpawn(GWorld, @(->unreal-value pos)) 
 if(spawn.SetName) 
   spawn.SetName(@(->unreal-value (spawner-name s)))
 return spawn 
    }))

(struct spawner (class-name name))

(define (dragon #:name [name ""])
  (spawner "Creature" name))

(define (spit-fire dragon [duration 1])
  (unreal-eval-js
   @unreal-value{
 var dragon = @(->unreal-value dragon);
 dragon.ShootFireball(@(->unreal-value duration));

 return true;
 })
  (sleep duration))

(define (zone #:name name)
  (spawner "MagicCircleZone" name))

(define (projectile #:name [name ""])
  (spawner "Projectile" name))

(define (shoot spawn #:with-force vector)
  (unreal-eval-js
   @unreal-value{
 var spawn = @(->unreal-value spawn);
 var scm = spawn.ProjectileSphere;
 scm.AddImpulse(@(->unreal-value vector));

 return true;
 }))


#;(define (move spawn #:to loc)
  ;find the vector we want to apply for along (loc - current-location)
  ;apply a small amount of force along that vector, scaled by distance away
  ;repeat until current-location is close to loc 
  ;then stop all forces 
  )