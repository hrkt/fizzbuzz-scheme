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



; (define char-ci=?
;     (lambda (char1 char2)
;         (char=?
;             (char-upcase char1)
;             (char-upcase char2))))
