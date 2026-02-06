# DailyBites

A modern fullstack web application built with Next.js and bkend.ai BaaS platform.

## Features

- 🔐 Authentication (Login/Register)
- 📊 Database integration with bkend.ai
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Next.js 15
- 🔒 Type-safe with TypeScript
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- bkend.ai account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Get your bkend.ai credentials:
   - Sign up at https://bkend.ai
   - Create a new project
   - Copy API Key and Project ID to `.env.local`

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: bkend.ai BaaS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## Project Structure

```
dailybites/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/             # Utilities and configurations
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── docs/            # PDCA documentation
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed development guide and architecture documentation.

## License

MIT
