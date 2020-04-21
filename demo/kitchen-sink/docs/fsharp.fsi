(* fsharp (* example *) *)
module Test =
    let (*) x y = (x + y)
    let func1 x = 
        if x < 100 then
            x*x
        else
            x*x + 1
    let list = (-1, 42) :: [ for i in 0 .. 99 -> (i, func1(i)) ]
    let verbatim = @"c:\Program "" Files\"
    let trippleQuote = """ "hello world" """
    
    // print
    printfn "The table of squares from 0 to 99 is:\n%A" list