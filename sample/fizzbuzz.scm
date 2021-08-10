; (define fb
; 	(lambda (x) 
; 		(if 
; 			(and (= (mod x 3) 0) (= (mod x 5) 0))
; 			"fizzbuzz"
; 			(if
; 				(= (mod x 3) 0)
; 				"fizz"
; 				(if
; 					(= (mod x 5) 0)
; 					"buzz"
; 					x
; 				)
; 			)
; 		)
; 	)
; )
; (define fizzbuzz (lambda (x) (display (fb x))))

(define (fb x)
	(if
		(and (= (mod x 3) 0) (= (mod x 5) 0))
		"fizzbuzz"
		(if
			(= (mod x 3) 0)
			"fizz"
			(if
				(= (mod x 5) 0)
				"buzz"
				x
			)
		)
	)
)
(define (fizzbuzz x) (display (fb x)))
