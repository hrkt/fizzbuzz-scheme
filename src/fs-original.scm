
(define fs-ascii-1
    (lambda (i)
        (begin
        (display i)
        (display " ")
        (display (integer->char i))
        (newline)
        )))

(define fs-ascii-inner
    (lambda (x)
        (if (> x 126)
            (newline)
            (begin
                (fs-ascii-1 x)
                (fs-ascii-inner (+ x 1))))))

; show ascii table
(define fs-ascii (lambda () (fs-ascii-inner 32)))
