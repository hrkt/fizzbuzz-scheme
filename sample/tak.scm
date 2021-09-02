(define (tak x y z)
   (if (<= x y) z
     (tak (tak (- x 1) y z) (tak (- y 1) z x) (tak (- z 1) x y))))
(display (tak 15 10 0)) ; it tooks 10.8s on Core i3 6006 at v0.1.5, while gauche runs it 0.4s

