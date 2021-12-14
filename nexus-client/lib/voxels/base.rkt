#lang at-exp racket

(require unreal
         unreal/libs/basic-types
         "../base.rkt"
         "../spawning/base.rkt"
         "../building/base.rkt"
)

;NOTE: This is re-providing a lot of building/base.rkt stuff.  Should it be?
(provide empty voxel-sphere voxel-box  (struct-out builder) (struct-out build-result-tree)
        (rename-out [build summon])
        summoner?
        summon-at
        width depth height 
        scale rotate above beside/wide beside/deep overlay translate build
        find-first-by-tag find-all-by-tag tag)

;Terrain stuff provides here (maybe move to its own module)
(provide terrain-switch-to-hills
         terrain-switch-to-globs
         terrain-switch-to-caves
         terrain-switch-to-mountain
         terrain-switch-to-cliffs
         remove-foliage
         )

#|
Begin functional API for Voxel Worlds:

(above (sphere 5) (sphere 10))

|#

(define (scale s b-or-a)
  (if (builder? b-or-a)
      (builder-scale s b-or-a)
      (spawned-actor-scale b-or-a s)))


;Constructors

(define (empty w [d w] [h w])
  (make-basic-builder 'empty
                        (lambda (b at)
                          (void))
                        #:dimensions (vec w d h)))

; @doc[(sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel]) builder?)]{
;   Returns a sphere builder. 
;   
;   ##Examples
;   
;   `(sphere 1000)`
;
;   `(sphere 500 'air)`
;}
(define (voxel-sphere r [material 'voxel])
  (when (not ((between/c 0 1000) r))
    (raise-user-error "Sphere's radius must be between 0 and 1000."))
  
  (if (not (eq? material 'voxel)) 
    (make-basic-builder 'air-sphere
                        (lambda (b at)
                          (dig-sphere at (/ (builder-w b) 2)))
                        #:dimensions (vec (* 2 r) (* 2 r) (* 2 r)))
    (make-basic-builder 'sphere
                        (lambda (b at)
                          (build-sphere at (/ (builder-w b) 2)))
                        #:dimensions (vec (* 2 r) (* 2 r) (* 2 r)))))

(define (voxel-box w d h [material 'voxel])
  (when (not ((between/c 0 2000) w))
    (raise-user-error "Box's width must be between 0 and 2000."))
  (when (not ((between/c 0 2000) d))
    (raise-user-error "Box's depth must be between 0 and 2000."))
  (when (not ((between/c 0 2000) h))
    (raise-user-error "Box's height must be between 0 and 2000."))
  
  (if (not (eq? material 'voxel))
      (make-basic-builder 'air-box
                          (lambda (b at)
                            (dig-box at (builder-w b) (builder-d b) (builder-h b)))
                          #:dimensions (vec w d h)
                          )
      (make-basic-builder 'box
                          (lambda (b at)
                            (build-box at (builder-w b) (builder-d b) (builder-h b)))
                          #:dimensions (vec w d h))))



;Side-effectful functions we are building our effect-free API atop of

(define/contract (build-box pos w d h)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.  
  (-> vec? (between/c 0 2000) (between/c 0 2000) (between/c 0 2000) any/c)
  
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
 var BS = Root.ResolveClass('VoxelAddEffect');

 setTimeout(()=>{
  var C = Root.ResolveClass('JSVoxelManager');
  var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
  o.BuildBox(@(->unreal-value
               (hash 'Min
                     ;(+vec pos (vec -100 -100 0))
                     (+vec pos (*vec -1/2 (vec w d h)))
                     'Max
                     ;(+vec pos (vec 100 100 200))
                     (+vec pos (*vec 1/2 (vec w d h)))
                     )))
  }, 200)
 

 return true
 }))
  
  unreal-response)

(define/contract (dig-box pos w d h)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.  
  (-> vec? (between/c 0 2000) (between/c 0 2000) (between/c 0 2000) any/c)
  
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
 var BS = Root.ResolveClass('VoxelAddEffect');

 setTimeout(()=>{
  var C = Root.ResolveClass('JSVoxelManager');
  var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
  o.DigBox(@(->unreal-value
               (hash 'Min
                     ;(+vec pos (vec -100 -100 0))
                     (+vec pos (*vec -1/2 (vec w d h)))
                     'Max
                     ;(+vec pos (vec 100 100 200))
                     (+vec pos (*vec 1/2 (vec w d h)))
                     )))
  }, 200)
 

 return true
 }))
  
  unreal-response)


(define/contract (build-sphere pos r)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.  
  (-> vec? (between/c 0 1000) any/c)
  
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
 var BS = Root.ResolveClass('VoxelAddEffect');

 let sphere = new BS(GWorld, @(->unreal-value pos))  
 
 var sphere_bounds = GameplayStatics.GetActorArrayBounds([sphere], false); 
 var sphere_radius = sphere_bounds.BoxExtent.Z
 var scaling_factor = @(->unreal-value r) / sphere_radius

 sphere.SetActorScale3D({X:scaling_factor, Y:scaling_factor, Z:scaling_factor})

  setTimeout(()=>{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.BuildSphere(@(->unreal-value pos), @(->unreal-value r))
  }, 200)

 setTimeout(()=>{
  sphere.DestroyActor()
  }, 400)

 return true
 }))
  
  unreal-response)

(require syntax/parse)

(define/contract (dig-sphere pos r)
  ;If the radius is too big, you end up crashing the game.
  ;  1000 can probably be bumped up if we wanted to.
  (-> vec? (between/c 0 2000) any/c)

  (define unreal-response
    (unreal-eval-js
     @unreal-value{
 var BS = Root.ResolveClass('VoxelAddEffect');

 let sphere = new BS(GWorld, @(->unreal-value pos))
 let magicCircleEffect = sphere.ChildActor.ChildActor
 let customMesh = magicCircleEffect.CreatedCustomMesh[0]
 let mat = customMesh.GetMaterials()[0]
 mat.SetVectorParameterValue("MESH_Color", {R:1,G:0,B:0})

 var sphere_bounds = GameplayStatics.GetActorArrayBounds([sphere], false);
 var sphere_radius = sphere_bounds.BoxExtent.Z
 var scaling_factor = @(->unreal-value r) / sphere_radius

 sphere.SetActorScale3D({X:scaling_factor, Y:scaling_factor, Z:scaling_factor})

 setTimeout(()=>{
  var C = Root.ResolveClass('JSVoxelManager');
  var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
  o.DigSphere(@(->unreal-value pos), @(->unreal-value r))
  }, 200)

 setTimeout(()=>{
  sphere.DestroyActor()
  }, 400)

 return true
 }))

  unreal-response)

(define (terrain-switch-to-hills [height 10] [floor 0] [seed 1337])
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.SwitchTerrainToFlat(@(->unreal-value height), 
                          @(->unreal-value floor), 
                          @(->unreal-value seed))

 return true
 }))
  
  unreal-response)

(define (terrain-switch-to-globs [floor 0])
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.SwitchTerrainToGlobs(@(->unreal-value floor))

 return true
 }))
  
  unreal-response)

(define (terrain-switch-to-caves)
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.SwitchTerrainToCaves()

 return true
 }))
  
  unreal-response)


(define (terrain-switch-to-mountain)
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.SwitchTerrainToMountain()

 return true
 }))
  
  unreal-response)

(define (terrain-switch-to-cliffs)
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0]
    o.SwitchTerrainToCliffs()

 return true
 }))
  
  unreal-response)

(define (remove-foliage)
  (define unreal-response
    (unreal-eval-js 
     @unreal-value{
    var C = Root.ResolveClass('JSVoxelManager');
    var o = GWorld.GetAllActorsOfClass(C).OutActors[0];
    o.RemoveFoliage();

 return true
 }))
  
  unreal-response)