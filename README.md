# KHANAK.OS — A Digital Universe

An interactive 3D portfolio for Khanak Jain. Visitors enter a real-time Three.js world, orbit its floating islands, and select six spatial locations to explore the existing portfolio archive. The experience is built with React, TypeScript, React Three Fiber, Drei, and Framer Motion.

## Local development

Run npm install followed by npm run dev.

The production bundle can be generated with npm run build and previewed with npm run preview.

## Portfolio data

Edit src/data.ts to update the biography, education, projects, links, technical inventory, experience, achievements, and contact details. Project and social links are intentionally shown as unavailable until a verified URL is provided.

## Experience and accessibility

- Drag or touch-drag to orbit the world; use the wheel or pinch to zoom.
- Select an island in the scene or use the visible location menu.
- Choose Guided tour to visit each location in order. Reset view returns to the map.
- The text archive after the 3D stage contains the same content for keyboard, assistive technology, and WebGL fallback use.
- Reduced-motion preferences disable ambient movement and camera easing. Mobile devices use a lower rendering resolution and lighter particle field.

## Deployment

vercel.json configures Vercel to build with npm run build and serve dist. The GitHub Pages workflow also builds and publishes dist to keep the existing Pages deployment working.

No models, screenshots, or contact URLs are fabricated. The world is assembled from procedural Three.js geometry and limited particle effects.
