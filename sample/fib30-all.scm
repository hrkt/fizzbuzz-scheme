(define (fib n) (if (< n 2)
    n
    (+ (fib (- n 2)) (fib (- n 1)))))
(write (fib 30))
(newline)
;(exit)