#lang racket

(require fmt)

(provide format-racket-code
         get-base-api-docs
         get-voxel-api-docs
         get-events-api-docs
         )

(define (format-racket-code code)
  (program-format code
                  standard-formatter-map
                  #:width 40))

(define (get-voxel-structures-docs)
  (list
   (hash 'name "Rooms"
         'descriptions (list))))

;each API will have its own get-...-docs function
(define (get-voxel-api-docs)
  (list
   (hash
    'name "Building Basics"
    'definitions
    (list
     (hash
      'name "build"
      'use (format-racket-code "(build [builder builder?])")
      'parameter (list "builder")
      'type (list "builder?")
      'optional (list #f)
      'parameterDesc (list "The builder to be placed in the 3D world.")
      'desc "Actually places a builder in the world."
      'example (map format-racket-code (list ";creating a sphere builder doesn't build a sphere \n (define s (sphere 1000))\n ;but this does\n (build s) " ))
      'returns "void?")
     (hash
      'name "builder?"
      'use (format-racket-code "(builder? [something any/c])")
      'parameter (list "something")
      'type (list "any/c")
      'optional (list #f)
      'parameterDesc (list "This can be anything.")
      'desc "Returns true if `something` is a builder. Returns false otherwise."
      'example (map format-racket-code (list "(builder? (sphere 1000))" "(builder? (current-location))"))
      'returns "boolean?")))
   (hash
    'name "Getters"
    'definitions
    (list
     (hash
      'name "width"
      'use (format-racket-code "(width [builder builder?])")
      'parameter (list "builder")
      'type (list "builder?" )
      'optional (list #f)
      'parameterDesc (list "The builder you want the width of." )
      'desc "Returns the width of a builder, which is a number."
      'example (map format-racket-code (list "(width (sphere 1000))" ))
      'returns "number?")
     (hash
      'name "height"
      'use (format-racket-code "(height [builder builder?])")
      'parameter (list "builder")
      'type (list "builder?" )
      'optional (list #f)
      'parameterDesc (list "The builder you want the height of." )
      'desc "Returns the height of a builder, which is a number."
      'example (map format-racket-code (list "(height (sphere 1000))" ))
      'returns "number?")
     (hash
      'name "depth"
      'use (format-racket-code "(depth [builder builder?])")
      'parameter (list "builder")
      'type (list "builder?" )
      'optional (list #f)
      'parameterDesc (list "The builder you want the depth of." )
      'desc "Returns the depth of a builder, which is a number."
      'example (map format-racket-code (list "(depth (sphere 1000))" ))
      'returns "number?")))
   (hash
    'name "Transformers"
    'definitions
    (list
     (hash
      'name "scale"
      'use (format-racket-code "(scale [factor number?] [builder builder?])")
      'parameter (list "factor" "builder")
      'type (list "number?" "builder?")
      'optional (list #f #f)
      'parameterDesc (list "The factor by which to scale the given builder." "Builder that will be scaled.")
      'desc "Scales a builder by the given factor. For example, scaling by a factor of 2 would double the size of a sphere. There is a limit to the amount you can scale. You'll get an error if you end up trying to place a builder that is too large."
      'example (map format-racket-code (list "(build (scale 5 (sphere 100)))" ";this will error\n(build (scale 2 (sphere 1000)))" ))
      'returns "builder?")
     (hash
      'name "translate"
      'use (format-racket-code "(translate [vector vec?] [builder builder?])")
      'parameter (list "vector" "builder")
      'type (list "vec?" "builder?")
      'optional (list #f #f)
      'parameterDesc (list "A vector by which to move the given builder." "Builder that will be moved.")
      'desc "Moves the builder in 3D space using the x, y, z of a given vector."
      'example (map format-racket-code (list "(build (beside/wide (translate (vec 0 0 400) (sphere 100)) (sphere 100)))" ))
      'returns "builder?")))
   (hash
    'name "Combiners"
    'definitions
    (list
     (hash
      'name "above"
      'use (format-racket-code "(above [builder builder?] ...)")
      'parameter (list "builder")
      'type (list "builder?")
      'optional (list #f)
      'parameterDesc (list "The builder to be placed above the following builders.")
      'desc "This function takes any number of builders. It will place one builder above the next in the order given."
      'example (map format-racket-code (list "(build (above (sphere 200)(sphere 400)(sphere 800)))" ))
      'returns "builder?")
     (hash
      'name "beside/wide"
      'use (format-racket-code "(beside/wide [builder builder?] ...)")
      'parameter (list "builder")
      'type (list "builder?")
      'optional (list #f)
      'parameterDesc (list "The builder to be placed next to the following builders in the x-direction.")
      'desc "This function takes any number of builders. It will place one builder next to the following builders in the order given, along the x-axis."
      'example (map format-racket-code (list "(build (beside/wide (sphere 200)(sphere 400)(sphere 800)))" ))
      'returns "builder?")
     (hash
      'name "beside/deep"
      'use (format-racket-code "(beside/deep [builder builder?] ...)")
      'parameter (list "builder")
      'type (list "builder?")
      'optional (list #f)
      'parameterDesc (list "The builder to be placed next to the following builders in the y-direction.")
      'desc "This function takes any number of builders. It will place one builder next to the following builders in the order given, along the y-axis."
      'example (map format-racket-code (list "(build (beside/deep (sphere 200)(sphere 400)(sphere 800)))" ))
      'returns "builder?")
     (hash
      'name "overlay"
      'use (format-racket-code "(overlay [builder builder?] ...)")
      'parameter (list "builder")
      'type (list "builder?")
      'optional (list #f)
      'parameterDesc (list "The builder to be placed at the center of the following builders.")
      'desc "This function takes any number of builders. It will overlay each builder atop the following builders in the order given."
      'example (map format-racket-code (list "(build (overlay (sphere 1000) (beside/wide (sphere 600 'air)
                             (sphere 600 'air)
                             (sphere 600 'air))))" ))
      'returns "builder?")))
   (hash
    'name "Voxel Primitives"
    'definitions
    (list
     (hash
      'name "sphere"
      'use (format-racket-code "(sphere [radius (between/c 0 1000)] [material (or/c 'voxel 'air) 'voxel])")
      'parameter (list "radius" "material")
      'type (list "(between/c 0 1000)" "(or/c 'voxel 'air)")
      'optional (list #f #t)
      'parameterDesc (list "Radius of the sphere. Must be between 0 and 1000." "Material of the sphere. Available materials are 'air and 'sphere")
      'desc "Returns a sphere builder, which when passed into `build` instantiates a voxel sphere into the world."
      'example (map format-racket-code (list "(build (sphere 1000))" "(build (sphere 500 'air))" ))
      'returns "builder?")
     (hash
      'name "empty"
      'use (format-racket-code "(empty [width number?] [depth number? width] [height number? depth])")
      'parameter (list "width" "depth" "height")
      'type (list "number?" "number?" "number?")
      'optional (list #f #t #t)
      'parameterDesc (list "Width of an empty space." "Depth of an empty space. Defaults to width if unspecified." "Height of an empty space. Defaults to depth if unspecified")
      'desc "Returns an empty space builder, which when passed into `build` instantiates an empty space into the world. Useful for spacing other primitives out."
      'example (map format-racket-code (list "(build (beside/wide (sphere 1000) (empty 2000 2000 2000) (sphere 1000)))" ))
      'returns "builder?")))))

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
                                               (lambda (e) (build (sphere 1000) (event-location e))))"
                                             
                                             "(clear-projectile-hit-functions)
                                             
                                             (define size 0)

                                             (on-projectile-hit 
                                               (lambda (e) 
                                                 (set! size (+ size 200))
                                                 (when (> size 1000) (set! size 200))
                                                 (build (sphere size) 
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
                                             "(define (build-once e)
                                                (build (sphere 1000) (event-location e))
                                                (cancel-on-projectile-hit build-once))

                                             (on-projectile-hit build-once)"
                                             
                                             "(define num-builds 0)
                                             
                                              (define (build-thrice e)
                                                (set! num-builds (add1 num-builds))
                                                (build (sphere 1000) (event-location e))
                                                (when (>= num-builds 3)
                                                  (cancel-on-projectile-hit build-thrice)))

                                             (on-projectile-hit build-thrice)"))
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
                                                   (build (room 1000 1000 1000) 
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
                                             "(and (vec? (vec 100 200 -100)) (builder? (sphere 1000)) (boolean? #f))"))
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
                                             "(or (vec? (vec 100 200 -100)) (builder? (sphere 1000)) (boolean? #f))"))
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
      'example (map format-racket-code (list "(build (sphere 500) (+vec (vec 1000 1000 1000) (current-location)))"))
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
      'example (map format-racket-code (list "(build (sphere 500) (+vec (vec 1000 1000 1000) (current-location)))"))
      'returns "vec?")
     (hash
      'name "*vec"
      'use (format-racket-code "(*vec [factor number?] [vector vec?])")
      'parameter (list "factor" "vector")
      'type (list "number?" "vec?")
      'optional (list #f #f)
      'parameterDesc (list "The factor by which to scale each number in the vector." "The vector to be scaled.")
      'desc "Returns a vector that is scaled by the given factor."
      'example (map format-racket-code (list "(build (sphere 500) (+vec (*vec 10 (vec 100 100 100)) (current-location)))"))
      'returns "vec?")
     (hash
      'name "vec?"
      'use (format-racket-code "(vec [something any/c])")
      'parameter (list "something")
      'type (list "any/c")
      'optional (list #f)
      'parameterDesc (list "Something you are checking to see if its a vector." )
      'desc "Returns true if `something` is a vector. Returns false otherwise."
      'example (map format-racket-code (list "(vec? (current-location))" "(vec? (vec 340 2340 123))" "(vec? (sphere 100))"))
      'returns "boolean?")
     ))))