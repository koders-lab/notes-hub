---
publish: true
title: OSI vs TCP/IP, and TCP / HTTP
tags:
  - networking
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **OSI (7 layers)** = the teaching/reference model. **TCP/IP (4 layers)** = what the internet actually runs on.
> - People _speak_ OSI ("layer-7 load balancer") but the wire _runs_ TCP/IP.
> - **TCP** = reliable, ordered byte pipe (ports, seq/ack, handshake). **HTTP** = request/response on top of TCP.

## OSI (7) vs TCP/IP (4)

| OSI (7) | TCP/IP (4) | Examples |
|---|---|---|
| Application / Presentation / Session | **Application** | HTTP, TLS, WebSocket, your login |
| Transport | **Transport** | TCP, UDP (ports: 8080, 443) |
| Network | **Internet** | IP (addresses, routing) |
| Data Link / Physical | **Link** | Ethernet, Wi-Fi |

- **OSI** = conceptual reference (7 clean layers); great for _reasoning_ and vocabulary.
- **TCP/IP** = the real, implemented stack (4 layers); collapses OSI's top 3 into "Application," bottom 2 into "Link."
- Not competitors: OSI is the map everyone points at; TCP/IP is the territory that's wired up.

## TCP — the reliable pipe

- **Ports** — identify the app on a host (8080, 443).
- **Sequence & ack numbers** — guarantee **order** and **redelivery** of lost packets.
- **Flags** — SYN/ACK/FIN drive the handshake and teardown.
- **3-way handshake:** SYN → SYN-ACK → ACK establishes a connection.
- TCP is a reliable **byte stream**; HTTP, SSH, WebSocket all ride on it.

## HTTP — request/response

- **One-shot:** you ask, server answers, done. Stateless by design.
- Has **headers + body** (e.g. the JSON you inspect in Wireshark).
- The connection's job is over once the response lands (though keep-alive reuses the TCP connection for efficiency).

## TCP vs UDP (quick)

- **TCP** — reliable, ordered, connection-based (web, APIs, DB).
- **UDP** — fire-and-forget, no ordering/redelivery, low latency (video, gaming, DNS).

## Test Yourself

OSI vs TCP/IP — which is 'real'?::TCP/IP (4 layers) is what runs the internet; OSI (7 layers) is the reference/teaching model whose vocabulary everyone uses.
What makes TCP reliable?::Sequence/ack numbers (order + redelivery), the 3-way handshake, and flags — a reliable ordered byte stream.
Map OSI to TCP/IP top layers.::OSI Application+Presentation+Session → TCP/IP Application; Transport→Transport; Network→Internet; DataLink+Physical→Link.
TCP vs UDP?::TCP = reliable, ordered, connection-based. UDP = fire-and-forget, no ordering, low latency (video/gaming/DNS).
