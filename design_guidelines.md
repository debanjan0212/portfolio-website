# Modern Portfolio Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from contemporary portfolio sites like Linear, Notion, and modern agency websites that balance professionalism with creative flair.

## Core Design Elements

### Color Palette
**Dark Mode (Primary)**:
- Background: 220 20% 8% (deep charcoal)
- Surface: 220 15% 12% (elevated dark)
- Primary: 240 80% 65% (vibrant blue)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 0 0% 70% (muted)

**Light Mode**:
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white)
- Primary: 240 80% 55% (deeper blue)
- Text Primary: 220 20% 15% (dark gray)
- Text Secondary: 220 10% 45% (medium gray)

**Gradients**: Subtle blue-to-purple gradients (240 80% 65% to 280 70% 60%) for hero backgrounds and accent elements.

### Typography
- **Primary**: Inter (Google Fonts) - clean, modern sans-serif
- **Accent**: JetBrains Mono (Google Fonts) - for code snippets and technical elements
- **Hierarchy**: 
  - Hero: 4xl-6xl weights 700-800
  - Headings: xl-3xl weight 600
  - Body: base-lg weight 400-500
  - Captions: sm weight 400

### Layout System
**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 24 for consistent rhythm (p-4, m-8, gap-12, etc.)

### Component Library

**Navigation**:
- Floating glass-morphism header with backdrop blur
- Smooth slide-in mobile menu with staggered animations
- Active state indicators with animated underlines

**Hero Section**:
- Full viewport height with gradient background
- Animated text reveals with staggered timing
- Floating geometric shapes with subtle parallax
- CTA buttons with outline variants on blurred backgrounds

**Cards & Content**:
- Elevated cards with subtle shadows and hover lift effects
- Rounded corners (rounded-xl for cards, rounded-lg for buttons)
- Smooth hover transitions (300ms ease)

**Interactive Elements**:
- Skill bars with animated fill-on-scroll
- Project cards with image overlay effects
- Modal popups with backdrop blur and scale animations
- Form inputs with floating labels and validation states

**Overlays & Modals**:
- Project detail modals with smooth scale-in animations
- Contact form overlays with backdrop blur
- Toast notifications for form submissions

### Animations
**Entrance Animations**:
- Fade-up for text content (AOS library)
- Staggered reveals for card grids
- Typing animation for hero tagline

**Micro-interactions**:
- Button hover states with scale and shadow
- Icon hover rotations and color changes
- Smooth page transitions between sections

**Scroll Animations**:
- Parallax backgrounds (subtle, 0.5x speed)
- Progressive skill bar fills
- Image reveals with mask animations

## Images
**Hero Image**: Large background gradient with floating geometric shapes (no photography needed - use CSS/SVG)
**Project Screenshots**: Mockup-style presentation with device frames and shadows
**About Section**: Professional headshot placeholder with rounded styling
**Tech Stack Icons**: SVG icons from popular libraries (Heroicons, Simple Icons)

## Key Principles
- **Performance First**: Minimal animations, optimized for 60fps
- **Mobile-First**: Responsive design with touch-friendly interactions
- **Accessibility**: High contrast ratios, keyboard navigation, screen reader support
- **Professional Polish**: Subtle animations that enhance rather than distract