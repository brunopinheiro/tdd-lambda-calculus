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

test_truth("test truth", TRUE);
test_false("test false", FALSE);

const NOT = (s) => s(FALSE)(TRUE);

test_truth("not FALSE => TRUE", NOT(FALSE));
test_false("not TRUE => FALSE", NOT(TRUE));

const XOR = (a) => (b) => a(NOT(b))(b);

test_false("XOR TRUE TRUE", XOR(TRUE)(TRUE));
test_truth("XOR TRUE FALSE", XOR(TRUE)(FALSE));
test_truth("XOR FALSE TRUE", XOR(FALSE)(TRUE));
test_false("XOR FALSE FALSE", XOR(FALSE)(FALSE));

const OR = (a) => (b) => a(TRUE)(b);

test_truth("OR TRUE TRUE", OR(TRUE)(TRUE));
test_truth("OR TRUE FALSE", OR(TRUE)(FALSE));
test_truth("OR FALSE TRUE", OR(FALSE)(TRUE));
test_false("OR FALSE FALSE", OR(FALSE)(FALSE));

// defining our first data structure
const TUPLE = (a) => (b) => (c) => c(a)(b);
const FIRST = (t) => t(TRUE);
const SECOND = (t) => t(FALSE);

test_truth("first of (true, false) is true", FIRST(TUPLE(TRUE)(FALSE)));
test_false("second of (true, false) is false", SECOND(TUPLE(TRUE)(FALSE)));


// defining zero
const ZERO = TUPLE(TRUE)(TRUE);
const IS_ZERO = (n) => FIRST(n);

test_truth("zero is zero", IS_ZERO(ZERO));

// predecessor
const P = (n) => SECOND(n);

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
let EQUAL = (_) => (_) => FALSE;
EQUAL = (a) => (b) => IF(IS_ZERO(a))(
    IS_ZERO(b)
)(
    IF(IS_ZERO(b))(
        FALSE
    )(
        P_REC(EQUAL)(TUPLE(a)(b))
    )
);

test_truth("zero equals zero", EQUAL(ZERO)(ZERO));

// 6. For every natural number n, S(n) is a natural number. That is, the natural numbers are closed under S.
// 7. For all natural numbers m and n, if S(m) = S(n), then m = n. That is, S is an injection.

// successor
const S = (n) => TUPLE(FALSE)(n);

test_truth("S(0) == S(0)", EQUAL(S(ZERO))(S(ZERO)));

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