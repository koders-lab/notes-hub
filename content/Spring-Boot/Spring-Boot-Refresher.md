---
publish: true
title: Spring & Spring Boot — Interview Refresher
tags:
  - java
  - spring
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. High-frequency Q\&A at senior level.

## Core

> [!question]- IoC & Dependency Injection?
> **IoC** = the framework, not your code, creates and wires objects. **DI** is how — Spring injects dependencies (constructor/setter/field). Prefer **constructor injection** (immutable, testable, no NPE surprises).

> [!question]- Bean scopes?
> **singleton** (default — one per container), **prototype** (new each request), plus web scopes **request / session / application**. Singleton is shared → don't put mutable state in it.

> [!question]- Bean lifecycle?
> Instantiate → populate deps → `@PostConstruct` / `InitializingBean` → in use → `@PreDestroy` / `DisposableBean`.

> [!question]- @Component vs @Service vs @Repository vs @Controller?
> All are stereotypes (auto-detected beans). @Repository adds DB exception translation; @Controller/@RestController handle web; @Service is semantic (business logic). Functionally similar, semantically distinct.

## AOP (ties to your Company E work)

> [!question]- What is AOP + how does @Transactional/@Cacheable work?
> **AOP** = cross-cutting concerns (logging, tx, caching) applied via **proxies**. Spring wraps your bean in a proxy that intercepts calls. **Gotcha:** proxy-based AOP can't intercept **self-invocation** or **private** methods (@Transactional on a private method = ignored).

## Spring Boot

> [!question]- What does Spring Boot add over Spring?
> **Auto-configuration** (sensible defaults from classpath), **starters** (curated dependency bundles), **embedded server** (Tomcat/Netty — no WAR), **actuator** (health/metrics), opinionated defaults. Less boilerplate.

> [!question]- How does auto-configuration work?
> `@SpringBootApplication` → `@EnableAutoConfiguration` → scans classpath, applies `@Conditional` config (e.g. "H2 on classpath → configure a datasource"). Override by defining your own bean.

> [!question]- @Transactional — propagation levels (senior)?
> **REQUIRED** (default — join or create), **REQUIRES\_NEW** (suspend outer, new tx), **SUPPORTS**, **MANDATORY**, **NESTED**. Know REQUIRED vs REQUIRES\_NEW.

## Drill cards

IoC vs DI?::IoC = framework controls object creation/wiring; DI = the mechanism (inject dependencies). Prefer constructor injection.
Default bean scope + risk?::Singleton — one shared instance; don't store mutable state on it (thread-safety).
Why can't @Transactional work on a private/self-invoked method?::Proxy-based AOP intercepts external calls only; self-invocation bypasses the proxy.
Spring Boot over Spring?::Auto-config, starters, embedded server, actuator — convention over configuration.
REQUIRED vs REQUIRES\_NEW?::REQUIRED joins/creates a tx; REQUIRES\_NEW suspends the current one and starts an independent tx.
