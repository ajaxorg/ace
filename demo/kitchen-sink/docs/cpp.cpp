// compound assignment operators

#include <iostream>
using namespace std;

int main ()
{
    int a, b=3; /* foobar */
    a = b;
    a+=2; // equivalent to a=a+2
    cout << a;
    return 0;
}