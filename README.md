# Smart Portfolio with AI Integration

This project is a modern portfolio website built with Next.js 15, featuring AI-powered components including a chatbot, tech stack validation, and interactive visualizations.

## Key Features

- **AI-powered Chatbot**: Interactive portfolio exploration using LangChain and OpenAI, with vector search capabilities through Supabase pgvector
- **Tech Stack Architecture Visualization**: Interactive drag-and-drop interface to design and validate technology stacks with AI feedback
- **GitHub Integration**: Dynamic GitHub statistics, featured projects, and contribution graphs
- **Responsive Design**: Fully responsive UI with dark/light mode support using Tailwind CSS and NextUI components
- **Blog System**: Markdown-based blog with reading time estimation and syntax highlighting
- **Performance Optimized**: Server components, static generation, and efficient caching strategies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS, NextUI components, Framer Motion
- **Database**: Supabase with pgvector for vector embeddings
- **AI/ML**: 
  - LangChain for chat functionality
  - OpenAI for embeddings and completions
  - ReactFlow for tech stack visualization
- **GitHub API**: Octokit for repository and contribution data
- **UI Components**: 
  - React Icons
  - Lucide React
  - Recharts for data visualization
- **Content**: 
  - React Markdown
  - Gray Matter for frontmatter parsing
  - React Syntax Highlighter

## Features Summary

1. **Home Page**: Featuring about section, skills, timeline, and featured projects
2. **Tech Stack Architect**: Interactive tool for designing and validating technology stacks with AI feedback
3. **Blog System**: Markdown-based blog with filtering capabilities
4. **AI Chatbot**: Conversational interface for exploring the portfolio
5. **GitHub Integration**: Dynamic display of repositories and statistics

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git
- [Supabase](https://supabase.com) account (free tier works)
- [OpenAI](https://platform.openai.com) API key

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/medevs/smart-portfolio.git
   cd smart-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your credentials:

   | Variable | Description | Where to Get |
   |----------|-------------|--------------|
   | `SUPABASE_URL` | Your Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
   | `SUPABASE_ANON_KEY` | Public anonymous key | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
   | `OPENAI_API_KEY` | OpenAI API key | [OpenAI Platform](https://platform.openai.com/api-keys) |

4. **Set Up Supabase Database**

   **Option A: Using Supabase Dashboard (Recommended for beginners)**

   1. Create a new project at [supabase.com](https://supabase.com)
   2. Go to the SQL Editor in your project dashboard
   3. Run each migration file in order from `supabase/migrations/`:
      - `20240101000000_enable_pgvector.sql`
      - `20240101000001_create_documents_table.sql`
      - `20240101000002_create_match_function.sql`

   **Option B: Using Supabase CLI**

   ```bash
   # Install Supabase CLI if you haven't
   npm install -g supabase

   # Link to your remote project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

5. **Generate Embeddings**
   ```bash
   npm run generate
   ```
   This populates the database with document embeddings for the AI chat.

6. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Database Schema

The project uses Supabase with pgvector for AI-powered semantic search. The schema includes:

- **`documents` table**: Stores content chunks with vector embeddings
- **`match_documents` function**: Performs cosine similarity search

Migration files are located in `supabase/migrations/` for version control and reproducibility.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key |
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings & chat |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Only for local CLI migrations |

> **Note**: These are server-side variables. Do NOT prefix with `NEXT_PUBLIC_` as they contain sensitive keys.

## Build for Production

```bash
npm run build
npm run start
```

## Project Structure

For a detailed breakdown of the project’s folders and files, see [Project-Structure.md](./Project-Structure.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.