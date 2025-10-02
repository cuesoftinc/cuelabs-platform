# Code Review Guidelines

## Overview

Code reviews are a critical part of our development process at CueLABS™. They ensure code quality, share knowledge, and maintain consistency across the codebase. This guide outlines our code review standards and best practices.

## Code Review Philosophy

### Goals of Code Review

1. **Quality Assurance**: Catch bugs and issues before they reach production
2. **Knowledge Sharing**: Spread understanding of the codebase across the team
3. **Consistency**: Maintain coding standards and architectural patterns
4. **Learning**: Help team members grow and improve their skills
5. **Collaboration**: Foster team communication and shared ownership

### Review Mindset

- **Be Kind**: Reviews should be constructive, not critical
- **Be Thorough**: Take time to understand the changes
- **Be Timely**: Respond to review requests promptly
- **Be Open**: Both authors and reviewers should be open to feedback

## Review Process

### For Pull Request Authors

#### Before Requesting Review

1. **Self-Review Your Changes**

   ```bash
   # Review your own diff
   git diff main...feature/your-branch

   # Check for common issues
   - Debugging code left in
   - TODO comments without issues
   - Commented-out code
   - Formatting inconsistencies
   ```

2. **Ensure Quality Standards**
   - [ ] All tests pass locally
   - [ ] Code follows project style guidelines
   - [ ] No linting errors or warnings
   - [ ] Documentation is updated if needed
   - [ ] Commit messages follow conventions

3. **Write Clear PR Description**

   ```markdown
   ## What
   Brief description of what this PR does

   ## Why
   Explanation of why this change is needed

   ## How
   High-level overview of the implementation approach

   ## Testing
   How to test the changes

   ## Screenshots (if applicable)
   Before/after images for UI changes

   ## Checklist
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

#### During Review

1. **Respond Promptly**
   - Acknowledge feedback within 24 hours
   - Ask for clarification if comments are unclear
   - Be open to suggestions and alternative approaches

2. **Address Feedback Thoroughly**
   - Fix all blocking issues
   - Consider suggestions even if not blocking
   - Explain your reasoning if you disagree with feedback

3. **Update and Re-request Review**

   ```bash
   # After making changes
   git add .
   git commit -m "fix: address review feedback"
   git push origin feature/your-branch

   # Re-request review on GitHub
   ```

### For Reviewers

#### Review Checklist

##### Functionality

- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled appropriately?
- [ ] Is error handling comprehensive?
- [ ] Are there any obvious bugs or logic errors?

##### Code Quality

- [ ] Is the code readable and well-structured?
- [ ] Are functions and variables named clearly?
- [ ] Is the code DRY (Don't Repeat Yourself)?
- [ ] Are there any code smells or anti-patterns?

##### Performance

- [ ] Are there any performance bottlenecks?
- [ ] Is database access optimized?
- [ ] Are expensive operations cached appropriately?
- [ ] Is the bundle size impact reasonable?

##### Security

- [ ] Are user inputs properly validated and sanitized?
- [ ] Are authentication and authorization handled correctly?
- [ ] Are secrets and sensitive data protected?
- [ ] Are there any potential security vulnerabilities?

##### Testing

- [ ] Are there adequate tests for the new functionality?
- [ ] Do tests cover edge cases and error conditions?
- [ ] Are existing tests still passing?
- [ ] Is test coverage maintained or improved?

##### Documentation

- [ ] Is code self-documenting with clear names and structure?
- [ ] Are complex algorithms or business logic commented?
- [ ] Is API documentation updated if needed?
- [ ] Are README or setup instructions updated?

#### Review Process Steps

1. **Understand the Context**
   - Read the PR description thoroughly
   - Check linked issues or tickets
   - Understand the problem being solved

2. **Review the Code**
   - Start with the overall structure and approach
   - Dive into implementation details
   - Check for consistency with existing patterns
   - Look for potential improvements

3. **Test the Changes (if needed)**

   ```bash
   # Check out the PR branch
   gh pr checkout 123

   # Install dependencies and test
   npm install
   npm run dev

   # Test the specific functionality
   ```

4. **Provide Feedback**
   - Use GitHub's review features effectively
   - Categorize feedback appropriately
   - Be specific and actionable

## Feedback Categories

### Blocking Issues (Request Changes)

Issues that must be fixed before merging:

- **Bugs**: Logic errors, potential crashes, incorrect behavior
- **Security**: Vulnerabilities, exposed secrets, unsafe operations
- **Breaking Changes**: Unintended API changes, compatibility issues
- **Standards Violations**: Major deviations from coding standards

```markdown
**Blocking**: This introduces a security vulnerability by not sanitizing user input.

Please use the `sanitizeInput()` utility function before processing the data.
```

### Suggestions (Comment)

Improvements that would be nice but aren't required:

- **Performance**: Minor optimizations, better algorithms
- **Readability**: Clearer naming, better structure
- **Best Practices**: Following established patterns
- **Future-proofing**: Making code more maintainable

```markdown
**Suggestion**: Consider extracting this logic into a separate utility function for reusability.

```javascript
// Could be moved to utils/validation.js
function validateUserInput(input) {
  // validation logic
}
```

```

### Nitpicks (Comment)

Minor style or preference issues:

- **Formatting**: Spacing, indentation (if not caught by automated tools)
- **Naming**: Minor improvements to variable/function names
- **Comments**: Adding or improving code comments

```markdown
**Nitpick**: Consider using a more descriptive variable name here.

```suggestion
const userAuthenticationToken = generateToken();
```

```

### Questions (Comment)

Seeking clarification or understanding:

```markdown
**Question**: Why did you choose this approach over using the existing `UserService.authenticate()` method?

I'm curious about the trade-offs here.
```

### Praise (Comment)

Positive feedback for good practices:

```markdown
**Nice**: Great use of TypeScript generics here! This makes the function much more flexible and type-safe.
```

## Review Standards by Area

### React Components

#### Component Structure

```typescript
// Good: Clear, focused component
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <Button onClick={handleEdit}>Edit</Button>
      </CardContent>
    </Card>
  );
}
```

#### Review Points

- [ ] Props are properly typed with interfaces
- [ ] Component is focused and has single responsibility
- [ ] Event handlers are memoized when appropriate
- [ ] Accessibility attributes are included
- [ ] Component is exported with proper naming

### API Routes

#### Route Structure

```typescript
// Good: Proper error handling and validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = userSchema.parse(body);

    // Process request
    const result = await userService.createUser(validatedData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('User creation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Review Points

- [ ] Input validation is implemented
- [ ] Error handling covers all scenarios
- [ ] Appropriate HTTP status codes are used
- [ ] Authentication/authorization is checked
- [ ] Response format is consistent

### Database Operations

#### Airtable Integration

```typescript
// Good: Proper error handling and type safety
export async function getUserById(id: string): Promise<User | null> {
  try {
    const record = await airtableClient.getRecord('Users', id);

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      name: record.fields.Name,
      email: record.fields.Email,
      // ... other fields
    };
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    throw new Error('Database operation failed');
  }
}
```

#### Review Points

- [ ] Error handling is comprehensive
- [ ] Return types are properly defined
- [ ] Database queries are optimized
- [ ] Data transformation is correct
- [ ] Logging is appropriate

## Common Review Comments

### Performance Issues

```markdown
**Blocking**: This could cause performance issues with large datasets.

Consider implementing pagination or virtual scrolling for the user list.

```typescript
// Instead of loading all users at once
const users = await getAllUsers();

// Load users with pagination
const users = await getUsers({ limit: 20, offset: 0 });
```

```

### Security Concerns

```markdown
**Blocking**: User input is not being sanitized, which could lead to XSS attacks.

Please sanitize the input before displaying it:

```typescript
import { sanitizeHtml } from '@/lib/security';

const safeContent = sanitizeHtml(userInput);
```

```

### Code Organization

```markdown
**Suggestion**: This component is getting quite large. Consider breaking it down into smaller components.

You could extract the form logic into a separate `UserForm` component and the display logic into a `UserDisplay` component.
```

### Type Safety

```markdown
**Suggestion**: Consider using a more specific type instead of `any`.

```typescript
// Instead of
function processData(data: any) { ... }

// Use
interface ProcessableData {
  id: string;
  value: number;
}

function processData(data: ProcessableData) { ... }
```

```

### Testing

```markdown
**Suggestion**: This function would benefit from unit tests, especially for the edge cases.

Consider adding tests for:
- Empty input
- Invalid data format
- Network errors
```

## Review Tools and Features

### GitHub Review Features

#### Suggesting Changes

```markdown
```suggestion
const isAuthenticated = user?.id != null;
```

```

#### Reviewing Specific Lines
- Click line numbers to comment on specific lines
- Select multiple lines for range comments
- Use "Start a review" to batch comments

#### Review Status
- **Comment**: General feedback, doesn't block merge
- **Approve**: Changes look good, ready to merge
- **Request Changes**: Issues must be addressed before merge

### VS Code Integration

```json
// .vscode/settings.json
{
  "github.pullRequests.defaultMergeMethod": "merge",
  "github.pullRequests.showInSCM": true,
  "gitlens.codeLens.enabled": true
}
```

## Review Metrics and Goals

### Response Time Goals

- **Initial Response**: Within 24 hours
- **Follow-up Reviews**: Within 4 hours during business hours
- **Final Approval**: Within 1 business day of addressing feedback

### Quality Metrics

- **Bug Detection**: Catch issues before they reach production
- **Knowledge Transfer**: Team members learn from each review
- **Code Consistency**: Maintain architectural patterns
- **Test Coverage**: Maintain or improve coverage with each PR

## Handling Disagreements

### When Author Disagrees with Feedback

1. **Discuss Openly**
   - Explain your reasoning clearly
   - Ask questions to understand the reviewer's perspective
   - Consider alternative approaches

2. **Seek Additional Input**
   - Ask for a second opinion from another team member
   - Bring up in team discussion if it's a broader architectural decision

3. **Document Decisions**
   - Record the reasoning behind decisions
   - Update coding guidelines if needed

### When Reviewer is Uncertain

1. **Ask Questions**
   - "I'm not familiar with this pattern, can you explain the benefits?"
   - "Have you considered approach X? What are the trade-offs?"

2. **Research and Learn**
   - Look up best practices
   - Check existing codebase for similar patterns
   - Ask team members for input

## Review Automation

### Automated Checks

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks
on:
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### Code Quality Tools

- **ESLint**: Catch common JavaScript/TypeScript issues
- **Prettier**: Ensure consistent code formatting
- **TypeScript**: Catch type-related errors
- **Jest**: Run unit tests automatically
- **Husky**: Run checks on commit/push

## Continuous Improvement

### Regular Review Retrospectives

Monthly team discussions about:

- What's working well in our review process?
- What could be improved?
- Are we catching the right issues?
- How can we make reviews more efficient?

### Updating Guidelines

- Review and update guidelines quarterly
- Incorporate lessons learned from production issues
- Adapt to new tools and technologies
- Get team input on process changes

### Training and Onboarding

- Include code review training for new team members
- Pair new reviewers with experienced ones
- Share examples of good and bad review practices
- Encourage learning from each review
