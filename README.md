# Next.js Portfolio with AI Chatbot

This project is a personal portfolio website built with Next.js, featuring an AI-powered chatbot that can answer questions about the website's content and the owner's projects.

## Features

- Responsive portfolio website showcasing projects and skills
- AI chatbot integrated into the website
- Dynamic content management for projects and blog posts
- GitHub integration to display repositories and contributions
- Dark mode support
- Vector search capabilities using Supabase pgvector

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Octokit (for GitHub API integration)
- Langchain (for AI chatbot functionality)
- Supabase (for vector storage)
- OpenAI (for embeddings and chat)
- Upstash Redis (for caching)
- Vercel (for deployment)

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── [...other pages]
│   ├── components/
│   │   ├── AboutMe.tsx
│   │   ├── GitHubStats.tsx
│   │   ├── Technologies.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── LatestPosts.tsx
│   │   ├── InteractiveCode.tsx
│   │   ├── GitHubTrends.tsx
│   │   └── Chatbot.tsx
│   └── lib/
│       ├── supabase.ts
│       └── github.ts
├── public/
├── scripts/
│   └── generate.ts
├── data.json
├── .env.local
├── next.config.js
├── package.json
└── tailwind.config.js
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/medevs/smart-portfolio.git
   cd portfolio-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Enable the Vector extension in your Supabase database
   - Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Enable the pgvector extension
   create extension if not exists vector;

   -- Create a table to store your documents and embeddings
   create table if not exists documents (
     id bigserial primary key,
     content text,
     metadata jsonb,
     embedding vector(1536)
   );

   -- Create the matching function
   create or replace function match_documents(
     query_embedding vector(1536),
     filter jsonb default '{}'::jsonb,
     match_count int default 10
   ) returns table (
     id bigint,
     content text,
     metadata jsonb,
     similarity float
   )
   language plpgsql
   as $$
   #variable_conflict use_column
   begin
     return query
     select
       documents.id,
       documents.content,
       documents.metadata,
       1 - (documents.embedding <=> query_embedding) as similarity
     from documents
     where case
       when filter::text = '{}'::text then true
       else documents.metadata @> filter
     end
     order by documents.embedding <=> query_embedding
     limit match_count;
   end;
   $$;

   -- Create an index for faster similarity searches
   create index if not exists documents_embedding_idx on documents
   using ivfflat (embedding vector_cosine_ops)
   with (lists = 100);
   ```

4. Set up Upstash Redis:
   - Create a new Redis database at https://upstash.com
   - Copy your Redis REST URL and token

5. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   OPENAI_API_KEY=your_openai_api_key
   
   # Supabase configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Redis configuration
   UPSTASH_REDIS_REST_URL=your_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
   ```

6. Generate embeddings for the chatbot:
   ```bash
   npm run generate
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## How It Works

The chatbot uses several key technologies to provide intelligent responses:

1. **Content Embedding**: The `generate.ts` script processes your website content and generates embeddings using OpenAI's text-embedding-3-small model.

2. **Vector Storage**: These embeddings are stored in Supabase using the pgvector extension, enabling efficient similarity searches.

3. **Retrieval Chain**: When a user asks a question:
   - The question is analyzed to generate a relevant search query
   - Similar content is retrieved from the vector store
   - The matching content is used as context for the AI to generate a response

4. **Caching**: Upstash Redis is used to cache responses, improving performance and reducing API costs.

## Deployment

This project is set up for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in your Vercel project settings
4. Deploy!

## Updating Content

To update the chatbot's knowledge:

1. Modify the content in your website files
2. Run the embedding generation script:
   ```bash
   npm run generate
   ```

The script will:
- Clear the existing Redis cache
- Process all content files
- Generate new embeddings
- Store them in your Supabase database

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.