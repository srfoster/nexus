#lang at-exp racket

(require unreal
         unreal/libs/basic-types
         "../base.rkt"
         "../spawning/base.rkt"
         "../building/base.rkt"
)

(provide empty sphere box  (struct-out builder) (struct-out build-result-tree) 
        width depth height 
        scale rotate above beside/wide beside/deep overlay translate build
        find-first-by-tag find-all-by-tag tag)

(struct build-result-tree (result builder children))

(define (has-tag? brt t)
  (member t (builder-tags (build-result-tree-builder brt))))

(define (find-all-by-tag brt t)
  (flatten
   (if (has-tag? brt t)
       (cons (build-result-tree-result brt)
             (map (curryr find-all-by-tag t)
                  (build-result-tree-children brt)))
       (map (curryr find-all-by-tag t)
            (build-result-tree-children brt)))))

(define (find-first-by-tag brt t)
  (first (find-all-by-tag brt t)))

(define (build b [at (current-location)])
  (_build b at))

;Renderer
(define (_build b [at (current-location)])
  (define at-rel (+vec at (builder-p b)))

  (match (builder-t b)
    [(spawner class-name name post-spawn)
     (build-result-tree (let () 
                          (define s (spawn (spawner class-name name post-spawn) at-rel))
                          (spawned-actor-scale-to-dimensions s (hash 'W (builder-w b) 'D (builder-d b) 'H (builder-h b)))
                          s)
                        b
                        '())]
    ['sphere (build-result-tree (build-sphere at-rel (/ (builder-w b) 2))
                                b
                                '())]
    ['box (build-result-tree (build-box at-rel (builder-w b) (builder-d b) (builder-h b))
                             b
                             '())]
    ['air-sphere (build-result-tree (dig-sphere at-rel (/ (builder-w b) 2))
                                    b
                                    '())]
    ['empty (build-result-tree (void)
                                 b
                                 '())]
    [else (build-result-tree (void)
                             b
                             (map (curryr _build at-rel)
                                  (builder-c b))
                             )]))

#|
Begin functional API for Voxel Worlds:

(above (sphere 5) (sphere 10))

|#



;Constructors

(define (empty w [d w] [h w])
  (builder 'empty (vec 0 0 0) w d h #f '()))

; @doc[(sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel]) builder?)]{
;   Returns a sphere builder. 
;   
;   ##Examples
;   
;   `(sphere 1000)`
;
;   `(sphere 500 'air)`
;}
(define (sphere r [material 'voxel])
  (when (not ((between/c 0 1000) r))
    (raise-user-error "Sphere's radius must be between 0 and 1000."))
  
  (if (not (eq? material 'voxel)) 
    (builder 'air-sphere (vec 0 0 0) (* 2 r) (* 2 r) (* 2 r) #f '())
    (builder 'sphere (vec 0 0 0) (* 2 r) (* 2 r) (* 2 r) #f '())
    ))

(define (box w d h [material 'voxel])
  (when (not ((between/c 0 2000) w))
    (raise-user-error "Box's width must be between 0 and 2000."))
  (when (not ((between/c 0 2000) d))
    (raise-user-error "Box's depth must be between 0 and 2000."))
  (when (not ((between/c 0 2000) h))
    (raise-user-error "Box's height must be between 0 and 2000."))
  
  (if (not (eq? material 'voxel)) 
    (builder 'air-box (vec 0 0 0) w d h #f '())
    (builder 'box (vec 0 0 0) w d h #f '())
    ))

;Getters

(define (width b-or-a)
  (if (builder? b-or-a)
      (builder-w b-or-a)
      (unreal-eval-js
       @unreal-value{
 var actor = @(->unreal-value b-or-a)
 var bounds = GameplayStatics.GetActorArrayBounds([actor.ChildActor.ChildActor], false);
 return 2*bounds.BoxExtent.X
 })))
(define (depth b-or-a)
  (if (builder? b-or-a)
      (builder-d b-or-a)
      (unreal-eval-js
       @unreal-value{
 var actor = @(->unreal-value b-or-a)
 var bounds = GameplayStatics.GetActorArrayBounds([actor.ChildActor.ChildActor], false);
 return 2*bounds.BoxExtent.Y
 })))
(define (height b-or-a)
  (if (builder? b-or-a)
      (builder-h b-or-a)
      (unreal-eval-js
       @unreal-value{
 var actor = @(->unreal-value b-or-a)
 var bounds = GameplayStatics.GetActorArrayBounds([actor.ChildActor.ChildActor], false);
 return 2*bounds.BoxExtent.Z
 })))

;Setters

;More of a util, not for users.
(define (builder-translate b v)
  (struct-copy builder b [p (+vec v (builder-p b))]))

(define (translate v b)
  (builder-translate b v))

(define (scale s b-or-a)
  (if (builder? b-or-a)
      (builder-scale s b-or-a)
      (spawned-actor-scale b-or-a s)))

(define (builder-scale s b)
  (struct-copy builder b 
    [p (*vec s (builder-p b))]
    [w (* s (builder-w b))]
    [d (* s (builder-d b))]
    [h (* s (builder-h b))]
    [c (and 
        (builder-c b)
        (map (curry builder-scale s) (builder-c b)))]))


(define (rotate b)
  b)

;Combinators
(define (above . bs)
  (combine-all above_ bs))

(define (beside/wide . bs)
  (combine-all beside/wide_ bs))

(define beside beside/wide)

(define (beside/deep . bs)
  (combine-all beside/deep_ bs))

(define (overlay . bs)
  (combine-all overlay_ bs))

(define (combine-all f bs)
  (if (= (length bs) 1)
      (first bs)
      (combine-all f (cons
                      (f (first bs) (second bs))
                      (drop bs 2)))))

(define (overlay_ b1 b2)
  (builder 'overlay 
           (vec 0 0 0) 
           (max (builder-w b1) (builder-w b2))
           (max (builder-d b1) (builder-d b2))
           (max (builder-h b1) (builder-h b2))
           (list b1 b2)
           '()))

(define (above_ b1 b2)
  (define recenter (vec 0
                        0
                        (/ (- 
                            (builder-h b2) 
                            (builder-h b1))
                           2)))
  (builder 'above 
           (vec 0 0 0) 
           (max (builder-w b1) (builder-w b2))
           (max (builder-d b1) (builder-d b2))
           (+ (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec 0 0 (/ (builder-h b1) 2)))) 
                 (builder-translate b2 (+vec recenter (vec 0 0 (/ (builder-h b2) -2)))))
           '()
                 ))

(define (beside/wide_ b1 b2)
  (define recenter (vec (/ (- 
                            (builder-w b2) 
                            (builder-w b1))
                           2)
                        0 0 ))
  (builder 'beside/wide
           (vec 0 0 0) 
           (+ (builder-w b1) (builder-w b2))
           (max (builder-d b1) (builder-d b2))
           (max (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec (/ (builder-w b1) 2) 0 0)))
                 (builder-translate b2 (+vec recenter (vec (/ (builder-w b2) -2) 0 0))))
           '()
                 ))

(define (beside/deep_ b1 b2)
  (define recenter (vec 0
                        (/ (- 
                            (builder-d b2) 
                            (builder-d b1))
                           2)
                        0 ))
  (builder 'beside/deep
           (vec 0 0 0) 
           (max (builder-w b1) (builder-w b2))
           (+ (builder-d b1) (builder-d b2))
           (max (builder-h b1) (builder-h b2))
           (list (builder-translate b1 (+vec recenter (vec 0 (/ (builder-d b1) 2) 0)))
                 (builder-translate b2 (+vec recenter (vec 0 (/ (builder-d b2) -2) 0))))
           '()))



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


