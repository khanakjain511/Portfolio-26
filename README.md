# Khanak Jain — Digital Fieldnotes

A responsive portfolio with a progressive Three.js layer: an abstract hero sculpture and a shared spatial gallery, backed by the original accessible HTML, ASCII art, and project archive.

## Run locally

Serve this folder over HTTP (for example, `python3 -m http.server 8000`) and open `http://localhost:8000`. The 3D module loads on demand from jsDelivr; when WebGL or the CDN is unavailable, the rest of the portfolio remains usable. Typography loads from Google Fonts when connected, with system fallbacks.

## Update the archive

Edit the `portfolio` object near the top of `script.js` to update project descriptions, contributions, verified repository/demo URLs, and personal contact links. Empty URLs remain visibly unavailable.

## Files

- `index.html` — semantic page structure, metadata, ASCII fallback, and scene mounts
- `styles.css` — responsive visual system and motion
- `script.js` — project data, navigation, command palette, and archive interactions
- `universe.js` — lazy Three.js scenes, 3D exhibit focus, WebGL fallback, and reduced-motion handling
