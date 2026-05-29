---
name: Obsidian Infrastructure
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#c4c6ce'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#2f3033'
  outline: '#8e9198'
  outline-variant: '#43474d'
  surface-tint: '#b0c8eb'
  primary: '#b0c8eb'
  on-primary: '#19324d'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#49607e'
  secondary: '#40e56c'
  on-secondary: '#003912'
  secondary-container: '#02c953'
  on-secondary-container: '#004d1b'
  tertiary: '#eebd90'
  on-tertiary: '#472a08'
  tertiary-container: '#381d00'
  on-tertiary-container: '#ae835a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#69ff87'
  secondary-fixed-dim: '#3ce36a'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#eebd90'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#613f1c'
  background: '#121315'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-metric:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for high-stakes civic intelligence, blending the precision of developer tools with the elegance of luxury fintech. It targets government officials, urban planners, and engineers who require a "God-view" of city infrastructure.

The aesthetic is **Dark Glassmorphism**: a sophisticated fusion of deep charcoal surfaces, crisp semi-transparent layers, and vibrant data-driven accents. Drawing inspiration from modern high-performance software, it utilizes ultra-thin borders and subtle gradients to imply depth without visual clutter. The emotional response is one of absolute control, technical superiority, and futuristic reliability.

## Colors

The palette is anchored in a "Void" background—a deep, near-black navy that allows neon accents to pop with high functional contrast.

- **Primary Deep Blue**: Used for structural backgrounds and deep layering.
- **Secondary Emerald**: Reserved for "Healthy" status, successful AI detections, and positive trend lines.
- **Electric Cyan**: The core interaction color, used for active states, focus rings, and primary data highlights.
- **Purple-to-Lavender Gradient**: Used sparingly for "Intelligence" features, such as AI processing states and high-priority neural nodes.
- **Neutral System**: A range of cool greys with blue undertones to maintain a technical, cohesive atmosphere.

## Typography

This design system utilizes a dual-font strategy to balance editorial impact with technical utility.

- **Geist (Headlines)**: Selected for its sharp, geometric precision. Headlines should use tight tracking (letter-spacing) to achieve a "compressed" tech aesthetic suitable for high-density dashboards.
- **JetBrains Mono (Body/UI/Data)**: Every metric, coordinate, and technical label uses this monospaced font. It ensures that numbers align perfectly in tables and gauges, reinforcing the platform's AI-driven accuracy.

For mobile, scale headlines down by 20% while maintaining the monospaced body size for legibility.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The primary sidebar and data panels remain at fixed widths (280px and 320px respectively), while the central map/visualization area expands to fill the viewport.

- **Grid**: A 12-column grid is used for marketing and static pages. Dashboards utilize a "Slot" system where components snap to a 4px baseline grid.
- **Density**: High. Information is packed tightly to allow for comprehensive monitoring, mitigated by the use of "breathing room" provided by glassmorphic transparency.
- **Breakpoints**: 
  - Mobile: < 768px (Single column stacked)
  - Tablet: 768px - 1280px (Collapsible sidebars)
  - Desktop: > 1280px (Full density, persistent panels)

## Elevation & Depth

Depth is conveyed through **Physical Layering** rather than traditional shadows.

1.  **Level 0 (Base)**: Deep navy background (#020617).
2.  **Level 1 (Panels)**: Surface with 40% opacity and a 20px backdrop blur. Borders are 1px solid at 10% white opacity.
3.  **Level 2 (Modals/Popovers)**: Surface with 60% opacity, 40px backdrop blur. 1px border using a subtle gradient (White 20% to Transparent).
4.  **Accents**: Glowing elements use a "Shadow Bloom" effect—a color-matched outer glow with 0px blur and high spread, creating a neon-tube effect.

## Shapes

The shape language is "Soft-Technical." Elements use a consistent `4px` radius (Soft) to maintain a crisp, engineered feel without the harshness of 90-degree corners.

- **Standard Elements**: 4px radius (Cards, Buttons, Inputs).
- **Interactive Chips**: 2px radius (Technical/Strict look).
- **AI Nodes**: Circular (100% radius) to differentiate organic/neural intelligence from the structural UI.

## Components

### Buttons
- **Primary (Launch Dashboard)**: Solid Electric Cyan background with black text for maximum contrast. On hover, apply a subtle glow effect.
- **Secondary (Technical)**: Ghost style with a 1px border in Cyan. Text is Monospaced.
- **AI Action**: Gradient background (Purple to Lavender) with white text.

### Glassmorphism Cards
- Background: `#FFFFFF` at 0.05 opacity.
- Backdrop Blur: `12px`.
- Border: `1px` linear gradient (Top-Left: White 15%, Bottom-Right: White 0%).

### Input Fields
- Dark filled backgrounds with a Cyan bottom-border that glows on focus.
- Placeholder text in JetBrains Mono at 40% opacity.

### AI Detection Nodes
- Small pulsing circles connected by thin, 0.5px lines (Cyan for static, Gradient for active processing).
- Use "Bloom" shadows for detected anomalies.

### Data Visualization
- **Gauges**: Semi-circular arcs with Gradient strokes.
- **Sparklines**: High-frequency lines using the Secondary Emerald color for positive trends and Electric Cyan for neutral technical data.