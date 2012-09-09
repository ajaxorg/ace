@protocol Printing: someParent
-(void) print;
@end

@interface Fraction: NSObject <Printing, NSCopying> {
    int numerator;
    int denominator;
}
@end

@"blah" @"asd\d" @"\fawn\\"