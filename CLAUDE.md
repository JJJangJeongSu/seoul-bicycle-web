# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Seoul bike-sharing (따릉이) simulation platform built with React and Vite. The application is a mock frontend that simulates a bike rental system with user and admin interfaces, using client-side mock data instead of a backend API.

**Original Design**: https://www.figma.com/design/aJfOnTQZwtUneqKjGGYkcj/Simulation-Platform-Design

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 3000, auto-opens browser)
npm run dev

# Build for production (outputs to /build directory)
npm run build
```

## Tech Stack

- **Framework**: React 18.3.1 with Vite 6.3.5
- **Compiler**: SWC (via @vitejs/plugin-react-swc)
- **Styling**: TailwindCSS v4 (imported via index.css)
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Charts**: Recharts 2.15.2
- **Icons**: Lucide React
- **Forms**: React Hook Form 7.55.0
- **Theme**: next-themes for dark/light mode support
- **Path Alias**: `@/` points to `src/` directory

## Architecture

### State Management

This application uses **React local state only** (useState hooks) for all state management. There is no global state management library (no Redux, Zustand, etc.).

**Critical state flows**:
- **User authentication**: Handled in App.tsx via `user` state, passed down as props
- **Current rental**: Tracked in App.tsx via `currentRental` state
- **Page navigation**: Controlled by `currentPage` state in App.tsx (client-side routing)
- **Mock data**: Imported from `src/lib/mockData.ts` and copied to local state

### Component Organization

```
src/
├── App.tsx                 # Root component with auth, navigation, and rental state
├── main.tsx               # React entry point
├── components/
│   ├── auth/              # LoginModal, SignupModal
│   ├── layout/            # Navbar (navigation bar)
│   ├── pages/             # Full page components (HomePage, MyPage, etc.)
│   │   ├── HomePage.tsx       # Station browsing (map/list views)
│   │   ├── MyPage.tsx         # User rental history and stats
│   │   ├── BoardPage.tsx      # Community board
│   │   ├── RepairPage.tsx     # Bike/station repair reporting
│   │   ├── RoutePage.tsx      # Route navigation
│   │   ├── AICourseRecommendPage.tsx  # AI course recommendations
│   │   └── AdminPage.tsx      # Admin dashboard (tabs for users, stations, bikes, repairs)
│   ├── home/              # HomePage subcomponents (MapView, ListView, StationDetailModal)
│   ├── mypage/            # MyPage subcomponents
│   ├── board/             # Board feature components
│   ├── repair/            # Repair feature components
│   ├── admin/             # Admin feature components
│   └── ui/                # shadcn/ui components (50+ components, DO NOT EDIT)
├── lib/
│   └── mockData.ts        # All mock data (stations, rentals, posts, repairs, routes)
└── styles/
    └── globals.css
```

### Page Navigation

The app uses a **manual client-side router** (no React Router):
- Navigation controlled by `currentPage` state in App.tsx
- Valid pages: 'home' | 'mypage' | 'board' | 'repair' | 'admin' | 'route' | 'aicourserecommend'
- Page changes triggered via Navbar component buttons

### Type Definitions

Core types are defined **directly in App.tsx** (lines 13-42):
- `User`: User account with role ('user' | 'admin')
- `Station`: Bike station with location and bike count
- `Rental`: Rental record with timestamps and distance

When you need these types in child components, import them from App.tsx:
```tsx
import { User, Station, Rental } from '../../App';
```

### Mock Data Pattern

All data lives in `src/lib/mockData.ts`. Components typically:
1. Import mock data arrays
2. Copy to local state on mount
3. Simulate CRUD operations by modifying local state

Example pattern seen throughout:
```tsx
import { mockStations } from '../../lib/mockData';
const [stations, setStations] = useState<Station[]>(mockStations);
```

### Authentication Flow

Mock authentication in App.tsx:
- Email `admin@test.com` creates admin user (role: 'admin')
- Any other email creates regular user (role: 'user')
- No real password validation (mock system)
- Admin role unlocks AdminPage; regular users see MyPage

### UI Component Library

The `src/components/ui/` directory contains 50+ shadcn/ui components. These are:
- Pre-built, styled Radix UI wrappers
- **Should NOT be edited** unless fixing bugs
- Imported and used as-is in feature components

To use UI components:
```tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

## Important Implementation Notes

### Path Aliasing

vite.config.ts defines extensive package version aliases (lines 11-48) to handle specific versions. The `@` alias points to `src/`:
```tsx
import { mockStations } from '@/lib/mockData';
```

### Styling Approach

- TailwindCSS utility classes for all styling
- Responsive design with md:, lg: breakpoints
- Component variants use `class-variance-authority` (cva)
- Theme support via `next-themes` (light/dark mode ready)

### Data Flow Rules

1. **No API calls**: All data is local/mocked
2. **Props drilling**: State passed down from App.tsx through props (no context API)
3. **Callback pattern**: Child components receive `onSomething` callbacks to trigger parent state updates

Example from HomePage:
```tsx
<HomePage
  user={user}
  currentRental={currentRental}
  onRent={setCurrentRental}
  onLoginRequired={() => setShowLoginModal(true)}
/>
```

## Key Features by Page

### HomePage
- **Toggle views**: Map view or List view of stations
- **Filters**: Search, district filter, bike availability
- **Station details**: Modal with station info and bike rental action
- **Auto-refresh**: Optional automatic station data refresh

### MyPage (regular users only)
- Rental history with charts (Recharts)
- User statistics (distance, duration, rental count)
- User settings

### AdminPage (admin users only)
- Dashboard with statistics and charts
- Tabs: Users, Stations, Bikes, Repairs
- Simulate admin CRUD operations on mock data

### BoardPage
- Community posts (categories: notice, info, question, free)
- Post detail view
- Post editor (requires login)

### RepairPage
- Report bike/station issues
- View repair history
- Categories: brake, tire, chain, light, seat, bell, other

### RoutePage
- Route navigation features

### AICourseRecommendPage
- AI-powered course recommendations

## When Adding New Features

1. **State placement**: Add state to the closest common ancestor (often App.tsx for global features)
2. **Types**: Add new types in App.tsx if used across multiple components
3. **Mock data**: Add to `src/lib/mockData.ts` and follow existing patterns
4. **UI components**: Reuse existing shadcn/ui components from `src/components/ui/`
5. **Styling**: Use Tailwind utility classes consistently with the rest of the codebase
