(do 
  (
    ( vec (make-vector 5)  ) (i 0 (+ i 1))
  )



  ((= i 5) vec)

  (vector-set! vec i i)
)



(do (
    
    (vec (make-vector 5))

    (i 0 (+ i 1))
     
    )

  ; test
  ((= i 5) vec)

  ; command
  (vector-set! vec i i)
  
  ) 
