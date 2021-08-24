; This file gets hosted at https://codespells-org.s3.amazonaws.com/Nexus/Installer/what-to-do-next.rkt
; Gets fetched & eval-ed by main.rkt

;TODO Progress bar
;     Get racket executable to not launch cmd?

(let ()
  (local-require racket/gui
                 file/unzip)

  ;Creates Versions directory if doesn't exist yet
  (when (not (directory-exists? (build-path "Versions")))
      (make-directory (build-path "Versions")))

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

  (define (find-dl-size url)
    (local-require net/http-easy)

    (/
    (string->number (bytes->string/utf-8 (response-headers-ref (head url) 'Content-Length)))
    1000000))

  (define (dl from to [size-in-megabytes (find-dl-size from)] #:on-progress progress-function)
    (local-require net/url)

    (delete-directory/files #:must-exist? #f to)

    (define the-url (string->url from))
    (define in (get-pure-port the-url))
    (define out (open-output-file to))

    (thread (λ () (listen-for-progress in 0 size-in-megabytes progress-function)))
    
    (copy-port in out)
    
    (close-output-port out))

  (define (listen-for-progress in last-percent-complete total-metabytes progress-function)
    (sync (port-progress-evt in))
    (unless (port-closed? in)
      (define-values [line col pos] (port-next-location in))
      ;pos is the byte position

      (define percent-complete (* 100 (exact->inexact (/ pos (* total-metabytes 1000000)))))

      (if (> percent-complete (+ 1 last-percent-complete))
          (begin
            (progress-function (min percent-complete 100))
            (listen-for-progress in percent-complete total-metabytes progress-function))
          (listen-for-progress in last-percent-complete total-metabytes progress-function))))

  (define (download-latest-version! progress-function)
    (define install-location (~a "Versions/" (latest-version) ".zip"))
    (define download-from-location 
      (~a "https://codespells-org.s3.amazonaws.com/Nexus/Versions/" (latest-version) ".zip"))

    (dl download-from-location install-location #:on-progress progress-function)
    (send msg set-label "Unzipping...")
    (unzip install-location)
    (sleep 1) ;there may be a race condition between
    ;unzip and the rename, so we've added the sleep
    ;here to manage that problem. We're not certain
    ;that is what sometimes causes the following
    ;rename operation to fail with an access
    ;denied error. It happened once & we are confused
    (rename-file-or-directory 
      (build-path (latest-version)) 
      (build-path "Versions" (latest-version)))
    (send msg set-label "Complete!")

    (update-local-latest-version!)

    (play-button))

  ;Downloads latest version (puts it in Versions folder) 
  ;& updates the latest-version file
  (define (update-button)
    (define but 
      (new button% [parent a-panel]
                   [label "Download Latest Version"]
                   [callback (lambda (button event)
                                (send msg set-label "Downloading...")
                                (send but enable #f)
                                (thread (thunk (download-latest-version! 
                                  (lambda (percent)
                                    (send msg set-label (~a (floor percent) "% Complete")))))) 
                                ; Needs to switch button over to PLAY button
                                )]))
    but)

  (define (play-button)
    (new button% [parent a-panel]
                  [label "Play the Game"]
                  [callback (lambda (button event)
                                (send msg set-label "Launching...")
                                (system (~a "cd Versions/" (get-local-latest-version) " && main.exe"))
                                )]))

  ;TODO: What if this fails? How to report errors to user
  ;Fetch from the internet what the latest version is
  (define (latest-version)        
    (define res
      (get "https://codespells-org.s3.amazonaws.com/Nexus/Versions/latest-version" #:stream? #t))
    (define body 
      (response-body res))
    (string-trim (bytes->string/utf-8 body))  
  )

  (define latest-version-file-path 
      (build-path "Versions" "latest-version"))

  ;Check latest version against local version
  (define (latest-version? str)
    (string=? str (latest-version)))

  (define (get-local-latest-version)
    (if (file-exists? latest-version-file-path)
      (string-trim (file->string latest-version-file-path))
      "No versions installed"))

(define (update-local-latest-version!)
  (with-output-to-file latest-version-file-path
    #:exists 'replace
    (lambda () 
      (printf (latest-version)))))

  ; Check to see if there's anything installed
  ; If not, download latest version and put in Versions folder
  (void (if (not (latest-version? (get-local-latest-version)))
      (let () 
        (send msg set-label "New version available")
        (update-button))
      (let ()
        (send msg set-label "Up-to-date!")
        (play-button)))
  )
  ; check to see if it's version is current
  ; If not, update! If it is, offer a Lunch button. 
)
