#lang at-exp racket

(require unreal
         unreal/tcp/server
         "../base.rkt"
         "../building/base.rkt"
         unreal/libs/physics
         (prefix-in unreal: unreal/libs/actors))

(provide (struct-out spawner) 
         spawn zone magic-cube magic-dodecahedron magic-sphere magic-torus 
         dragon spit-fire 
         spawned-actor-scale-to-dimensions
         projectile shoot)

(define (spawn s [pos (current-location)] [dimensions #f])
  (when (builder? s)
    (set! s (builder-t s)))
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
  (make-basic-builder (spawner "MagicCircleZone" name js-identity)))

(provide zone2)
(define (zone2 #:name name)
  (make-basic-builder (spawner "StemCell" name @unreal-value{
 return (sc)=>{sc.BecomeMagicCircle()}}))
)

(provide spawned-actor-scale)
(define (spawned-actor-scale spawn s)
  (unreal-eval-js
    @unreal-value{
     var spawn = @(->unreal-value spawn);
     var s = @(->unreal-value s);
     var current_scale = spawn.ChildActor.ChildActor.RootComponent.GetWorldScale();
     spawn.ChildActor.ChildActor.RootComponent.SetWorldScale3D({X:current_scale.X*s, Y:current_scale.Y*s, Z:current_scale.Z*s});
     return spawn;
    }
    ))

(define (spawned-actor-scale-to-dimensions spawn dimensions)
  (unreal-eval-js
    @unreal-value{
     var spawn = @(->unreal-value spawn);
     var dimensions = @(->unreal-value dimensions);

     var current_dimensions = GameplayStatics.GetActorArrayBounds([spawn.ChildActor.ChildActor], false); 
     var current_width = 2*current_dimensions.BoxExtent.X
     var current_depth = 2*current_dimensions.BoxExtent.Y
     var current_height = 2*current_dimensions.BoxExtent.Z
     var current_scale = spawn.ChildActor.ChildActor.RootComponent.GetWorldScale();

     var scaleX = dimensions.W / current_width
     var scaleY = dimensions.D / current_depth
     var scaleZ = dimensions.H / current_height

     spawn.ChildActor.ChildActor.RootComponent
          .SetWorldScale3D({X:current_scale.X*scaleX, Y:current_scale.Y*scaleY, Z:current_scale.Z*scaleZ});
     return spawn;
  })
  )

(define (magic-cube #:name [name ""])
  (make-basic-builder (spawner "StemCell" name @unreal-value{
 return (sc)=>{sc.BecomeMagicCube()}
 }))
 )

(define (magic-dodecahedron #:name [name ""])
  (make-basic-builder (spawner "StemCell" name @unreal-value{
 return (sc)=>{sc.BecomeMagicDodecahedron()}
 })))

(define (magic-sphere #:name [name ""])
  (make-basic-builder (spawner "StemCell" name @unreal-value{
 return (sc)=>{sc.BecomeMagicSphere()}
 })))

(define (magic-torus #:name [name ""])
  (make-basic-builder (spawner "StemCell" name @unreal-value{
 return (sc)=>{sc.BecomeMagicTorus()}
 })))

(define (projectile #:name [name ""])
  (spawner "Projectile" name js-identity))

(define (dragon #:name [name ""])
  (make-basic-builder (spawner "Creature" name js-identity)))

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


(provide magic-force)
(define (magic-force spawn #:with-force vect)
  (unreal-eval-js
    @unreal-value{     
 var spawn = @(->unreal-value spawn);
 var scm = spawn.ChildActor.ChildActor.StaticMeshComponent;
 scm.AddImpulse(@(->unreal-value vect));

 return true;
    }))

(provide teleport)
(define (teleport spawn vec)
  (unreal-eval-js
    @unreal-value{     
 var spawn = @(->unreal-value spawn);
 spawn.SetActorLocation(@(->unreal-value vec))

 return true;
}))

(provide location)
(define (location spawn)
  (unreal-eval-js (unreal:location 
    @unreal-value{
      return @(->unreal-value spawn).ChildActor.ChildActor
    })))