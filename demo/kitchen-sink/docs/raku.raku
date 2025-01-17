=begin comment
Raku example for ace
=end comment
class Cook is Employee {
    has @.utensils  is rw;
    has @.cookbooks is rw;

    method cook( $food ) {
        say "Cooking $food";
    }

    method clean_utensils {
        say "Cleaning $_" for @.utensils;
    }
}

class Baker is Cook {
    method cook( $confection ) {
        say "Baking a tasty $confection";
    }
}

my $cook = Cook.new(
    utensils => <spoon ladle knife pan>,
    cookbooks => 'The Joy of Cooking',
    salary => 40000);

$cook.cook( 'pizza' );       # OUTPUT: «Cooking pizza␤»
say $cook.utensils.perl;     # OUTPUT: «["spoon", "ladle", "knife", "pan"]␤»
say $cook.cookbooks.perl;    # OUTPUT: «["The Joy of Cooking"]␤»
say $cook.salary;            # OUTPUT: «40000␤»

my $baker = Baker.new(
    utensils => 'self cleaning oven',
    cookbooks => "The Baker's Apprentice",
    salary => 50000);

$baker.cook('brioche');      # OUTPUT: «Baking a tasty brioche␤»
say $baker.utensils.perl;    # OUTPUT: «["self cleaning oven"]␤»
say $baker.cookbooks.perl;   # OUTPUT: «["The Baker's Apprentice"]␤»
say $baker.salary;           # OUTPUT: «50000␤»
