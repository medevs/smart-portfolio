# Next.js Portfolio with AI Chatbot

This project is a personal portfolio website built with Next.js, featuring an AI-powered chatbot that can answer questions about the website's content and the owner's projects.

## Features

- Responsive portfolio website showcasing projects and skills
- AI chatbot integrated into the website
- Dynamic content management for projects and blog posts
- GitHub integration to display repositories and contributions
- Dark mode support

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Octokit (for GitHub API integration)
- Langchain (for AI chatbot functionality)
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
│   └── generateEmbeddings.ts
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

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Generate embeddings for the chatbot:
   ```bash
   npm run generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

This project is set up for easy deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy your main branch.

Make sure to add all the environment variables from your `.env.local` file to your Vercel project settings.

## Updating Content

To update the chatbot's knowledge:

1. Modify the `data.json` file with your updated content
2. Run the embedding generation script:
   ```bash
   npm run generate
   ```
3. Deploy the updates to Vercel

## Customization

- Modify the components in `src/components/` to change the layout and design of your portfolio
- Update the `src/app/` directory to add or modify pages
- Adjust the chatbot's behavior by modifying the `Chatbot.tsx` component and the embedding generation script

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.