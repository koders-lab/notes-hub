---
publish: true
title: Tomcat vs Vert.x, Sessions & Stateless REST
tags:
  - java
  - concurrency
  - spring
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Tomcat = thread-per-request** (pooled). **Vert.x = event loop** (few threads, never block).
> - **Stateless** = the _server_ keeps no memory of you between requests; the **client** re-sends its identity (cookie/token) every time.
> - Your own thread-safety job starts only with **shared long-lived mutable state** (static field / mutable singleton bean).

## Tomcat — thread-per-request

A pool of N threads. Each HTTP request is assigned one pooled thread that runs your controller top-to-bottom, then returns to the pool. **All your Spring code already runs on these threads.**

- Simple to reason about; but threads are heavyweight, so concurrency is pool-capped.

## Vert.x — event loop

A few event-loop threads handle **thousands** of connections by never blocking — each does a tiny slice and hands off. Blocking work → **worker pool**. Rule: **never block the event loop** (one blocked thread stalls thousands of connections).

- Scales to huge concurrency; punishes any blocking call.

## Why user A never sees user B's data

- **Request data** arrives as **method params + locals** → each request-thread's private stack → physically isolated.
- **Session**: the framework reads the **cookie (`JSESSIONID`)** on each request and hands that request's thread the correct session object. Isolation = the framework routing the right session per cookie.

## Stateless REST — resolving the "but there's a cookie?" paradox

- **Stateless** = the _server_ holds no memory of you between requests; each request must **carry everything** needed.
- The **cookie lives on the client** and is re-sent every request — you _remind_ the server who you are each time. Server keeps no memory → still stateless.
- **No cookie?** → no session; treated as brand new. Pure REST APIs often use a **token (JWT)** in the `Authorization` header instead of a server session — same "carry identity every time" idea.

## Scaling sessions (why sticky LB / Redis)

- In-memory session lives on **one** server → with many servers behind a load balancer, request 2 might hit a server without your session.
  - **Sticky sessions** — LB pins you to the same server. Simple but fragile (server dies = session lost; uneven load).
  - **External store (Redis)** — pull sessions out into shared Redis; any server serves any request. Scalable + restart-safe (Spring Session does this).

## When do _I_ handle thread-safety?

Only with **shared long-lived mutable state**:

1. **Mutable field on a singleton Spring bean** (one instance, all threads) — the #1 real bug.
2. **`static` counter / cache / map**.
3. In-memory state that must survive across requests (rate limiter, cache).
   If there's **no shared mutable state** (locals + DB only), you're safe automatically.

## Test Yourself

Tomcat vs Vert.x threading?::Tomcat = thread-per-request (pooled, simple, capped). Vert.x = event loop (few threads, never block, scales huge, blocking work → worker pool).
How is REST stateless if there's a session cookie?::Server keeps no memory between requests; the cookie lives on the client and is re-sent each time, so the server reacts to what the request carries.
When must I handle thread-safety myself?::Only with shared long-lived mutable state — mutable singleton-bean field, static var, or in-memory cross-request state.
Why externalize sessions to Redis?::In-memory sessions force sticky load balancing (fragile, doesn't scale). Redis lets any server serve any request; restart-safe.
