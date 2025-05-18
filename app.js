/*
https://en.wikipedia.org/wiki/Peano_axioms

1. 0 is a natural number.
2. For every natural number x, x = x. That is, equality is reflexive.
3. For all natural numbers x and y, if x = y, then y = x. That is, equality is symmetric.
4. For all natural numbers x, y and z, if x = y and y = z, then x = z. That is, equality is transitive.
5. For all a and b, if b is a natural number and a = b, then a is also a natural number. That is, the natural numbers are closed under equality.
6. For every natural number n, S(n) is a natural number. That is, the natural numbers are closed under S.
7. For all natural numbers m and n, if S(m) = S(n), then m = n. That is, S is an injection.
8. For every natural number n, S(n) = 0 is false. That is, there is no natural number whose successor is 0.
*/

// boolean definitions to help us with test cases
const TRUE = (a) => (_) => a;
const FALSE = (_) => (b) => b;
const IF = (s) => (t) => (f) => s(t)(f);

// lambda calculus is too abstract. we're going to cheat a little so we see the results
const test_truth = (title, s) => console.log(IF(s)("√")("X"), title);
const test_false = (title, s) => console.log(IF(s)("X")("√"), title);

const NOT = (s) => s(FALSE)(TRUE);
const XOR = (a) => (b) => a(NOT(b))(b);
const OR = (a) => (b) => a(TRUE)(b);

// defining our first data structure
const TUPLE = (a) => (b) => (c) => c(a)(b);
const FIRST = (t) => t(TRUE);
const SECOND = (t) => t(FALSE);

// defining zero
const ZERO = TUPLE(TRUE)(TRUE);
const IS_ZERO = (n) => FIRST(n);

// predecessor
const P = (n) => SECOND(n);

// successor
const S = (n) => TUPLE(FALSE)(n);

// another cheat here, just to simplify readability of the code. 
// improvement: use the Y-Combinator (https://medium.com/@ayanonagon/the-y-combinator-no-not-that-one-7268d8d9c46)
// "recursion" for a given "two args" function
const P_REC = (F) => (t) => (
    IF( 
        OR(IS_ZERO(FIRST(t)))(IS_ZERO(SECOND(t))) 
    )(
        FALSE
    )(
        F
    ))(P(FIRST(t)))(P(SECOND(t)));

// 2. for every natural number x, x = x. That is, equality is reflexive.
const EQUAL = (a) => (b) => IF(IS_ZERO(a))(
    IS_ZERO(b)
)(
    IF(IS_ZERO(b))(
        FALSE
    )(
        P_REC(EQUAL)(TUPLE(a)(b))
    )
);

const ADD = (a) => (b) => IF(IS_ZERO(a))(
    b
)(
    IF(IS_ZERO(b))(
        a
    )(
        P_REC(ADD)(TUPLE(a)(S(S(b))))
    )
)

const SUB = (a) => (b) => IF(IS_ZERO(a))(
    ZERO
)(
    IF(IS_ZERO(b))(
        a
    )(
        P_REC(SUB)(TUPLE(a)(b))
    )
)

const MUL = (a) => (b) => IF(IS_ZERO(a))(
    ZERO
)(
    IF(IS_ZERO(b))(
        ZERO
    )(
        IF(IS_ZERO(P(a)))(
            b
        )(
            IF(IS_ZERO(P(b)))(
                a
            )(
               ADD(a)(P_REC(MUL)(TUPLE(S(a))(b)))
            )
        )
    )
)

// For readability purposes:
const NUMBER = (n) => {
    if(n == 0) return ZERO;
    return S(NUMBER(n-1));
}

// -- TEST CASES --

// TEST ASSERTIONS
test_truth("test truth", TRUE);
test_false("test false", FALSE);

// BOOLEANS
test_truth("not FALSE => TRUE", NOT(FALSE));
test_false("not TRUE => FALSE", NOT(TRUE));

// XOR
test_false("XOR TRUE TRUE", XOR(TRUE)(TRUE));
test_truth("XOR TRUE FALSE", XOR(TRUE)(FALSE));
test_truth("XOR FALSE TRUE", XOR(FALSE)(TRUE));
test_false("XOR FALSE FALSE", XOR(FALSE)(FALSE));

// OR
test_truth("OR TRUE TRUE", OR(TRUE)(TRUE));
test_truth("OR TRUE FALSE", OR(TRUE)(FALSE));
test_truth("OR FALSE TRUE", OR(FALSE)(TRUE));
test_false("OR FALSE FALSE", OR(FALSE)(FALSE));

// TUPLE
test_truth("first of (true, false) is true", FIRST(TUPLE(TRUE)(FALSE)));
test_false("second of (true, false) is false", SECOND(TUPLE(TRUE)(FALSE)));

// ZERO and IS_ZERO
test_truth("zero is zero", IS_ZERO(ZERO));
test_truth("zero equals zero", EQUAL(ZERO)(ZERO));

// 6. For every natural number n, S(n) is a natural number. That is, the natural numbers are closed under S.
// 7. For all natural numbers m and n, if S(m) = S(n), then m = n. That is, S is an injection.
test_truth("S(0) == S(0)", EQUAL(S(ZERO))(S(ZERO)));
test_truth("S(S(0)) == S(S(0))", EQUAL(S(S(ZERO)))(S(S(ZERO))));

// 8. For every natural number n, S(n) = 0 is false. That is, there is no natural number whose successor is 0.
test_false("S(0) != 0", EQUAL(S(ZERO))(ZERO));

/*
    Should S(S(0)) == S(0) be true?
    - let's consider that this is true
    - let's assume S(0) = n
    - so, S(n) = n
    - considering axiom 6, we can say that n is a natural number
    - now, let's apply axiom 7
    - if "n = S(0)"", and "S(n) = n", then we can say that "S(n) = S(0)"
    - if we apply axiom 8, we can say "n == 0"
    - replacing n one more time, we have "S(0) == 0"
    - if that's is true, we break axiom 8
*/
test_false("S(S(0)) != S(0)", EQUAL(S(S(ZERO)))(S(ZERO)));
test_false("S(S(S(0))) != S(S(0))", EQUAL(S(S(ZERO)))(S(ZERO)));

// NUMBER
const N0 = NUMBER(0);
const N1 = NUMBER(1);
const N2 = NUMBER(2);
const N3 = NUMBER(3);
const N4 = NUMBER(4);
const N5 = NUMBER(5);
const N6 = NUMBER(6);

test_truth("number 0 is zero", IS_ZERO(N0));
test_truth("number 1 == S(0)", EQUAL(N1)(S(ZERO)));
test_truth("number 1 == number 1", EQUAL(N1)(N1));
test_truth("number 2 == S(S(0))", EQUAL(N2)(S(S(ZERO))));
test_false("number 2 != S(0)", EQUAL(N2)(S(ZERO)));
test_false("number 2 != number 1", EQUAL(N2)(N1));

// ADDITION
test_truth("0 + 0 == 0", EQUAL(N0)(ADD(N0)(N0)));
test_truth("1 + 0 == 1", EQUAL(N1)(ADD(N1)(N0)));
test_truth("3 + 2 == 5", EQUAL(N5)(ADD(N3)(N2)));

// SUBTRACTION
test_truth("0 - 0 == 0", EQUAL(N0)(SUB(N0)(N0)));
test_truth("1 - 0 == 1", EQUAL(N1)(SUB(N1)(N0)));
test_truth("4 - 2 == 2", EQUAL(N2)(SUB(N4)(N2)));
// for simplicity, we're going to assume that 0 - n = 0
test_truth("0 - 1 == 0", EQUAL(N0)(SUB(N0)(N1)));
test_truth("1 - 3 == 0", EQUAL(N0)(SUB(N1)(N3)));

// MULTIPLICATION
test_truth("0 * 0 == 0", EQUAL(N0)(MUL(N0)(N0)));
test_truth("5 * 0 == 0", EQUAL(N0)(MUL(N5)(N0)));
test_truth("0 * 5 == 0", EQUAL(N0)(MUL(N0)(N5)));
test_truth("1 * 4 == 4", EQUAL(N4)(MUL(N1)(N4)));
test_truth("4 * 1 == 4", EQUAL(N4)(MUL(N4)(N1)));
test_truth("2 * 3 == 6", EQUAL(N6)(MUL(N2)(N3)));