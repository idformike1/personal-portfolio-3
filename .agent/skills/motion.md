# @motion Skill: Hybrid Motion Strategy

This skill defines the motion architecture for the portfolio, optimized for performance and high-end aesthetics.

## Strategy
We use a **Hybrid Motion** approach:
1. **Lenis**: Smooth scroll foundation.
2. **GSAP**: High-frequency interactions (mouse followers, custom cursors) and complex scroll-bound choreography.
3. **Framer Motion**: UI state transitions (modals, menus, enter/exit animations).

## Core Patterns
- **Smooth Scroll**: Always wrap the root layout in `<SmoothScroll />`.
- **Mouse Followers**: Use `gsap.quickTo` for performance.
- **ScrollTrigger**: Register `ScrollTrigger` in components using `useEffect`.
- **AnimatePresence**: Use for page transitions and modal visibility.

## Performance Rules
- Clean up GSAP timelines/ScrollTriggers on component unmount.
- Use `useMemo` or `useCallback` for static animation properties.
- Avoid animating `left`/`top`; prefer `x`/`y` translations.
