;(define (fib n)
;  (if (< n 2)
;    n
;    (+ (fib (- n 2)) (fib (- n 1)))))

(define fib (lambda (n) (if (< n 2)
    n
    (+ (fib (- n 2)) (fib (- n 1))))))

