---
publish: true
title: AI / RAG / LangChain — Interview Refresher
tags:
  - ai
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. "GenAI exposure" is a _plus_ on the JD — enough to speak credibly, tied to your NLP background.

## Foundations

> [!question]- What is an LLM / how does it work (gist)?
> A large neural network (transformer) trained to **predict the next token**. Given a prompt, it generates text token-by-token. Not a database — it _generates_, which is why it can **hallucinate**.

> [!question]- What is a token / embedding?
> **Token** = a chunk of text (~¾ of a word). **Embedding** = a vector (list of numbers) capturing meaning, so similar text has nearby vectors. Basis of semantic search.

> [!danger]- What is RAG (Retrieval-Augmented Generation)?
> Instead of relying only on the model's training, you **retrieve relevant documents** and feed them into the prompt as context.  Flow: **chunk docs → embed → store in a vector DB → at query time, embed the question, find similar chunks, stuff them into the prompt → LLM answers grounded in them.** Fixes hallucination + stale knowledge.

## Building blocks

> [!question]- Vector database?
> Stores embeddings and does **similarity search** (nearest-neighbor). E.g. pgvector, Pinecone, Chroma, Elasticsearch.

> [!question]- LangChain?
> A framework to build LLM apps — **chains** (compose steps), **tools** (let the LLM call functions/APIs), **memory** (conversation history), retrievers for RAG. Glue for LLM pipelines.

> [!question]- LangGraph?
> Builds **stateful, multi-step agent workflows** as a graph (nodes = steps, edges = transitions, with state + checkpoints). For agents that loop, branch, and maintain state — beyond a linear chain.

> [!success]- Spring AI (YOUR lane — Java + AI)
> Do RAG **in Java/Spring**: `VectorStore` abstraction, `ChatClient` fluent API, `QuestionAnswerAdvisor` (out-of-box RAG) or `RetrievalAugmentationAdvisor` (modular). Lets you build AI on your existing stack. _This is your differentiator — Java dev who ships AI._

## Positioning

> [!note] Your honest AI story
> _"I have a data-science masters and did classical NLP with OpenNLP and Solr. Now I'm building on that with GenAI — I understand RAG end-to-end (chunk → embed → vector store → retrieve → generate), and I'm learning LangChain, LangGraph, and Spring AI so I can do it in Java."_ Credible, tied to real background.

## Drill cards

What is RAG?::Retrieve relevant docs (via embeddings + vector search), inject them into the prompt as context so the LLM answers grounded in real data. Fixes hallucination + stale knowledge.
What is an embedding?::A vector representing text meaning; similar text → nearby vectors. Enables semantic/similarity search.
LangChain vs LangGraph?::LangChain = compose LLM steps/tools/memory (often linear). LangGraph = stateful multi-step agent workflows as a graph (nodes/edges/checkpoints).
What is a vector database?::Stores embeddings and does nearest-neighbor similarity search (pgvector, Pinecone, Chroma).
Why do LLMs hallucinate?::They generate the most likely next token, not retrieve facts — so they can produce plausible-but-wrong output. RAG grounds them in real docs.
Spring AI?::Build RAG/LLM apps in Java — VectorStore, ChatClient, QuestionAnswerAdvisor. AI on your existing Spring stack.
