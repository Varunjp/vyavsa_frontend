# Agent Rule 05: UI Development, Styling & Design System

## 1. Styling Stack & Exclusivity
- **Bootstrap 5**: The foundational CSS framework.
- **Do Not Install Tailwind CSS**: Tailwind is strictly forbidden.
- **Do Not Mix UI Frameworks**: Do not install MUI, AntD, Chakra, or Shadcn. Use custom reusable components built on Bootstrap 5 markup and Vyavsa design tokens.

## 2. Design Tokens
The design system is anchored on modern 2026 SaaS visual standards:
- **Brand Colors**:
  - Primary: `#4f46e5` (Indigo 600)
  - Primary Hover: `#4338ca` (Indigo 700)
  - Primary Active: `#3730a3` (Indigo 800)
  - Primary Subtle: `#eef2ff`
  - Primary Border: `#c7d2fe`
- **Surfaces & Borders**:
  - Background: `#f8fafc` (Slate 50)
  - Card/Modal Surface: `#ffffff`
  - Subtle Hover: `#f1f5f9` (Slate 100)
  - Border: `#e2e8f0` (Slate 200)
  - Focus Ring: `#6366f1` (Indigo 500)
- **Text Palette**:
  - Main Text: `#0f172a` (Slate 900)
  - Muted Text: `#64748b` (Slate 500)
  - Subtle Text: `#94a3b8` (Slate 400)
- **Typography**:
  - Body & Headings: `Plus Jakarta Sans`, sans-serif.
  - Tabular Numbers & Currency: `JetBrains Mono`, monospace.

## 3. Mandatory Component States
Every asynchronous view must handle three states:
1. **Loading State**: Render `LoadingSpinner` or skeleton placeholder while data loads.
2. **Empty State**: Render `EmptyState` when collections return zero items, including an action button to create the first record.
3. **Error State**: Render `ErrorState` with an informative error message and a retry trigger.

## 4. Reusable Component Primitives
Located under `src/components/ui/`:
- `Button`: Primary, secondary, danger, outline, and subtle variants with loading spinner support.
- `Input`: Accessible input with floating label, error message, and prefix/suffix icon slots.
- `Select`: Semantic select dropdown with typed options.
- `Modal`: Accessible dialog overlay with backdrop dismiss, keyboard escape, and focus trap.
- `Card`: Bordered container with header, body, and footer sections.
- `DataTable`: Responsive table with column sorting and pagination controls.
- `PageHeader`: Consistent title, breadcrumb trail, and top-right action buttons.
