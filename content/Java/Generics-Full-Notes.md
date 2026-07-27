---
publish: true
title: Generics — Full Notes
tags:
  - java
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - Generics = **compile-time** type safety; erased at runtime.
> - Wildcards: `<?>` unknown · `<? extends T>` T-or-subtype (**read**) · `<? super T>` T-or-supertype (**write**).
> - **Hook:** _PECS — Producer Extends, Consumer Super._
> - Generics are **invariant**: `List<Integer>` is NOT a `List<Number>`.

## 1. Why generics

Before generics, collections held `Object` → casts everywhere, `ClassCastException` at runtime. Generics move that type-checking to **compile time**: `List<String>` can't hold an `Integer`, caught by the compiler.

## 2. The invariance gotcha (root of all confusion)

`List<Integer>` is **not** a subtype of `List<Number>`, even though `Integer` is a `Number`. If it were, you could put a `Double` into a `List<Integer>` through the `List<Number>` reference — broken. So generics are **invariant** by default. Wildcards buy back _some_ flexibility.

## 3. Wildcards

- **Unbounded `<?>`** — "some unknown type." Read-only, values come out as `Object`. Use when the type doesn't matter (e.g. `printAll(List<?> list)`).
- **Upper-bounded `<? extends T>`** — T or any **subtype**. You can **READ** items as T; you **cannot add** (compiler doesn't know the exact subtype). A **producer** of Ts.
- **Lower-bounded `<? super T>`** — T or any **supertype**. You can **ADD** a T; you can only read back as `Object`. A **consumer** of Ts.

### PECS — Producer Extends, Consumer Super

- If a structure **produces** values you read → `? extends T`.
- If a structure **consumes** values you write → `? super T`.
- Straight from the JDK: `Collections.copy(List<? super T> dest, List<? extends T> src)` — `dest` consumes (super), `src` produces (extends). Also `Comparator<? super T>`.

The trap: _why can't you `add()` to `List<? extends Number>`?_ Because it might be a `List<Integer>`; adding a `Double` would corrupt it. So `extends` lists are read-only.

## 4. Generic methods & bounded type parameters

```java
// generic method — <T> before the return type
static <T> T firstOf(List<T> list) { return list.get(0); }

// bounded type parameter — T must be Comparable
static <T extends Comparable<T>> T max(List<T> list) { ... }

// multiple bounds
static <T extends Number & Comparable<T>> T maxNum(List<T> list) { ... }
```

- `<T extends X>` in a **type parameter** = upper bound (T must be X or a subtype). Note: `extends` here works for both classes and interfaces.
- There is **no `super`** for type parameters — `super` only appears in **wildcards**.

## 5. Type erasure (the runtime truth)

Generics are a **compile-time** feature — erased after compilation. At runtime, `List<String>` and `List<Integer>` are both just `List`. Consequences:

- **No `new T[]`** — can't create a generic array (type not known at runtime).
- **No `instanceof List<String>`** — only `instanceof List<?>`.
- **No overloads differing only by generic type** — `foo(List<String>)` and `foo(List<Integer>)` clash (same erased signature).
- Casts the compiler inserts can cause **unchecked warnings**.
- **Why erasure?** Backward compatibility with pre-generics (Java 1.4) bytecode.

## 6. Common pitfalls

- **Raw types** (`List` instead of `List<String>`) — legal for back-compat, but lose all type safety. Avoid.
- **`Objects.requireNonNull` / `Objects.hash`** are generic-friendly; prefer them.
- Arrays are **covariant** (`Integer[]` IS an `Object[]`) but generics are **invariant** — mixing them is a classic source of confusion (arrays can throw `ArrayStoreException` at runtime; generics catch it at compile time).

## References

https://dev.java/learn/generics/
https://docs.oracle.com/javase/tutorial/java/index.html
https://docs.oracle.com/javase/tutorial/java/TOC.html

## Test Yourself

Why do generics exist?::Compile-time type safety — catch type errors at compile time instead of ClassCastException at runtime.
What does invariance mean for generics?::List<Integer> is NOT a List<Number>; generics don't inherit like their type args, to prevent unsafe writes.
PECS?::Producer Extends, Consumer Super. Read from `? extends T`; write to `? super T`.
Why can't you add to a List\<? extends Number>?::The compiler only knows it's some subtype of Number; adding a Double could corrupt a List<Integer>. Read-only.
What is type erasure and one consequence?::Generics are erased at runtime (List<String> → List); so no new T\[], no instanceof List<String>, no overloads by generic type. Reason: backward compatibility.
Is there a `super` bound for type parameters?::No — `super` only appears in wildcards. Type parameters use `extends` (upper bound) only.
Arrays vs generics variance?::Arrays are covariant (Integer\[] is Object\[]) and fail at runtime (ArrayStoreException); generics are invariant and fail at compile time.
