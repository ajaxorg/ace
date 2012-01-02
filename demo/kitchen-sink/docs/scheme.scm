#|
  Multi line comment.
|#
#;((
    s-expression
    comment
  ))

;; characters
#\a	
#\A	
#\newline
  
;; strings
"oneliner"
"multi-
liner"

;; datum
'(list)
#(vector)
#vu8(bytevector)
`(quasiqoute)
,(unqoute)
`@(splice)

;; numbers
1.231
332+2i
-2.5
-2.521+0.0i
2/2
2/1+1i
+nan.0+0i
-nan.0
+inf.0
-inf.0
0xFFF

(define #| Cons! |# (cons x y)
  (define (set-x! v) (set! x v))
  (define (set-y! v) (set! y v))
  (define (dispatch m)
    (cond ((eq? m 'car) x)
          ((eq? m 'cdr) y)
          ((eq? m 'set-car!) set-x!)
          ((eq? m 'set-cdr!) set-y!)
          (else (error "Undefined operation — CONS" m))))
  dispatch)
(define (car z) (z 'car))
(define (cdr z) (z 'cdr))
(define (set-car! z new-value)
  ((z 'set-car!) new-value)
  z)
(define (set-cdr! z new-value)
  ((z 'set-cdr!) new-value)
  z)

(define (analyze-assignment exp)
  (let ((var (assignment-variable exp))
        (vproc (analyze (assignment-value exp))))
    (lambda (env succeed fail)
      (vproc env
             (lambda (val fail)         ; *1*
               (let ((old-value
                      (lookup-variable-value var env))) 
                 (set-variable-value! var val env)
                 (succeed 'ok
                          (lambda ()    ; *2*
                            (set-variable-value! var
                                                 old-value
                                                 env)
                            (fail)))))
             fail))))