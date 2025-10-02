# Fork-based Contribution Workflow

## Overview

CueLABS™ uses a **fork-based contribution model** for all external contributions. This document explains how to contribute to the project using GitHub forks.

## Why Fork-based Workflow?

### Benefits

- **Security**: Protects the main repository from unauthorized changes
- **Isolation**: Contributors work in their own space without conflicts
- **Review Process**: All changes go through proper code review
- **Open Source Standard**: Follows established open source practices
- **Learning**: Teaches proper Git collaboration patterns

### Repository Structure

```
cuesoftinc/cuelabs-platform (upstream)
├── main branch (production-ready code)
└── Protected branches (require PR reviews)

YOUR_USERNAME/cuelabs-platform (your fork)
├── main branch (synced with upstream)
├── feature/your-feature (your work)
└── fix/your-bugfix (your work)
```

## Step-by-Step Workflow

### 1. Initial Setup (One-time)

#### Fork the Repository

1. Go to [https://github.com/cuesoftinc/cuelabs-platform](https://github.com/cuesoftinc/cuelabs-platform)
2. Click the "Fork" button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for the fork to be created

#### Clone Your Fork

```bash
# Clone your fork (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/cuelabs-platform.git
cd cuelabs-platform

# Add upstream remote
git remote add upstream https://github.com/cuesoftinc/cuelabs-platform.git

# Verify remotes
git remote -v
# Should show:
# origin    https://github.com/YOUR_USERNAME/cuelabs-platform.git (fetch)
# origin    https://github.com/YOUR_USERNAME/cuelabs-platform.git (push)
# upstream  https://github.com/cuesoftinc/cuelabs-platform.git (fetch)
# upstream  https://github.com/cuesoftinc/cuelabs-platform.git (push)
```

### 2. Starting New Work

#### Sync with Upstream

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

#### Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/123-user-dashboard

# Push branch to your fork
git push -u origin feature/123-user-dashboard
```

### 3. Development Process

#### Make Changes

```bash
# Make your changes
# Edit files, add features, fix bugs

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user dashboard with analytics"

# Push to your fork
git push origin feature/123-user-dashboard
```

#### Keep Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch on upstream main
git rebase upstream/main

# Resolve any conflicts if they occur
# Edit conflicted files, then:
git add .
git rebase --continue

# Force push to your fork (after rebase)
git push --force-with-lease origin feature/123-user-dashboard
```

### 4. Creating Pull Request

#### Push Final Changes

```bash
# Ensure all changes are pushed
git push origin feature/123-user-dashboard
```

#### Create PR on GitHub

1. **Navigate to Upstream Repository**
   - Go to [https://github.com/cuesoftinc/cuelabs-platform](https://github.com/cuesoftinc/cuelabs-platform)

2. **Start New Pull Request**
   - Click "New Pull Request"
   - Click "compare across forks"

3. **Select Branches**
   - **Base repository**: `cuesoftinc/cuelabs-platform`
   - **Base branch**: `main`
   - **Head repository**: `YOUR_USERNAME/cuelabs-platform`
   - **Compare branch**: `feature/123-user-dashboard`

4. **Fill Out PR Template**
   - Add descriptive title
   - Complete the PR template
   - Link related issues
   - Add screenshots if UI changes

5. **Submit Pull Request**
   - Click "Create Pull Request"
   - Wait for review and feedback

### 5. Review Process

#### Responding to Feedback

```bash
# Make requested changes
# Edit files based on review comments

# Commit changes
git add .
git commit -m "fix: address review comments"

# Push to your fork (PR updates automatically)
git push origin feature/123-user-dashboard
```

#### After Merge

```bash
# Switch to main branch
git checkout main

# Sync with upstream (includes your merged changes)
git pull upstream main

# Push to your fork
git push origin main

# Delete feature branch (optional)
git branch -d feature/123-user-dashboard
git push origin --delete feature/123-user-dashboard
```

## Branch Naming Conventions

### Feature Branches

```bash
feature/issue-number-short-description
feature/123-user-dashboard
feature/456-github-integration
```

### Bug Fix Branches

```bash
fix/issue-number-short-description
fix/789-login-redirect-bug
fix/101-mobile-layout-issue
```

### Documentation Branches

```bash
docs/issue-number-short-description
docs/456-api-documentation
docs/789-setup-guide-update
```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```bash
# Feature
git commit -m "feat(auth): add GitHub OAuth integration"

# Bug fix
git commit -m "fix(dashboard): resolve chart rendering on mobile"

# Documentation
git commit -m "docs(api): add authentication endpoint examples"

# Breaking change
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns nested user object"
```

## Common Scenarios

### Scenario 1: Simple Feature Addition

```bash
# 1. Sync and create branch
git checkout main
git pull upstream main
git checkout -b feature/new-button
git push -u origin feature/new-button

# 2. Make changes
# Edit files...
git add .
git commit -m "feat: add new action button to dashboard"
git push origin feature/new-button

# 3. Create PR on GitHub
# Follow PR creation steps above
```

### Scenario 2: Long-running Feature

```bash
# 1. Create branch
git checkout -b feature/complex-feature
git push -u origin feature/complex-feature

# 2. Work and commit regularly
git add .
git commit -m "feat: add initial component structure"
git push origin feature/complex-feature

# 3. Keep updated with upstream (do this regularly)
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin feature/complex-feature

# 4. Continue development...
git add .
git commit -m "feat: add API integration"
git push origin feature/complex-feature

# 5. Final sync before PR
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin feature/complex-feature

# 6. Create PR
```

### Scenario 3: Fixing Merge Conflicts

```bash
# During rebase, if conflicts occur:
git fetch upstream
git rebase upstream/main

# Git will pause and show conflicts
# Edit conflicted files to resolve conflicts
# Remove conflict markers (<<<<<<<, =======, >>>>>>>)

# Stage resolved files
git add resolved-file.js

# Continue rebase
git rebase --continue

# Push to your fork
git push --force-with-lease origin feature/your-branch
```

## Troubleshooting

### Problem: Fork is Behind Upstream

```bash
# Solution: Sync your fork
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### Problem: Accidentally Committed to Main

```bash
# Solution: Move commits to feature branch
git branch feature/accidental-commits
git reset --hard upstream/main
git checkout feature/accidental-commits
git push -u origin feature/accidental-commits
```

### Problem: Need to Update PR After Force Push

```bash
# Solution: PR automatically updates when you push to your branch
git push origin feature/your-branch
# PR will show updated changes automatically
```

### Problem: Multiple People Working on Same Feature

```bash
# Solution: Create shared feature branch in one fork
# Or coordinate through issues and split work
```

## Best Practices

### Do's ✅

- **Always work in feature branches**
- **Keep your fork synced with upstream**
- **Write clear commit messages**
- **Rebase before creating PR**
- **Respond promptly to review feedback**
- **Test your changes locally**
- **Follow the PR template**

### Don'ts ❌

- **Don't commit directly to main branch**
- **Don't force push to main branch**
- **Don't ignore merge conflicts**
- **Don't create PRs with unrelated changes**
- **Don't skip the review process**
- **Don't forget to link related issues**

## GitHub CLI Shortcuts

Install [GitHub CLI](https://cli.github.com/) for easier workflow:

```bash
# Install GitHub CLI
brew install gh  # macOS
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Fork repository
gh repo fork cuesoftinc/cuelabs-platform --clone

# Create PR from command line
gh pr create --title "feat: add user dashboard" --body "Implements user analytics dashboard"

# Check PR status
gh pr status

# View PR in browser
gh pr view --web
```

## Resources

- [GitHub Fork Documentation](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [Git Workflow Guide](./development/git-workflow.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI](https://cli.github.com/)

## Getting Help

If you need help with the fork workflow:

1. **Check Documentation**: Review this guide and related docs
2. **Search Issues**: Look for similar questions in [GitHub Issues](https://github.com/cuesoftinc/cuelabs-platform/issues)
3. **Ask Questions**: Create a new issue with the "question" label
4. **Join Discussions**: Participate in [GitHub Discussions](https://github.com/cuesoftinc/cuelabs-platform/discussions)

---

**Remember**: The fork-based workflow might seem complex at first, but it's the standard way to contribute to open source projects. Once you get comfortable with it, it becomes second nature!
