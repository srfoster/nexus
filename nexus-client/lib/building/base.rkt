#lang at-exp racket

(require unreal/libs/basic-types
         unreal
         "../base.rkt")

(provide build (struct-out builder)
         make-basic-builder
         (struct-out build-result-tree) 
         builder-w builder-d builder-h builder-scale
        width depth height 
        rotate above beside/wide beside/deep overlay translate 
        tag find-first-by-tag find-all-by-tag)

(struct builder (data function position dimensions children tags))

(define (make-basic-builder data function #:dimensions [dimensions (vec 300 300 300)] #:children [children '()])
  (builder data function (vec 0 0 0) dimensions children '()))

(struct build-result-tree (result builder children))

(define (build b [at (current-location)])
  (_build b at))

;Renderer
(define (_build b [at (current-location)])
  (define at-rel (+vec at (builder-position b)))
  (define f (builder-function b))
  (if f
      (build-result-tree (f b at-rel) b '())
      (build-result-tree (void)
                         b
                         (map (curryr _build at-rel)
                              (builder-children b)))))

(define (builder-w b)
  (x (builder-dimensions b)))

(define (builder-d b)
  (y (builder-dimensions b)))

(define (builder-h b)
  (z (builder-dimensions b)))

(define (tag b t)
  (struct-copy builder b [tags (cons t (builder-tags b))]))

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
  (struct-copy builder b [position (+vec v (builder-position b))]))

(define (translate v b)
  (builder-translate b v))


(define (builder-scale s b)
  (struct-copy builder b 
    [position (*vec s (builder-position b))]
    [dimensions (vec (* s (builder-w b))
                     (* s (builder-d b))
                     (* s (builder-h b)))]
    [children (and 
        (builder-children b)
        (map (curry builder-scale s) (builder-children b)))]))


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


(define (combine-all f bs)
  (if (= (length bs) 1)
      (first bs)
      (combine-all f (cons
                      (f (first bs) (second bs))
                      (drop bs 2)))))

(define (overlay . bs)
  (combine-all overlay_ bs))

(define (overlay_ b1 b2)
  (make-basic-builder 'overlay
                      #f
                      #:dimensions (vec
                                    (max (builder-w b1) (builder-w b2))
                                    (max (builder-d b1) (builder-d b2))
                                    (max (builder-h b1) (builder-h b2)))
                      #:children (list b1 b2)))

(define (above_ b1 b2)
  (define recenter (vec 0
                        0
                        (/ (- 
                            (builder-h b2) 
                            (builder-h b1))
                           2)))
  (make-basic-builder 'above
                      #f
                      #:dimensions (vec
                                    (max (builder-w b1) (builder-w b2))
                                    (max (builder-d b1) (builder-d b2))
                                    (+ (builder-h b1) (builder-h b2)))
                      #:children (list (builder-translate b1 (+vec recenter (vec 0 0 (/ (builder-h b1) 2))))
                                       (builder-translate b2 (+vec recenter (vec 0 0 (/ (builder-h b2) -2)))))
                      ))

(define (beside/wide_ b1 b2)
  (define recenter (vec (/ (- 
                            (builder-w b2) 
                            (builder-w b1))
                           2)
                        0 0 ))
  (make-basic-builder 'beside/wide
                      #f
                      #:dimensions (vec
                                    (+ (builder-w b1) (builder-w b2))
                                    (max (builder-d b1) (builder-d b2))
                                    (max (builder-h b1) (builder-h b2)))
                      #:children (list (builder-translate b1 (+vec recenter (vec (/ (builder-w b1) 2) 0 0)))
                                       (builder-translate b2 (+vec recenter (vec (/ (builder-w b2) -2) 0 0))))))

(define (beside/deep_ b1 b2)
  (define recenter (vec 0
                        (/ (- 
                            (builder-d b2) 
                            (builder-d b1))
                           2)
                        0 ))
  (make-basic-builder 'beside/deep
                      #f
                      #:dimensions (vec
                                    (max (builder-w b1) (builder-w b2))
                                    (+ (builder-d b1) (builder-d b2))
                                    (max (builder-h b1) (builder-h b2)))
                      #:children (list (builder-translate b1 (+vec recenter (vec 0 (/ (builder-d b1) 2) 0)))
                                       (builder-translate b2 (+vec recenter (vec 0 (/ (builder-d b2) -2) 0))))))