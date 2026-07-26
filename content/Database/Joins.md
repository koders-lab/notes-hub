---
publish: true
title: SQL Joins
tags:
  - rdbms
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **INNER** = only matching rows. **LEFT** = all left + matches. **RIGHT** = all right + matches. **FULL** = all rows both sides. **CROSS** = every combination.
> - **Self join** = a table joined to itself. Non-matches show as **NULL** (in outer joins).

## The joins

| Join | Returns |
|---|---|
| **INNER JOIN** | only rows with a match in **both** tables |
| **LEFT (OUTER) JOIN** | **all** rows from left + matching right (NULLs where no match) |
| **RIGHT (OUTER) JOIN** | all rows from right + matching left (NULLs where no match) |
| **FULL (OUTER) JOIN** | all rows from **both** (NULLs where either side missing) |
| **CROSS JOIN** | Cartesian product — every left row × every right row |
| **SELF JOIN** | table joined to itself (e.g. employee → manager in same table) |

## Examples

```sql
-- INNER: customers who have orders
SELECT c.name, o.id
FROM customers c
JOIN orders o ON o.customer_id = c.id;

-- LEFT: ALL customers, even those with no orders (order cols NULL)
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;

-- SELF: each employee with their manager's name
SELECT e.name AS emp, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

## Interview points

- **INNER vs LEFT** is the most-asked distinction: LEFT keeps unmatched left rows (as NULLs); INNER drops them.
- Joins on **indexed** columns (usually the foreign key) are fast; joining on unindexed columns → full scans.
- **N+1 problem** (ORM): fetching a list then a query per row — fix with a join / `JOIN FETCH` / batch.

## Test Yourself

INNER vs LEFT JOIN?::INNER returns only matching rows in both tables; LEFT returns all left rows plus matches (NULLs where the right has no match).
What is a self join?::A table joined to itself — e.g. employee joined to manager in the same table.
What is a CROSS JOIN?::Cartesian product — every row of one table combined with every row of the other.
Why join on indexed columns?::Joins on indexed (usually FK) columns avoid full scans and are much faster.
