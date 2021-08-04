(define fb
	(lambda (x) 
		(if 
			(and (= (mod x 3) 0) (= (mod x 5) 0))
			(quote fizzbuzz)
			(if
				(= (mod x 3) 0)
				(quote fizz)
				(if
					(= (mod x 5) 0)
					(quote buzz)
					x
				)
			)
		)
	)
)