# CueLABS™ Platform

<div align="center">
  <img src="public/svgs/cuesoft-logo.svg" alt="CueLABS™ Logo" width="200"/>

**AI Innovation for Global Impact**

A community-driven platform for developers to collaborate on AI and open-source projects while earning rewards through a gamified system.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)

</div>

## 🚀 Features

- **🎯 Bounty System**: Participate in development bounties and earn Cue Currency rewards
- **📊 Project Management**: Track and manage collaborative development projects
- **🛒 Marketplace**: Purchase items using earned Cue Currency
- **🏆 Leaderboards**: Community rankings and achievement system
- **👥 User Profiles**: Comprehensive developer profiles with GitHub integration
- **🔐 Secure Authentication**: GitHub OAuth integration for seamless login
- **⚡ Admin Dashboard**: Administrative tools for managing bounties and submissions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Redux Toolkit + TanStack Query
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Airtable integration
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher)
- **npm** or **yarn**
- **Git**
- **GitHub account** (for OAuth setup)
- **Airtable account** (for database setup)

## 🚀 Quick Start

1. **Fork and clone the repository**

   ```bash
   # Fork the repository on GitHub first, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cuelabs-platform.git
   cd cuelabs-platform

   # Add the upstream repository
   git remote add upstream https://github.com/cuesoftinc/cuelabs-platform.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see [Environment Setup](#environment-setup) below)

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Setup

### 1. Airtable Configuration

1. Create a new Airtable base or use an existing one
2. Set up the required tables (see [Airtable Setup Guide](docs/setup/airtable-setup.md))
3. Get your API key from [Airtable Account](https://airtable.com/account)
4. Get your Base ID from the Airtable API documentation

### 2. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: CueLABS™ Platform (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret

### 3. Environment Variables

Update your `.env.local` file with the following variables:

```env
# Database
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Optional: Analytics
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Fork-based Workflow Guide](docs/FORK_WORKFLOW.md)
- [Airtable Setup Guide](docs/setup/airtable-setup.md)
- [GitHub OAuth Setup](docs/setup/github-oauth-setup.md)
- [API Documentation](docs/api/overview.md)
- [Architecture Overview](docs/architecture/system-overview.md)
- [Deployment Guide](docs/deployment/vercel-deployment.md)

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork** locally and add upstream remote
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes** following our coding standards
5. **Run tests and linting** (`npm run test && npm run lint`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request** from your fork to the upstream `main` branch

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
```

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── platform/       # Platform pages (auth, dashboard, admin)
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # shadcn/ui base components
│   └── custom/        # Application-specific components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── store/             # Redux store and slices
└── types/             # TypeScript type definitions
```

## 🔒 Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) for responsible disclosure.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Community

- **GitHub Discussions**: [Join the conversation](https://github.com/cuesoftinc/cuelabs-platform/discussions)
- **Issues**: [Report bugs or request features](https://github.com/cuesoftinc/cuelabs-platform/issues)
- **Twitter**: [@cuesoftinc](https://twitter.com/cuesoftinc)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)

---

<div align="center">
  Made with ❤️ by the CueLABS™ community
</div>
