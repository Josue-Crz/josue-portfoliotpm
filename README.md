# Josue Cruz Technical Product Portfolio

A static portfolio website for Josue Cruz, a Computer Science student at San Francisco State University focused on technical program management, open-source collaboration, security-minded development, and IoT/full-stack product work.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=111111)

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
|   +-- Josue_Cruz_Resume.pdf
|   +-- product-management-preview.svg
+-- README.md
+-- LICENSE
```

## Run Locally

Open `index.html` in a browser.

Because this is a static site, no package install or local server is required. A local server can still be used if preferred:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Main Sections

- `Home`: profile summary, about section, selected projects, tech stack, and product operating principles.
- `Blogs`: writeups for John the Ripper issue/PR work and Keyshade.io input field sanitation.
- `Resume`: education, skills, experience, certifications, and resume PDF link.
- `Contact`: email-first direct links, text-preferred phone contact, LinkedIn, GitHub, and website links.

## Assets

Local assets live in `assets/`. The site uses remote Shields.io badges for programming languages, frameworks, tools, and project technologies.
