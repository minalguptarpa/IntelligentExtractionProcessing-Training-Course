# IXP Self-Learning Training Course

## Project Overview

A self-paced course website for **Intelligent Extraction Processing (IXP)** — a UiPath product that enables intelligent document processing and data extraction using AI/ML. This is a static HTML/CSS/JS site deployable on GitHub Pages.

## Site Architecture

```
/
├── index.html              # Landing page / course overview
├── modules/                # One HTML file per course module
│   ├── module-01.html
│   ├── module-02.html
│   └── ...
├── assets/
│   ├── css/
│   │   ├── main.css        # Global styles
│   │   └── course.css      # Course-specific component styles
│   ├── js/
│   │   ├── progress.js     # Track learner progress via localStorage
│   │   └── nav.js          # Navigation and menu logic
│   └── images/             # Screenshots, diagrams, icons
└── _config.yml             # GitHub Pages config (optional, for theme/baseurl)
```

## Technology Constraints

- **Pure static**: No build tools, no npm, no bundlers. Just HTML, CSS, and vanilla JS.
- **No server-side code**: Everything runs in the browser; persistence via `localStorage`.
- **GitHub Pages compatible**: All paths must be relative. No absolute paths starting with `/`.
- **No external CDN dependencies** for core functionality — bundle any required libs locally (e.g., a syntax highlighter).

## Design Guidelines

- **Brand**: Follow UiPath brand colors — primary `#FA4616` (UiPath orange), neutral dark `#1A1A2E`, white backgrounds.
- **Typography**: System font stack; no web font calls that require internet at viewing time.
- **Responsive**: Mobile-first, works at 320px–1440px.
- **Accessibility**: Semantic HTML, ARIA labels on interactive elements, sufficient color contrast (WCAG AA).

## Course Content Structure

Each module page should include:
1. **Learning objectives** — bulleted list at the top
2. **Lesson content** — text + diagrams/screenshots
3. **Knowledge check** — short quiz (rendered from inline JSON, no backend)
4. **Mark complete** button — writes completion state to `localStorage`
5. **Next/Prev navigation** — links to adjacent modules

Progress is tracked client-side only: module completion stored in `localStorage` under key `ixp-course-progress`.

## Key Concepts to Cover (Course Scope)

- What is IXP / Document Understanding in UiPath
- OCR engines and their configuration
- ML models for extraction (forms, invoices, receipts, etc.)
- Human-in-the-loop validation (Action Center integration)
- API usage and integration patterns
- Best practices and troubleshooting

## GitHub Pages Deployment

1. Push to a repo with Pages enabled (Settings → Pages → branch: `main`, folder: `/root`).
2. Use relative asset paths (`./assets/css/main.css`, `../assets/css/main.css` from subdirs).
3. If the repo is not at the root domain, set `baseurl` in `_config.yml`:
   ```yaml
   baseurl: "/repo-name"
   ```
4. No Jekyll processing needed — add a `.nojekyll` file at the repo root to skip it.

## Common Commands

```powershell
# Serve locally for development (Python must be installed)
python -m http.server 8080

# Or use Node's http-server if available
npx http-server . -p 8080
```

## File Naming Conventions

- Lowercase, hyphen-separated: `module-01-introduction.html`
- Images: descriptive names, e.g., `ixp-architecture-diagram.png`
- CSS classes: BEM-lite — `block__element--modifier` (e.g., `module-card__title--completed`)

## What NOT to Do

- Do not add a React/Vue/Angular build pipeline — keep it plain HTML.
- Do not use absolute URLs for assets — they will break on GitHub Pages subdirectories.
- Do not store sensitive data (API keys, tokens) anywhere in the repo.
- Do not add a backend or database; all state lives in `localStorage`.
