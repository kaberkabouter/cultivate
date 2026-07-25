<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cultivate Design System (CDS) Rules

All styling and UI components across Cultivate MUST strictly adhere to the **Cultivate Design System (CDS)**:

1. **Global Tokens First**: Always consume central design tokens from `src/app/globals.css` (`@theme`). Never hardcode hex colors or arbitrary border-radius/spacing values in components.
2. **Standard 3-Tier Border Radius Scale**:
   - `sm` (8px / `rounded-lg`): Badges, chips, micro-toggles.
   - `md` (12px / `rounded-xl`): Buttons, inputs, selects, table cells.
   - `lg` (16px / `rounded-2xl`): Cards, modals, containers, tab bar shells.
3. **Atomic UI Primitives**: Always build user interfaces using the standardized UI primitives in `src/components/ui/` (`Button`, `Card`, `Input`, `Select`, `Badge`, `Dialog`, `Table`, `Tabs`, `StatCard`).
4. **Color Semantics**:
   - `primary`: Emerald (`#10b981`) for primary call-to-actions and positive trajectories.
   - `baseline`: Cobalt Blue (`#3b82f6`) for baseline forecast indicators.
   - `destructive`: Rose (`#f43f5e`) for expenses and destructive actions.
   - `surface`: Slate 950 canvas (`#020617`) and Slate 900 card surface (`#0f172a`).
