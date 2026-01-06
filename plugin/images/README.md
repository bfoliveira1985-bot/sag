# Images Directory

Place your plugin screenshots and images here.

## Recommended Images

1. **dashboard.jpg** / **dashboard.png**
   - Screenshot of the main dashboard
   - Recommended size: 1920x1080 or 1200x675
   - Shows the main interface of your plugin

2. **telemetry.jpg** / **telemetry.png**
   - Screenshot of real-time telemetry features
   - Recommended size: 1920x1080 or 1200x675
   - Displays live race data and statistics

3. **management.jpg** / **management.png**
   - Screenshot of championship management features
   - Recommended size: 1920x1080 or 1200x675
   - Shows how to manage races and standings

## Optional Additional Images

- **hero-bg.jpg** - Background image for hero section (1920x1080)
- **feature-1.jpg** through **feature-6.jpg** - Individual feature screenshots
- **logo.png** - Your plugin logo (transparent background, 512x512)
- **icon.ico** - Favicon for the page (32x32)

## Image Optimization Tips

1. **Compress images** before uploading:
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Target: < 200KB per image for web

2. **Use appropriate formats**:
   - JPEG for photos and screenshots
   - PNG for graphics with transparency
   - WebP for modern browsers (with fallback)

3. **Provide multiple sizes** for responsive design:
   - Small: 480px width (mobile)
   - Medium: 768px width (tablet)
   - Large: 1200px+ width (desktop)

## How to Add Images to Landing Page

Once you have your images here, update `index.html`:

```html
<!-- Find the gallery section and replace placeholders -->
<div class="gallery-item">
    <img src="images/dashboard.jpg" alt="Dashboard Principal" loading="lazy">
</div>
```

For the hero background, update `styles.css`:

```css
.hero {
    background-image: url('images/hero-bg.jpg');
    background-size: cover;
    background-position: center;
}
```
