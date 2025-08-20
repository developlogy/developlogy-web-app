import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"
import JSZip from "jszip"

export async function POST(request: NextRequest, { params }: { params: { siteId: string } }) {
  try {
    const site = await storage.getSite(params.siteId)

    if (!site) {
      return new NextResponse("Site not found", { status: 404 })
    }

    const zip = new JSZip()

    // Generate HTML content
    const htmlContent = generateStaticHTML(site)
    zip.file("index.html", htmlContent)

    // Generate CSS content
    const cssContent = generateStaticCSS(site)
    zip.file("styles.css", cssContent)

    // Add basic JavaScript for interactivity
    const jsContent = generateStaticJS(site)
    zip.file("script.js", jsContent)

    // Add README with instructions
    const readmeContent = generateReadme(site)
    zip.file("README.md", readmeContent)

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${site.name.toLowerCase().replace(/\s+/g, "-")}-website.zip"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return new NextResponse("Export failed", { status: 500 })
  }
}

function generateStaticHTML(site: any): string {
  const { name, theme, seo, blocks, businessInfo } = site

  const blocksHTML = blocks
    .map((block: any) => {
      switch (block.type) {
        case "hero":
          return `
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">${block.heading}</h1>
        <p class="hero-subtitle">${block.subheading}</p>
        <button class="cta-button" onclick="handleCTAClick('${block.ctaLabel}')">${block.ctaLabel}</button>
      </div>
    </section>`

        case "about":
          return `
    <section class="about-section">
      <div class="container">
        <h2 class="section-title">${block.title}</h2>
        <div class="about-content">
          <p>${block.body}</p>
        </div>
      </div>
    </section>`

        case "services":
          return `
    <section class="services-section">
      <div class="container">
        <h2 class="section-title">${block.title}</h2>
        <div class="services-grid">
          ${block.items
            .map(
              (item: any) => `
            <div class="service-item">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              ${item.price ? `<span class="price">${item.price}</span>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>`

        case "contact":
          return `
    <section class="contact-section">
      <div class="container">
        <h2 class="section-title">${block.title}</h2>
        <div class="contact-info">
          <p><strong>Email:</strong> ${block.email}</p>
          <p><strong>Phone:</strong> ${block.phone}</p>
          <p><strong>Address:</strong> ${block.address}</p>
        </div>
      </div>
    </section>`

        default:
          return ""
      }
    })
    .join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords.join(", ")}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title}">
    <meta name="twitter:description" content="${seo.description}">
    
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-title">${name}</h1>
                <nav class="site-nav">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </div>
    </header>

    <main>
        ${blocksHTML}
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
                ${businessInfo.email ? `<p>Contact: ${businessInfo.email}</p>` : ""}
                <p class="powered-by">Built with <a href="https://developlogy.com" target="_blank">Developlogy</a></p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`
}

function generateStaticCSS(site: any): string {
  const { theme } = site

  return `/* Generated by Developlogy Website Builder */
:root {
  --primary-color: ${theme.color};
  --font-scale: ${theme.fontScale};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  font-size: calc(1rem * var(--font-scale));
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.site-header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.site-title {
  color: var(--primary-color);
  font-size: calc(1.5rem * var(--font-scale));
  font-weight: bold;
}

.site-nav {
  display: flex;
  gap: 2rem;
}

.site-nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.site-nav a:hover {
  color: var(--primary-color);
}

/* Sections */
section {
  padding: 4rem 0;
}

.section-title {
  font-size: calc(2rem * var(--font-scale));
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color)10, var(--primary-color)05);
  text-align: center;
  padding: 6rem 0;
}

.hero-title {
  font-size: calc(3rem * var(--font-scale));
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.hero-subtitle {
  font-size: calc(1.25rem * var(--font-scale));
  margin-bottom: 2rem;
  color: #666;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: calc(1.1rem * var(--font-scale));
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s;
}

.service-item:hover {
  transform: translateY(-4px);
}

.service-item h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: calc(1.25rem * var(--font-scale));
}

.price {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 1rem;
}

/* Contact Section */
.contact-info {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.contact-info p {
  margin-bottom: 1rem;
  font-size: calc(1.1rem * var(--font-scale));
}

/* Footer */
.site-footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

.footer-content p {
  margin-bottom: 0.5rem;
}

.powered-by {
  font-size: 0.9rem;
  opacity: 0.8;
}

.powered-by a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .site-nav {
    gap: 1rem;
  }
  
  .hero-title {
    font-size: calc(2rem * var(--font-scale));
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}`
}

function generateStaticJS(site: any): string {
  return `// Generated by Developlogy Website Builder

// Simple analytics tracking
function trackEvent(eventType, eventData) {
  console.log('Event tracked:', eventType, eventData);
  // In a real implementation, this would send data to your analytics service
}

// CTA click handler
function handleCTAClick(ctaText) {
  trackEvent('cta_click', { text: ctaText });
  // Add your custom CTA logic here
  alert('Thank you for your interest! Please contact us for more information.');
}

// Track page view
document.addEventListener('DOMContentLoaded', function() {
  trackEvent('pageview', { path: window.location.pathname });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Simple form handling (if forms are present)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    trackEvent('form_submit', { form: this.id || 'contact' });
    alert('Thank you for your message! We will get back to you soon.');
  });
});`
}

function generateReadme(site: any): string {
  return `# ${site.name} - Static Website

This website was generated by [Developlogy](https://developlogy.com), an instant website builder.

## Files Included

- \`index.html\` - Main HTML file
- \`styles.css\` - All CSS styles
- \`script.js\` - JavaScript for interactivity
- \`README.md\` - This file

## Hosting Instructions

### Option 1: Netlify
1. Drag and drop this entire folder to [netlify.com/drop](https://netlify.com/drop)
2. Your site will be live instantly with a custom URL

### Option 2: Vercel
1. Upload this folder to a GitHub repository
2. Connect your repository to [vercel.com](https://vercel.com)
3. Deploy with one click

### Option 3: GitHub Pages
1. Upload files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at \`username.github.io/repository-name\`

### Option 4: Traditional Web Hosting
1. Upload all files to your web hosting provider's public folder
2. Ensure \`index.html\` is in the root directory

## Customization

- Edit \`index.html\` to modify content
- Update \`styles.css\` to change styling
- Modify \`script.js\` to add functionality

## Support

For questions about this export or to create more websites, visit [Developlogy](https://developlogy.com).

---

Generated on ${new Date().toLocaleDateString()}
Website: ${site.name}
Industry: ${site.industry}
`
}
