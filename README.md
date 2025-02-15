# Smart Portfolio with AI Integration

This project is a modern portfolio website built with Next.js 14, featuring AI-powered components including a chatbot, tech stack validation, and interactive visualizations.

## Key Features

- AI-powered chatbot for interactive portfolio exploration
- Tech stack architecture visualization and validation
- Dynamic GitHub statistics and contribution graphs
- Fully responsive design with dark/light mode
- Vector search capabilities using Supabase pgvector
- Real-time data updates and caching with Upstash Redis

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS, NextUI
- **Database**: Supabase (with pgvector)
- **AI/ML**: 
  - Langchain
  - OpenAI
  - D3.js for visualizations
- **Authentication**: NextAuth.js
- **Caching**: Upstash Redis
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.17 or later
- npm or yarn package manager
- Git

## Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/medevs/smart-portfolio.git
   cd smart-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # GitHub
   GITHUB_ACCESS_TOKEN=your_github_token

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

4. **Database Setup**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Enable the pgvector extension
   create extension if not exists vector;

   -- Create documents table for vector storage
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
   begin
     return query
     select
       id,
       content,
       metadata,
       1 - (documents.embedding <=> query_embedding) as similarity
     from documents
     where metadata @> filter
     order by documents.embedding <=> query_embedding
     limit match_count;
   end;
   $$;
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:3000`

6. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── tech-stack-architect/  # Tech stack visualization
│   │   ├── github-stats/          # GitHub integration
│   │   └── chat/                  # AI chatbot components
│   ├── lib/             # Utility functions and API clients
│   └── styles/          # Global styles and Tailwind
├── public/              # Static assets
├── scripts/             # Build and generation scripts
├── posts/              # Blog posts and content
└── utils/              # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static content
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.