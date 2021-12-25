; basic procedures
;
; some procedures are brought from r5rs directly (see comments).

(define first car)
(define negative? (lambda (x) (if (< x 0) #t #f)))
(define zero? (lambda (x) (if (= x 0) #t #f)))

(define char-lower-case?
    (lambda (x)
        (if (and
            (char? x)
            (and
                (>= (char->integer x) 97))
                (<= (char->integer x) 122))
            #t #f)))

(define char-upper-case?
    (lambda (x)
        (if (and
            (char? x)
            (and
                (>= (char->integer x) 65))
                (<= (char->integer x) 90))
            #t #f)))

(define char-whitespace?
    (lambda (x)
        (if (and
            (char? x)
            (= (char->integer x) 32))
            #t #f)))

(define char-alphabetic?
    (lambda (x)
        (if (or
            (char-lower-case? x)
            (char-upper-case? x))
            #t #f)))

(define char-numeric?
    (lambda (x)
        (if (and
            (char? x)
            (and
                (>= (char->integer x) 48))
                (<= (char->integer x) 57))
            #t #f)))

(define char-upcase
    (lambda (x)
        (if (char-lower-case? x)
            (integer->char (- (char->integer x) 32))
            x)))

(define char-downcase
    (lambda (x)
        (if (char-upper-case? x)
            (integer->char (+ (char->integer x) 32))
            x)))

(define char-ci=?
    (lambda (char1 char2)
        (char=?
            (char-upcase char1)
            (char-upcase char2))))

(define char-ci<?
    (lambda (char1 char2)
        (char<?
            (char-upcase char1)
            (char-upcase char2))))

(define char-ci<=?
    (lambda (char1 char2)
        (char<=?
            (char-upcase char1)
            (char-upcase char2))))

(define char-ci>?
    (lambda (char1 char2)
        (char>?
            (char-upcase char1)
            (char-upcase char2))))

(define char-ci>=?
    (lambda (char1 char2)
        (char>=?
            (char-upcase char1)
            (char-upcase char2))))

(define caar (lambda (x) (car (car x))))
(define cadr (lambda (x) (car (cdr x))))
(define cdar (lambda (x) (cdr (car x))))
(define cddr (lambda (x) (cdr (cdr x))))

(define caaar (lambda (x) (car (car (car x)))))
(define caadr (lambda (x) (car (car (cdr x)))))
(define cadar (lambda (x) (car (cdr (car x)))))
(define caddr (lambda (x) (car (cdr (cdr x)))))
(define cdaar (lambda (x) (cdr (car (car x)))))
(define cdadr (lambda (x) (cdr (car (cdr x)))))
(define cddar (lambda (x) (cdr (cdr (car x)))))
(define cdddr (lambda (x) (cdr (cdr (cdr x)))))

(define caaaar (lambda (x) (car (car (car (car x))))))
(define caaadr (lambda (x) (car (car (car (cdr x))))))
(define caadar (lambda (x) (car (car (cdr (car x))))))
(define caaddr (lambda (x) (car (car (cdr (cdr x))))))
(define cadaar (lambda (x) (car (cdr (car (car x))))))
(define cadadr (lambda (x) (car (cdr (car (cdr x))))))
(define caddar (lambda (x) (car (cdr (cdr (car x))))))
(define cadddr (lambda (x) (car (cdr (cdr (cdr x))))))
(define cdaaar (lambda (x) (cdr (car (car (car x))))))
(define cdaadr (lambda (x) (cdr (car (car (cdr x))))))
(define cdadar (lambda (x) (cdr (car (cdr (car x))))))
(define cdaddr (lambda (x) (cdr (car (cdr (cdr x))))))
(define cddaar (lambda (x) (cdr (cdr (car (car x))))))
(define cddadr (lambda (x) (cdr (cdr (car (cdr x))))))
(define cdddar (lambda (x) (cdr (cdr (cdr (car x))))))
(define cddddr (lambda (x) (cdr (cdr (cdr (cdr x))))))

; from r5rs
(define list-tail
  (lambda (x k)
    (if (zero? k)
        x
        (list-tail (cdr x) (- k 1)))))

(define list-ref
  (lambda (x k)
    (if (zero? k)
        (car x)
        (list-ref (cdr x) (- k 1)))))

(define memq
  (lambda (key x)
    (if (null? x)
        #f
        (if (eq? key (car x))
            x
            (memq key (cdr x))))))

(define memv
  (lambda (key x)
    (if (null? x)
        #f
        (if (eqv? key (car x))
            x
            (memv key (cdr x))))))

(define member
  (lambda (key x)
    (if (null? x)
        #f
        (if (equal? key (car x))
            x
            (member key (cdr x))))))

(define assq
  (lambda (key x)
    (if (null? x)
        #f
        (if (eq? key (car (car x)))
            (car x)
            (assq key (cdr x))))))

(define assv
  (lambda (key x)
    (if (null? x)
        #f
        (if (eqv? key (car (car x)))
            (car x)
            (assv key (cdr x))))))

(define assoc
  (lambda (key x)
    (if (null? x)
        #f
        (if (equal? key (car (car x)))
            (car x)
            (assoc key (cdr x))))))

; string=?
; (define string=?-internal (lambda (x y i length)
;     (if (= i length)
;         #t
;         (if (not (eq? (string-ref x i) (string-ref y i)))
;             #f
;             (string=?-internal x y (+ i 1) length)
;     ))))

; (define string=?-2arg (lambda (x y)
;     (if (not (= (string-length x) (string-length y)))
;         #f
;         (string=?-internal x y 0 (string-length x))
;     )))


(define string-comp-internal (lambda (f x y i length)
    (if (= i length)
        #t
        (if (not (apply f (list (string-ref x i) (string-ref y i))))
            #f
            (string-comp-internal f x y (+ i 1) length)
    ))))

(define string-comp-2arg (lambda (f x y)
    (if (not (= (string-length x) (string-length y)))
        #f
        (string-comp-internal f x y 0 (string-length x))
    )))

(define string=? (lambda (a b . c)
    (if (and
        (string-comp-2arg char=? a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string=? b (car c))))))

(define string-ci=? (lambda (a b . c)
    (if (and
        (string-comp-2arg char-ci=? a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string-ci=? b (car c))))))

; string-compare-order

(define string-comp-order-internal (lambda (f acceptEqual l<r x y lx ly i)
        (if (or
                (and (> i lx) (= lx ly) acceptEqual)
                (and (> i lx) (< lx ly) l<r)
                (and (> i ly) (> lx ly) (not l<r))
                )
            #t
            (if (or
                (and (> i lx) (not acceptEqual) l<r)
                (and (> i lx) (not acceptEqual) (not l<r))
                (and (> i lx) acceptEqual (not l<r))
                )
                    #f
                    (if (eq? (string-ref x i) (string-ref y i))
                        (string-comp-order-internal f acceptEqual l<r x y lx ly (+ i 1))
                        (if (apply f (list (string-ref x i) (string-ref y i)))
                            #t
                            #f))))))

(define string-comp-order-2arg (lambda (f acceptEqual l<r x y)
        (string-comp-order-internal
            f acceptEqual l<r x y (- (string-length x) 1) (- (string-length y) 1) 0)
    ))

; string order

(define string<? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char<? #f #t a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string<? b (car c))))))


(define string<=? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char<=? #t #t a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string<=? b (car c))))))

(define string>? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char>? #f #f a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string>? b (car c))))))

(define string>=? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char>=? #t #f a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string>=? b (car c))))))

; string-ci order

(define string-ci<? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char-ci<? #f #t a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string-ci<? b (car c))))))


(define string-ci<=? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char-ci<=? #t #t a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string-ci<=? b (car c))))))

(define string-ci>? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char-ci>? #f #f a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string-ci>? b (car c))))))

(define string-ci>=? (lambda (a b . c)
    (if (and
        (string-comp-order-2arg char-ci>=? #t #f a b)
        (null? c))
        #t
        (if (null? c)
            #f
            (string-ci>=? b (car c))))))

; (define substring-inner (lambda (string start end buf i)
;     (if (= i (- end start))
;         buf
;         (string-set! buf i (string-ref string (+ i start)))
;         (substring-inner string start end buf (+ i 1)))
;         buf)

; (define substring2 (lambda (string start end)
;     (let ((buf (make-string (- end start))))
;         (substring-inner string start end buf 0))))

(define write-char (lambda (c . port)
    (if (null? port)
        (display (string c))
        (display (string c) (car port)))))

(define scheme-report-environment (lambda (version)
    (if (not (eq? 5 version))
        (raise "only 5 is permitted here.")
        ()
        )))

(define null-environment (lambda (version)
    (if (not (eq? 5 version))
        (raise "only 5 is permitted here.")
        ()
        )))
