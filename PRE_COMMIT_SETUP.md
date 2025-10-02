# Pre-commit Hooks Setup Guide

This guide explains how to set up and use pre-commit hooks for the CueLABS™ platform to ensure code quality and consistency.

## What are Pre-commit Hooks?

Pre-commit hooks are scripts that run automatically before each commit to check your code for issues like:

- Code formatting problems
- Linting errors
- Security vulnerabilities
- Commit message format
- Large files
- Merge conflicts

## Prerequisites

### Node.js Version

This project requires Node.js 22. If you're using nvm:

```bash
nvm use
```

Or check your Node version with:

```bash
make node-version
```

## Installation

### 1. Install pre-commit

**Using pip (recommended):**

```bash
pip install pre-commit
```

**Using Homebrew (macOS):**

```bash
brew install pre-commit
```

**Using conda:**

```bash
conda install -c conda-forge pre-commit
```

### 2. Install the hooks

After installing pre-commit, run:

```bash
npm run pre-commit:install
```

Or manually:

```bash
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

## Usage

### Automatic Usage

Once installed, the hooks will run automatically on every commit. If any hook fails, the commit will be blocked until you fix the issues.

### Manual Usage

You can run all hooks on all files manually:

```bash
npm run pre-commit:run
```

Or using pre-commit directly:

```bash
pre-commit run --all-files
```

### Run specific hooks

```bash
pre-commit run eslint --all-files
pre-commit run prettier --all-files
```

## Configured Hooks

### Code Quality

- **ESLint**: JavaScript/TypeScript linting with auto-fix
- **Prettier**: Code formatting
- **TypeScript Check**: Type checking without emitting files

### File Checks

- **Trailing Whitespace**: Removes trailing whitespace
- **End of File Fixer**: Ensures files end with a newline
- **Large Files Check**: Prevents committing files larger than 1MB
- **Merge Conflict Check**: Detects merge conflict markers

### Format Validation

- **YAML Check**: Validates YAML syntax
- **JSON Check**: Validates JSON syntax
- **TOML Check**: Validates TOML syntax

### Security

- **Detect Secrets**: Scans for potential secrets and API keys
- **Private Key Detection**: Prevents committing private keys

### Commit Message

- **Conventional Commits**: Enforces conventional commit message format

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: extract user service
test: add unit tests for auth service
chore: update dependencies
```

## Bypassing Hooks (Not Recommended)

In rare cases, you might need to bypass hooks:

```bash
git commit --no-verify -m "emergency fix"
```

**Note:** This should only be used in emergencies and the issues should be fixed in a follow-up commit.

## Troubleshooting

### Hook Installation Issues

If hooks aren't running, reinstall them:

```bash
pre-commit clean
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

### ESLint Issues

If ESLint fails, run it manually to see detailed errors:

```bash
npm run lint
```

### Prettier Issues

If Prettier fails, format the files manually:

```bash
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"
```

### TypeScript Issues

If TypeScript check fails, run type checking manually:

```bash
npx tsc --noEmit
```

### Secrets Detection

If secrets are detected, review the flagged files and either:

1. Remove the actual secrets and use environment variables
2. Add false positives to the allowlist in `.secrets.baseline`

## Configuration Files

- `.pre-commit-config.yaml`: Main configuration file
- `.secrets.baseline`: Baseline for secrets detection
- `package.json`: Contains npm scripts for pre-commit

## Updating Hooks

To update to the latest versions of hooks:

```bash
pre-commit autoupdate
```

## Getting Help

If you encounter issues with pre-commit hooks:

1. Check this guide for common solutions
2. Run hooks manually to see detailed error messages
3. Check the [pre-commit documentation](https://pre-commit.com/)
4. Ask for help in the project's issue tracker
