# Git Workflow Guide

## Overview

This guide outlines the Git workflow for contributing to the CueLABS™ platform, including branching strategies, commit conventions, and pull request processes.

## Contribution Model

CueLABS™ uses a **fork-based contribution model** for external contributors:

- **External Contributors**: Fork the repository, create branches in your fork, and submit PRs to upstream
- **Maintainers**: Have direct access to the main repository for releases and maintenance

### Why Fork-based?

- **Security**: Protects the main repository from unauthorized changes
- **Isolation**: Contributors work in their own space without affecting others
- **Review Process**: All changes go through proper review before merging
- **Community**: Encourages open source collaboration patterns

## Branching Strategy

We use a simplified branching model focused on the main branch:

### Main Branches

#### `main`

- **Purpose**: Production-ready code and primary development branch
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Automatically deploys to production
- **Merges from**: Feature branches via PRs from forks

### Supporting Branches

#### Feature Branches (`feature/*`)

- **Purpose**: New features and enhancements
- **Naming**: `feature/issue-number-short-description`
- **Examples**:
  - `feature/123-user-dashboard`
  - `feature/456-github-integration`
- **Base**: `main` (from upstream)
- **Merge to**: `main` (via PR from fork)

#### Bug Fix Branches (`fix/*`)

- **Purpose**: Bug fixes and patches
- **Naming**: `fix/issue-number-short-description`
- **Examples**:
  - `fix/789-auth-bug-fix`
  - `fix/101-security-patch`
- **Base**: `main` (from upstream)
- **Merge to**: `main` (via PR from fork)

#### Documentation Branches (`docs/*`)

- **Purpose**: Documentation updates and improvements
- **Naming**: `docs/issue-number-short-description`
- **Examples**:
  - `docs/456-api-documentation`
  - `docs/789-setup-guide`
- **Base**: `main` (from upstream)
- **Merge to**: `main` (via PR from fork)

## Workflow Process

### 1. Starting New Work (Fork-based Workflow)

#### Initial Setup (First-time Contributors)

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/cuelabs-platform.git
cd cuelabs-platform

# 3. Add upstream remote
git remote add upstream https://github.com/cuesoftinc/cuelabs-platform.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR_USERNAME/cuelabs-platform.git (fetch)
# origin    https://github.com/YOUR_USERNAME/cuelabs-platform.git (push)
# upstream  https://github.com/cuesoftinc/cuelabs-platform.git (fetch)
# upstream  https://github.com/cuesoftinc/cuelabs-platform.git (push)
```

#### For New Features

```bash
# 1. Sync with upstream and ensure you're on main
git checkout main
git pull upstream main
git push origin main

# 2. Create feature branch
git checkout -b feature/123-user-dashboard

# 3. Push branch to your fork
git push -u origin feature/123-user-dashboard
```

#### For Hotfixes (Maintainers Only)

```bash
# 1. Sync with upstream main
git checkout main
git pull upstream main
git push origin main

# 2. Create hotfix branch
git checkout -b hotfix/789-auth-bug-fix

# 3. Push branch to your fork
git push -u origin hotfix/789-auth-bug-fix
```

**Note**: Hotfixes are typically handled by maintainers. External contributors should create regular feature branches for bug fixes.

### 2. Development Process

#### Making Changes

```bash
# 1. Make your changes
# Edit files, add features, fix bugs

# 2. Stage changes
git add .

# 3. Commit with conventional commit message
git commit -m "feat: add user dashboard with analytics"

# 4. Push changes regularly
git push origin feature/123-user-dashboard
```

#### Keeping Branch Updated

```bash
# 1. Fetch latest changes from upstream
git fetch upstream

# 2. Rebase on upstream main (for feature branches)
git rebase upstream/main

# 3. Force push to your fork (after rebase)
git push --force-with-lease origin feature/123-user-dashboard
```

### 3. Pull Request Process

#### Creating a Pull Request

1. **Push Final Changes**

   ```bash
   git push origin feature/123-user-dashboard
   ```

2. **Create PR on GitHub**
   - Navigate to the upstream repository (cuesoftinc/cuelabs-platform) on GitHub
   - Click "New Pull Request"
   - Select "compare across forks"
   - Base repository: `cuesoftinc/cuelabs-platform` base: `main`
   - Head repository: `YOUR_USERNAME/cuelabs-platform` compare: `feature/123-user-dashboard`
   - Fill out PR template completely

3. **PR Requirements**
   - [ ] Descriptive title and description
   - [ ] Link to related issue(s)
   - [ ] Screenshots for UI changes
   - [ ] Tests pass
   - [ ] Code review requested

#### PR Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Code quality checks
   - Security scans

2. **Code Review**
   - At least 1 reviewer required
   - Address all review comments
   - Request re-review after changes

3. **Merge Requirements**
   - All checks passing ✅
   - Approved by reviewer(s) ✅
   - No merge conflicts ✅
   - Up to date with base branch ✅

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve login redirect issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Code style changes | `style: format code with prettier` |
| `refactor` | Code refactoring | `refactor: extract user service` |
| `test` | Adding tests | `test: add unit tests for auth service` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add deployment workflow` |
| `perf` | Performance improvements | `perf: optimize database queries` |

### Commit Examples

```bash
# Feature addition
git commit -m "feat(auth): implement GitHub OAuth integration"

# Bug fix
git commit -m "fix(dashboard): resolve chart rendering issue on mobile"

# Documentation
git commit -m "docs(api): add authentication endpoint documentation"

# Breaking change
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns nested user object"

# Multiple changes
git commit -m "feat(dashboard): add user analytics

- Add earnings chart component
- Implement data fetching hooks
- Add responsive design for mobile

Closes #123"
```

## Code Review Guidelines

### For Authors

#### Before Requesting Review

- [ ] Self-review your changes
- [ ] Ensure tests pass locally
- [ ] Update documentation if needed
- [ ] Add screenshots for UI changes
- [ ] Write clear PR description

#### During Review

- [ ] Respond to comments promptly
- [ ] Ask questions if feedback is unclear
- [ ] Make requested changes
- [ ] Request re-review after updates
- [ ] Be open to feedback and suggestions

### For Reviewers

#### Review Checklist

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Code Quality**: Is the code clean and maintainable?
- [ ] **Performance**: Are there any performance concerns?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Tests**: Are there adequate tests for the changes?
- [ ] **Documentation**: Is documentation updated if needed?

#### Review Process

1. **Understand the Context**
   - Read the PR description
   - Check linked issues
   - Understand the problem being solved

2. **Review the Code**
   - Check for logic errors
   - Verify code style consistency
   - Look for potential improvements
   - Test locally if needed

3. **Provide Feedback**
   - Be constructive and specific
   - Suggest improvements, don't just point out problems
   - Use GitHub's suggestion feature for small changes
   - Approve when satisfied with changes

#### Review Comments

```markdown
# Good review comments

## Suggestion
Consider using a more descriptive variable name here:
```suggestion
const userAuthenticationToken = generateToken();
```

## Question

Why did you choose this approach over using the existing utility function?

## Nitpick

Minor: This could be simplified to a single line.

## Blocking

This introduces a security vulnerability. Please use the sanitized input instead.

```

## Merge Strategies

### Merge Commit (Recommended)

- **When**: Feature branches to main
- **Benefits**: Preserves complete development history, shows commit progression
- **Process**: GitHub creates merge commit preserving all commits

```bash
# Result: Merge commit in main branch
Merge pull request #123 from user/feature-branch
```

### Merge Commit

- **When**: Release branches to main
- **Benefits**: Preserves branch history
- **Process**: Creates merge commit

```bash
# Result: Merge commit preserving branch history
Merge pull request #456 from feature/user-dashboard
```

### Rebase and Merge

- **When**: Small, clean commits that add value individually
- **Benefits**: Linear history without merge commits
- **Process**: Replays commits on target branch

## Release Process

### 1. Prepare Release

```bash
# 1. Create release branch from main
git checkout main
git pull origin main
git checkout -b release/1.2.0

# 2. Update version numbers
npm version 1.2.0 --no-git-tag-version

# 3. Update CHANGELOG.md
# Add release notes and changes

# 4. Commit version bump
git add .
git commit -m "chore(release): bump version to 1.2.0"

# 5. Push release branch
git push -u origin release/1.2.0
```

### 2. Testing and Bug Fixes

```bash
# Make any necessary bug fixes in release branch
git commit -m "fix(release): resolve critical bug before release"
git push origin release/1.2.0
```

### 3. Merge to Main

```bash
# 1. Create PR from release/1.2.0 to main
# 2. After approval and testing, merge to main
# 3. Tag the release
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### 4. Clean Up

```bash
# 1. Delete release branch after merge to main
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```

## Git Hooks

### Pre-commit Hooks

We use [pre-commit](https://pre-commit.com/) for automated checks:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
      - id: check-json
      - id: check-yaml

  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npm run lint
        language: system
        files: \.(js|jsx|ts|tsx)$

      - id: prettier
        name: Prettier
        entry: npm run format
        language: system
        files: \.(js|jsx|ts|tsx|json|md)$
```

### Commit Message Hook

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Check commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|ci|perf)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: type(scope): description"
    echo "Example: feat(auth): add GitHub OAuth integration"
    exit 1
fi
```

## Troubleshooting

### Common Git Issues

#### Merge Conflicts

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Rebase on target branch
git rebase origin/main

# 3. Resolve conflicts in files
# Edit conflicted files, remove conflict markers

# 4. Stage resolved files
git add resolved-file.js

# 5. Continue rebase
git rebase --continue

# 6. Force push (if needed)
git push --force-with-lease origin feature/branch-name
```

#### Accidentally Committed to Wrong Branch

```bash
# 1. Create new branch from current commit
git branch feature/correct-branch

# 2. Reset current branch to previous commit
git reset --hard HEAD~1

# 3. Switch to correct branch
git checkout feature/correct-branch
```

#### Need to Update PR After Force Push

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Reset to remote branch
git reset --hard origin/feature/branch-name

# 3. Make new changes
# Edit files

# 4. Commit and push
git add .
git commit -m "fix: address review comments"
git push origin feature/branch-name
```

### Git Best Practices

#### Do's

- ✅ Write clear, descriptive commit messages
- ✅ Keep commits small and focused
- ✅ Rebase feature branches before merging
- ✅ Use conventional commit format
- ✅ Test changes before committing
- ✅ Review your own changes before requesting review

#### Don'ts

- ❌ Commit directly to main
- ❌ Force push to shared branches
- ❌ Commit large binary files
- ❌ Mix unrelated changes in single commit
- ❌ Ignore merge conflicts
- ❌ Skip code review process

## Tools and Resources

### Recommended Git Tools

- **Git CLI**: Primary interface for Git operations
- **GitHub CLI**: `gh` command for GitHub operations
- **Git GUI**: GitKraken, SourceTree, or VS Code Git integration
- **Diff Tools**: Beyond Compare, Meld, or built-in VS Code diff

### Useful Git Aliases

```bash
# Add to ~/.gitconfig
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    graph = log --oneline --graph --decorate --all
    amend = commit --amend --no-edit
    pushf = push --force-with-lease
```

### GitHub CLI Commands

```bash
# Install GitHub CLI
brew install gh  # macOS
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Create PR from command line
gh pr create --title "feat: add user dashboard" --body "Implements user analytics dashboard"

# Check PR status
gh pr status

# Merge PR
gh pr merge --merge

# View PR in browser
gh pr view --web
```
