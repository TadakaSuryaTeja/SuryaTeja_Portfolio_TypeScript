/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    // The chat route reads the retrieval index and the MiniLM weights from
    // disk at runtime. Neither is reachable from an import graph, so Next's
    // file tracing cannot infer them — without this the function deploys
    // without its index and every answer becomes a refusal.
    outputFileTracingIncludes: {
      '/api/chat': ['./public/rag-index.json', './.rag-model/**/*'],
    },
  },
};
