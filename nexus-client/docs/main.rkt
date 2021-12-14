#lang racket

(require fmt)

(provide format-racket-code
         get-base-api-docs
         get-summon-api-docs
         get-transmogrification-api-docs
         get-events-api-docs
         get-terrain-api-docs
         )

(define (format-racket-code code)
  (program-format code
                  #:formatter-map standard-formatter-map
                  #:width 40
                  ))

(define (get-voxel-structures-docs)
  (list
   (hash 'name "Rooms"
         'descriptions (list))))

;each API will have its own get-...-docs function
(define (get-summon-api-docs)
  (list
   (hash
    'name "Summoning Basics"
    'definitions
    (list
     (hash
      'name "summon"
      'use (format-racket-code "(summon [summoner summoner?])")
      'parameter (list "summoner")
      'type (list "summoner?")
      'optional (list #f)
      'parameterDesc (list "The summoner to be placed in the 3D world.")
      'desc "Actually places a summoner in the world."
      'example (map format-racket-code (list ";creating a sphere summoner doesn't summon a sphere \n (define s (voxel-sphere 1000))\n ;but this does\n (summon s) " ))
      'returns "void?")
     (hash
      'name "summoner?"
      'use (format-racket-code "(summoner? [something any/c])")
      'parameter (list "something")
      'type (list "any/c")
      'optional (list #f)
      'parameterDesc (list "This can be anything.")
      'desc "Returns true if `something` is a summoner. Returns false otherwise."
      'example (map format-racket-code (list "(summoner? (voxel-sphere 1000))" "(summoner? (current-location))"))
      'returns "boolean?")))
   (hash
    'name "Getters"
    'definitions
    (list
     (hash
      'name "width"
      'use (format-racket-code "(width [summoner summoner?])")
      'parameter (list "summoner")
      'type (list "summoner?" )
      'optional (list #f)
      'parameterDesc (list "The summoner you want the width of." )
      'desc "Returns the width of a summoner, which is a number."
      'example (map format-racket-code (list "(width (voxel-sphere 1000))" ))
      'returns "number?")
     (hash
      'name "depth"
      'use (format-racket-code "(depth [summoner summoner?])")
      'parameter (list "summoner")
      'type (list "summoner?" )
      'optional (list #f)
      'parameterDesc (list "The summoner you want the depth of." )
      'desc "Returns the depth of a summoner, which is a number."
      'example (map format-racket-code (list "(depth (torus))" ))
      'returns "number?")
     (hash
      'name "height"
      'use (format-racket-code "(height [summoner summoner?])")
      'parameter (list "summoner")
      'type (list "summoner?" )
      'optional (list #f)
      'parameterDesc (list "The summoner you want the height of." )
      'desc "Returns the height of a summoner, which is a number."
      'example (map format-racket-code (list "(height (voxel-box 1000 500 600))" ))
      'returns "number?")))
   (hash
    'name "Transformers"
    'definitions
    (list
     (hash
      'name "scale"
      'use (format-racket-code "(scale [factor number?] [summoner summoner?])")
      'parameter (list "factor" "summoner")
      'type (list "number?" "summoner?")
      'optional (list #f #f)
      'parameterDesc (list "The factor by which to scale the given summoner." "Builder that will be scaled.")
      'desc "Scales a summoner by the given factor. For example, scaling by a factor of 2 would double the size of a sphere. There is a limit to the amount you can scale. You'll get an error if you end up trying to place a summoner that is too large."
      'example (map format-racket-code (list "(summon (scale 5 (voxel-sphere 100)))" ";this will error\n(summon (scale 2 (voxel-sphere 1000)))" ))
      'returns "summoner?")
     (hash
      'name "translate"
      'use (format-racket-code "(translate [vector vec?] [summoner summoner?])")
      'parameter (list "vector" "summoner")
      'type (list "vec?" "summoner?")
      'optional (list #f #f)
      'parameterDesc (list "A vector by which to move the given summoner." "Builder that will be moved.")
      'desc "Moves the summoner in 3D space using the x, y, z of a given vector."
      'example (map format-racket-code (list "(summon (beside/wide (translate (vec 0 0 400) (voxel-sphere 100)) (voxel-sphere 100)))" ))
      'returns "summoner?")))
   (hash
    'name "Combiners"
    'definitions
    (list
     (hash
      'name "above"
      'use (format-racket-code "(above [summoner summoner?] ...)")
      'parameter (list "summoner")
      'type (list "summoner?")
      'optional (list #f)
      'parameterDesc (list "The summoner to be placed above the following summoners.")
      'desc "This function takes any number of summoners. It will place one summoner above the next in the order given."
      'example (map format-racket-code (list "(summon (above (voxel-sphere 200)(voxel-sphere 400)(voxel-sphere 800)))" ))
      'returns "summoner?")
     (hash
      'name "beside/wide"
      'use (format-racket-code "(beside/wide [summoner summoner?] ...)")
      'parameter (list "summoner")
      'type (list "summoner?")
      'optional (list #f)
      'parameterDesc (list "The summoner to be placed next to the following summoners in the x-direction.")
      'desc "This function takes any number of summoners. It will place one summoner next to the following summoners in the order given, along the x-axis."
      'example (map format-racket-code (list "(summon (beside/wide (voxel-sphere 200)(voxel-sphere 400)(voxel-sphere 800)))" ))
      'returns "summoner?")
     (hash
      'name "beside/deep"
      'use (format-racket-code "(beside/deep [summoner summoner?] ...)")
      'parameter (list "summoner")
      'type (list "summoner?")
      'optional (list #f)
      'parameterDesc (list "The summoner to be placed next to the following summoners in the y-direction.")
      'desc "This function takes any number of summoners. It will place one summoner next to the following summoners in the order given, along the y-axis."
      'example (map format-racket-code (list "(summon (beside/deep (voxel-sphere 200)(voxel-sphere 400)(voxel-sphere 800)))" ))
      'returns "summoner?")
     (hash
      'name "overlay"
      'use (format-racket-code "(overlay [summoner summoner?] ...)")
      'parameter (list "summoner")
      'type (list "summoner?")
      'optional (list #f)
      'parameterDesc (list "The summoner to be placed at the center of the following summoners.")
      'desc "This function takes any number of summoners. It will overlay each summoner atop the following summoners in the order given."
      'example (map format-racket-code (list "(summon (overlay (voxel-sphere 1000) (beside/wide (voxel-sphere 600 'air)
                             (voxel-sphere 600 'air)
                             (voxel-sphere 600 'air))))" ))
      'returns "summoner?")))
   (hash
    'name "Voxel Primitives"
    'definitions
    (list
     (hash
      'name "voxel-sphere"
      'use (format-racket-code "(voxel-sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel])")
      'parameter (list "radius" "material")
      'type (list "(between/c 0 1000)" "(or/c 'voxel 'air)")
      'optional (list #f #t)
      'parameterDesc (list "Radius of the sphere. Must be between 0 and 1000." "Material of the sphere. Available materials are 'air and 'sphere")
      'desc "Returns a voxel-sphere summoner, which when passed into `summon` instantiates a voxel sphere into the world."
      'example (map format-racket-code (list "(summon (voxel-sphere 1000))" "(summon (overlay (voxel-box 1000 1000 1000) (voxel-sphere 600 'air)))" ))
      'returns "summoner?")
     (hash
      'name "voxel-box"
      'use (format-racket-code "(voxel-box [width (between/c 0 2000)] [depth (between/c 0 2000)] [height (between/c 0 2000)] [material (or/c 'voxel 'air) 'voxel])")
      'parameter (list "width" "depth" "height" "material")
      'type (list "(between/c 0 2000)" "(between/c 0 2000)" "(between/c 0 2000)" "(or/c 'voxel 'air)")
      'optional (list #f #t)
      'parameterDesc (list "Width of the box. Must be between 0 and 2000." "Depth of the box. Must be between 0 and 2000." "Height of the box. Must be between 0 and 2000." "Material of the sphere. Available materials are 'air and 'sphere")
      'desc "Returns a voxel-box summoner, which when passed into `summon` instantiates a voxel box into the world."
      'example (map format-racket-code (list "(summon (voxel-box 1000 500 400))" "(summon (overlay (voxel-box 800 800 800) (voxel-box 400 1000 400 'air)))" ))
      'returns "summoner?")
     (hash
      'name "empty"
      'use (format-racket-code "(empty [width number?] [depth number? width] [height number? depth])")
      'parameter (list "width" "depth" "height")
      'type (list "number?" "number?" "number?")
      'optional (list #f #t #t)
      'parameterDesc (list "Width of an empty space." "Depth of an empty space. Defaults to width if unspecified." "Height of an empty space. Defaults to depth if unspecified")
      'desc "Returns an empty space summoner, which when passed into `summon` instantiates an empty space into the world. Useful for spacing other primitives out."
      'example (map format-racket-code (list "(summon (beside/wide (voxel-sphere 1000) (empty 2000 2000 2000) (voxel-sphere 1000)))" ))
      'returns "summoner?")))
   (hash
    'name "Physical Objects"
    'definitions
    (list
     (hash
      'name "sphere"
      'use (format-racket-code "(sphere)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns a sphere with physics, which when passed into `summon` instantiates a sphere into the world."
      'example (map format-racket-code (list "(summon (sphere))" "(summon (above (sphere) (voxel-box 600 600 600)))" ))
      'returns "summoner?")
     (hash
      'name "cube"
      'use (format-racket-code "(cube)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns a cube with physics, which when passed into `summon` instantiates a cube into the world."
      'example (map format-racket-code (list "(summon (cube))" "(summon (above (cube) (voxel-box 600 600 600)))" ))
      'returns "summoner?")
     (hash
      'name "torus"
      'use (format-racket-code "(torus)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns a torus with physics, which when passed into `summon` instantiates a torus into the world."
      'example (map format-racket-code (list "(summon (torus))" "(summon (above (torus) (voxel-box 600 600 600)))" ))
      'returns "summoner?")
     (hash
      'name "dodecahedron"
      'use (format-racket-code "(dodecahedron)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns a dodecahedron with physics, which when passed into `summon` instantiates a dodecahedron into the world."
      'example (map format-racket-code (list "(summon (dodecahedron))" "(summon (above (dodecahedron) (voxel-box 600 600 600)))" ))
      'returns "summoner?")
  ))
  (hash
    'name "Magical Effects"
    'definitions
    (list
     (hash
      'name "magic-circle"
      'use (format-racket-code "(magic-circle)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns a magic circle which doesn't have physics, which when passed into `summon` instantiates a magic circle into the world."
      'example (map format-racket-code (list "(summon (magic-circle))" "(summon (above (magic-circle) (magic-circle)))" ))
      'returns "summoner?")
     (hash
      'name "energy-ball"
      'use (format-racket-code "(energy-ball)")
      'parameter (list )
      'type (list )
      'optional (list )
      'parameterDesc (list )
      'desc "Returns an energy ball which doesn't have physics, which when passed into `summon` instantiates an energy ball into the world."
      'example (map format-racket-code (list "(summon (energy-ball))" "(summon (above 
        (energy-ball) 
        (magic-circle)
        (energy-ball)
        (magic-circle)))"
        "(define brt (summon (above (tag (scale 2 (energy-ball)) \"ball\") (tag (sphere) \"sphere\"))))

         (define b (find-first-by-tag brt \"ball\"))
         (define s (find-first-by-tag brt \"sphere\"))

         (parent s b)"))
      'returns "summoner?")
  ))))

(define (get-transmogrification-api-docs)
  (list
   (hash 'name "Base"
         'definitions
         (list
          (hash
           'name "tag"
           'use (format-racket-code "(tag [summoner summoner?] [tag-name string?])")
           'parameter (list "summoner" "tag-name")
           'type (list "summoner?" "string?")
           'optional (list #f #f)
           'parameterDesc (list "A summoner to tag with a tag name." "A tag name to label a specific summoner.")
           'desc "Wrapping a summoner in a tag allows the user to later find the object reference by tag and transmogrify that object later."
           'example (map format-racket-code (list
                                             "(define brt (summon (tag (cube) \"cube\")))

                                              (define magic-cube (find-first-by-tag brt \"cube\"))

                                              (sleep 4)

                                              (force magic-cube (vec 0 0 5000000))"
                                             ))
           'returns "void?")
          (hash
           'name "parent"
           'use (format-racket-code "(parent [obj1 summoned?] [obj2 summoned?])")
           'parameter (list "obj1" "obj2")
           'type (list "summoned?" "summoned?")
           'optional (list #f #f)
           'parameterDesc (list "The parent." "The child, which must not be a physical object.")
           'desc "This function attaches the second summoned to the first summoned. The second summoned can not be a physical object. It must be a summoned without physics like a (magic-circle)."
           'example (map format-racket-code (list
                                             "(define brt (summon (above (tag (cube) \"cube\")
                                                                        (tag (scale 3 (magic-circle)) \"circle\"))))

                                              (define magic-cube (find-first-by-tag brt \"cube\"))
                                              (define circle (find-first-by-tag brt \"circle\"))

                                              (sleep 4)

                                              (parent magic-cube circle)"
                                             ))
           'returns "void?")
           ))
   (hash 'name "Magical Forces"
         'definitions
         (list
          (hash
           'name "force"
           'use (format-racket-code "(force [summoner summoner?] [vec vec?])")
           'parameter (list "summoner" "vec")
           'type (list "summoner?" "vec?")
           'optional (list #f #f)
           'parameterDesc (list "A summoner to apply a force to." "A vector which represents the direction and magnitude of the force to be applied.")
           'desc "This function applies a force to the summoner in the magnitude and direction of the given vector."
           'example (map format-racket-code (list
                                             "(define (letter->summoner l)
  (above (tag (cube) \"letter\") (voxel-box 500 500 200)))

(define (list->summoner l)
  (apply beside/wide (map letter->summoner l)))

(define rt (summon 
            (beside/wide 
             (translate (vec 0 0 -100) (tag (magic-circle) \"pointer\"))
             (list->summoner '(a b c a)))))

(define letters (find-all-by-tag rt \"letter\"))

(sleep 5)
(for ([l letters])
     (sleep 0.5)
     (scale 0.5 l)
     (force l
            (vec 0 0 1000000)))
(sleep 2)
(define pointer (find-first-by-tag rt \"pointer\"))
(scale 2 pointer)

(teleport pointer (location (first letters)))

(sleep 2)

(teleport pointer (+vec 
                   (location (first letters)) 
                   (vec 0 0 (/ (height (first letters)) -2))
                	))"
                                             ))
           'returns "void?")
           ))
   (hash 'name "Magic Circles"
         'definitions
         (list
          (hash
           'name "magic-circle-color"
           'use (format-racket-code "(magic-circle-color [mc obj?] [color-vec hash?])")
           'parameter (list "mc" "color-vec")
           'type (list "obj?" "hash?")
           'optional (list #f #f)
           'parameterDesc (list "A magic circle to change the color of." "A hash of R, B, G values (from 0 to 1).")
           'desc "Changes the color of a given magic circle using the given RGB values (in hash form)."
           'example (map format-racket-code (list
                                             "(define brt (summon (tag (magic-circle) \"circle\")))

                                             (define circle (find-first-by-tag brt \"circle\"))

                                             (magic-circle-color circle (hash 'R 1 'G 1 'B 0))"
                                             "(define brt (summon (above
                    (tag (magic-circle) \"red\")
                    (tag (magic-circle) \"orange\")
                    (tag (magic-circle) \"yellow\")
                    (tag (magic-circle) \"green\")
                    (tag (magic-circle) \"blue\")
                    (tag (magic-circle) \"purple\"))))

(define red (find-first-by-tag brt \"red\"))
(define orange (find-first-by-tag brt \"orange\"))
(define yellow (find-first-by-tag brt \"yellow\"))
(define green (find-first-by-tag brt \"green\"))
(define blue (find-first-by-tag brt \"blue\"))
(define purple (find-first-by-tag brt \"purple\"))

(magic-circle-color red (hash 'R 1 'G 0 'B 0))
(magic-circle-color orange (hash 'R 1 'G 0.5 'B 0))
(magic-circle-color yellow (hash 'R 1 'G 1 'B 0))
(magic-circle-color green (hash 'R 0 'G 1 'B 0))
(magic-circle-color blue (hash 'R 0 'G 0 'B 1))
(magic-circle-color purple (hash 'R 0.5 'G 0 'B 1))"
                                             ))
           'returns "void?")
           ))
  ))

(define (get-terrain-api-docs)
  (list
   (hash 'name "Terrain"
         'definitions
         (list
          (hash
           'name "terrain-switch-to-hills"
           'use (format-racket-code "(terrain-switch-to-hills [height 10 number?] [floor 0 number?] [seed 1337 number?])")
           'parameter (list "height" "floor" "seed")
           'type (list "number?" "number?" "number?")
           'optional (list #t #t #t)
           'parameterDesc (list "Height of the hills" "The z-value of the floor of the terrain" "A number that seeds the randomness")
           'desc "Switches the terrain to a world with hills. The world will be flat with a height of 0."
           'example (map format-racket-code (list
           "(terrain-switch-to-hills 100 -100 1567)"
                                             ))
           'returns "void?")
          (hash
           'name "terrain-switch-to-globs"
           'use (format-racket-code "(terrain-switch-to-globs [floor 0 number?])")
           'parameter (list "floor")
           'type (list "number?")
           'optional (list #t)
           'parameterDesc (list "The z-value of the floor of the terrain")
           'desc "Switches the terrain to a world produced by 3D perlin noise, beneath the floor z value."
           'example (map format-racket-code (list
           "(terrain-switch-to-globs -100)"
                                             ))
           'returns "void?")
          (hash
           'name "terrain-switch-to-caves"
           'use (format-racket-code "(terrain-switch-to-caves)")
           'parameter (list )
           'type (list )
           'optional (list )
           'parameterDesc (list )
           'desc "Switches the terrain to a cave world."
           'example (map format-racket-code (list
           "(terrain-switch-to-caves)"
                                             ))
           'returns "void?")
          (hash
           'name "terrain-switch-to-mountain"
           'use (format-racket-code "(terrain-switch-to-mountain)")
           'parameter (list )
           'type (list )
           'optional (list )
           'parameterDesc (list )
           'desc "Switches the terrain to a mountain world."
           'example (map format-racket-code (list
           "(terrain-switch-to-mountain)"
                                             ))
           'returns "void?")
          (hash
           'name "terrain-switch-to-cliffs"
           'use (format-racket-code "(terrain-switch-to-cliffs)")
           'parameter (list )
           'type (list )
           'optional (list )
           'parameterDesc (list )
           'desc "Switches the terrain to a cliffs world."
           'example (map format-racket-code (list
           "(terrain-switch-to-cliffs)"
                                             ))
           'returns "void?")
           ))))

(define (get-events-api-docs)
  (list
   (hash 'name "Base"
         'definitions
         (list
          (hash
           'name "on-projectile-hit"
           'use (format-racket-code "(on-projectile-hit [function function?])")
           'parameter (list "function")
           'type (list "function?")
           'optional (list #f)
           'parameterDesc (list "Function to stop running when projectile hits something in the world.")
           'desc "This function configures the projectile of your character to execute a given function when it lands. The given function will be called with the location that the projectile hit."
           'example (map format-racket-code (list
           "(clear-projectile-hit-functions)

           (on-projectile-hit
             (lambda (e)
               (summon (light) 
                       (event-location e))))"
                                             "(clear-projectile-hit-functions)
                                             
                                             (on-projectile-hit 
                                               (lambda (e) (summon (voxel-sphere 1000) (event-location e))))"
                                             
                                             "(clear-projectile-hit-functions)
                                             
                                             (define size 0)

                                             (on-projectile-hit 
                                               (lambda (e) 
                                                 (set! size (+ size 200))
                                                 (when (> size 1000) (set! size 200))
                                                 (summon (voxel-sphere size) 
                                                        (event-location e))))"
                                             ))
           'returns "void?")
          (hash
           'name "cancel-on-projectile-hit"
           'use (format-racket-code "(cancel-on-projectile-hit [function function?])")
           'parameter (list "function")
           'type (list "function?")
           'optional (list #f)
           'parameterDesc (list "Function to run when projectile hits something in the world.")
           'desc "This function can be used to cancel a previous call to `on-projectile-hit`.  You must pass in the same function you registered with `on-projectile-hit`.  This will prevent it from being called the next time the character's projectile lands.  This can also be used to make one-off spells (ones that cancel themselves when complete)"
           'example (map format-racket-code (list
                                             "(clear-projectile-hit-functions)
                                             
                                             (define (summon-once e)
                                                (summon (voxel-sphere 1000) (event-location e))
                                                (cancel-on-projectile-hit summon-once))

                                             (on-projectile-hit summon-once)"
                                             
                                             "(clear-projectile-hit-functions)
                                             
                                             (define num-summons 0)
                                             
                                              (define (summon-thrice e)
                                                (set! num-summons (add1 num-summons))
                                                (summon (voxel-sphere 1000) (event-location e))
                                                (when (>= num-summons 3)
                                                  (cancel-on-projectile-hit summon-thrice)))

                                             (on-projectile-hit summon-thrice)"))
           'returns "void?")
          (hash
           'name "clear-projectile-hit-functions"
           'use (format-racket-code "(clear-projectile-hit-functions [function function?])")
           'parameter (list)
           'type (list)
           'optional (list)
           'parameterDesc (list)
           'desc "This function clears all previously made configurations for the projectile of your character. This can be particularly useful to call before configuring a new `on-projectile-hit`, if you want to clear previous configurations."
           'example (map format-racket-code (list
                                             "(clear-projectile-hit-functions)"
                                             ))
           'returns "void?")
          
          (hash
           'name "on-zone-enter"
           'use (format-racket-code "(on-zone-enter [function function?])")
           'parameter (list "function")
           'type (list "function?")
           'optional (list #f)
           'parameterDesc (list "Function to run when a zone is entered.  Must take an event data structure.")
           'desc "This allow you to register a function to be called when zones are entered.  Use the event data in the callback (e.g. with functions `(event-name e)`  and `(event-location e)`) to perform further calculations.  Note that zone enter events will only get fired if there are zones in the world.  See example below for how to spawn a zone (or see the Spawning section of the API).  Also note that `clear-zone-enter-functions` and `cancel-on-zone-enter` work analogously to `clear-projectile-hit-functions` and `cancel-on-projectil-hit` (see above)."
           'example (map format-racket-code (list
                                             "(clear-zone-enter-functions)
                                             (clear-projectile-hit-functions)

                                             (on-projectile-hit
                                               (lambda (e)
                                                 (spawn (zone #:name \"Trap\")
                                                        (event-location e))))
                                             
                                             (on-zone-enter
                                               (lambda (e) 
                                                 (when (string=? \"Trap\" (event-name e))
                                                   (summon (room 1000 1000 1000) 
                                                          (event-location e)))))"
                                             "(clear-zone-enter-functions)
(clear-projectile-hit-functions)

(on-projectile-hit
 (lambda (e)
   (define brt (summon (overlay 
                       (tag (zone #:name \"Trap\") \"zone-actor\")
                       (tag (magic-circle) \"circle\"))
          (event-location e)))
   (define zone-actor (find-first-by-tag brt \"zone-actor\"))
   (define circle (find-first-by-tag brt \"circle\"))
   (parent zone-actor circle)))

(on-zone-enter
 (lambda (e)
   (when (string=? \"Trap\"
                   (event-name e))
     (summon (room 1000 1000 600)
            (event-location e)))))"

            "(clear-zone-enter-functions)
(clear-projectile-hit-functions)

(on-projectile-hit
 (lambda (e)
   (define brt
     (summon
      (overlay
       (tag (zone #:name \"Trap\")
            \"zone-actor\")
       (tag (sphere) \"sph\"))
      (event-location e)))
   (define zone-actor
     (find-first-by-tag brt
                        \"zone-actor\"))
   (define sph
     (find-first-by-tag brt \"sph\"))
   (parent sph zone-actor)))

(on-zone-enter
 (lambda (e)
   (when (and (string=? \"Trap\"
                        (event-name e))
              (is-player? (event-other-actor e)))
     (summon (room 1000 1000 600)
            (event-location e)))))"
                                             ))
           'returns "void?")))))

(define (get-base-api-docs)
  (list
   (hash 'name "Math"
         'definitions
         (list))
   (hash 'name "Control Flow"
         'definitions
         (list
          
          ))
   (hash 'name "Logic"
         'definitions
         (list
          (hash
           'name "and"
           'use (format-racket-code "(and [v1 any/c] [v2 any/c] ...)")
           'parameter (list "v1" "v2")
           'type (list "any/c" "any/c")
           'optional (list #f #f)
           'parameterDesc (list "First value." "Second value. More can follow.")
           'desc "This can take any number of values, but requires at least two. This returns the last value given, if all preceding values are not false. Returns false if any given value is false."
           'example (map format-racket-code (list
                                             "(and #t #t #f)"
                                             "(and #t #t #t)"
                                             "(and (vec? (vec 100 200 -100)) (summoner? (voxel-sphere 1000)) (boolean? #f))"))
           'returns "list?")
          (hash
           'name "or"
           'use (format-racket-code "(or [b1 boolean?] [b2 boolean?] ...)")
           'parameter (list "b1" "b2")
           'type (list "boolean?" "boolean?")
           'optional (list #f #f)
           'parameterDesc (list "First boolean." "Second boolean. More can follow.")
           'desc "This can take any number of values, but requires at least two. This returns the first value that is not false. Returns false if all given values are false."
           'example (map format-racket-code (list
                                             "(or #t #t #f)"
                                             "(or #f #t)"
                                             "(or 5 #t #t)"
                                             "(or (vec? (vec 100 200 -100)) (summoner? (voxel-sphere 1000)) (boolean? #f))"))
           'returns "list?")
          ))
   (hash 'name "Lists"
         'definitions
         (list
          (hash
           'name "map"
           'use (format-racket-code "(map [function function?] [list list?])")
           'parameter (list "function" "list")
           'type (list "function?" "list?")
           'optional (list #f #f)
           'parameterDesc (list "A function to apply to each element of the list." "The list.")
           'desc "Returns a new list after applying a given function to each element of a given list."
           'example (map format-racket-code (list
                                             "(define (add1 num) (+ num 1)) (map add1 (list 1 2 3 4 5))"
                                             "(map string-upcase (list \"socks\" \"rock\"))"))
           'returns "list?")
          ;;Lots more list stuff todo later
          ))
   (hash
    'name "Locations"
    'definitions
    (list
     (hash
      'name "current-location"
      'use (format-racket-code "(current-location)")
      'parameter (list )
      'type (list )
      'optional (list)
      'parameterDesc (list )
      'desc "Returns a vector representing the current location of the user's orb."
      'example (map format-racket-code (list "(summon (voxel-sphere 500) (+vec (vec 1000 1000 1000) (current-location)))"))
      'returns "vec?")
     (hash
      'name "vec"
      'use (format-racket-code "(vec [x number?] [y number?] [z number?])")
      'parameter (list "x" "y" "z")
      'type (list "number?" "number?" "number?")
      'optional (list #f #f #f)
      'parameterDesc (list "The x-component of the vector." "The y-component of the vector." "The z-component of the vector.")
      'desc "Constructs a vector, given x-, y-, and z-components."
      'example (map format-racket-code (list "(vec 100 100 100)"))
      'returns "vec?")
     (hash
      'name "+vec"
      'use (format-racket-code "(+vec [vector1 vec?] [vector2 vec?])")
      'parameter (list "vector1" "vector2")
      'type (list "vec?" "vec?")
      'optional (list #f #f)
      'parameterDesc (list "The vector to be added to the second vector." "The vector to be added to the first vector.")
      'desc "Returns a vector that is the addition of the two given vectors."
      'example (map format-racket-code (list "(summon (voxel-sphere 500) (+vec (vec 1000 1000 1000) (current-location)))"))
      'returns "vec?")
     (hash
      'name "*vec"
      'use (format-racket-code "(*vec [factor number?] [vector vec?])")
      'parameter (list "factor" "vector")
      'type (list "number?" "vec?")
      'optional (list #f #f)
      'parameterDesc (list "The factor by which to scale each number in the vector." "The vector to be scaled.")
      'desc "Returns a vector that is scaled by the given factor."
      'example (map format-racket-code (list "(summon (voxel-sphere 500) (+vec (*vec 10 (vec 100 100 100)) (current-location)))"))
      'returns "vec?")
     (hash
      'name "vec?"
      'use (format-racket-code "(vec [something any/c])")
      'parameter (list "something")
      'type (list "any/c")
      'optional (list #f)
      'parameterDesc (list "Something you are checking to see if its a vector." )
      'desc "Returns true if `something` is a vector. Returns false otherwise."
      'example (map format-racket-code (list "(vec? (current-location))" "(vec? (vec 340 2340 123))" "(vec? (voxel-sphere 100))"))
      'returns "boolean?")
     ))))
