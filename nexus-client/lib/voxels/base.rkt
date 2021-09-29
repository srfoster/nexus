#lang at-exp racket

(require unreal
         unreal/libs/actors
         unreal/libs/basic-types
)

(provide current-location
        empty sphere builder? 
        width depth height 
        scale rotate above beside/wide beside/deep overlay translate build)

#|
Begin functional API for Voxel Worlds:

(above (sphere 5) (sphere 10))

|#

(define/contract (current-location)
  (-> vec?)
  
  (unreal-eval-js 
   (location (character))))

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


(struct builder (t p w d h c))

;Constructors

(define (empty w [d w] [h w])
  (builder 'empty (vec 0 0 0) w d h #f))

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
  (if (not (eq? material 'voxel)) 
    (builder 'air-sphere (vec 0 0 0) (* 2 r) (* 2 r) (* 2 r) #f)
    (builder 'sphere (vec 0 0 0) (* 2 r) (* 2 r) (* 2 r) #f)
    ))

;Getters

(define width builder-w)
(define depth builder-d)
(define height builder-h)

;Setters

;More of a util, not for users.
(define (builder-translate b v)
  (struct-copy builder b [p (+vec v (builder-p b))]))

(define (translate v b)
  (builder-translate b v))

(define (scale s b)
  (struct-copy builder b 
    [p (*vec s (builder-p b))]
    [w (* s (builder-w b))]
    [d (* s (builder-d b))]
    [h (* s (builder-h b))]
    [c (and 
        (builder-c b)
        (map (curry scale s) (builder-c b)))]))


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
           (list b1 b2)))

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
                 (builder-translate b2 (+vec recenter (vec 0 0 (/ (builder-h b2) -2)))))))

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
                 (builder-translate b2 (+vec recenter (vec (/ (builder-w b2) -2) 0 0))))))

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
                 (builder-translate b2 (+vec recenter (vec 0 (/ (builder-d b2) -2) 0))))))


;Renderer
(define (build b [at (current-location)])
  (define at-rel (+vec at (builder-p b)))

  (match (builder-t b)
    ['sphere (build-sphere at-rel (/ (builder-w b) 2))]
    ['air-sphere (dig-sphere at-rel (/ (builder-w b) 2))] 
    ['empty  (void)] 
    [else (map (curryr build at-rel) 
               (builder-c b))]))


;Side-effectful functions we are building our effect-free API atop of

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


