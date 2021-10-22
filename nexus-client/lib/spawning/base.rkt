#lang at-exp racket

(require unreal
         unreal/tcp/server
         "../base.rkt")

(provide spawn zone magic-cube 
        dragon spit-fire
        projectile shoot)

(define (spawn s [pos (current-location)])
  (unreal-eval-js 
    @unreal-value{
 var toSpawn = Root.ResolveClass(@(->unreal-value (spawner-class-name s)));

 let spawn = new toSpawn(GWorld, @(->unreal-value pos)) 
 if(spawn.SetName) 
   spawn.SetName(@(->unreal-value (spawner-name s)));
 let postSpawn = @(->unreal-value (spawner-post-spawn s));
 postSpawn(spawn);
 return spawn;
    }))

(struct spawner (class-name name post-spawn))

(define js-identity
  @unreal-value{
    return (x)=>x
  })

(define (zone #:name name)
  (spawner "MagicCircleZone" name js-identity))

(define (magic-cube #:name [name ""])
  (spawner "StemCell" name @unreal-value{
    return (sc)=>{sc.BecomeMagicCube()}
  }))

(define (projectile #:name [name ""])
  (spawner "Projectile" name js-identity))

(define (dragon #:name [name ""])
  (spawner "Creature" name js-identity))

(define (spit-fire dragon [duration 1])
  (unreal-eval-js
   @unreal-value{
 var dragon = @(->unreal-value dragon);
 dragon.ShootFireball(@(->unreal-value duration));

 return true;
 })
  (sleep duration))

(define (shoot spawn #:with-force vector)
  (unreal-eval-js
   @unreal-value{
 var spawn = @(->unreal-value spawn);
 var scm = spawn.ProjectileSphere;
 scm.AddImpulse(@(->unreal-value vector));

 return true;
 }))
