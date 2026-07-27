---
publish: true
title: Hibernate / JPA — Interview Refresher
tags:
  - java
  - hibernate
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. JPA = the spec; Hibernate = the implementation.

> [!question]- JPA vs Hibernate?
> **JPA** is the specification (interfaces/annotations); **Hibernate** is the most common implementation (the ORM engine).

> [!question]- Entity lifecycle states?
> **Transient** (new, not tracked) → **Persistent/Managed** (attached to a session, changes auto-flushed) → **Detached** (session closed) → **Removed** (marked for delete).

> [!question]- Lazy vs Eager loading?
> **Lazy** = load the association only when accessed (default for collections). **Eager** = load immediately. Prefer lazy; eager causes over-fetching.

> [!warning]- The N+1 problem (they WILL ask)
> Fetching a list (1 query) then a query **per row** for its association = N+1 queries. **Fix:** `JOIN FETCH`, `@EntityGraph`, or batch fetching. Classic performance killer.

> [!question]- LazyInitializationException?
> Accessing a lazy association **after the session closed** (e.g. in the view layer). Fix: fetch within the transaction, use a DTO, or `JOIN FETCH`.

> [!question]- first vs second level cache?
> **L1** = session-scoped (always on). **L2** = SessionFactory-scoped, shared across sessions (opt-in, e.g. Ehcache).

> [!question]- save vs persist vs merge vs saveOrUpdate?
> `persist` (transient→managed, no return), `save` (Hibernate, returns id), `merge` (detached→managed copy), `saveOrUpdate` (insert or update by id).

## Drill cards

JPA vs Hibernate?::JPA = specification; Hibernate = an implementation of it.
N+1 problem + fix?::One query for the list, then one per row for its association. Fix with JOIN FETCH / @EntityGraph / batch fetching.
Lazy vs eager?::Lazy loads on access (preferred); eager loads immediately (over-fetch risk).
Entity states?::Transient → Persistent(managed) → Detached → Removed.
L1 vs L2 cache?::L1 = session-scoped (always on); L2 = SessionFactory-scoped, shared, opt-in.
