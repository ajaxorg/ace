use core::rand::RngUtil;

fn main() {
    for ["Alice", "Bob", "Carol"].each |&name| {
        do spawn {
            let v = rand::Rng().shuffle([1, 2, 3]);
            for v.each |&num| {
                print(fmt!("%s says: '%d'\n", name, num + 1))
            }
        }
    }
}

fn map<T, U>(vector: &[T], function: &fn(v: &T) -> U) -> ~[U] {
    let mut accumulator = ~[];
    for vec::each(vector) |element| {
        accumulator.push(function(element));
    }
    return accumulator;
}

struct ConstGenericStruct<const N: usize>([(); N]);
// T constrains by being an argument to GenericTrait.
impl<T> GenericTrait<T> for i32 { /* ... */ }

// T constrains by being an arguement to GenericStruct
impl<T> Trait for GenericStruct<T> { /* ... */ }

// Likewise, N constrains by being an argument to ConstGenericStruct
impl<const N: usize> Trait for ConstGenericStruct<N> { /* ... */ }

// T constrains by being in an associated type in a bound for type `U` which is
// itself a generic parameter constraining the trait.
impl<T, U> GenericTrait<U> for u32 where U: HasAssocType<Ty = T> { /* ... */ }

// Like previous, except the type is `(U, isize)`. `U` appears inside the type
// that includes `T`, and is not the type itself.
impl<T, U> GenericStruct<U> where (U, isize): HasAssocType<Ty = T> { /* ... */ }

//!  - Inner line doc
//!! - Still an inner line doc (but with a bang at the beginning)

/*!  - Inner block doc */
/*!! - Still an inner block doc (but with a bang at the beginning) */

/**  - Outer block doc (exactly) 2 asterisks */

macro_rules! mac_variant {
    ($vis:vis $name:ident) => {
        enum $name {
            $vis Unit,

            $vis Tuple(u8, u16),

            $vis Struct { f: u8 },
        }
    }
}