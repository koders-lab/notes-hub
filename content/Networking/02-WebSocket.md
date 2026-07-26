---
publish: true
title: WebSocket
tags:
  - networking
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **WebSocket** = a **persistent, two-way** connection. Starts as an HTTP request, then **upgrades** and stays open.
> - HTTP = walkie-talkie (ask, then they answer). WebSocket = phone call (both talk freely, line stays open).
> - Used when the **server must push to the client unprompted**: chat, live prices, gaming, notifications.

## How it works

1. Browser sends an **HTTP request** with header `Upgrade: websocket`.
2. Server replies **`101 Switching Protocols`**.
3. From that moment the **same TCP connection** stops being request/response and becomes a **full-duplex open pipe** — either side can send **frames** anytime, without being asked.

In Wireshark you'd see the HTTP `Upgrade` handshake, then the traffic stops looking like HTTP — that's the switch.

## HTTP vs WebSocket

| | HTTP | WebSocket |
|---|---|---|
| Pattern | request → response (client starts) | both sides push anytime |
| Connection | short-lived (or keep-alive reuse) | long-lived, stays open |
| Server push | no (client must ask/poll) | yes (native) |
| Use | REST APIs, page loads | chat, live feeds, gaming |

## Why it exists

Plain HTTP can't let the **server** initiate a message to the client — the client always has to ask first (hence old hacks like long-polling). WebSocket removes that: the open pipe lets the server push the instant something happens.

## Test Yourself

What is a WebSocket in one line?::A persistent two-way connection that starts as HTTP, upgrades (101 Switching Protocols), then stays open for either side to push frames.
HTTP vs WebSocket?::HTTP = client-initiated request/response, short-lived. WebSocket = long-lived, full-duplex, server can push unprompted.
Why can't plain HTTP do chat well?::HTTP is client-initiated; the server can't push unprompted, so you'd have to poll. WebSocket's open pipe lets the server push instantly.
