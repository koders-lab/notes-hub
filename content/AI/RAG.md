Here is a complete, production-ready code guide to building a Retrieval-Augmented Generation (RAG) pipeline using LangChain and Chroma (an open-source vector store). \[1, 2, 3]

This script takes a raw text document, splits it into chunks, stores it in a vector database, and queries an LLM using that stored data as context. \[4, 5, 6, 7]

## 📋 Prerequisites

First, install the required LangChain and provider packages: \[8, 9, 10]

```bash
pip install langchain langchain-community langchain-chroma langchain-openai

```

_Note: Ensure you have your `OPENAI_API_KEY` set up in your environment variables._ \[11, 12]

---

## 💻 Complete LangChain RAG Implementation

```python
import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# ==========================================
# 1. LOAD AND PREPARE DOCUMENTS
# ==========================================
# Create a dummy text file to act as our private data source
with open("company_policy.txt", "w") as f:
    f.write(
        "Project Quantum is our top-secret AI project. "
        "The project launch date is set for October 15, 2026. "
        "All team members must complete security training by September 1, 2026."
    )

# Load the document into LangChain memory
loader = TextLoader("company_policy.txt")
raw_documents = loader.load()

# ==========================================
# 2. CHUNK THE TEXT
# ==========================================
# LLMs have context limits, and vector search works best with small, focused snippets.
# We split text into chunks of 500 characters, with a 50-character overlap to keep context intact.
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
documents = text_splitter.split_documents(raw_documents)

print(f"Loaded {len(raw_documents)} document(s) and split into {len(documents)} chunk(s).")

# ==========================================
# 3. INITIALIZE EMBEDDINGS AND VECTOR STORE
# ==========================================
# Initialize the model that converts text chunks into mathematical vector numbers
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Create an in-memory Chroma vector store populated with our document chunks
# In production, add `persist_directory="./chroma_db"` to save it to disk.
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)

# Convert the vector store into a 'Retriever' interface to fetch similar vectors easily
retriever = vector_store.as_retriever(search_kwargs={"k": 2}) # Fetches top 2 most relevant chunks

# ==========================================
# 4. DEFINE THE LLM & PROMPT
# ==========================================
# Initialize our primary brain (the LLM)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Construct a strict prompt template instructing the LLM to only use provided context
prompt_template = """
You are a helpful assistant. Answer the question using ONLY the provided context. 
If you do not know the answer based on the context, say "I don't know".

Context:
{context}

Question: {question}
Answer:
"""
prompt = ChatPromptTemplate.from_template(prompt_template)

# ==========================================
# 5. ASSEMBLE THE RAG CHAIN (LCEL)
# ==========================================
# LangChain Expression Language (LCEL) chains tasks sequentially using the pipe `|` operator.
def format_docs(docs):
    # Helper function to merge retrieved text chunks into a single string block
    return "\n\n".join(doc.page_content for docs in docs)

rag_chain = (
    {
        "context": retriever | format_docs, # Pass question to retriever, format outputs as string
        "question": RunnablePassthrough()    # Pass user's raw question directly through untouched
    }
    | prompt                                # Inject context and question into the prompt template
    | llm                                   # Send filled prompt to the OpenAI LLM
    | StrOutputParser()                     # Clean the LLM output, extracting just the text response
)

# ==========================================
# 6. RUN THE QUERY
# ==========================================
query = "When is the launch date for Project Quantum and what training is needed?"
print(f"\nUser Query: {query}")

# Execute the chain
response = rag_chain.invoke(query)
print(f"AI Response:\n{response}")

```

---

## 🧠 Deep-Dive Explanation of Key Components

## 🧱 1. Document Loaders & Text Splitters

- `TextLoader`: Converts raw files (`.txt`, `.pdf`, `.html`) into structured LangChain `Document` objects containing both text content and structural metadata.
- `RecursiveCharacterTextSplitter`: This is the gold standard for text splitting. It looks for natural paragraph breaks (`\n\n`), sentence breaks (`\n`), and word spaces (  ) to split your text down to your target `chunk_size` without cutting words in half. \[13, 14, 15, 16, 17]

## 🧮 2. Embeddings vs. Vector Stores

- `OpenAIEmbeddings`: It converts a human sentence like _"Project Quantum launch"_ into a 1536-dimensional array of numbers representing its literal meaning.
- `Chroma`: When you call `from_documents`, Chroma takes the text, sends it to OpenAI to get the numeric embeddings, and indexes them. When you query it, it computes the cosine similarity between your question's numbers and your document's numbers to instantly find the closest context matches. \[18, 19, 20]

## 🔗 3. LCEL (LangChain Expression Language) \[21]

The pipe (`|`) syntax joins Lego blocks together:

1. Inputs arrive via `.invoke("Your Question")`.
2. `"question": RunnablePassthrough()` copies your text straight forward.
3. `"context": retriever | format_docs` takes your text, sends it to Chroma to pull matching chunks, and joins them into one unified string block.
4. The dictionary feeds into the `prompt`, which slots the values into `{context}` and `{question}`.
5. The filled template goes to the `llm`, and `StrOutputParser()` strips away system metadata so you only get clean text back. \[22, 23, 24, 25, 26]

# References

\[1] [https://gettingstarted.ai](https://gettingstarted.ai/blog/everything-you-need-to-know-when-getting-started-with-langchain/)

\[2] [https://discuss.streamlit.io](https://discuss.streamlit.io/t/langchain-tutorial-4-build-an-ask-the-doc-app/45688)

\[3] [https://medium.com](https://medium.com/@wendell_89912/building-a-python-powered-rag-system-with-langchain-step-by-step-guide-c5b9f39a1374)

\[4] [https://levelup.gitconnected.com](https://levelup.gitconnected.com/chat-with-your-emails-with-this-rag-pipeline-langchain-chromadb-78b65a68cf77)

\[5] [https://www.sitepoint.com](https://www.sitepoint.com/local-rag-without-the-cloud-private-document-ai-setup/)

\[6] [https://pynions.com](https://pynions.com/langchain)

\[7] [https://medium.com](https://medium.com/towards-generative-ai/rag-explained-showcasing-azures-no-code-low-code-llmops-alongside-langchain-expertise-260894ae6fc9)

\[8] [https://www.designveloper.com](https://www.designveloper.com/blog/how-to-build-chatbot-with-langchain/)

\[9] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-02-02-langchain-vector-stores/view)

\[10] [https://reference.langchain.com](https://reference.langchain.com/python/langchain-classic/chat_models)

\[11] [https://render.com](https://render.com/articles/building-an-agent-with-langchain-and-claude-open-ai)

\[12] [https://medium.com](https://medium.com/@dreamai/building-a-production-grade-q-a-system-for-knowledge-graphs-and-pdfs-with-langchain-agents-neo4j-b1988a29d499)

\[13] [https://github.com](https://github.com/edaaydinea/llm_engineering)

\[14] [https://dev.to](https://dev.to/klement_gunndu/build-a-rag-pipeline-in-python-that-actually-works-28dg)

\[15] [https://dilipkumar.medium.com](https://dilipkumar.medium.com/langchain-coding-framework-for-vector-database-6fe875de0954)

\[16] [https://www.udemy.com](https://www.udemy.com/course/langchain/)

\[17] [https://www.firecrawl.dev](https://www.firecrawl.dev/blog/build-documentation-agent-langgraph-firecrawl)

\[18] [https://www.firecrawl.dev](https://www.firecrawl.dev/blog/build-documentation-agent-langgraph-firecrawl)

\[19] [https://gaodalie.substack.com](https://gaodalie.substack.com/p/langgraph-deepseek-r1-function-call)

\[20] [https://medium.com](https://medium.com/@abonia/document-based-llm-powered-chatbot-bb316009de93)

\[21] [https://www.sitepoint.com](https://www.sitepoint.com/an-introduction-to-langchain-ai-powered-language-modeling/)

\[22] [https://medium.com](https://medium.com/@Ana_Caballero_H/langchain-78a27a692d5a)

\[23] [https://www.linkedin.com](https://www.linkedin.com/posts/marlenemhangami_the-combination-of-langchain-and-mcp-is-so-activity-7386022296404099072-GMli)

\[24] [https://www.linkedin.com](https://www.linkedin.com/posts/gideon-mendels_one-of-langchains-core-built-in-prompts-activity-7391504209441095681-itTd)

\[25] [https://www.linkedin.com](https://www.linkedin.com/pulse/exploring-langchains-expression-language-lcel-rany-elhousieny-phd%E1%B4%AC%E1%B4%AE%E1%B4%B0-5evkc)

\[26] [https://www.linkedin.com](https://www.linkedin.com/pulse/retrieval-augmented-generation-rag-langchain-refining-rany-adgmc)
