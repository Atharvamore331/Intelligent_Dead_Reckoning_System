---
name: IntelliDR
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-navigation:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  edge_margin: 16px
  stack_gap: 12px
  touch_target_min: 48px
  card_padding: 16px
---

## Brand & Style

The design system is centered on high-utility, technical precision for professional navigation. The target audience includes logistics operators, field engineers, and long-haul drivers who require immediate, glanceable data under varying lighting conditions. 

The visual style is **Minimalist-Technical**. It prioritizes information density and optical clarity over decorative elements. By utilizing a "Dark-UI First" approach, the system reduces eye strain during night operation and maximizes the contrast of critical route data. The aesthetic is inspired by aviation cockpits and modern IDEs: functional, systematic, and reliable. There is a strict avoidance of skeuomorphism or distracting glass effects; depth is instead communicated through disciplined tonal layering.

## Colors

The palette is optimized for OLED displays and high-glare environments. 

- **Navigation Blue (#3B82F6):** Reserved exclusively for the active path, primary action buttons, and directional indicators.
- **Surface Strategy:** The base layer uses #0B0B0C to merge with hardware bezels. Floating panels and cards use #141416 to create subtle separation.
- **Semantic Logic:** Green (#10B981) indicates "On Schedule" or "Route Clear." Amber (#F59E0B) is for "Traffic Delays" or "Low Fuel." Red (#EF4444) is strictly for "Road Closures" or "Critical Vehicle Alerts."
- **Contrast:** High-emphasis text must maintain at least a 7:1 contrast ratio against the charcoal backgrounds to ensure legibility while the device is mounted at arm's length.

## Typography

The design system utilizes **Inter** for its tall x-height and exceptional legibility in small sizes. 

- **Display-Navigation:** Used for the primary "Distance to Turn" or "Street Name" at the top of the HUD. It features tight tracking and heavy weight for immediate recognition.
- **Label-Caps:** Used for metadata (e.g., "ETA", "DISTANCE LEFT"). Always displayed in uppercase to distinguish from interactive body text.
- **Mono-Data:** While Inter is sans-serif, its tabular numbers are utilized for coordinates, speedometers, and timestamps to prevent layout jitter during real-time updates.
- **Mobile Scaling:** On small screens, `display-navigation` drops to 32px to ensure long street names do not truncate prematurely.

## Layout & Spacing

This design system follows a **4px grid system** to accommodate the technical nature of the UI.

- **Mobile Constraints:** A 16px safe-zone margin is maintained on the left and right edges. 
- **Touch Targets:** As a driver-facing app, the minimum touch target is strictly 48x48px, even if the visual element is smaller. 
- **Layout Model:** High-density data modules are stacked vertically in a "bottom-sheet" or "side-rail" configuration. 
- **Map Focus:** The map is the "Level 0" layer. All UI components are treated as "Overlays" with standardized 12px gaps between floating modules to allow the map to remain visible in the negative space.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Elevation** and **Structural Outlines** rather than soft shadows.

1.  **Level 0 (Map):** The deepest layer.
2.  **Level 1 (Surface):** Secondary info panels using #141416 with a 1px solid border of #27272A.
3.  **Level 2 (Active Modals/Pop-ups):** Use #1C1C1E with a subtle 10% white inner-glow stroke to simulate light hitting the edge.

Shadows, if used, are restricted to `offset: 0, blur: 8px, color: rgba(0,0,0,0.5)` to provide just enough lift for the primary navigation "Next Turn" card to stand out against the map.

## Shapes

The shape language is **Soft (0.25rem)**. 

- Standard buttons and input fields use a 4px corner radius to maintain a professional, systematic appearance. 
- **Large Floating Cards:** Use `rounded-lg` (8px) to feel distinct from the hardware screen corners.
- **Status Pills:** Small indicators (like "Fastest Route") use a fully rounded/pill shape to distinguish them from actionable buttons.
- **Icons:** Use a 1.5px stroke weight with slightly rounded joins to match the typography.

## Components

- **Primary Action Button:** Full-width, #3B82F6 background, white 600-weight text. No gradients.
- **HUD Cards:** Semi-opaque (90%) #141416 backgrounds to allow hint of the map behind, with a 1px #27272A border.
- **Navigation Chips:** Small status indicators for "Tolls" or "Traffic." Backgrounds use semantic colors at 20% opacity with 100% opacity text for high legibility without overwhelming the UI.
- **Input Fields:** Darker than the surface (#0B0B0C), with a blue 2px focus border. Placeholder text is in `neutral_medium_emphasis`.
- **List Items:** Separated by 1px dividers (#27272A). Chevron-right icons are used only for navigational drills.
- **Map Markers:** Teardrop shapes with a white outer ring and a semantic center color (Blue for destination, Red for incidents).
- **Control Floating Action Buttons (FABs):** Square-ish (4px radius) buttons for Zoom In/Out and Recenter, grouped vertically on the right edge.