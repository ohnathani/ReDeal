---
globs: ["*.html"]
---

# HTML Rules

## Semantic HTML5

- Use semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<nav>`, `<figure>`, `<figcaption>`
- One `<h1>` per page, logical heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions, `<a>` for navigation
- Forms: `<form>`, `<label>` with `for` attribute, `<input>`, `<select>`, `<textarea>`

## Accessibility

- Alt text for all images: `alt="Description"` (empty `alt=""` for decorative)
- ARIA labels for icon-only buttons: `<button aria-label="Close">×</button>`
- Focus visible: never remove outline without `:focus-visible` replacement
- Skip link: `<a href="#main" class="skip-link">Skip to main content</a>`
- Landmarks: `role="banner"`, `role="main"`, `role="contentinfo"` on header/main/footer
- Form labels: always associate with inputs

## Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Site Name</title>
  <meta name="description" content="Page description for SEO/social">
  <!-- Open Graph -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header class="header" role="banner">...</header>
  <main id="main" class="main" role="main">...</main>
  <footer class="footer" role="contentinfo">...</footer>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

## Valid Markup

- All tags closed: `<br>`, `<img>`, `<input>` are self-closing in HTML5
- Attributes quoted: `class="value"` not `class=value`
- No duplicate IDs
- Valid nesting: no `<div>` inside `<span>`, no block in inline

## SEO Fundamentals

- Descriptive `<title>` (50-60 chars)
- Meta description (150-160 chars)
- Semantic headings with keywords
- Structured data (JSON-LD) where appropriate
- Canonical URLs if needed

## Avoid Unnecessary Divs

| Instead of | Use |
|------------|-----|
| `<div class="header">` | `<header>` |
| `<div class="main">` | `<main>` |
| `<div class="card">` | `<article class="card">` |
| `<div class="button">` | `<button>` |
| `<div onclick="...">` | `<button>` |
| `<div class="section">` | `<section>` |

## Comments

```html
<!-- Header -->
<header>...</header>
<!-- /Header -->

<!-- Main Content -->
<main>...</main>
<!-- /Main Content -->
```

## Images

```html
<!-- Informative -->
<img src="chart.png" alt="Bar chart showing 40% increase in Q3" width="600" height="400">

<!-- Decorative -->
<img src="pattern.svg" alt="" aria-hidden="true">

<!-- Responsive -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" width="800" height="600">
</picture>
```

## Forms

```html
<form class="form" action="/submit" method="POST">
  <div class="form-group">
    <label for="email" class="form-label">Email</label>
    <input type="email" id="email" name="email" class="form-input" required autocomplete="email">
  </div>
  <button type="submit" class="btn btn--primary">Submit</button>
</form>
```

---

*Enforced by Claude Code. See AGENTS.md for full conventions.*