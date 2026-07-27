---
publish: true
title: Resume Storytelling — Say It With Confidence
tags:
  - interview
  - refresher
---

## TL;DR ⚡

> [!abstract] Read this right before any interview
>
> - **Your fumbling is a confidence problem, not a knowledge one.** Same question, second attempt, was always crisp today.
> - **Buy 2 seconds:** say _"Let me structure that,"_ pause, then answer.
> - **Run a fixed skeleton every time:** _what it is → the problem → the fix → the trade-off._
> - When they ask "have you done X?" and it's on your resume — **the answer is YES**, then tell the story.

## The anti-fumble system (use in the room)

1. **Pause on purpose.** Fumbling happens when the mouth starts before the thought is assembled. Say "let me structure that" to buy the half-second.
2. **Four-beat skeleton:** _What it is → the problem in my project → how I fixed it → the trade-off._ Pour any answer into this rail.
3. **The wobble is nerves lying.** You know this material (resume + practice prove it). Name it internally: "the answer's in there," pause, run the skeleton.
4. **Practice out loud**, not just in your head — speaking is the skill being tested.

## Lead with your strengths (this role: Java + microservices + AWS)

You clear an "8+ year" bar as a **13-year** engineer. On the core (Java, REST/microservices, AWS, PostgreSQL) you're strong-to-over-qualified. Manage two gaps **honestly**:

- **Python depth** ("5+ yrs" asked): "My core is Java; I've used Python across NLP, chatbots, and Flask services, and I ramp fast — I taught myself NLTK to ship a project." Refresh basic syntax + the **GIL**.
- **K8s / GitHub Actions** (tool-specific): "Docker/Compose hands-on; Kubernetes I understand conceptually (pods, deployments, services) and have worked adjacent to; GitHub Actions maps to my AWS CodePipeline CI/CD experience." Honesty on a gap beats a bluff.

## STORY 1 — Saga (from your resume: "Saga-based compensation")

**What it is:** A Saga keeps data consistent across microservices when one ACID transaction can't span them — a chain of local transactions, each with a compensating action; eventual consistency. _(Not a distributed transaction — the alternative to one.)_

**My project (skeleton):**

- _Scene:_ State project. Ingested **FND/NND** files via **Apache Camel** (format-specific specs), processed, fanned out to downstream microservices (Medicaid, Family Services).
- _Why not one DB transaction:_ each service has its own DB — no single ACID transaction spans them; 2PC locks/couples everything.
- _The pattern:_ **Saga via Axon** with an **orchestrator** — each service commits in its boundary; if service A fails, the orchestrator triggers **compensating transactions** across the others.
- _Hard parts (the follow-ups):_ idempotency via an **idempotency key** (UUID v7) + dedupe; **retry with exponential backoff + jitter**; failures → **DLQ**; orchestrator crash → **persisted saga state** (event sourcing/outbox) replays on restart. (Axon does this.)

See [[Saga Pattern — Full Notes]].

## STORY 2 — CQRS (from your resume: "CQRS to decouple read/write")

**What it is:** Command Query Responsibility Segregation — separate models for writes (commands) and reads (queries).

**My project (skeleton):**

- _Scene:_ Transactional system taking in data; one team needed **heavy analytics dashboards** over it.
- _The problem:_ aggregate queries against the **normalized** write tables meant huge **joins**, slow, and contended with the transactional load.
- _The fix:_ keep the write model **normalized/transactional**; maintain a **separate denormalized read model** shaped for the dashboard. Reads and writes scale independently, stop fighting.
- _Sync + trade-off:_ write side **publishes events (Kafka)** → read model updated **async** → **eventually consistent**, which is fine for analytics.

See [[CQRS — Full Notes]].

## Other resume lines to have a story ready for

- **Concurrency engine / Project Loom** — "parallel synchronization engine for distributed state consistency." Have a race-condition/locking story (see concurrency notes).
- **Resilience4j circuit breaker** — preventing cascading failures; open/half-open/closed states.
- **AWS Lambda cold starts** — you fixed these with **provisioned concurrency** + slimmer JARs. Strong, specific, own it.
- **Kafka DLQ + retry** — you literally have this; it's the Saga reliability story.

## The mindset line to carry in

> "I fumbled the first pass and nailed the second today — so when I wobble tomorrow, I pause and go again. The answer is in there."

## Test Yourself

What's the 4-beat answer skeleton?::What it is → the problem in my project → how I fixed it → the trade-off.
One-line Saga story?::Camel-ingested files fanned out to microservices; Saga-via-Axon orchestrator with compensating transactions; idempotency + retry/backoff/jitter + DLQ + persisted state.
One-line CQRS story?::Analytics dashboards over transactional data were slow via joins; split into normalized write model + denormalized read model synced via Kafka events; eventually consistent, fine for analytics.
How to handle a fumble mid-answer?::Pause, say "let me structure that," run the four-beat skeleton — the wobble is nerves, not a knowledge gap.

---

## Scripted opener — "Tell me about yourself" (rehearse word-for-word)

> The ONE answer you fully script — it opens every interview and sets your confidence for the rest.

"I started as a J2EE developer, working alongside data and analytics teams — which
got me curious about data science. I did a masters in the field, hands-on with
Python, R, and machine learning, with internship projects in NLP. Then I moved into
Java, in banking and payments, building high-throughput, distributed, resilient
services, largely on AWS. This role excites me because it converges both sides of my
background — Java and Python — right as AI reshapes the field. I'm already learning
RAG, LangChain, LangGraph, and Spring AI, and this is where I get to put all of that
into practice. That's what draws me to it."

**Structure:** identity/arc → why this role (convergence) → clean stop.
**Never say:** "I worked in banking because a requirement came through" (makes 13 yrs sound accidental). Own it as expertise.
**Your differentiator:** the data-science masters — most Java devs pivoting to AI don't have it. Lead with it.

## STORY 3 — AWS Lambda cold starts (resume: serverless + Spring Boot)

**What it is:** Latency when Lambda spins up a fresh execution environment (download code, start runtime, run init). Spring Boot's context startup is slow → adds seconds to the first request AND can hit Lambda's ~10s init timeout.

**My fix (skeleton):**

- Slimmed the deployment JAR — trimmed unneeded Maven dependencies so there's less to load/init.
- Enabled **provisioned concurrency** via **SAM** + CodePipeline → keeps N environments **pre-initialized and warm**, so requests hit ready containers instead of paying cold-start cost.
- "Today I'd also use **SnapStart**" — AWS's Java-specific fix that restores from a snapshot of the initialized state.

**CRITICAL wording:** it's **SAM** (Serverless Application Model), NOT SAML (that's SSO/auth). Don't mix them.
**Provisioned concurrency internals:** pre-initializes + keeps warm a set number of environments before requests arrive (you pay to keep them warm).

## STORY 4 — Deadlock diagnosis (behavioral / STAR — your thread war story)

**S:** Before go-live, a service kept hanging under load. Grafana dashboards (multi-level metrics) showed CPU/memory/latency all normal — nothing explained it.
**T:** I was tasked with finding the cause.
**A:** Took a **thread dump** (`jps` for the pid, then `jstack <pid>`). At the bottom the JVM reported **"Found one Java-level deadlock"** — two threads each **BLOCKED**, waiting on a lock the other held (circular wait).
**R:** Fixed by enforcing a **consistent lock acquisition order** so the cycle can't form. Resolved before go-live.
**Transferable line:** _"Metrics tell you THAT something's wrong; a thread dump tells you WHY, for concurrency bugs."_

### The 3 follow-ups they'll ask (know these cold)

1. **How to get a thread dump?** `jps` → `jstack <pid>` (or `kill -3 <pid>`, or `jcmd <pid> Thread.print`).
2. **What shows a deadlock?** jstack prints "Found one Java-level deadlock" at the bottom + each thread BLOCKED "waiting to lock <monitor> held by <other>". Two pointing at each other = the cycle.
3. **How to fix / lock ordering?** Always acquire locks in the same global order (e.g. by a stable id: lock lower-id first), so two threads can't take them in opposite orders → no circular wait.

```java
Object first  = a.id() < b.id() ? a : b;
Object second = a.id() < b.id() ? b : a;
synchronized (first) { synchronized (second) { /* work */ } }
```

---

# 🎬 FULL RESUME STORY BANK

> [!tip] How to use on the one-way video
> Read the **bold bullets** off-camera, speak in your own words, **1–2 min each**. The bullets are a safety net, not a script.

> [!danger] Never bluff — honesty lines
>
> - **Project Loom / "parallel synchronization engine":** you had help, don't own the internals.
>   ✅ Say: _"I contributed to a parallel synchronization engine for distributed state consistency, as part of a team — I understand the problem it solved (safe shared state under high throughput); I'm still deepening Loom's internals."_
> - **Pushed past your depth?** → _"That part I worked on with the team — here's what I understand,"_ not a bluff.

---

## 🏦 COMPANY A — Modernization · AWS · Camel/Kafka/Saga _(recent, lead)_

> [!note]- Story 1 · Monolith → cloud-native microservices
> **S** legacy monolith needed to scale → **T** lead the transition → **A** microservices on **12-Factor**, across **EC2 + isolated VPCs + Lambda**, Spring Boot + Postgres → **R** scalable, independently deployable.
> 🎯 _monolith → 12-factor · EC2 + VPC + Lambda · Spring Boot + Postgres · led it_

> [!note]- Story 2 · Lambda cold starts _(full detail: STORY 3 up top)_
> 🎯 _cold start = slow Spring init on new env · slimmed uber-JAR · **Provisioned Concurrency** (pre-warmed) via SAM/CodePipeline · today = **SnapStart**_
>
> > [!warning] It's **SAM** (Serverless App Model), **NOT SAML** (that's SSO/auth).

> [!note]- Story 3 · File pipelines + Saga _(full detail: STORY 1 up top)_
> 🎯 _**Camel** ingests files · fan-out to services · **Saga via Axon** + compensations · idempotency (UUID v7) + retry/backoff/jitter + **DLQ** · eventual consistency_

> [!note]- Story 4 · CI/CD + security
> **A** pipelines via **CodePipeline + SAM** · secrets in **Secrets Manager** · **SonarQube + HP Fortify** gates · **CloudWatch** · helped neutralize **Log4j**.
> 🎯 _CodePipeline+SAM · Secrets Manager · Sonar+Fortify · CloudWatch · Log4j_

> [!note]- Story 5 · Parallel synchronization engine ⚠️
> 🎯 _concurrency engine · distributed state consistency · high-throughput · **team effort — use the honesty line above**_

---

## 📊 COMPANY B — CQRS · Resilience4j · Kafka DLQ

> [!note]- Story 6 · CQRS on Oracle _(full detail: STORY 2 up top)_
> 🎯 _analytics dashboards slow via joins on normalized tables → split **read/write models** → read side tuned (Spring JDBC) → **Kafka** sync → eventually consistent (fine for analytics)_

> [!note]- Story 7 · Resilience with Resilience4j
> **S** a slow/down service caused cascading failures → **A** global **Circuit Breaker** (Resilience4j) + centralized validation (@ControllerAdvice) → **R** one bad service no longer sank the chain.
> 🎯 _circuit breaker · stops cascading failures · centralized validation_
>
> > [!question] Follow-up: circuit breaker states? → **Closed** (normal) · **Open** (fail fast) · **Half-Open** (test, then close if healthy)

> [!note]- Story 8 · Kafka reliability (DLQ)
> 🎯 _consumer groups · custom retry layer · **DLQ** = give-up bucket after retries · reliable delivery_

---

## 💳 COMPANY C — Payments (ISO 8583) · Netflix OSS · Hystrix

> [!note]- Story 9 · ISO 8583 payments
> **A** translated **ISO 8583** specs (v0→v1) into secure microservices for **acquirer/issuer** flows.
> 🎯 _ISO 8583 = card payment message standard · acquirer/issuer · versioned spec_
>
> > [!question] "What is ISO 8583?" → the international standard for card-originated transaction messages (what POS/ATM speak to banks).

> [!note]- Story 10 · Netflix OSS topology
> **A** **Ribbon** (LB) · **Eureka** (discovery) · **Zuul** (gateway) · **Config Server** (config) · **Hystrix** (circuit breaker) · **Grafana/Dynatrace** → 99.99% uptime.
> 🎯 _Ribbon=LB · Eureka=discovery · Zuul=gateway · Config=config · Hystrix=breaker_
>
> > [!question] Modern equivalent? → Eureka→K8s/discovery · Zuul→Spring Cloud Gateway · Hystrix→Resilience4j. "I've used both generations."

> [!note]- Story 11 · DB optimization + testing
> 🎯 _Spring Data JPA + Oracle · native stored procs for latency · BDD (Cucumber) + TDD (JUnit/Mockito) · Docker Compose local_

---

## 🔍 COMPANY D — NLP / Search _(your AI credibility!)_

> [!success]- Story 12 · NLP search app — LEAD HERE for "AI background"
> **A** **Apache OpenNLP** processes raw text · **Solr** indexes/retrieves · trained + dictionary models tag words · **Spring Boot REST** → **Angular** front end.
> 🎯 _OpenNLP · Solr · trained models · REST → Angular_
> 💡 _Ties to your **data-science masters** + the AI angle in your intro. This is real ML/NLP experience — most Java devs don't have it._

---

## ☕ COMPANY E — Core Java · Spring/Hibernate · early AWS

> [!note]- Story 13 · Enterprise Java + AWS foundations
> **A** Spring + Hibernate/Oracle · **Spring AOP** (logging/caching/tx) · **Elastic Beanstalk** · **S3 + IAM** · **CloudWatch + SNS** · **Jenkins** on EC2.
> 🎯 _Spring+Hibernate · AOP · Beanstalk · S3+IAM · Jenkins_

---

## 👥 LEADERSHIP _(for "tell me about leading a team")_

> [!note]- Leadership story
> **8 engineers across 3 squads** · 1-on-1 mentoring + quarterly reviews → **2 promotions in 18 months** · stakeholder translation · owned trade-off decisions.
> 🎯 _8 engineers, 3 squads · mentoring → 2 promotions · trade-off ownership_

---

> [!abstract] ⚡ TOP FOLLOW-UPS — know these cold
>
> - **Circuit breaker states** → Closed / Open / Half-Open
> - **Saga failure** → idempotency + retry/backoff/jitter + **DLQ** + persisted state
> - **CQRS sync** → Kafka events, eventual consistency
> - **Lambda cold start** → slim JAR + provisioned concurrency + **SnapStart** _(SAM ≠ SAML)_
> - **Deadlock** → `jstack` → "Found one Java-level deadlock" → consistent lock ordering
> - **ISO 8583** → card transaction message standard
> - **"AI background?"** → data-science masters + OpenNLP/Solr + now RAG/LangChain/Spring AI
