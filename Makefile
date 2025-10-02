# CueLABS™ Platform Development Makefile
# This Makefile provides common development commands for the CueLABS™ platform

.PHONY: help install dev build start test lint format clean setup check-deps

# Default target
help: ## Show this help message
	@echo "CueLABS™ Platform Development Commands"
	@echo "====================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Installation and setup
install: check-node ## Install all dependencies
	@echo "Installing dependencies..."
	npm install

node-version: ## Check and switch to correct Node.js version
	@echo "Checking Node.js version..."
	@if [ -f .nvmrc ]; then \
		echo "Required Node.js version: $$(cat .nvmrc)"; \
		echo "Current Node.js version: $$(node --version)"; \
		if command -v nvm >/dev/null 2>&1; then \
			echo "Switching to required Node.js version..."; \
			echo "Run: nvm use"; \
		else \
			echo "⚠️  nvm not found. Please install nvm or ensure Node.js $$(cat .nvmrc) is installed."; \
		fi; \
	else \
		echo "No .nvmrc file found."; \
	fi

setup: node-version install ## Initial project setup (check Node version, install dependencies and create .env)
	@echo "Setting up CueLABS™ platform..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "✅ .env file created. Please update it with your configuration."; \
	else \
		echo "⚠️  .env file already exists."; \
	fi
	@echo ""
	@echo "Setting up pre-commit hooks..."
	@if command -v pre-commit >/dev/null 2>&1; then \
		npm run pre-commit:install; \
		echo "✅ Pre-commit hooks installed."; \
	else \
		echo "⚠️  pre-commit not found. Install it with: pip install pre-commit"; \
		echo "   Then run: make pre-commit-install"; \
	fi
	@echo ""
	@echo "✅ Setup complete! Run 'make dev' to start development server."
	@echo "📖 See PRE_COMMIT_SETUP.md for pre-commit hooks documentation."

# Development
dev: check-deps ## Start development server
	@echo "Starting development server..."
	npm run dev

build: check-deps ## Build for production
	@echo "Building for production..."
	npm run build

start: ## Start production server (requires build first)
	@echo "Starting production server..."
	npm run start

# Code quality
lint: check-deps ## Run ESLint
	@echo "Running ESLint..."
	npm run lint

lint-fix: check-deps ## Run ESLint with auto-fix
	@echo "Running ESLint with auto-fix..."
	npm run lint -- --fix

format: check-deps ## Format code with Prettier
	@echo "Formatting code with Prettier..."
	npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

format-check: check-deps ## Check code formatting with Prettier
	@echo "Checking code formatting..."
	npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"

# Testing (placeholder for future test setup)
test: check-deps ## Run tests (placeholder - no tests configured yet)
	@echo "⚠️  No tests configured yet. Consider adding Jest or Vitest for testing."
	@echo "   Example: npm install --save-dev jest @types/jest"

test-watch: check-deps ## Run tests in watch mode (placeholder)
	@echo "⚠️  No tests configured yet. This would run tests in watch mode."

# Pre-commit hooks
pre-commit-install: ## Install pre-commit hooks
	@echo "Installing pre-commit hooks..."
	@if command -v pre-commit >/dev/null 2>&1; then \
		npm run pre-commit:install; \
		echo "✅ Pre-commit hooks installed successfully."; \
	else \
		echo "❌ pre-commit is not installed. Please install it first:"; \
		echo "   pip install pre-commit"; \
		echo "   or brew install pre-commit"; \
		exit 1; \
	fi

pre-commit-run: ## Run pre-commit hooks on all files
	@echo "Running pre-commit hooks on all files..."
	@if command -v pre-commit >/dev/null 2>&1; then \
		npm run pre-commit:run; \
	else \
		echo "❌ pre-commit is not installed. Run 'make pre-commit-install' first."; \
		exit 1; \
	fi

pre-commit-update: ## Update pre-commit hooks to latest versions
	@echo "Updating pre-commit hooks..."
	@if command -v pre-commit >/dev/null 2>&1; then \
		pre-commit autoupdate; \
		echo "✅ Pre-commit hooks updated."; \
	else \
		echo "❌ pre-commit is not installed."; \
		exit 1; \
	fi

# Maintenance
clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	@echo "✅ Clean complete."

clean-cache: ## Clean Next.js cache
	@echo "Cleaning Next.js cache..."
	rm -rf .next
	@echo "✅ Cache cleaned."

# Utility commands
check-node: ## Check if correct Node.js version is being used
	@if [ -f .nvmrc ]; then \
		REQUIRED_VERSION=$$(cat .nvmrc); \
		CURRENT_VERSION=$$(node --version | sed 's/v//'); \
		CURRENT_MAJOR=$$(echo $$CURRENT_VERSION | cut -d. -f1); \
		if [ "$$CURRENT_MAJOR" != "$$REQUIRED_VERSION" ]; then \
			echo "⚠️  Node.js version mismatch!"; \
			echo "   Required: $$REQUIRED_VERSION"; \
			echo "   Current: $$CURRENT_VERSION"; \
			echo "   Run: nvm use (if you have nvm installed)"; \
		fi; \
	fi

check-deps: ## Check if node_modules exists
	@if [ ! -d "node_modules" ]; then \
		echo "❌ Dependencies not installed. Run 'make install' first."; \
		exit 1; \
	fi

check-env: ## Check if .env file exists
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found. Run 'make setup' to create it."; \
		exit 1; \
	else \
		echo "✅ .env file exists."; \
	fi

# Development workflow
ready: format lint build ## Prepare code for commit (format, lint, build)
	@echo "✅ Code is ready for commit!"

# Project information
info: ## Show project information
	@echo "CueLABS™ Platform Information"
	@echo "============================"
	@echo "Node version: $$(node --version)"
	@echo "NPM version: $$(npm --version)"
	@echo "Next.js version: $$(npm list next --depth=0 2>/dev/null | grep next || echo 'Not installed')"
	@echo "TypeScript version: $$(npm list typescript --depth=0 2>/dev/null | grep typescript || echo 'Not installed')"
	@if [ -f .env ]; then echo "Environment: ✅ .env configured"; else echo "Environment: ❌ .env missing"; fi
	@if [ -d node_modules ]; then echo "Dependencies: ✅ Installed"; else echo "Dependencies: ❌ Not installed"; fi
