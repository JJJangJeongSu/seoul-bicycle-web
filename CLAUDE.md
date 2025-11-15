# CLAUDE.md - AI Assistant Guide for Seoul Bicycle Simulation Platform

## Project Overview

**Project Name:** Seoul Bicycle Simulation Platform Web
**Repository:** seoul-bicycle-web
**Purpose:** A web-based simulation platform for Seoul's bicycle sharing system, designed to visualize and analyze bicycle usage patterns, station data, and operational metrics.

**Design Source:** [Figma - Simulation Platform Design](https://www.figma.com/design/aJfOnTQZwtUneqKjGGYkcj/Simulation-Platform-Design)

## Current State

This is a **new repository** in early development. The project structure and dependencies are being established.

## Technology Stack

Based on the project requirements and README, the expected stack includes:

- **Runtime:** Node.js (LTS version recommended)
- **Package Manager:** npm
- **Framework:** TBD (likely React, Next.js, or similar modern frontend framework)
- **Language:** JavaScript/TypeScript (TypeScript strongly recommended for type safety)
- **Build Tools:** Vite, Webpack, or similar modern bundler
- **Styling:** TBD (CSS Modules, Tailwind CSS, styled-components, or similar)

## Repository Structure

### Recommended Directory Layout

```
seoul-bicycle-web/
├── .git/                    # Git repository
├── .github/                 # GitHub workflows and templates
│   └── workflows/           # CI/CD pipelines
├── public/                  # Static assets
│   ├── images/             # Image assets
│   └── data/               # Static data files
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── simulation/     # Simulation-specific components
│   │   ├── charts/         # Data visualization components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components/routes
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and data fetching
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Application constants
│   ├── styles/             # Global styles
│   ├── store/              # State management (Redux, Zustand, etc.)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── docs/                   # Documentation
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Node dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Build tool configuration
├── README.md              # Project documentation
└── CLAUDE.md              # This file - AI assistant guide
```

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Branch Strategy

- **main/master:** Production-ready code
- **develop:** Integration branch for features
- **feature/[name]:** New features
- **bugfix/[name]:** Bug fixes
- **hotfix/[name]:** Urgent production fixes
- **claude/[session-id]:** AI assistant working branches

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `ci:` CI/CD changes

**Examples:**
```
feat(simulation): add bicycle flow visualization
fix(api): correct station data fetch logic
docs(readme): update installation instructions
refactor(components): extract reusable chart component
```

## Code Conventions

### TypeScript/JavaScript

1. **Use TypeScript** for all new code
2. **Strict mode:** Enable strict TypeScript checking
3. **Naming conventions:**
   - Components: PascalCase (`SimulationMap.tsx`)
   - Functions/variables: camelCase (`fetchStationData`)
   - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
   - Types/Interfaces: PascalCase (`StationData`, `BicycleMetrics`)
   - Private methods: prefix with underscore (`_handleInternalState`)

4. **File organization:**
   - One component per file
   - Co-locate tests with source files (`Component.tsx`, `Component.test.tsx`)
   - Export named exports for better refactoring

5. **Function preferences:**
   - Prefer functional components over class components
   - Use arrow functions for callbacks
   - Keep functions small and single-purpose

6. **Type safety:**
   ```typescript
   // Good - explicit types
   interface StationData {
     id: string;
     name: string;
     location: { lat: number; lng: number };
     bicycleCount: number;
   }

   function fetchStation(id: string): Promise<StationData> {
     // ...
   }

   // Avoid 'any' type
   // Bad: function processData(data: any)
   // Good: function processData(data: StationData)
   ```

### React Best Practices

1. **Component structure:**
   ```typescript
   // Imports
   import React, { useState, useEffect } from 'react';

   // Types
   interface Props {
     stationId: string;
   }

   // Component
   export function StationDetail({ stationId }: Props) {
     // Hooks
     const [data, setData] = useState<StationData | null>(null);

     // Effects
     useEffect(() => {
       // ...
     }, [stationId]);

     // Event handlers
     const handleRefresh = () => {
       // ...
     };

     // Render helpers
     const renderStats = () => {
       // ...
     };

     // Main render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   }
   ```

2. **Hooks usage:**
   - Use custom hooks to encapsulate reusable logic
   - Follow hooks rules (only call at top level, only in React functions)
   - Memoize expensive calculations with `useMemo`
   - Memoize callbacks with `useCallback` when passed to optimized children

3. **State management:**
   - Use local state for component-specific data
   - Use context for shared state in component trees
   - Consider state management library (Redux, Zustand) for complex global state

### Styling

1. **Consistent approach:** Choose one styling method and stick with it
2. **Responsive design:** Mobile-first approach
3. **Accessibility:** Follow WCAG guidelines
4. **Color variables:** Use CSS variables or theme constants
5. **Class naming:** Use BEM or CSS Modules to avoid conflicts

### Performance

1. **Code splitting:** Split code by routes/features
2. **Lazy loading:** Lazy load components and heavy dependencies
3. **Memoization:** Use React.memo for expensive renders
4. **Debouncing/Throttling:** Apply to frequent events (scroll, resize, input)
5. **Bundle analysis:** Regularly check bundle size

## Testing Strategy

### Test Types

1. **Unit Tests:** Test individual functions and components
   - Framework: Vitest or Jest
   - React testing: React Testing Library
   - Coverage goal: >80% for utilities, >70% for components

2. **Integration Tests:** Test component interactions
   - Test user workflows
   - Mock external APIs

3. **E2E Tests:** Test complete user journeys
   - Framework: Playwright or Cypress
   - Focus on critical paths

### Test Conventions

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { StationDetail } from './StationDetail';

describe('StationDetail', () => {
  it('should render station name', () => {
    render(<StationDetail stationId="123" />);
    expect(screen.getByText('Station Name')).toBeInTheDocument();
  });

  it('should fetch data on mount', async () => {
    // ...
  });
});
```

## Data Handling

### API Integration

1. **Service layer:** Encapsulate all API calls in service modules
   ```typescript
   // src/services/stationService.ts
   export async function fetchStations(): Promise<StationData[]> {
     const response = await fetch(`${API_BASE_URL}/stations`);
     return response.json();
   }
   ```

2. **Error handling:** Always handle errors gracefully
3. **Loading states:** Show loading indicators
4. **Caching:** Consider caching strategies for static data

### Simulation Data

1. **Data models:** Define clear TypeScript interfaces for all data types
2. **Validation:** Validate data from external sources
3. **Transformation:** Keep raw data separate from display data
4. **Performance:** Consider data pagination/virtualization for large datasets

## Environment Configuration

### Environment Variables

Create `.env.example` with:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_API_KEY=your_map_api_key
VITE_ENVIRONMENT=development
```

**Rules:**
- Never commit `.env` files with real credentials
- Prefix variables with `VITE_` (or appropriate prefix for your bundler)
- Document all required variables in `.env.example`

## Security Considerations

1. **API Keys:** Never expose API keys in client-side code
2. **Input Validation:** Validate and sanitize all user inputs
3. **XSS Prevention:** Use React's built-in XSS protection, avoid `dangerouslySetInnerHTML`
4. **HTTPS:** Use HTTPS in production
5. **Dependencies:** Regularly audit and update dependencies
   ```bash
   npm audit
   npm audit fix
   ```

## Accessibility (a11y)

1. **Semantic HTML:** Use appropriate HTML elements
2. **ARIA labels:** Add labels where necessary
3. **Keyboard navigation:** Ensure all interactive elements are keyboard accessible
4. **Color contrast:** Meet WCAG AA standards minimum
5. **Screen readers:** Test with screen readers
6. **Focus management:** Maintain clear focus indicators

## AI Assistant Specific Guidelines

### When Working on This Project

1. **Always check existing code** before creating new files
2. **Prefer editing over creating** new files when possible
3. **Follow established patterns** in the codebase
4. **Use TypeScript** for all new code with proper types
5. **Write tests** for new features
6. **Update documentation** when making significant changes

### Before Making Changes

1. **Read the Figma design** link if working on UI components
2. **Check for existing implementations** of similar features
3. **Understand the data flow** before modifying state management
4. **Review recent commits** to understand context

### Code Quality Checks

Before committing, ensure:
- [ ] Code compiles without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint` if configured)
- [ ] TypeScript types are properly defined
- [ ] No console.logs or debugging code left in
- [ ] Comments explain "why" not "what"
- [ ] Accessibility requirements met
- [ ] Responsive design tested

### Common Tasks

**Adding a new component:**
1. Create component file in appropriate directory
2. Define TypeScript interfaces for props
3. Implement component with proper hooks
4. Add styles (following project convention)
5. Write unit tests
6. Export from index file if needed
7. Document props and usage

**Adding a new API endpoint integration:**
1. Define TypeScript types for request/response
2. Create service function in `src/services/`
3. Add error handling
4. Consider caching strategy
5. Write unit tests for service
6. Document API endpoint and usage

**Fixing bugs:**
1. Understand the root cause
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Verify the test passes
5. Check for similar issues elsewhere
6. Document the fix in commit message

### Git Workflow for AI Assistants

1. **Always work on feature branches** (already configured as `claude/[session-id]`)
2. **Commit frequently** with meaningful messages
3. **Push when ready** using: `git push -u origin <branch-name>`
4. **Create PRs** with clear descriptions of changes
5. **Never force push** to main/master

## Documentation

### Code Documentation

1. **JSDoc comments** for public APIs:
   ```typescript
   /**
    * Fetches bicycle station data by ID
    * @param stationId - The unique identifier for the station
    * @returns Promise resolving to station data
    * @throws {Error} When station is not found
    */
   export async function fetchStation(stationId: string): Promise<StationData>
   ```

2. **README sections to maintain:**
   - Installation instructions
   - Available scripts
   - Environment setup
   - Project structure
   - Contributing guidelines

3. **Update CLAUDE.md** when:
   - Technology stack changes
   - New patterns are established
   - Directory structure changes
   - New conventions are adopted

## Performance Metrics

Monitor and optimize:
- **Bundle size:** Keep main bundle < 250KB gzipped
- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3.5s
- **Lighthouse score:** > 90 (Performance, Accessibility, Best Practices, SEO)

## Debugging

### Common Issues

1. **Build failures:** Check Node.js version and dependency versions
2. **Type errors:** Ensure all dependencies have types (`@types/` packages)
3. **Hot reload issues:** Clear cache and restart dev server
4. **API errors:** Check CORS settings and API endpoint URLs

### Debugging Tools

- React DevTools (browser extension)
- Redux DevTools (if using Redux)
- Network tab for API calls
- Console for runtime errors
- Source maps for debugging production builds

## Resources

- **Figma Design:** https://www.figma.com/design/aJfOnTQZwtUneqKjGGYkcj/Simulation-Platform-Design
- **React Documentation:** https://react.dev
- **TypeScript Documentation:** https://www.typescriptlang.org/docs
- **Web Accessibility:** https://www.w3.org/WAI/WCAG21/quickref

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0   | 2025-11-15 | Initial CLAUDE.md creation |

---

**Last Updated:** 2025-11-15
**Maintainer:** AI Assistant
**Status:** Active Development

## Notes for Future Updates

As the project evolves, keep this document updated with:
- Actual technology choices made (framework, state management, styling)
- Established code patterns and conventions
- API documentation and data models
- Deployment procedures
- Team-specific conventions
- Performance optimization strategies
- Known issues and solutions
