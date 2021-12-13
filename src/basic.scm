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

