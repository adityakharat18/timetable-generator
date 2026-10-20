---
name: Academic Algorithmic Architecture
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#3130c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b4dd8'
  on-tertiary-container: '#d9d8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  metric-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves academic administrators, department heads, and operational planners who resolve multi-dimensional scheduling problems. The emotional tone balances scholarly authority with the precision of computational science. The interface must communicate stability, mathematical rigor, and clarity under dense cognitive loads. 

The aesthetic style is **Corporate / Modern** elevated by clean computational instrumentation:
- Precision gridlines, crisp container separation, and quiet surface transitions.
- High typographic legibility prioritizing tabular scannability and structural alignment over decorative flair.
- High-density data presentation without visual clutter, emphasizing status transparency, constraint resolution, and algorithmic iteration metrics.

## Colors

The color palette centers on a disciplined academic slate foundation highlighted by restrained indigo accents and distinct functional markers.

### Core Canvas & Surfaces
- **Canvas Base**: `#F8FAFC` (Slate 50) provides an anti-glare, calm reading canvas across large viewports.
- **Surface Elevation 0 (Card/Panels)**: `#FFFFFF` (Pure White) creates crisp, distinct planes against the canvas.
- **Surface Elevation 1 (Muted/Sub-panels)**: `#F1F5F9` (Slate 100) used for table headers, inactive segments, and nested algorithm nodes.

### Structural Text & Lines
- **Primary Text**: `#0F172A` (Slate 900) provides high contrast for timetable grids, metrics, and primary hierarchy.
- **Secondary Text**: `#334155` (Slate 700) for labels, secondary copy, and table rows.
- **Muted Text / Icons**: `#64748B` (Slate 500) for tertiary descriptors, metadata, and empty states.
- **Structural Borders**: `#E2E8F0` (Slate 200) for razor-thin 1px bounding boxes and dividers.
- **Subtle Borders**: `#F1F5F9` (Slate 100) for internal table row dividers.

### Primary Accents & Interaction
- **Primary Brand / Interactive**: `#4F46E5` (Indigo 600) for active buttons, selected tabs, progress fills, and primary actions.
- **Primary Hover / Focus**: `#4338CA` (Indigo 700).
- **Secondary Accent**: `#6366F1` (Indigo 500) for node links, algorithm state diagrams, and subtle glow highlights.
- **Accent Soft Surface**: `#EEF2FF` (Indigo 50) for selected row highlights and active interactive badges.

### Academic Subject Taxonomy
Badges and schedule blocks require distinct, low-saturation pastels paired with deep contrast text to preserve readability:
- **Accountancy**: Surface `#E0F2FE` (Sky 100), Border `#BAE6FD` (Sky 200), Text `#0369A1` (Sky 700).
- **Business Law**: Surface `#F3E8FF` (Purple 100), Border `#E9D5FF` (Purple 200), Text `#6B21A8` (Purple 800).
- **Book Keeping**: Surface `#CCFBF1` (Teal 100), Border `#99F6E4` (Teal 200), Text `#0F766E` (Teal 800).
- **Secretarial Practice**: Surface `#FFEDD5` (Orange 100), Border `#FED7AA` (Orange 200), Text `#C2410C` (Orange 700).

### Algorithmic & Validation Status Indicators
- **Valid (Fitness Met / Feasible)**: Text `#15803D`, Surface `#DCFCE7`, Border `#86EFAC`.
- **Warning (Soft Constraint Violated)**: Text `#B45309`, Surface `#FEF3C7`, Border `#FDE68A`.
- **Conflict (Hard Constraint Collision)**: Text `#B91C1C`, Surface `#FEE2E2`, Border `#FCA5A5`.

## Typography

Typography prioritizes information density and numerical scanning.

- **Plus Jakarta Sans** is reserved for headlines, section titles, and primary numerical metric cards. Its geometric yet slightly sculpted characteristics lend modern authority without being overly playful.
- **Inter** handles all tabular data, input labels, administrative metadata, and body prose. Its tall x-height and neutral grotesque terminals support high-density readability.
- **Tabular Figures**: All timetable times, room indices, generation counts, and fitness score readouts must use the OpenType feature `tnum` (tabular numbers) to avoid layout shifts during real-time genetic algorithm iterations.

## Layout & Spacing

The layout model is an asymmetrical fluid grid designed for dual monitoring: configuration parameters on one side, dense timetable and algorithmic telemetry on the other.

### Layout Model
- **Desktop (1280px and above)**: 12-column layout. Typically structured as a persistent 260px left sidebar, a 340px constraint/generation panel, and a fluid main viewport holding the timetable matrix and convergence graphs.
- **Tablet (768px - 1279px)**: 8-column layout. Left navigation collapses into an icon dock (64px); constraint tuning moves into collapsible horizontal accordions above the timetable matrix.
- **Mobile (Below 768px)**: 4-column layout. Timetable views switch from full horizontal calendar matrices to single-day tabbed lists or vertical agenda cards.

### Spacing Rhythm
- Compact spatial rhythm derived from a strict 4px / 8px baseline.
- `space-xs` (4px) and `space-sm` (8px) govern micro-interactions within badges, status chips, table cells, and form inputs.
- `space-md` (12px) and `space-lg` (20px) manage container internal paddings.
- `space-xl` (32px) defines boundary separations between high-level architectural zones.

## Elevation & Depth

Visual hierarchy uses **low-contrast outlines** paired with **ambient micro-shadows**, ensuring the high density of schedule blocks does not induce visual fatigue.

- **Level 0 (Canvas)**: Color `#F8FAFC`, flat, 0px shadow.
- **Level 1 (Cards, Timetable Cells, Data Tables)**: Color `#FFFFFF`, 1px solid `#E2E8F0`, shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Dropdowns, Popovers, Dragging Timetable Slots)**: Color `#FFFFFF`, 1px solid `#CBD5E1`, shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modal Dialogs, Constraint Resolution Overlays)**: Color `#FFFFFF`, 1px solid `#94A3B8`, shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

Dragging items or live genetic algorithm mutations employ a focused ring (`box-shadow: 0 0 0 2px #EEF2FF, 0 0 0 4px #4F46E5`) rather than deep dramatic drop shadows.

## Shapes

The design system employs **Level 1 (Soft)** rounding to maintain crisp architectural precision:
- Standard buttons, inputs, table container borders, and calendar grid blocks use `0.25rem` (4px) radius.
- Larger cards, metric panels, and visual model nodes use `rounded-lg` (`0.5rem` / 8px).
- Modals, global drawers, and flyout overlays use `rounded-xl` (`0.75rem` / 12px).
- Status indicator dots, algorithmic node junctions, and avatar markers use fully circular geometries (`rounded-full`).

## Components

### Buttons
- **Primary**: Background `#4F46E5`, text `#FFFFFF`, border none, 4px border-radius. Padding: 8px 16px. Height: 36px. Font weight 600. Hover state: `#4338CA`. Active state: `#3730A3`.
- **Secondary / Outline**: Background `#FFFFFF`, text `#334155`, border 1px solid `#E2E8F0`. Hover state: `#F8FAFC` with border `#CBD5E1`.
- **Destructive**: Background `#FFFFFF`, text `#B91C1C`, border 1px solid `#FCA5A5`. Hover state: `#FEE2E2`.
- **Compact Metric Action**: Height 28px, 6px 10px padding, font size 12px, for instant operations inside timetable grid slots.

### Timetable Subject Badges
- Displayed inside timetable grid slots. Must use light background, 1px matching border, deep matching text, and 4px border-radius.
- Internal layout: Subject abbreviation or name (bold 12px), followed by Room index (regular 11px) and Faculty initials (muted 11px).
- Must show a subtle left border accent (3px width) in the corresponding subject's darkest tone for rapid peripheral identification.

### Status Indicators & Conflict Chips
- **Conflict Tag**: Height 20px, 4px radius, `#FEE2E2` fill, `#B91C1C` text, `#FCA5A5` border. Displays an alert icon alongside collision descriptors (e.g., `Prof. Davis: Overlap`).
- **Fitness Score Meter**: Linear progress bar with `#E2E8F0` track, `#4F46E5` fill for regular optimization, transitioning to `#15803D` upon reaching 100% feasibility.

### Structured Data Tables
- Table headers: `#F8FAFC`, uppercase 11px text (`#64748B`), 1px solid `#E2E8F0` bottom boundary.
- Cells: Vertical padding 10px, horizontal padding 12px. Row dividers 1px solid `#F1F5F9`. Hover state `#F8FAFC`.
- Conflict lines: Highlighted with a background of `#FEF2F2` and a left border of 3px `#DC2626`.

### Input Fields & Controls
- **Text Inputs & Selects**: Height 36px, background `#FFFFFF`, border 1px solid `#E2E8F0`, 4px radius, text 14px `#0F172A`. Focus state: border `#4F46E5`, ring `0 0 0 3px #EEF2FF`.
- **Checkboxes & Radios**: 16px square/circle, border 1px solid `#CBD5E1`. Checked state: `#4F46E5` fill with white glyph check.

### Metric Stat Cards
- Background `#FFFFFF`, border 1px solid `#E2E8F0`, padding 16px, 8px radius.
- Upper row: Uppercase label in 11px `#64748B` with contextual trend icon.
- Lower row: Primary numeric value in 24px `Plus Jakarta Sans` bold `#0F172A`, followed by small secondary delta badge.

### Genetic Algorithm Flow Diagrams
- Nodes: 8px rounded white containers with 1px solid `#E2E8F0`. Title in 12px `#0F172A` bold; status pill in upper corner.
- Connectors: 1.5px solid `#CBD5E1` lines with directional arrow markers; animated pulse in `#6366F1` when a generation phase (Selection, Crossover, Mutation) is currently executing.