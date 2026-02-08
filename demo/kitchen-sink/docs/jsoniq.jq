(: Single line comment :)

(:
 : Multi-line comment block
 : JSONiq uses XQuery-style comments
 :)

let $string := "Hello, JSONiq!"
let $number := 42
let $decimal := 3.14159
let $scientific := 1.5e10
let $boolean_true := true

let $person := {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "active": true,
    "balance": 1250.50,
    "metadata": null
}

let $result :=
    for $i in 1 to 10
    let $squared := $i * $i
    where $i mod 2 eq 0
    order by $squared descending
    return { "number": $i, "squared": $squared }

let $admins :=
    for $user in $data.users[]
    where $user.roles[] = "admin"
    order by $user.name ascending
    return $user.name

(: Conditional Expressions :)
let $status :=
    if ($person.age >= 18)
    then "adult"
    else "minor"

let $tier :=
    if ($person.balance >= 1000) then "gold"
    else if ($person.balance >= 500) then "silver"
    else "bronze"

(: Quantified Expressions :)
let $has_admin :=
    some $user in $data.users[]
    satisfies $user.roles[] = "admin"

let $all_active :=
    every $user in $data.users[]
    satisfies exists($user.name)

(: Type Expressions :)
let $typed_value := 42 cast as string
let $check := $person.name instance of string
let $treated := $number treat as integer

let $eq := 5 eq 5
let $ne := 5 ne 3
let $lt := 3 lt 5
let $le := 3 le 5
let $gt := 5 gt 3
let $ge := 5 ge 3

let $concat := "Hello" || " " || "World"
let $contains := contains("JSONiq", "JSON")
let $substring := substring("Hello World", 1, 5)
let $upper := upper-case("hello")
let $lower := lower-case("HELLO")
let $length := string-length("JSONiq")

(: User-Defined Function :)
declare function local:greet($name as string) as string {
    "Hello, " || $name || "!"
};

declare function local:factorial($n as integer) as integer {
    if ($n le 1)
    then 1
    else $n * local:factorial($n - 1)
};

declare function local:filter-by-age($users, $min-age as integer) {
    for $user in $users[]
    where $user.age >= $min-age
    return $user
};

return {
    "greeting": local:greet("World"),
    "factorial_5": local:factorial(5),
    "admins": $admins,
    "status": $status,
    "tier": $tier,
    "has_admin": $has_admin,
    "grouped": $grouped
}