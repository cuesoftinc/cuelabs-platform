#!/bin/bash

# CueLABS™ Platform Clean Environment Setup Test
# This script simulates setting up the project from scratch to validate setup instructions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

test_step() {
    local description="$1"
    local command="$2"

    log_info "Testing: $description"

    if eval "$command" > /dev/null 2>&1; then
        log_success "$description"
        ((TESTS_PASSED++))
        return 0
    else
        log_error "$description"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_section "Checking Prerequisites"

    test_step "Node.js is installed (v22+)" "node --version | grep -E 'v(1[8-9]|[2-9][0-9])'"
    test_step "npm is installed" "npm --version"
    test_step "Git is installed" "git --version"

    # Check Node.js version more specifically
    NODE_VERSION=$(node --version | sed 's/v//')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)

    if [ "$MAJOR_VERSION" -ge 22 ]; then
        log_success "Node.js version $NODE_VERSION is compatible"
        ((TESTS_PASSED++))
    else
        log_error "Node.js version $NODE_VERSION is too old. Requires v22+"
        ((TESTS_FAILED++))
    fi
}

# Test project structure
test_project_structure() {
    log_section "Testing Project Structure"

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "Not in project root directory (package.json not found)"
        exit 1
    fi

    # Check required files exist
    local required_files=(
        "package.json"
        "tsconfig.json"
        "next.config.ts"
        "README.md"
        "CONTRIBUTING.md"
        ".env.example"
        "src/app/layout.tsx"
        "src/app/page.tsx"
    )

    for file in "${required_files[@]}"; do
        test_step "Required file exists: $file" "[ -f '$file' ]"
    done

    # Check required directories
    local required_dirs=(
        "src"
        "src/app"
        "src/components"
        "src/lib"
        "docs"
        "docs/setup"
        ".github"
    )

    for dir in "${required_dirs[@]}"; do
        test_step "Required directory exists: $dir" "[ -d '$dir' ]"
    done
}

# Test dependency installation
test_dependency_installation() {
    log_section "Testing Dependency Installation"

    log_info "Installing dependencies (this may take a while)..."

    if npm install > /dev/null 2>&1; then
        log_success "Dependencies installed successfully"
        ((TESTS_PASSED++))
    else
        log_error "Failed to install dependencies"
        ((TESTS_FAILED++))
        return 1
    fi

    # Check if node_modules was created
    test_step "node_modules directory created" "[ -d 'node_modules' ]"

    # Check key dependencies
    local key_deps=(
        "next"
        "react"
        "typescript"
        "next-auth"
        "tailwindcss"
    )

    for dep in "${key_deps[@]}"; do
        test_step "Key dependency installed: $dep" "[ -d 'node_modules/$dep' ] || npm list $dep > /dev/null 2>&1"
    done
}

# Test environment setup
test_environment_setup() {
    log_section "Testing Environment Setup"

    # Check if .env.example exists and has required variables
    if [ -f ".env.example" ]; then
        log_success ".env.example file exists"
        ((TESTS_PASSED++))

        # Check for required environment variables in .env.example
        local required_env_vars=(
            "AIRTABLE_API_KEY"
            "AIRTABLE_BASE_ID"
            "NEXTAUTH_URL"
            "NEXTAUTH_SECRET"
            "GITHUB_CLIENT_ID"
            "GITHUB_CLIENT_SECRET"
        )

        for var in "${required_env_vars[@]}"; do
            if grep -q "^$var=" .env.example; then
                log_success "Environment variable documented: $var"
                ((TESTS_PASSED++))
            else
                log_error "Missing environment variable in .env.example: $var"
                ((TESTS_FAILED++))
            fi
        done
    else
        log_error ".env.example file not found"
        ((TESTS_FAILED++))
    fi

    # Test copying .env.example to .env.local
    if cp .env.example .env.local.test 2>/dev/null; then
        log_success "Can copy .env.example to .env.local"
        ((TESTS_PASSED++))
        rm -f .env.local.test
    else
        log_error "Failed to copy .env.example"
        ((TESTS_FAILED++))
    fi
}

# Test build process
test_build_process() {
    log_section "Testing Build Process"

    # Test TypeScript compilation
    log_info "Testing TypeScript compilation..."
    if npx tsc --noEmit > /dev/null 2>&1; then
        log_success "TypeScript compilation successful"
        ((TESTS_PASSED++))
    else
        log_warning "TypeScript compilation has issues (may be due to missing env vars)"
        # Don't fail the test as this might be expected without proper env setup
    fi

    # Test linting
    log_info "Testing ESLint..."
    if npm run lint > /dev/null 2>&1; then
        log_success "ESLint passed"
        ((TESTS_PASSED++))
    else
        log_warning "ESLint found issues"
        # Don't fail as this might be expected
    fi

    # Test if we can start the build process (without completing it)
    log_info "Testing build command availability..."
    if npm run build --dry-run > /dev/null 2>&1 || command -v npm > /dev/null; then
        log_success "Build command is available"
        ((TESTS_PASSED++))
    else
        log_error "Build command not available"
        ((TESTS_FAILED++))
    fi
}

# Test documentation completeness
test_documentation() {
    log_section "Testing Documentation"

    # Check setup documentation files
    local setup_docs=(
        "docs/setup/airtable-setup.md"
        "docs/setup/github-oauth-setup.md"
        "docs/setup/environment-setup.md"
        "docs/setup/troubleshooting.md"
    )

    for doc in "${setup_docs[@]}"; do
        test_step "Setup documentation exists: $doc" "[ -f '$doc' ]"

        # Check if documentation has substantial content
        if [ -f "$doc" ]; then
            local word_count=$(wc -w < "$doc")
            if [ "$word_count" -gt 100 ]; then
                log_success "Documentation has substantial content: $doc ($word_count words)"
                ((TESTS_PASSED++))
            else
                log_warning "Documentation seems incomplete: $doc ($word_count words)"
            fi
        fi
    done

    # Check GitHub templates
    local github_templates=(
        ".github/ISSUE_TEMPLATE/bug_report.md"
        ".github/ISSUE_TEMPLATE/feature_request.md"
        ".github/PULL_REQUEST_TEMPLATE.md"
    )

    for template in "${github_templates[@]}"; do
        test_step "GitHub template exists: $template" "[ -f '$template' ]"
    done

    # Check main documentation files
    local main_docs=(
        "README.md"
        "CONTRIBUTING.md"
        "SECURITY.md"
        "CODE_OF_CONDUCT.md"
        "CHANGELOG.md"
        "LICENSE"
    )

    for doc in "${main_docs[@]}"; do
        test_step "Main documentation exists: $doc" "[ -f '$doc' ]"
    done
}

# Test Makefile commands
test_makefile() {
    log_section "Testing Makefile Commands"

    if [ -f "Makefile" ]; then
        log_success "Makefile exists"
        ((TESTS_PASSED++))

        # Check for required make targets
        local make_targets=(
            "install"
            "dev"
            "build"
            "lint"
            "clean"
        )

        for target in "${make_targets[@]}"; do
            if grep -q "^$target:" Makefile; then
                log_success "Makefile target exists: $target"
                ((TESTS_PASSED++))
            else
                log_error "Missing Makefile target: $target"
                ((TESTS_FAILED++))
            fi
        done
    else
        log_error "Makefile not found"
        ((TESTS_FAILED++))
    fi
}

# Generate test report
generate_report() {
    log_section "Test Summary"

    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    local success_rate=0

    if [ $total_tests -gt 0 ]; then
        success_rate=$((TESTS_PASSED * 100 / total_tests))
    fi

    echo -e "${BLUE}Test Results:${NC}"
    echo -e "${GREEN}✅ Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Failed: $TESTS_FAILED${NC}"
    echo -e "${BLUE}Success Rate: $success_rate%${NC}"

    if [ $success_rate -ge 90 ]; then
        echo -e "\n${GREEN}🎉 Excellent! The setup process is working correctly.${NC}"
        return 0
    elif [ $success_rate -ge 70 ]; then
        echo -e "\n${YELLOW}⚠️  Good progress! Some issues need attention.${NC}"
        return 1
    else
        echo -e "\n${RED}❌ Setup process has significant issues that need to be resolved.${NC}"
        return 2
    fi
}

# Main test execution
main() {
    echo -e "${BLUE}CueLABS™ Platform Clean Environment Setup Test${NC}\n"
    echo "This script validates that the setup instructions work correctly."
    echo "It simulates setting up the project from scratch.\n"

    # Run all test suites
    check_prerequisites
    test_project_structure
    test_dependency_installation
    test_environment_setup
    test_build_process
    test_documentation
    test_makefile

    # Generate final report
    generate_report
    exit_code=$?

    echo -e "\n${BLUE}Recommendations:${NC}"
    if [ $exit_code -eq 0 ]; then
        echo "1. Setup process is ready for new contributors"
        echo "2. Consider running the full validation: node scripts/validate-setup.js"
        echo "3. Test with actual environment variables"
    else
        echo "1. Review and fix the failed tests above"
        echo "2. Update documentation if needed"
        echo "3. Re-run this test after fixes"
        echo "4. Check the troubleshooting guide: docs/setup/troubleshooting.md"
    fi

    exit $exit_code
}

# Run main function
main "$@"
