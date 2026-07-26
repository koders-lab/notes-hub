---
publish: true
title: Second-Highest Value (classic SQL question)
tags:
  - rdbms
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - "Find the 2nd highest salary" — know **3 ways**: subquery MAX, `LIMIT/OFFSET`, and window function `DENSE_RANK()`.
> - The trap: **duplicates** and **NULL when there's no 2nd** — `DENSE_RANK` handles ties correctly.

## Approach 1 — subquery with MAX (works everywhere)

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

"The max salary that is less than the overall max." Simple, returns NULL if there's no second. Handles duplicate top salaries correctly (they're all excluded by `< max`).

## Approach 2 — LIMIT / OFFSET (MySQL/Postgres)

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;     -- skip the 1st, take the next
```

Use `DISTINCT` so duplicate top salaries don't make OFFSET land on the same value. (Oracle: `FETCH FIRST 1 ROWS ONLY OFFSET 1 ROWS`.)

## Approach 3 — window function DENSE\_RANK (best, handles ties, generalizes to Nth)

```sql
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) t
WHERE rnk = 2;
```

- **`DENSE_RANK`** gives ties the **same** rank with **no gaps** (1,1,2) — so "2nd highest distinct salary" is correct even with duplicates.
- Change `= 2` to `= N` for the **Nth** highest — this is why it's the interview-preferred answer.
- Contrast: `RANK()` leaves gaps after ties (1,1,3); `ROW_NUMBER()` gives unique numbers (1,2,3) ignoring ties.

## Interview points

- If asked "what if two people share the top salary?" → subquery-MAX and DENSE\_RANK handle it; naive OFFSET without DISTINCT breaks.
- "What if there's no second highest?" → returns NULL / no row.
- Generalize: DENSE\_RANK for Nth-highest is the clean, scalable answer.

## Test Yourself

Three ways to find 2nd highest salary?::(1) MAX where salary < (SELECT MAX...); (2) ORDER BY DESC LIMIT 1 OFFSET 1 with DISTINCT; (3) DENSE\_RANK() window, filter rnk=2.
Why DENSE\_RANK over ROW\_NUMBER for 'Nth highest'?::DENSE\_RANK gives ties the same rank with no gaps, so duplicates are handled; ROW\_NUMBER would give distinct numbers ignoring ties.
How to generalize to Nth highest?::Use DENSE\_RANK() OVER (ORDER BY salary DESC) and filter rnk = N.
