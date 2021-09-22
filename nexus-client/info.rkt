#lang info
(define collection "nexus-client")
(define deps '("base" "rfc6455" "https://github.com/srfoster/unreal.git" "reloadable"))
(define build-deps '("scribble-lib" "racket-doc" "rackunit-lib"))
(define pkg-desc "Description Here")
(define version "0.0")
(define pkg-authors '(ThoughtSTEM))
(define compile-omit-paths '("Installer" "World"))