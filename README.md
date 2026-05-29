# Josue Cruz Technical Product Portfolio

A static portfolio website for Josue Cruz, a Computer Science student at San Francisco State University focused on technical program management, open-source collaboration, security-minded development, and IoT/full-stack product work.

Built with `HTML5`, `CSS3`, and `JavaScript`.

## Project Overview

This site is a single-page portfolio with tabbed sections for home, blogs, resume, and contact. It is built with plain HTML, CSS, and JavaScript, so it can run directly in the browser without a build step.

The portfolio highlights:

- TPM and product positioning for internships and product-adjacent engineering roles.
- Selected projects: GreenSense, Dogs2Home, Keyshade.io input field sanitation, and CouchMunch.
- Open-source blog posts based on real issues and pull requests.
- Resume content, direct contact links, contact preferences, social links, and two small canvas mini games.
- Scroll-triggered section highlighting and responsive card layouts.

## File Structure

```text
.
+-- index.html
+-- styles.css
+-- script.js
+-- assets/
|   +-- Flappy_Bird_icon.png
|   +-- Josue_Cruz_Headshot.png
|   +-- product-management-preview.svg
+-- README.md
+-- LICENSE
```

## Run Locally

Open `index.html` in a browser.

Because this is a static site, no package setup or local server is required. A local server can still be used if preferred:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Main Sections

- `Home`: profile summary, about section, selected projects, tech stack, and product operating principles.
- `Blogs`: writeups for John the Ripper issue/PR work and Keyshade.io input field sanitation.
- `Resume`: education, skills, experience, certifications, and profile links.
- `Contact`: email-first direct links, LinkedIn, GitHub, and website links.

## Assets

Local assets live in `assets/`. The site uses remote Shields.io badges for programming languages, frameworks, tools, and project technologies.
