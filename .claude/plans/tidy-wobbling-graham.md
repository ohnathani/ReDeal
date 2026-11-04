# Plan: Create Favicon from Logo

## Context
The current `assets/images/logo.svg` is an embedded raster image (107×34) showing a recycle arrow + price tag icon next to "ReDeal" text. The user wants a favicon version: square, curved/rounded edges, text cropped out.

## Requirements
- Square aspect ratio (32×32 or 48×48 for favicon)
- Rounded corners (curved edges)
- Only the icon (recycle arrow + tag), no "ReDeal" text
- Clean vector format (not embedded raster)

## Approach
1. **Create a new clean vector favicon** (`assets/images/favicon.svg`) based on the icon portion of the current logo
2. **Design**: Recycle arrow (🔄) + price tag combined mark, in primary color `#BF4408`
3. **Format**: Square viewBox (e.g., 32×32), rounded rect background or transparent with icon centered
4. **Also generate**: `favicon.ico` (multi-size: 16, 32, 48) and PNG fallbacks if needed

## Files to Create/Modify
- `assets/images/favicon.svg` — primary favicon (vector)
- `assets/images/favicon.ico` — multi-size ICO for broad browser support
- Update HTML `<head>` to reference new favicon

## Implementation Details
```svg
<!-- favicon.svg concept -->
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded background -->
  <rect width="32" height="32" rx="6" fill="#BF4408"/>
  <!-- White icon: recycle arrow + tag -->
  <path d="..." fill="white"/>
</svg>
```

## Verification
- Open `favicon.svg` in browser — should show clean icon at any size
- Check HTML `<head>` has `<link rel="icon" href="assets/images/favicon.svg">`
- Test in browser tab — shows correctly at 16×16 and 32×32