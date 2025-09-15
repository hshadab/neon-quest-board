# Neon Quest Board - Design Documentation

**Last Updated:** 2025-09-15  
**Project Scope:** Full-featured task management board with neon cyberpunk aesthetic  
**Confidence Level:** High (85%)

## Stack & Technology Decisions

**Stack:** React 18.3.1, TypeScript, Tailwind CSS, shadcn/ui, Vite, React Router DOM  
**Standard:** Glassmorphism with neon glow effects, HSL color system, semantic tokens  
**Pattern:** Component-based architecture with custom hooks for state management  

## Core Design System

**Snippet:** Neon color palette defined in CSS variables
```css
--neon-blue: 195 100% 75%;
--neon-purple: 280 100% 70%;
--neon-pink: 320 100% 70%;
--neon-green: 120 100% 60%;
```

**Pattern:** Glass card system with backdrop blur and neon borders
- `bg-card-glass/50 backdrop-blur-glass border border-card-border/30`
- Hover states add glow effects and subtle transforms
- All animations use CSS custom properties for consistency

## Component Architecture

**Decision:** Modular component structure for quest board functionality
- `QuestColumn` - Drag-drop enabled column containers
- `QuestCard` - Interactive cards with progress, tags, difficulty
- `QuestDetailModal` - Full CRUD operations with checklist
- `WeekStrip` - Calendar overview with quest indicators
- `FiltersPanel` - Tag and difficulty filtering

**Rationale:** Separation of concerns allows for maintainable code and easy feature expansion

## State Management Strategy

**Pattern:** Custom hook `useQuestBoard` with localStorage persistence
- Debounced search (300ms delay)
- Automatic save on state changes
- Sample data initialization for new users

**Snippet:** Quest interface structure
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  difficulty: Difficulty;
  tags: string[];
  progress: number;
  dueDate?: string;
  checklist: ChecklistItem[];
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}
```

## User Experience Features

**Standard:** Keyboard-first design with shortcuts
- `Ctrl+K` - Command palette (planned)
- `Ctrl+N` - New quest creation
- `Ctrl+F` - Focus search input
- `Escape` - Close modals/panels

**Pattern:** Progressive disclosure in quest details
- Card view shows essential info (title, tags, progress, due date)
- Modal expands to full editing capabilities
- Activity stream for audit trail

## Visual Design Language

**Decision:** Cyberpunk neon aesthetic with glassmorphism
- Dark background (230 35% 7%) for contrast
- Neon accents for interactive elements
- Glass panels with backdrop-blur for depth
- Smooth animations with cubic-bezier easing

**Standard:** Semantic color mapping by quest status
- Backlog: Neon Blue (195 100% 75%)
- Doing: Neon Purple (280 100% 70%)
- Review: Neon Pink (320 100% 70%)
- Done: Neon Green (120 100% 60%)

## Data Persistence & State

**Pattern:** localStorage with automatic save/restore
- Storage key: 'neon-quest-board'
- Includes quest data, search term, and filter preferences
- Migration support for future schema changes

**Fix:** Added debounced search to prevent excessive filtering
- 300ms delay prevents lag during typing
- Separate state for immediate UI updates

## Responsive Design Considerations

**Standard:** Mobile-first grid system
- Single column on mobile (grid-cols-1)
- Two columns on tablet (md:grid-cols-2)
- Four columns on desktop (lg:grid-cols-4)

**Pattern:** Adaptive modal sizing
- Full viewport on mobile
- Constrained width (max-w-4xl) on desktop
- Scrollable content areas for long lists

## Performance Optimizations

**Decision:** Memoized quest filtering and grouping
- `useMemo` for filtered quests calculation
- `useMemo` for status-based grouping
- Prevents unnecessary re-renders on state changes

**Pitfall:** Avoided inline object creation in render
- Status colors defined as static objects
- Event handlers wrapped in useCallback where needed

## Future Enhancements

**Next:** Command palette implementation (Ctrl+K)
**Next:** Real-time collaboration features
**Next:** Quest templates and automation
**Next:** Advanced reporting and analytics

## Technical Debt & Improvements

**Pitfall:** Drag-and-drop currently uses native HTML5 API
- Consider react-beautiful-dnd for better UX
- Need touch support for mobile devices

**Fix:** Added TypeScript interfaces for all data structures
- Prevents runtime errors from malformed data
- Enables better IDE support and refactoring

## Documentation Links

**Link:** [Tailwind Glassmorphism Effects](https://tailwindcss.com/docs/backdrop-blur)
**Link:** [React Hook Patterns](https://react.dev/reference/react/hooks)
**Link:** [HSL Color System](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)

---

**scope=** Complete quest board with CRUD operations, filtering, search, keyboard shortcuts  
**confidence=** 85% - Core functionality implemented, some advanced features pending  
**path=** /src/pages/NeonQuestBoard.tsx - Main entry point  
**usage=** npm run dev to start development server, auto-saves to localStorage