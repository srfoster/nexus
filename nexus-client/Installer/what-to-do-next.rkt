; This file gets hosted at https://codespells-org.s3.amazonaws.com/Nexus/Installer/what-to-do-next.rkt
; Gets fetched & eval-ed by main.rkt
(let ()
  (local-require racket/gui)
  
  ; Main window
  (define frame (new frame% [label "CodeSpells"]
                            [width 600]
                            [height 300]))
  
  ; Display GUI
  (send frame show #t)
  
  ; Main panel within GUI
  (define a-panel (new vertical-panel%
                     (parent frame)
                     (vert-margin 25)
                     (horiz-margin 25)
                     (alignment '(center center))
                     (style (list 'border))))
  
  (define msg (new message% [parent a-panel]
                            [auto-resize #t]
                            [label ""]))

(define (update-button)
  (new button% [parent a-panel]
                 [label "Download Latest Version"]
                 [callback (lambda (button event)
                              (send msg set-label "Downloading..."))]))

(define (play-button)
  (new button% [parent a-panel]
                 [label "Play the Game"]
                 [callback (lambda (button event)
                              (send msg set-label "Launching..."))]))

;This should instead scrape version # from a file and check it against current version?
(define (latest-version? str)
  (string=? str "0.1"))

  ; Check to see if there's anything installed (Check for Versions folder)i
  ; If not, download latest version and put in Versions folder
  (when (not (directory-exists? "Versions"))
    (send msg set-label "No Versions found")
    (update-button)
    )

 ; If there is something installed,
  (when (directory-exists? "Versions")
    (if (not (latest-version? "0.1")
        (let () 
          (send msg set-label "New version available")
          (update-button))
        (let ()
          (send msg set-label "Up-to-date!")
          (play-button)
          ))))
 ; check to see if it's version is current
 ; If not, update! If it is, offer a Launch button. 
  
  (displayln "Is this taking changes?")
  )