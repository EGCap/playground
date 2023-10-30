# Embedding playground

Introducing [embeds.ai](https://embeds.ai): an embedding playground and battleground

Compare how embedding models work on a real world use case (retrieval augmented generation for Wikipedia articles).

A few weeks ago, we were looking for an embedding model to use for RAG. We eventually came across the MTEB leaderboard, but we struggled to understand the benchmark scores.

We wanted a tool to test various embedding models with example queries on real-world datasets. After unsuccessfully looking for such a “playground”, we decided to just build one ourselves!

We embedded HuggingFace’s Simple Wikipedia dataset using @OpenAI, @Cohere, and 2 open-source models via @Baseten. We then stored the embeddings in @Supabase using pgvector. Finally, we built a web app using NextJS and deployed it on @Vercel.

Now we’re hosting the playground for anyone to use for free, as well as open-sourcing our work so people can try evaluating other models, datasets, or indexes.

Learn more here in our [full blog post here on Substack](https://shreyanjain.substack.com/p/announcing-embedding-battleground).

If you have other suggestions / pain points from working with embedding models, vector DBs, or RAG, or if you would like to collaborate on any of the above or unrelated projects, please reach out!


Built by: [Shreyan Jain](https://twitter.com/shreyanj98), [David Song](https://twitter.com/davidtsong), and [Elad Gil](https://twitter.com/eladgil)