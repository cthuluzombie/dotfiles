;;; esh-help-autoloads.el --- automatically extracted autoloads
;;
;;; Code:


;;;### (autoloads nil "esh-help" "esh-help.el" (0 0 0 0))
;;; Generated autoloads from esh-help.el

(autoload 'setup-esh-help-eldoc "esh-help" "\
Setup eldoc function for Eshell." t nil)

(autoload 'esh-help-run-help "esh-help" "\
Show help for the pointed command or functions CMD.
It comes from Zsh.

\(fn CMD)" t nil)

(if (fboundp 'register-definition-prefixes) (register-definition-prefixes "esh-help" '("esh-help-")))

;;;***

(provide 'esh-help-autoloads)
;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; coding: utf-8
;; End:
;;; esh-help-autoloads.el ends here
