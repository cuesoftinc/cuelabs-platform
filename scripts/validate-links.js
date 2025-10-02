#!/usr/bin/env node

/**
 * Documentation Link Validation Script
 *
 * This script validates all internal and external links in documentation files,
 * checks file references, and tests template functionality.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class LinkValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checkedUrls = new Set();
    this.fileCache = new Map();
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log('🔍 Starting documentation validation...\n');

    // Get all markdown files
    const markdownFiles = this.getMarkdownFiles();

    for (const file of markdownFiles) {
      console.log(`📄 Validating ${file}...`);
      await this.validateFile(file);
    }

    // Validate GitHub templates
    await this.validateGitHubTemplates();

    // Print results
    this.printResults();

    // Exit with error code if there are errors
    process.exit(this.errors.length > 0 ? 1 : 0);
  }

  /**
   * Get all markdown files in the project
   */
  getMarkdownFiles() {
    const files = [];
    const searchDirs = ['.', 'docs', '.github'];

    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (
          stat.isDirectory() &&
          !item.startsWith('.') &&
          item !== 'node_modules'
        ) {
          scanDirectory(fullPath);
        } else if (
          stat.isFile() &&
          (item.endsWith('.md') || item.endsWith('.yml'))
        ) {
          files.push(fullPath);
        }
      }
    };

    searchDirs.forEach(scanDirectory);
    return files;
  }

  /**
   * Validate a single file
   */
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract and validate markdown links
      await this.validateMarkdownLinks(filePath, content);

      // Validate file references
      this.validateFileReferences(filePath, content);

      // Validate relative paths
      this.validateRelativePaths(filePath, content);
    } catch (error) {
      this.addError(filePath, `Failed to read file: ${error.message}`);
    }
  }

  /**
   * Validate markdown links in content
   */
  async validateMarkdownLinks(filePath, content) {
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, text, url] = match;
      const lineNumber = this.getLineNumber(content, match.index);

      await this.validateLink(filePath, url, lineNumber, text);
    }

    // Match reference-style links: [text][ref]
    const refLinkRegex = /\[([^\]]*)\]\[([^\]]+)\]/g;
    while ((match = refLinkRegex.exec(content)) !== null) {
      const [fullMatch, text, ref] = match;
      const lineNumber = this.getLineNumber(content, match.index);

      // Check if reference is defined
      const refDefRegex = new RegExp(`^\\[${ref}\\]:\\s*(.+)$`, 'm');
      const refMatch = content.match(refDefRegex);

      if (!refMatch) {
        this.addError(
          filePath,
          `Undefined reference link: [${ref}]`,
          lineNumber,
        );
      } else {
        await this.validateLink(filePath, refMatch[1].trim(), lineNumber, text);
      }
    }
  }

  /**
   * Validate a single link
   */
  async validateLink(filePath, url, lineNumber, linkText) {
    // Skip anchors and mailto links
    if (url.startsWith('#') || url.startsWith('mailto:')) {
      return;
    }

    // Handle relative file paths
    if (!url.startsWith('http')) {
      this.validateLocalFile(filePath, url, lineNumber, linkText);
      return;
    }

    // Validate external URLs
    await this.validateExternalUrl(filePath, url, lineNumber, linkText);
  }

  /**
   * Validate local file references
   */
  validateLocalFile(filePath, url, lineNumber, linkText) {
    // Remove query parameters and anchors
    const cleanUrl = url.split('?')[0].split('#')[0];

    // Resolve relative path
    const basePath = path.dirname(filePath);
    const targetPath = path.resolve(basePath, cleanUrl);

    // Check if file exists
    if (!fs.existsSync(targetPath)) {
      this.addError(
        filePath,
        `Broken local link: ${url} -> ${targetPath}`,
        lineNumber,
      );
    }
  }

  /**
   * Validate external URLs
   */
  async validateExternalUrl(filePath, url, lineNumber, linkText) {
    // Skip if already checked
    if (this.checkedUrls.has(url)) {
      return;
    }

    this.checkedUrls.add(url);

    try {
      const isValid = await this.checkUrl(url);
      if (!isValid) {
        this.addError(filePath, `Broken external link: ${url}`, lineNumber);
      }
    } catch (error) {
      this.addWarning(
        filePath,
        `Could not validate external link: ${url} (${error.message})`,
        lineNumber,
      );
    }
  }

  /**
   * Check if URL is accessible
   */
  checkUrl(url) {
    return new Promise((resolve) => {
      const client = url.startsWith('https:') ? https : http;
      const timeout = 10000; // 10 seconds

      const req = client.get(url, { timeout }, (res) => {
        // Consider 2xx and 3xx status codes as valid
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.setTimeout(timeout, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Validate file references in content
   */
  validateFileReferences(filePath, content) {
    // Skip code blocks when looking for file references
    const codeBlockRegex = /```[\s\S]*?```/g;
    let contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');

    // Look for file references in various formats
    const patterns = [
      // Markdown image references: ![alt](path)
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      // HTML img src
      /<img[^>]+src=["']([^"']+)["']/g,
      // CSS url() references
      /url\(["']?([^"')]+)["']?\)/g,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(contentWithoutCodeBlocks)) !== null) {
        const url = match[match.length - 1]; // Last capture group is usually the path
        const lineNumber = this.getLineNumber(content, match.index);

        if (
          !url.startsWith('http') &&
          !url.startsWith('data:') &&
          !this.isNpmPackage(url)
        ) {
          this.validateLocalFile(filePath, url, lineNumber, 'file reference');
        }
      }
    });
  }

  /**
   * Validate relative paths in content
   */
  validateRelativePaths(filePath, content) {
    // Look for relative path references
    const relativePathRegex = /(?:\.\.?\/)+[^\s\)'"]+/g;
    let match;

    while ((match = relativePathRegex.exec(content)) !== null) {
      const relativePath = match[0];
      const lineNumber = this.getLineNumber(content, match.index);

      // Skip if it's part of a URL
      if (
        content
          .substring(Math.max(0, match.index - 10), match.index)
          .includes('http')
      ) {
        continue;
      }

      const basePath = path.dirname(filePath);
      const targetPath = path.resolve(basePath, relativePath);

      if (!fs.existsSync(targetPath)) {
        this.addWarning(
          filePath,
          `Potentially broken relative path: ${relativePath}`,
          lineNumber,
        );
      }
    }
  }

  /**
   * Validate GitHub templates
   */
  async validateGitHubTemplates() {
    console.log('🔧 Validating GitHub templates...');

    const templateFiles = [
      '.github/ISSUE_TEMPLATE/bug_report.yml',
      '.github/ISSUE_TEMPLATE/feature_request.yml',
      '.github/ISSUE_TEMPLATE/question.yml',
      '.github/PULL_REQUEST_TEMPLATE.md',
    ];

    for (const templateFile of templateFiles) {
      if (fs.existsSync(templateFile)) {
        console.log(`  ✓ Template exists: ${templateFile}`);

        // Validate YAML syntax for .yml files
        if (templateFile.endsWith('.yml')) {
          try {
            const content = fs.readFileSync(templateFile, 'utf8');
            // Basic YAML validation - check for proper indentation and structure
            this.validateYamlStructure(templateFile, content);
          } catch (error) {
            this.addError(templateFile, `Invalid YAML: ${error.message}`);
          }
        }
      } else {
        this.addError('GitHub Templates', `Missing template: ${templateFile}`);
      }
    }
  }

  /**
   * Basic YAML structure validation
   */
  validateYamlStructure(filePath, content) {
    const lines = content.split('\n');
    let inBody = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check for required fields in GitHub issue templates
      if (line.trim() === 'body:') {
        inBody = true;
      }

      // Validate indentation (should be consistent)
      if (line.trim() && !line.startsWith('#')) {
        const indent = line.match(/^(\s*)/)[1].length;
        if (indent % 2 !== 0 && indent > 0) {
          this.addWarning(
            filePath,
            `Inconsistent indentation (${indent} spaces)`,
            lineNumber,
          );
        }
      }
    }

    if (!inBody && filePath.includes('ISSUE_TEMPLATE')) {
      this.addError(
        filePath,
        'Missing required "body:" section in issue template',
      );
    }
  }

  /**
   * Check if a path is an npm package or built-in module
   */
  isNpmPackage(path) {
    // Skip npm packages, built-in modules, and TypeScript path aliases
    return (
      !path.startsWith('./') &&
      !path.startsWith('../') &&
      !path.startsWith('/') &&
      (path.startsWith('@') ||
        !path.includes('/') ||
        path.startsWith('next/') ||
        path === 'crypto')
    );
  }

  /**
   * Get line number for a character position
   */
  getLineNumber(content, position) {
    return content.substring(0, position).split('\n').length;
  }

  /**
   * Add an error
   */
  addError(file, message, line = null) {
    this.errors.push({
      file,
      message,
      line,
      type: 'error',
    });
  }

  /**
   * Add a warning
   */
  addWarning(file, message, line = null) {
    this.warnings.push({
      file,
      message,
      line,
      type: 'warning',
    });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n📊 Validation Results\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All documentation links and references are valid!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} error(s):\n`);
      this.errors.forEach((error) => {
        const location = error.line ? `:${error.line}` : '';
        console.log(`  ${error.file}${location}`);
        console.log(`    ${error.message}\n`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warning(s):\n`);
      this.warnings.forEach((warning) => {
        const location = warning.line ? `:${warning.line}` : '';
        console.log(`  ${warning.file}${location}`);
        console.log(`    ${warning.message}\n`);
      });
    }

    console.log(
      `\nSummary: ${this.errors.length} errors, ${this.warnings.length} warnings`,
    );
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new LinkValidator();
  validator.validate().catch((error) => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = LinkValidator;
