#lang racket

(require "../web-ui.rkt"
         racket/runtime-path)

(define-runtime-path unreal-build "0.0-world")

;Delete webcache/Cache folder so that Unreal Browser fetches any website updates
(delete-directory/files 
    #:must-exist? #f
    (build-path unreal-build "Voxels" "Saved" "webcache" "Cache"))

(void (thread (thunk (with-output-to-string (thunk (start-ui))))))

;(void (system (~a unreal-build "/main.exe")))

(define-values (sp out in err)
    (subprocess #f #f #f (~a unreal-build "/main.exe")))
;;; (printf "stdout:\n~a" (port->string out))
;;; (printf "stderr:\n~a" (port->string err))
(close-input-port out)
(close-output-port in)
(close-input-port err)
(subprocess-wait sp)

;(subprocess-wait s)

;;; (let loop ()
;;;     (sleep 10000)
;;;     (loop))
