#!/usr/bin/env node

/**
 * GitHub Templates Functionality Test
 *
 * This script tests that GitHub issue and PR templates are properly formatted
 * and contain all required fields.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

class TemplateValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Main validation function
   */
  validate() {
    console.log('🧪 Testing GitHub template functionality...\n');

    // Test issue templates
    this.testIssueTemplates();

    // Test PR template
    this.testPRTemplate();

    // Print results
    this.printResults();

    return this.errors.length === 0;
  }

  /**
   * Test issue templates
   */
  testIssueTemplates() {
    const templates = [
      {
        file: '.github/ISSUE_TEMPLATE/bug_report.yml',
        requiredFields: ['name', 'description', 'body'],
        requiredBodyTypes: ['textarea', 'dropdown', 'checkboxes'],
      },
      {
        file: '.github/ISSUE_TEMPLATE/feature_request.yml',
        requiredFields: ['name', 'description', 'body'],
        requiredBodyTypes: ['textarea', 'dropdown'],
      },
      {
        file: '.github/ISSUE_TEMPLATE/question.yml',
        requiredFields: ['name', 'description', 'body'],
        requiredBodyTypes: ['textarea', 'dropdown', 'checkboxes'],
      },
    ];

    templates.forEach((template) => {
      console.log(`📋 Testing ${template.file}...`);
      this.validateIssueTemplate(template);
    });
  }

  /**
   * Validate individual issue template
   */
  validateIssueTemplate(template) {
    if (!fs.existsSync(template.file)) {
      this.addError(template.file, 'Template file does not exist');
      return;
    }

    try {
      const content = fs.readFileSync(template.file, 'utf8');

      // Check required top-level fields
      template.requiredFields.forEach((field) => {
        if (!content.includes(`${field}:`)) {
          this.addError(template.file, `Missing required field: ${field}`);
        }
      });

      // Check body structure
      if (content.includes('body:')) {
        const bodySection = content.split('body:')[1];

        // Check for required input types
        template.requiredBodyTypes.forEach((type) => {
          if (!bodySection.includes(`type: ${type}`)) {
            this.addWarning(
              template.file,
              `Missing recommended input type: ${type}`,
            );
          }
        });

        // Check for validation requirements
        if (!bodySection.includes('validations:')) {
          this.addWarning(template.file, 'No validation rules found');
        }

        // Check for required fields
        if (!bodySection.includes('required: true')) {
          this.addWarning(template.file, 'No required fields found');
        }
      }

      console.log(`  ✅ ${template.file} is valid`);
    } catch (error) {
      this.addError(
        template.file,
        `Failed to parse template: ${error.message}`,
      );
    }
  }

  /**
   * Test PR template
   */
  testPRTemplate() {
    const templateFile = '.github/PULL_REQUEST_TEMPLATE.md';
    console.log(`📝 Testing ${templateFile}...`);

    if (!fs.existsSync(templateFile)) {
      this.addError(templateFile, 'PR template file does not exist');
      return;
    }

    try {
      const content = fs.readFileSync(templateFile, 'utf8');

      // Check for required sections
      const requiredSections = [
        'Description',
        'Related Issues',
        'Type of Change',
        'Testing',
        'Checklist',
      ];

      requiredSections.forEach((section) => {
        if (!content.includes(section)) {
          this.addError(templateFile, `Missing required section: ${section}`);
        }
      });

      // Check for checkboxes
      if (!content.includes('- [ ]')) {
        this.addWarning(templateFile, 'No checkboxes found in PR template');
      }

      // Check for issue linking format
      if (!content.includes('Fixes #') && !content.includes('Closes #')) {
        this.addWarning(templateFile, 'No issue linking examples found');
      }

      console.log(`  ✅ ${templateFile} is valid`);
    } catch (error) {
      this.addError(templateFile, `Failed to parse template: ${error.message}`);
    }
  }

  /**
   * Add an error
   */
  addError(file, message) {
    this.errors.push({ file, message, type: 'error' });
  }

  /**
   * Add a warning
   */
  addWarning(file, message) {
    this.warnings.push({ file, message, type: 'warning' });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n📊 Template Test Results\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All GitHub templates are functional!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} error(s):\n`);
      this.errors.forEach((error) => {
        console.log(`  ${error.file}`);
        console.log(`    ${error.message}\n`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warning(s):\n`);
      this.warnings.forEach((warning) => {
        console.log(`  ${warning.file}`);
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
  const validator = new TemplateValidator();
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

module.exports = TemplateValidator;
