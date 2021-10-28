#lang at-exp racket

(require unreal
         unreal/tcp/server
         "../base.rkt"
         "../building/base.rkt"
         unreal/libs/physics
         unreal/libs/basic-types
         (prefix-in unreal: unreal/libs/actors))

(provide (struct-out spawner)
         spawn 
         ;stuff you can spawn
         zone cube dodecahedron sphere torus magic-circle
         energy-ball 
         dragon 
         ;getters and setters on spawned things
         parent
         spawned-actor-scale-to-dimensions
         spawned-actor-scale
         projectile shoot
         force
         teleport
         spit-fire
         location)

(define (spawn s [pos (current-location)] [dimensions #f])
  (when (builder? s)
    (set! s (builder-data s)))
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

(define (build-spawner b at)
  (let ()
    (define s (spawn (builder-data b) at))
    (spawned-actor-scale-to-dimensions s (hash 'W (builder-w b) 'D (builder-d b) 'H (builder-h b)))
    (displayln (hash 'W (builder-w b) 'D (builder-d b) 'H (builder-h b)))
    s))

;Do we need ALL these .ChildActors?
;Why does the scale change after parenting?
(define (parent a b)
  (unreal-eval-js
   @unreal-value{
     var a = @(->unreal-value a);
     var b = @(->unreal-value b);
     b.ChildActor.ChildActor.AttachActorToActor(a.ChildActor.ChildActor);
     b.ChildActor.ChildActor.SetActorRelativeLocation({X:0, Y:0, Z:0});
 }))

(define (zone [appearance (magic-circle)] #:name [name "zone"])
  (overlay appearance
           (make-basic-builder (spawner "StemCell"
                                        name
                                        @unreal-value{return (sc)=>{sc.BecomeZone()}})
                               build-spawner)))

(define (magic-circle)
  (make-basic-builder (spawner "StemCell"
                               "magic-circle"
                               @unreal-value{return (sc)=>{sc.BecomeMagicCircle()}})
                      build-spawner
                      #:dimensions (vec 300 300 150)))

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
     var current_dimensions; 
     if(spawn.ChildActor.ChildActor.GetBounds){
       current_dimensions = spawn.ChildActor.ChildActor.GetBounds();
     }
     else{
       current_dimensions = GameplayStatics.GetActorArrayBounds([spawn.ChildActor.ChildActor], false);
     }
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

(define (energy-ball #:name [name ""])
  (make-basic-builder (spawner "StemCell"
                               name
                               @unreal-value{ return (sc)=>{sc.BecomeWaterParticle()}})
                      build-spawner
                     ))

(define (cube #:name [name ""])
  (make-basic-builder (spawner "StemCell"
                               name
                               @unreal-value{ return (sc)=>{sc.BecomeMagicCube()}})
                      build-spawner))

(define (dodecahedron #:name [name ""])
  (make-basic-builder (spawner "StemCell"
                               name
                               @unreal-value{return (sc)=>{sc.BecomeMagicDodecahedron()}})
                      build-spawner))

(define (sphere #:name [name ""])
  (make-basic-builder (spawner "StemCell"
                               name
                               @unreal-value{return (sc)=>{sc.BecomeMagicSphere()}})
                      build-spawner))

(define (torus #:name [name ""])
  (make-basic-builder (spawner "StemCell"
                               name
                               @unreal-value{return (sc)=>{sc.BecomeMagicTorus()}})
                      build-spawner
                      #:dimensions (vec 300 300 150)))

(define (projectile #:name [name ""])
  (spawner "Projectile" name js-identity))

(define (dragon #:name [name ""])
  (make-basic-builder (spawner "Creature" name js-identity)
                      build-spawner))

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


(define (force spawn vect)
  (unreal-eval-js
    @unreal-value{     
 var spawn = @(->unreal-value spawn);
 var scm = spawn.ChildActor.ChildActor.StaticMeshComponent;
 scm.AddImpulse(@(->unreal-value vect));

 return true;
    }))

(define (teleport spawn vec)
  (unreal-eval-js
    @unreal-value{     
 var spawn = @(->unreal-value spawn);
 spawn.SetActorLocation(@(->unreal-value vec))

 return true;
}))

(define (location spawn)
  (unreal-eval-js (unreal:location 
    @unreal-value{
      return @(->unreal-value spawn).ChildActor.ChildActor
    })))