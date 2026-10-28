# Skills Journey — رحلة المهارات

An Arabic interactive educational web application for primary-grade students, focused on skills practice, question-based learning, progress tracking, and offline use.

## Included files

- `index.html` — the complete application and embedded question bank.
- `manifest.webmanifest` — Progressive Web App installation metadata.
- `sw.js` — Service Worker for offline caching and application updates.

## Features

- Arabic RTL interface.
- RTL rendering for Arabic numbers, sequences, and mathematical expressions.
- Curriculum-organized content for Grades 3 and 6.
- Explicit answer keys using unique question and option IDs.
- Adaptive practice and review features.
- Daily missions, skill progress, achievements, and error review.
- Local progress persistence with export/import support.
- Offline-capable core application.
- Central AR/Three.js dependencies are intentionally not included in this release.

## Run locally

Keep the three files in the same folder and serve the folder through a local web server. For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Opening `index.html` directly with a `file://` URL works for basic viewing, but Service Worker and PWA features require HTTPS or localhost.

## Deploy with GitHub and Vercel

1. Create a GitHub repository.
2. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and this `README.md` to the repository root.
3. Import the repository into Vercel.
4. Use these settings:
   - Framework Preset: `Other`
   - Build Command: empty
   - Output Directory: `.`
   - Install Command: empty
5. Deploy.

Vercel will automatically create a new deployment when a commit is pushed to the configured production branch, normally `main`.

## Updating the application

After changing the application, update the cache version in `sw.js`, for example:

```js
const CACHE = 'skills-journey-clean-v7';
```

Then commit and push all changed files together:

```bash
git add .
git commit -m "Update Skills Journey"
git push origin main
```

Users may need to select the in-app update notification or reload the site after a new release.

## Important notes

- The application is an independent educational project and is not affiliated with or officially endorsed by any education ministry or assessment authority.
- Student progress is stored locally in the browser unless the application is extended with an external service.
- The report button stores a local record by default. A central reporting endpoint can be added separately if required.
- Do not collect children’s names, email addresses, phone numbers, or other personal information without an appropriate privacy design and consent process.

## License and ownership

All application content and code remain under the ownership of the project creator unless a separate license is provided. Do not redistribute or modify the project for commercial use without permission.
