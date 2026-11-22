(() => {
  const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];
  const SVG_PATH = '../assets/images/favicon.svg';

  const container = document.getElementById('sizes');
  const errorEl = document.getElementById('error');
  const downloadAllBtn = document.getElementById('download-all');
  const entries = [];

  function downloadPng(size, canvas) {
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function renderSize(img, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.getContext('2d').drawImage(img, 0, 0, size, size);
    entries.push({ size, canvas });

    const label = document.createElement('strong');
    label.textContent = `${size}×${size}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tool__btn';
    button.dataset.size = String(size);
    button.textContent = `Download ${size}×${size}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'tool__size';
    wrapper.append(label, canvas, button);
    container.appendChild(wrapper);
  }

  async function init() {
    try {
      const response = await fetch(SVG_PATH);
      if (!response.ok) throw new Error(`Could not load ${SVG_PATH} (${response.status})`);
      const svgText = await response.text();
      const blobUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));

      const img = new Image();
      img.onload = () => SIZES.forEach((size) => renderSize(img, size));
      img.onerror = () => showError('The SVG could not be drawn.');
      img.src = blobUrl;
    } catch (err) {
      showError(`${err.message}. Open this page through a local server.`);
    }
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  // Event delegation for the per-size buttons
  container.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-size]');
    if (!button) return;
    const entry = entries.find((e) => e.size === Number(button.dataset.size));
    if (entry) downloadPng(entry.size, entry.canvas);
  });

  downloadAllBtn.addEventListener('click', () => {
    entries.forEach(({ size, canvas }) => downloadPng(size, canvas));
  });

  init();
})();
