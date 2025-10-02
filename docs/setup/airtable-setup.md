# Airtable Setup Guide

This guide will walk you through setting up an Airtable base for the CueLABS™ platform. Airtable serves as the database for managing users, bounties, submissions, and marketplace items.

## Prerequisites

- An Airtable account (free tier is sufficient for development)
- Basic understanding of database concepts (tables, fields, relationships)

## Step 1: Create a New Airtable Base

1. Log in to your [Airtable account](https://airtable.com)
2. Click "Create a base" from your workspace
3. Choose "Start from scratch"
4. Name your base "CueLABS™ Platform" (or your preferred name)
5. Choose a color and icon for easy identification

## Step 2: Create Required Tables

You'll need to create the following tables with their respective fields:

### Table 1: Users

Create a table named "Users" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique user identifier | Primary field |
| `email` | Email | User's email address | Required |
| `name` | Single line text | User's display name | |
| `github_username` | Single line text | GitHub username | |
| `cue_balance` | Number | User's Cue currency balance | Default: 0 |
| `role` | Single select | User role | Options: "user", "admin" |
| `created_at` | Date | Account creation date | |
| `last_login` | Date and time | Last login timestamp | |

### Table 2: Bounties

Create a table named "Bounties" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique bounty identifier | Primary field |
| `title` | Single line text | Bounty title | Required |
| `description` | Long text | Detailed bounty description | |
| `reward` | Number | Cue currency reward amount | Required |
| `status` | Single select | Bounty status | Options: "open", "in_progress", "completed", "cancelled" |
| `difficulty` | Single select | Difficulty level | Options: "beginner", "intermediate", "advanced" |
| `assignee` | Link to another record | Assigned user | Links to Users table |
| `created_by` | Link to another record | Bounty creator | Links to Users table |
| `created_at` | Date | Creation date | |
| `due_date` | Date | Deadline for completion | |
| `tags` | Multiple select | Bounty categories | Options: "frontend", "backend", "design", "documentation", "bug-fix" |

### Table 3: Submissions

Create a table named "Submissions" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique submission identifier | Primary field |
| `bounty_id` | Link to another record | Related bounty | Links to Bounties table |
| `user_id` | Link to another record | Submitting user | Links to Users table |
| `github_pr_url` | URL | GitHub pull request URL | |
| `status` | Single select | Submission status | Options: "pending", "approved", "rejected", "needs_changes" |
| `submitted_at` | Date and time | Submission timestamp | |
| `reviewed_at` | Date and time | Review timestamp | |
| `reviewer_notes` | Long text | Feedback from reviewer | |

### Table 4: Marketplace_Items

Create a table named "Marketplace_Items" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique item identifier | Primary field |
| `name` | Single line text | Item name | Required |
| `description` | Long text | Item description | |
| `price` | Number | Price in Cue currency | Required |
| `category` | Single select | Item category | Options: "electronics", "apparel", "accessories", "digital" |
| `image_url` | URL | Product image URL | |
| `stock_quantity` | Number | Available quantity | Default: 0 |
| `is_active` | Checkbox | Item availability | Default: checked |

### Table 5: Orders

Create a table named "Orders" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique order identifier | Primary field |
| `user_id` | Link to another record | Ordering user | Links to Users table |
| `total_amount` | Number | Total order cost | |
| `status` | Single select | Order status | Options: "pending", "processing", "shipped", "delivered", "cancelled" |
| `created_at` | Date and time | Order timestamp | |
| `shipping_address` | Long text | Delivery address | |

### Table 6: Order_Items

Create a table named "Order_Items" with these fields:

| Field Name | Field Type | Description | Options |
|------------|------------|-------------|---------|
| `id` | Single line text | Unique order item identifier | Primary field |
| `order_id` | Link to another record | Related order | Links to Orders table |
| `item_id` | Link to another record | Ordered item | Links to Marketplace_Items table |
| `quantity` | Number | Item quantity | Required |
| `unit_price` | Number | Price per unit | |

## Step 3: Configure Relationships

Set up the following relationships between tables:

1. **Users ↔ Bounties**:
   - Users can create multiple bounties (one-to-many)
   - Users can be assigned to multiple bounties (one-to-many)

2. **Bounties ↔ Submissions**:
   - Each bounty can have multiple submissions (one-to-many)

3. **Users ↔ Submissions**:
   - Each user can make multiple submissions (one-to-many)

4. **Users ↔ Orders**:
   - Each user can have multiple orders (one-to-many)

5. **Orders ↔ Order_Items**:
   - Each order can have multiple items (one-to-many)

6. **Marketplace_Items ↔ Order_Items**:
   - Each item can be in multiple orders (one-to-many)

## Step 4: Add Sample Data

### Sample Users

```
User 1:
- id: usr_001
- email: john.doe@example.com
- name: John Doe
- github_username: johndoe
- cue_balance: 150
- role: user

User 2:
- id: usr_002
- email: admin@cuelabs.cuesoft.io
- name: Admin User
- github_username: cuelabs-admin
- cue_balance: 1000
- role: admin
```

### Sample Bounties

```
Bounty 1:
- id: bty_001
- title: Fix responsive design on mobile
- description: The dashboard layout breaks on mobile devices. Need to fix CSS and ensure proper responsive behavior.
- reward: 50
- status: open
- difficulty: intermediate
- created_by: usr_002
- tags: frontend, bug-fix

Bounty 2:
- id: bty_002
- title: Add user profile page
- description: Create a user profile page where users can view and edit their information.
- reward: 75
- status: in_progress
- difficulty: beginner
- assignee: usr_001
- created_by: usr_002
- tags: frontend
```

### Sample Marketplace Items

```
Item 1:
- id: itm_001
- name: CueLABS™ T-Shirt
- description: Official CueLABS™ branded t-shirt in various sizes
- price: 25
- category: apparel
- stock_quantity: 50
- is_active: true

Item 2:
- id: itm_002
- name: Wireless Headphones
- description: High-quality wireless headphones perfect for coding sessions
- price: 100
- category: electronics
- stock_quantity: 10
- is_active: true
```

## Step 5: Get Your API Credentials

1. Go to your Airtable account settings
2. Navigate to "Developer" section
3. Click "Personal access tokens"
4. Click "Create new token"
5. Name it "CueLABS™ Development"
6. Select the following scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
7. Select your CueLABS™ base
8. Click "Create token"
9. Copy the token (it starts with `pat...`)

## Step 6: Get Your Base ID

1. Go to [Airtable API documentation](https://airtable.com/api)
2. Select your CueLABS™ base
3. Copy the Base ID from the URL or the documentation page
4. It should look like `appXXXXXXXXXXXXXX`

## Step 7: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
AIRTABLE_API_KEY=your_personal_access_token_here
AIRTABLE_BASE_ID=your_base_id_here
```

## Verification

To verify your setup is working:

1. Start your development server: `npm run dev`
2. Check the browser console for any Airtable connection errors
3. Try creating a test user through the application
4. Verify the data appears in your Airtable base

## Troubleshooting

### Common Issues

**Error: "Invalid API key"**

- Verify your personal access token is correct
- Ensure the token has the required scopes
- Check that the token hasn't expired

**Error: "Base not found"**

- Verify your Base ID is correct
- Ensure the token has access to the specific base
- Check that the base name matches your configuration

**Error: "Table not found"**

- Verify all table names match exactly (case-sensitive)
- Ensure all required tables have been created
- Check field names match the expected schema

**Error: "Permission denied"**

- Verify your token has write permissions
- Check that you're the owner or have edit access to the base
- Ensure the token scopes include `data.records:write`

### Performance Tips

- Use Airtable's built-in filtering and sorting to reduce API calls
- Implement proper caching in your application
- Consider using Airtable's webhook functionality for real-time updates
- Monitor your API usage to stay within rate limits

## Next Steps

After completing the Airtable setup:

1. Configure GitHub OAuth (see [GitHub OAuth Setup Guide](./github-oauth-setup.md))
2. Set up your environment variables (see [Environment Configuration Guide](./environment-setup.md))
3. Test the complete integration with your local development environment

## Additional Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Airtable Field Types Reference](https://support.airtable.com/hc/en-us/articles/203229705-Field-types-overview)
- [Airtable Rate Limits](https://airtable.com/developers/web/api/rate-limits)
