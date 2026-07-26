---
publish: true
title: SSH, Tunneling & Port Forwarding (Codespaces)
tags:
  - networking
  - devops
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Tunneling** = wrapping one protocol's packets **inside another** protocol as payload, to cross a network that wouldn't otherwise carry them.
> - **SSH** is its own protocol on port 22 (not HTTP). PuTTY = SSH client.
> - **Codespaces port forwarding** = an **application-layer reverse tunnel** (like ngrok / `ssh -R`), not a Docker network driver.

## What is tunneling?

**Encapsulation**: the inner packet becomes cargo; the outer protocol is the vehicle. The network in between only sees the outer "tube," not what rides inside.

- Example: your Codespace's WebSocket/port-3001 traffic is wrapped inside an outbound **HTTPS** connection to GitHub. The internet sees "an HTTPS connection"; it can't see the port-3001 traffic nested inside. That nesting is tunneling.

## Tunnel vs a normal login (e.g. your bank)

- **Bank login** = browser speaks HTTPS **directly to the bank**. TLS wraps HTTP, but that's a normal stack, not tunneling — packets are addressed to their real destination, no inner foreign protocol smuggled.
- **Tunnel** = traffic goes to a **middleman** who **unwraps** the cargo and forwards it elsewhere. The outer connection's destination is _not_ the real destination.
- Difference = **encapsulation + redirection**, not encryption. Both can use TLS.

## SSH

- SSH = its own protocol, **port 22**, raw TCP. **No HTTP, no WebSocket** involved. PuTTY is an SSH client.
- **`ssh -R` (reverse tunnel)** = the machine dials **out** and lets traffic come back in through that connection — the mirror image of logging _into_ a server.

## Codespaces: container or VM? and how the port works

- A Codespace is a **container** (devcontainer) running on a **VM in Microsoft's cloud** — **not** on your machine.
- So it's **not** Docker bridge/overlay/ipvlan. It's an **application-layer reverse tunnel**: an agent inside the Codespace holds an **outbound** connection to GitHub's edge; when you hit the `*.app.github.dev` URL, GitHub authenticates you and pushes the request **back down that tunnel** to `localhost:8080` inside the container. No inbound port is exposed.
- Closest analogy: **ngrok / Cloudflare Tunnel / `ssh -R`**, not any Docker network driver.
- If running in **VS Code Desktop**, it forwards the remote port to your real `localhost:8080`.

## Why "tunnel" slips through firewalls

The firewall sees a normal outbound **HTTPS** connection leaving; it can't see the port-3001 traffic riding inside. That's the whole trick — and why it's app-layer, auth-gated, and works from behind firewalls.

## Test Yourself

What is tunneling?::Wrapping one protocol's packets inside another as payload, so they cross a network that wouldn't otherwise route them (encapsulation).
How is a tunnel different from a normal HTTPS login?::A login goes directly to the real destination; a tunnel goes to a middleman who unwraps and forwards elsewhere. It's encapsulation + redirection, not just encryption.
Is a Codespace port a Docker bridge/overlay?::No — it's an application-layer reverse tunnel (like ngrok/ssh -R): an agent dials out to GitHub, which pushes requests back down to localhost inside the container.
What protocol/port is SSH?::Its own protocol on port 22, raw TCP — not HTTP.
