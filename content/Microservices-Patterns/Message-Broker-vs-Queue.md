---
publish: true
title: Message Broker vs Message Queue (+ Kafka)
tags:
  - microservices
  - kafka
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Message queue** = the data structure/channel (messages line up, usually point-to-point).
> - **Message broker** = the whole middleware that **manages queues + topics**, adds routing, pub/sub, delivery guarantees.
> - The queue is **one mechanism inside** the broker. (Your intuition was right — not the same.)
> - **Kafka a must for Saga/CQRS?** No — both are patterns; any transport (Kafka, RabbitMQ, REST) works.

## Queue vs Broker (they're not synonyms)

- **Message queue** — a channel where messages **line up**; a consumer takes them. Classic queue = **point-to-point** (one message → one consumer).
- **Message broker** — the **middleware system** that hosts many queues/topics and adds **routing, pub/sub fan-out, transformation, delivery guarantees, persistence**.
- Relationship: a broker **contains** queues (and topics). RabbitMQ is a broker; a queue is a thing it holds.

## Two messaging styles

- **Point-to-point (queue):** one message consumed by exactly one consumer. Work distribution.
- **Publish/subscribe (topic):** one message fanned out to **many** subscribers. Events.

## Where Kafka fits

Kafka is often called a broker, but it's really a **distributed append-only log** (topics split into **partitions**). Consumers read at their own offset, so the same message can be read by **many** consumer groups — that's why it fans out like pub/sub and retains messages. Not a classic "consume-and-delete" queue.

## Is Kafka required for Saga / CQRS?

**No.** Both are **patterns**, tool-agnostic:

- **Saga** needs steps to communicate — Kafka, RabbitMQ, or even synchronous REST calls.
- **CQRS** needs writes propagated to the read model — Kafka, a DB trigger, or a batch job.
  Kafka is a common _implementation choice_, never a requirement.

## Test Yourself

Message queue vs message broker?::Queue = the channel where messages line up (often point-to-point). Broker = the middleware managing queues/topics with routing, pub/sub, guarantees. Queue is inside the broker.
Is Kafka a queue?::Not classic — it's a distributed log (topics + partitions); consumers read at offsets, many groups can read the same messages (pub/sub-like, retained).
Is Kafka required for Saga or CQRS?::No — both are tool-agnostic patterns; any transport (Kafka, RabbitMQ, REST, DB trigger, batch) works.
Point-to-point vs pub/sub?::Point-to-point = one message → one consumer (queue). Pub/sub = one message → many subscribers (topic).
