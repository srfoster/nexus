#lang racket

(require net/http-easy)

; This becomes the installer that people download
; from Puzzle 2.5. This Racket file gets built into an
; executable. 

; Double clicking the executable will fetch a Racket file
; from https://codespells-org.s3.amazonaws.com/Nexus/Installer/what-to-do-next.rkt 
; that will tell it what to do next. Then it will eval 
; that file. See what-to-do-next.rkt.

(define url 
  "https://codespells-org.s3.amazonaws.com/Nexus/Installer/what-to-do-next.rkt")

(define res
  (get url #:stream? #t))

(define body 
  (response-body res))

(define-namespace-anchor a)
(define ns (namespace-anchor->namespace a))

(eval (read (open-input-string (bytes->string/utf-8 body))) ns)