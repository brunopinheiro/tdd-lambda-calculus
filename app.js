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
const test_truth = (s) => IF(s)("√")("X");
const test_false = (s) => IF(s)("X")("√");

console.log(test_truth(TRUE), "test truth");
console.log(test_false(FALSE), "test false");

// defining zero
const ZERO = TRUE;
const IS_ZERO = (n) => n;

console.log(test_truth(IS_ZERO(ZERO)), "zero is zero");

// 2. for every natural number x, x = x. That is, equality is reflexive.
const EQUAL = (_) => (_) => TRUE;

console.log(test_truth(EQUAL(ZERO)(ZERO)), "zero equals zero");