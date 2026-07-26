---
publish: true
title: PL/SQL — Interview Refresher
tags:
  - rdbms
  - plsql
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **PL/SQL** = Oracle's procedural extension to SQL (loops, variables, exceptions). Runs **in the DB**.
> - Building blocks: **block structure** (DECLARE/BEGIN/EXCEPTION/END), **procedures/functions**, **cursors**, **triggers**, **packages**.
> - Interview favourites: procedure vs function, implicit vs explicit cursor, `%ROWTYPE`/`%TYPE`, exception handling, why packages.

## Block structure

```sql
DECLARE
  v_salary NUMBER;               -- declarations
BEGIN
  SELECT salary INTO v_salary FROM emp WHERE id = 101;   -- executable
  DBMS_OUTPUT.PUT_LINE(v_salary);
EXCEPTION
  WHEN NO_DATA_FOUND THEN        -- exception handling
    DBMS_OUTPUT.PUT_LINE('not found');
END;
```

## Procedure vs Function

| | Procedure | Function |
|---|---|---|
| Returns | via OUT params (or nothing) | **must RETURN** a value |
| Call in SQL | no | **yes** (can be used in SELECT) |
| Use | perform an action | compute and return a value |

## Cursors

- **Implicit** — Oracle opens one automatically for a single-row `SELECT ... INTO` / DML.
- **Explicit** — you declare/open/fetch/close to process **multiple rows** one at a time.

```sql
CURSOR c IS SELECT name FROM emp;
OPEN c; FETCH c INTO v_name; ... CLOSE c;
-- or a cursor FOR loop (auto open/fetch/close):
FOR rec IN (SELECT name FROM emp) LOOP
  DBMS_OUTPUT.PUT_LINE(rec.name);
END LOOP;
```

## Anchored types (avoid hardcoding)

- **`%TYPE`** — variable takes a column's type: `v_sal emp.salary%TYPE;`
- **`%ROWTYPE`** — variable is a whole row: `r emp%ROWTYPE;` → `r.salary`, `r.name`.
  Benefit: schema changes don't break your code.

## Triggers

Code that fires automatically on `INSERT/UPDATE/DELETE` (BEFORE/AFTER, row/statement level). Use for auditing, derived columns, validation. `:NEW` and `:OLD` reference the changing row.

## Packages (why)

A **package** groups related procedures/functions/variables into one unit (spec + body).

- Benefits: **encapsulation**, **reusability**, **fewer recompiles** (change body without invalidating dependents), shared state within a session.

## Common interview Qs

- **Procedure vs function** (above).
- **Implicit vs explicit cursor** (above).
- **`%TYPE` vs `%ROWTYPE`**.
- **Exception handling** — predefined (NO\_DATA\_FOUND, TOO\_MANY\_ROWS) vs user-defined (`RAISE`).
- **Why PL/SQL over SQL** — procedural logic, loops, error handling, and running logic **inside the DB** reduces round-trips.

## Test Yourself

Procedure vs function in PL/SQL?::Function must RETURN a value and can be used in SQL; procedure performs an action (OUT params), can't be called from a SELECT.
Implicit vs explicit cursor?::Implicit = auto for single-row SELECT INTO/DML; explicit = you declare/open/fetch/close to process multiple rows.
%TYPE vs %ROWTYPE?::%TYPE = a variable of one column's datatype; %ROWTYPE = a variable holding a whole row's structure.
Why use a package?::Groups related procs/functions/vars; encapsulation, reuse, fewer recompiles, shared session state.
