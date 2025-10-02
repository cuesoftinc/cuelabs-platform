# Contributing to CueLABS™ Platform

Thank you for your interest in contributing to CueLABS™ Platform! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to our community-driven platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Fork-based Workflow](#fork-based-workflow)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community Support](#community-support)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@cuesoft.io](mailto:support@cuesoft.io).

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v22 or higher)
- **npm** or **yarn**
- **Git**
- **GitHub account**
- **Airtable account** (for database integration)

## 🍴 Fork-based Workflow

CueLABS™ uses a fork-based contribution model. This means:

### Why Fork-based?

- **Security**: Protects the main repository from unauthorized changes
- **Isolation**: You work in your own copy without affecting others
- **Review Process**: All changes are reviewed before merging
- **Open Source Standard**: Follows established open source practices

### How It Works

1. **Fork**: Create your own copy of the repository
2. **Clone**: Download your fork to your local machine
3. **Branch**: Create feature branches in your fork
4. **Develop**: Make changes in your local environment
5. **Push**: Upload changes to your fork
6. **Pull Request**: Request to merge changes into the main repository
7. **Review**: Maintainers review and provide feedback
8. **Merge**: Approved changes are merged into main repository

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/cuelabs-platform.git
   cd cuelabs-platform
   ```

3. **Add the upstream remote**:

   ```bash
   git remote add upstream https://github.com/cuesoftinc/cuelabs-platform.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   See the [Environment Setup](#environment-setup) section for detailed configuration.

## ⚙️ Development Setup

### Environment Configuration

1. **Airtable Setup**:
   - Create an Airtable base with the required tables
   - Follow our [Airtable Setup Guide](docs/setup/airtable-setup.md)
   - Add your API key and Base ID to `.env.local`

2. **GitHub OAuth Setup**:
   - Create a GitHub OAuth App
   - Follow our [GitHub OAuth Setup Guide](docs/setup/github-oauth-setup.md)
   - Add your Client ID and Secret to `.env.local`

3. **Start Development Server**:

   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🔄 Contribution Workflow

### 1. Sync Your Fork

Before starting new work, always sync with the upstream repository:

```bash
# Fetch latest changes from upstream
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push updates to your fork
git push origin main
```

### 2. Create a Branch

Always create a new branch for your work:

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Push branch to your fork
git push -u origin feature/your-feature-name
```

### Branch Naming Convention

- **Features**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-fix`
- **Documentation**: `docs/description-of-update`
- **Refactoring**: `refactor/description-of-refactor`

### 2. Make Your Changes

- Write clear, concise commit messages
- Follow our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

Before submitting, ensure:

```bash
npm run lint         # No linting errors
npm run type-check   # No TypeScript errors
npm run test         # All tests pass
npm run build        # Project builds successfully
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user profile editing functionality"
```

### 5. Keep Your Branch Updated

Regularly sync your branch with upstream changes:

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch on upstream main
git rebase upstream/main

# Force push to your fork (after rebase)
git push --force-with-lease origin feature/your-feature-name
```

#### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 6. Push and Create Pull Request

```bash
# Push final changes to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub:

1. Navigate to the [upstream repository](https://github.com/cuesoftinc/cuelabs-platform)
2. Click "New Pull Request"
3. Click "compare across forks"
4. Select:
   - **Base repository**: `cuesoftinc/cuelabs-platform`
   - **Base branch**: `main`
   - **Head repository**: `YOUR_USERNAME/cuelabs-platform`
   - **Compare branch**: `feature/your-feature-name`
5. Fill out the PR template completely
6. Submit the pull request

## 🎨 Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

### React Guidelines

- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing with interfaces
- Implement proper error boundaries

### Styling Guidelines

- Use Tailwind CSS for styling
- Follow the existing design system
- Use shadcn/ui components when possible
- Maintain responsive design principles

### File Organization

- Place components in appropriate directories
- Use kebab-case for file names
- Group related functionality together
- Follow the existing project structure

## 🧪 Testing Guidelines

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Ensure good test coverage for new features

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 📝 Pull Request Process

### Before Submitting

1. **Sync with upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**:

   ```bash
   npm run lint && npm run type-check && npm run test && npm run build
   ```

### Pull Request Template

When creating a PR, please fill out our template with:

- **Description**: Clear description of changes
- **Related Issues**: Link to related issues
- **Type of Change**: Bug fix, feature, documentation, etc.
- **Testing**: How you tested your changes
- **Screenshots**: If UI changes are involved
- **Checklist**: Confirm you've completed all requirements

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Verify functionality works as expected
4. **Documentation**: Ensure documentation is updated if needed

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Try the latest version** to see if the issue persists

### Issue Types

- **Bug Report**: Use the bug report template
- **Feature Request**: Use the feature request template
- **Question**: Use the question template
- **Documentation**: Use the documentation template

### Writing Good Issues

- **Clear title**: Descriptive and specific
- **Detailed description**: Steps to reproduce, expected behavior
- **Environment info**: OS, Node version, browser, etc.
- **Screenshots**: If applicable
- **Code samples**: Minimal reproduction case

## 🤝 Community Support

### Getting Help

- **GitHub Discussions**: For general questions and community chat
- **Issues**: For bug reports and feature requests
- **Discord**: [Join our Discord server](https://discord.gg/CDfZxxrxbb) for real-time chat
- **Email**: [support@cuesoft.io](mailto:support@cuesoft.io) for private inquiries

### Contributing Beyond Code

- **Documentation**: Improve guides and tutorials
- **Design**: UI/UX improvements and suggestions
- **Testing**: Help test new features and report bugs
- **Community**: Help answer questions and support other contributors

## 🏆 Recognition

Contributors are recognized in several ways:

- **Contributors page**: Listed on our website
- **GitHub contributors**: Automatic recognition on GitHub
- **Cue Currency**: Earn rewards for significant contributions
- **Special badges**: Recognition in the platform

## 📚 Additional Resources

- [Fork-based Workflow Guide](docs/FORK_WORKFLOW.md)
- [Git Workflow Guide](docs/development/git-workflow.md)
- [Architecture Documentation](docs/architecture/system-overview.md)
- [API Documentation](docs/api/overview.md)
- [Deployment Guide](docs/deployment/vercel-deployment.md)
- [Troubleshooting Guide](docs/setup/troubleshooting.md)

## 📞 Contact

- **Maintainers**: [cuelabs@cuesoft.io](mailto:cuelabs@cuesoft.io)
- **Security**: [support@cuesoft.io](mailto:support@cuesoft.io)
- **General**: [hello@cuesoft.io](mailto:hello@cuesoft.io)

---

Thank you for contributing to CueLABS™ Platform! Your contributions help make this platform better for the entire developer community. 🚀
