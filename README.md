# Smart Portfolio with AI Integration

A modern, terminal-inspired portfolio website built with Next.js 15, featuring an AI-powered chatbot with RAG (Retrieval-Augmented Generation) capabilities and a responsive bento grid layout.

## Key Features

- **AI-powered Chatbot**: Interactive portfolio exploration using LangChain and OpenAI, with vector search capabilities through Supabase pgvector for context-aware responses
- **Bento Grid Layout**: Modern, responsive grid design that adapts seamlessly between desktop and mobile views
- **Terminal Aesthetic**: Developer-focused design with terminal-inspired UI elements, typing animations, and command-style interactions
- **Global Theming**: Centralized CSS variable system with full dark/light mode support across all components
- **Blog System**: Markdown-based blog with reading time estimation, syntax highlighting, and table of contents
- **Configurable Content**: All portfolio data (projects, skills, experience, education) managed through TypeScript config files

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables for theming
- **Animations**: Framer Motion
- **Database**: Supabase with pgvector for vector embeddings
- **AI/ML**:
  - LangChain for RAG-based chat functionality
  - OpenAI for embeddings and completions
  - Vercel AI SDK for streaming responses
- **UI Components**:
  - Radix UI primitives (Dialog, Label, Slot)
  - Lucide React icons
  - Custom terminal-style components
- **Content**:
  - React Markdown with GFM support
  - Gray Matter for frontmatter parsing
  - React Syntax Highlighter for code blocks

## Portfolio Sections

1. **Hero**: Personal introduction with animated role typing, availability status, and social links
2. **Products/Projects**: Showcase of featured projects with images, tech stack, and status badges
3. **Skills**: Categorized skill display with progress indicators (Frontend, Backend, Database, AI/ML)
4. **AI Capabilities**: Highlights of AI/ML expertise and interests
5. **Experience**: Professional timeline with role details and technologies
6. **Blog**: Latest blog posts with category filtering
7. **CTA**: Contact section with email and LinkedIn links
8. **AI Chat Widget**: Floating chatbot for interactive portfolio exploration

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

## Configuration

All portfolio content is managed through TypeScript config files in `src/config/`:

- `personal.ts` - Name, email, location, availability status
- `projects.ts` - Featured projects with descriptions and tech stack
- `experience.ts` - Work history and timeline
- `education.ts` - Educational background
- `skills.ts` - Skill categories and proficiency levels
- `social.ts` - Social media links
- `ai.ts` - AI capabilities display
- `seo.ts` - SEO metadata

## Database Schema

The project uses Supabase with pgvector for AI-powered semantic search:

- **`documents` table**: Stores content chunks with vector embeddings
- **`match_documents` function**: Performs cosine similarity search for RAG

Migration files are located in `supabase/migrations/` for version control.

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Generate embeddings and build for production
- `npm run generate` - Generate vector embeddings for RAG
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/chat/          # AI chat API endpoint
│   ├── blog/              # Blog pages
│   └── page.tsx           # Home page with bento grid
├── components/
│   ├── chat/              # AI chatbot components
│   ├── sections/          # Page sections (Hero, Skills, etc.)
│   ├── terminal/          # Terminal-style UI components
│   └── ui/                # Reusable UI primitives
├── config/                # Portfolio configuration files
└── lib/                   # Utility functions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
