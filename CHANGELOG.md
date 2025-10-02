# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2025-01-02

### Added

- Open source readiness improvements
- Comprehensive documentation structure
- GitHub templates and workflows
- Development automation tools
- `NEXT_PUBLIC_AIRTABLE_TOKEN` as alternative to API key
- `NEXT_PUBLIC_BASE_ID` for additional base configuration
- `NEXT_PUBLIC_TABLE_ID` for specific table targeting
- Better documentation for multiple Airtable base usage

### Changed

- Updated environment configuration documentation in `env.example`
- Aligned environment variable names with actual implementation
- Added support for `NEXT_PUBLIC_` prefixed Airtable variables for client-side access
- Enhanced Airtable configuration with additional token and table ID options
- Improved setup instructions and troubleshooting documentation

## [1.1.1] - 2024-12-19

### Added

- CueLABS™ platform with bounty system
- User authentication and profiles
- Project management dashboard
- Marketplace with Cue Currency system
- Leaderboards and community features
- Admin dashboard for bounty and submission management
- Integration with Airtable for data management
- GitHub OAuth authentication
- Responsive design with Tailwind CSS
- Redux state management with persistence
- TanStack Query for server state management

### Features

- **Bounty System**: Developers can participate in bounties and earn rewards
- **Project Collaboration**: Track and manage development projects
- **Marketplace**: Purchase items using earned Cue Currency
- **User Dashboard**: Comprehensive user interface for managing activities
- **Admin Tools**: Administrative oversight for platform management
- **Analytics Integration**: Vercel Analytics for performance monitoring

### Technical

- Built with Next.js 15 and React 19
- TypeScript for type safety
- shadcn/ui component library
- Radix UI primitives
- Modern development tooling with ESLint and Prettier

## [1.1.0] - 2024-12-01

### Added

- Enhanced marketplace functionality
- Improved user dashboard
- Additional admin features

## [1.0.0] - 2024-11-15

### Added

- Initial release of CueLABS™ platform
- Basic bounty system
- User authentication
- Project management features
- Marketplace foundation

[Unreleased]: https://github.com/cuesoftinc/cuelabs-platform/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/cuesoftinc/cuelabs-platform/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/cuesoftinc/cuelabs-platform/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/cuesoftinc/cuelabs-platform/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cuesoftinc/cuelabs-platform/releases/tag/v1.0.0
