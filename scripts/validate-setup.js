#!/usr/bin/env node

/**
 * CueLABS™ Platform Setup Validation Script
 *
 * This script validates the complete setup process including:
 * - Environment variable configuration
 * - Airtable connection and schema
 * - GitHub OAuth configuration
 * - Documentation links and references
 *
 * Run with: node scripts/validate-setup.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix =
    {
      success: `${colors.green}✅`,
      error: `${colors.red}❌`,
      warning: `${colors.yellow}⚠️`,
      info: `${colors.blue}ℹ️`,
    }[type] || `${colors.blue}ℹ️`;

  console.log(`${prefix} ${message}${colors.reset}`);

  if (type === 'success') results.passed++;
  if (type === 'error') {
    results.failed++;
    results.errors.push(message);
  }
  if (type === 'warning') results.warnings++;
}

function section(title) {
  console.log(
    `\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}\n`,
  );
}

// Load environment variables from .env.local if it exists
function loadEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (value && !value.startsWith('#')) {
          process.env[key.trim()] = value;
        }
      }
    });
    log('Loaded environment variables from .env.local', 'success');
  } else {
    log(
      '.env.local file not found - using system environment variables',
      'warning',
    );
  }
}

// Validate environment variables
function validateEnvironmentVariables() {
  section('Environment Variables Validation');

  const requiredVars = [
    {
      name: 'AIRTABLE_API_KEY',
      pattern: /^pat[a-zA-Z0-9]{14}\.[a-zA-Z0-9]{64}$/,
      description: 'Airtable Personal Access Token',
    },
    {
      name: 'AIRTABLE_BASE_ID',
      pattern: /^app[a-zA-Z0-9]{14}$/,
      description: 'Airtable Base ID',
    },
    {
      name: 'NEXTAUTH_URL',
      pattern: /^https?:\/\/.+/,
      description: 'NextAuth.js URL',
    },
    {
      name: 'NEXTAUTH_SECRET',
      minLength: 32,
      description: 'NextAuth.js Secret',
    },
    {
      name: 'GITHUB_CLIENT_ID',
      pattern: /^Iv1\.[a-f0-9]{16}$/,
      description: 'GitHub OAuth Client ID',
    },
    {
      name: 'GITHUB_CLIENT_SECRET',
      pattern: /^[a-f0-9]{40}$/,
      description: 'GitHub OAuth Client Secret',
    },
  ];

  const optionalVars = [
    {
      name: 'VERCEL_ANALYTICS_ID',
      description: 'Vercel Analytics ID (optional)',
    },
    {
      name: 'NODE_ENV',
      values: ['development', 'production', 'test'],
      description: 'Node Environment',
    },
  ];

  // Check required variables
  requiredVars.forEach((varConfig) => {
    const value = process.env[varConfig.name];

    if (!value) {
      log(
        `Missing required environment variable: ${varConfig.name} (${varConfig.description})`,
        'error',
      );
      return;
    }

    // Check pattern if specified
    if (varConfig.pattern && !varConfig.pattern.test(value)) {
      log(
        `Invalid format for ${varConfig.name}: Expected pattern ${varConfig.pattern}`,
        'error',
      );
      return;
    }

    // Check minimum length if specified
    if (varConfig.minLength && value.length < varConfig.minLength) {
      log(
        `${varConfig.name} too short: Expected at least ${varConfig.minLength} characters, got ${value.length}`,
        'error',
      );
      return;
    }

    log(`${varConfig.name}: Valid (${varConfig.description})`, 'success');
  });

  // Check optional variables
  optionalVars.forEach((varConfig) => {
    const value = process.env[varConfig.name];

    if (!value) {
      log(
        `Optional variable ${varConfig.name} not set (${varConfig.description})`,
        'info',
      );
      return;
    }

    // Check allowed values if specified
    if (varConfig.values && !varConfig.values.includes(value)) {
      log(
        `Invalid value for ${varConfig.name}: Expected one of [${varConfig.values.join(', ')}], got "${value}"`,
        'warning',
      );
      return;
    }

    log(
      `${varConfig.name}: Set to "${value}" (${varConfig.description})`,
      'success',
    );
  });
}

// Test Airtable connection
async function validateAirtableConnection() {
  section('Airtable Connection Validation');

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    log('Skipping Airtable validation - missing credentials', 'warning');
    return;
  }

  try {
    // Test connection by fetching base schema
    const response = await makeHttpsRequest({
      hostname: 'api.airtable.com',
      path: `/v0/meta/bases/${baseId}/tables`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      log('Airtable connection successful', 'success');

      // Validate required tables
      const requiredTables = [
        'Users',
        'Bounties',
        'Submissions',
        'Marketplace_Items',
        'Orders',
        'Order_Items',
      ];
      const existingTables = data.tables.map((table) => table.name);

      requiredTables.forEach((tableName) => {
        if (existingTables.includes(tableName)) {
          log(`Required table "${tableName}" found`, 'success');
        } else {
          log(`Missing required table: "${tableName}"`, 'error');
        }
      });
    } else if (response.statusCode === 401) {
      log('Airtable authentication failed - check your API key', 'error');
    } else if (response.statusCode === 404) {
      log('Airtable base not found - check your Base ID', 'error');
    } else {
      log(
        `Airtable API error: ${response.statusCode} - ${response.body}`,
        'error',
      );
    }
  } catch (error) {
    log(`Airtable connection failed: ${error.message}`, 'error');
  }
}

// Test GitHub OAuth configuration
async function validateGitHubOAuth() {
  section('GitHub OAuth Configuration Validation');

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!clientId || !clientSecret || !nextAuthUrl) {
    log('Skipping GitHub OAuth validation - missing credentials', 'warning');
    return;
  }

  try {
    // Test GitHub OAuth app by checking if it exists
    const response = await makeHttpsRequest({
      hostname: 'github.com',
      path: `/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(nextAuthUrl + '/api/auth/callback/github')}&scope=read:user%20user:email`,
      method: 'HEAD',
    });

    if (response.statusCode === 200 || response.statusCode === 302) {
      log('GitHub OAuth app configuration appears valid', 'success');
    } else if (response.statusCode === 404) {
      log('GitHub OAuth app not found - check your Client ID', 'error');
    } else {
      log(
        `GitHub OAuth validation returned: ${response.statusCode}`,
        'warning',
      );
    }
  } catch (error) {
    log(`GitHub OAuth validation failed: ${error.message}`, 'error');
  }
}

// Validate documentation files and links
function validateDocumentation() {
  section('Documentation Validation');

  const requiredFiles = [
    'README.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'CODE_OF_CONDUCT.md',
    'CHANGELOG.md',
    'LICENSE',
    '.env.example',
    'docs/setup/airtable-setup.md',
    'docs/setup/github-oauth-setup.md',
    'docs/setup/environment-setup.md',
    'docs/setup/troubleshooting.md',
    'docs/api/overview.md',
    'docs/architecture/system-overview.md',
    'docs/deployment/vercel-deployment.md',
  ];

  // Check if required files exist
  requiredFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      log(`Documentation file exists: ${filePath}`, 'success');
    } else {
      log(`Missing documentation file: ${filePath}`, 'error');
    }
  });

  // Validate internal links in README.md
  if (fs.existsSync('README.md')) {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    const internalLinks =
      readmeContent.match(/\[.*?\]\((?!https?:\/\/)([^)]+)\)/g) || [];

    internalLinks.forEach((link) => {
      const match = link.match(/\[.*?\]\(([^)]+)\)/);
      if (match) {
        const linkPath = match[1].replace(/#.*$/, ''); // Remove anchor
        if (linkPath && !fs.existsSync(linkPath)) {
          log(`Broken internal link in README.md: ${linkPath}`, 'error');
        } else if (linkPath) {
          log(`Valid internal link: ${linkPath}`, 'success');
        }
      }
    });
  }

  // Check GitHub templates (both .md and .yml formats)
  const templateChecks = [
    {
      name: 'bug_report',
      paths: [
        '.github/ISSUE_TEMPLATE/bug_report.md',
        '.github/ISSUE_TEMPLATE/bug_report.yml',
      ],
    },
    {
      name: 'feature_request',
      paths: [
        '.github/ISSUE_TEMPLATE/feature_request.md',
        '.github/ISSUE_TEMPLATE/feature_request.yml',
      ],
    },
    {
      name: 'question',
      paths: [
        '.github/ISSUE_TEMPLATE/question.md',
        '.github/ISSUE_TEMPLATE/question.yml',
      ],
    },
    {
      name: 'pull_request',
      paths: ['.github/PULL_REQUEST_TEMPLATE.md'],
    },
  ];

  templateChecks.forEach((template) => {
    const exists = template.paths.some((path) => fs.existsSync(path));
    if (exists) {
      const existingPath = template.paths.find((path) => fs.existsSync(path));
      log(
        `GitHub template exists: ${template.name} (${existingPath})`,
        'success',
      );
    } else {
      log(
        `Missing GitHub template: ${template.name} (checked: ${template.paths.join(', ')})`,
        'error',
      );
    }
  });
}

// Validate project structure and dependencies
function validateProjectStructure() {
  section('Project Structure Validation');

  // Check package.json
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

      // Check required scripts
      const requiredScripts = ['dev', 'build', 'start', 'lint'];
      requiredScripts.forEach((script) => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          log(`Required script exists: ${script}`, 'success');
        } else {
          log(`Missing required script: ${script}`, 'error');
        }
      });

      // Check key dependencies
      const keyDependencies = ['next', 'react', 'typescript', 'next-auth'];
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      keyDependencies.forEach((dep) => {
        if (allDeps[dep]) {
          log(`Key dependency found: ${dep}@${allDeps[dep]}`, 'success');
        } else {
          log(`Missing key dependency: ${dep}`, 'warning');
        }
      });
    } catch (error) {
      log(`Error reading package.json: ${error.message}`, 'error');
    }
  } else {
    log('package.json not found', 'error');
  }

  // Check TypeScript configuration
  if (fs.existsSync('tsconfig.json')) {
    log('TypeScript configuration found', 'success');
  } else {
    log('tsconfig.json not found', 'error');
  }

  // Check Next.js configuration
  if (fs.existsSync('next.config.ts') || fs.existsSync('next.config.js')) {
    log('Next.js configuration found', 'success');
  } else {
    log('Next.js configuration not found', 'warning');
  }

  // Check Tailwind configuration
  const tailwindConfigExists =
    fs.existsSync('tailwind.config.ts') ||
    fs.existsSync('tailwind.config.js') ||
    fs.existsSync('tailwind.config.mjs');

  // Also check PostCSS config for Tailwind
  let tailwindInPostCSS = false;
  if (
    fs.existsSync('postcss.config.mjs') ||
    fs.existsSync('postcss.config.js')
  ) {
    try {
      const postcssFiles = ['postcss.config.mjs', 'postcss.config.js'].filter(
        (f) => fs.existsSync(f),
      );
      for (const file of postcssFiles) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('tailwind') || content.includes('@tailwindcss')) {
          tailwindInPostCSS = true;
          break;
        }
      }
    } catch (error) {
      // Ignore parsing errors
    }
  }

  if (tailwindConfigExists || tailwindInPostCSS) {
    log('Tailwind CSS configuration found', 'success');
  } else {
    log('Tailwind CSS configuration not found', 'warning');
  }
}

// Test build process
async function validateBuildProcess() {
  section('Build Process Validation');

  const { spawn } = require('child_process');

  return new Promise((resolve) => {
    log('Testing TypeScript compilation...', 'info');

    const tsc = spawn('npx', ['tsc', '--noEmit'], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });

    let output = '';
    let errorOutput = '';

    tsc.stdout.on('data', (data) => {
      output += data.toString();
    });

    tsc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    tsc.on('close', (code) => {
      if (code === 0) {
        log('TypeScript compilation successful', 'success');
      } else {
        log('TypeScript compilation failed', 'error');
        if (errorOutput) {
          console.log(`${colors.red}TypeScript errors:${colors.reset}`);
          console.log(errorOutput);
        }
      }
      resolve();
    });

    tsc.on('error', (error) => {
      log(`TypeScript compilation error: ${error.message}`, 'error');
      resolve();
    });
  });
}

// Helper function for HTTPS requests
function makeHttpsRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Generate validation report
function generateReport() {
  section('Validation Summary');

  console.log(`${colors.bold}Results:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(
    `${colors.yellow}⚠️  Warnings: ${results.warnings}${colors.reset}`,
  );
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);

  if (results.errors.length > 0) {
    console.log(`\n${colors.bold}${colors.red}Critical Issues:${colors.reset}`);
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  const score = (results.passed / (results.passed + results.failed)) * 100;
  console.log(
    `\n${colors.bold}Setup Completion: ${score.toFixed(1)}%${colors.reset}`,
  );

  if (score >= 90) {
    console.log(
      `${colors.green}🎉 Excellent! Your setup is ready for development.${colors.reset}`,
    );
  } else if (score >= 70) {
    console.log(
      `${colors.yellow}⚠️  Good progress! Address the remaining issues for optimal setup.${colors.reset}`,
    );
  } else {
    console.log(
      `${colors.red}❌ Setup needs attention. Please resolve the critical issues above.${colors.reset}`,
    );
  }

  // Generate recommendations
  console.log(`\n${colors.bold}Next Steps:${colors.reset}`);
  if (results.failed > 0) {
    console.log('1. Fix the critical issues listed above');
    console.log('2. Re-run this validation script');
  }
  console.log('3. Test the application: npm run dev');
  console.log('4. Run the full test suite: npm test');
  console.log(
    '5. Check the troubleshooting guide: docs/setup/troubleshooting.md',
  );
}

// Main validation function
async function runValidation() {
  console.log(
    `${colors.bold}${colors.blue}CueLABS™ Platform Setup Validation${colors.reset}\n`,
  );
  console.log('This script will validate your complete setup configuration.\n');

  try {
    loadEnvironment();
    validateEnvironmentVariables();
    await validateAirtableConnection();
    await validateGitHubOAuth();
    validateDocumentation();
    validateProjectStructure();
    await validateBuildProcess();
    generateReport();
  } catch (error) {
    log(`Validation failed with error: ${error.message}`, 'error');
    console.error(error);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  runValidation();
}

module.exports = {
  runValidation,
  validateEnvironmentVariables,
  validateAirtableConnection,
  validateGitHubOAuth,
  validateDocumentation,
  validateProjectStructure,
};
