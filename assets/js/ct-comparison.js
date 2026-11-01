(() => {
  document.querySelectorAll('[data-ct-comparison]').forEach(comparison => {
    const viewport = comparison.querySelector('.ct-comparison__viewport');
    const control = comparison.querySelector('.ct-comparison__control');
    let position = 50;
    let pointerId = null;

    function reveal(value) {
      position = Math.max(0, Math.min(100, value));
      viewport.style.setProperty('--reveal', `${position}%`);
      control.setAttribute('aria-valuenow', String(Math.round(position)));
      control.setAttribute('aria-valuetext', `${Math.round(position)}% FDK image revealed`);
    }

    function revealAt(clientX) {
      const bounds = viewport.getBoundingClientRect();
      if (bounds.width > 0) reveal((clientX - bounds.left) / bounds.width * 100);
    }

    control.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      pointerId = event.pointerId;
      control.setPointerCapture(pointerId);
      control.focus({ preventScroll: true });
      comparison.classList.add('is-dragging');
      revealAt(event.clientX);
    });
    control.addEventListener('pointermove', event => {
      if (event.pointerId === pointerId) revealAt(event.clientX);
    });
    function stopDragging(event) {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      comparison.classList.remove('is-dragging');
      if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
    }
    control.addEventListener('pointerup', stopDragging);
    control.addEventListener('pointercancel', stopDragging);
    control.addEventListener('lostpointercapture', stopDragging);
    control.addEventListener('keydown', event => {
      const changes = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -10, PageUp: 10 };
      if (event.key === 'Home') reveal(0);
      else if (event.key === 'End') reveal(100);
      else if (Object.prototype.hasOwnProperty.call(changes, event.key)) reveal(position + changes[event.key]);
      else return;
      event.preventDefault();
    });

    control.hidden = false;
    comparison.classList.add('is-interactive');
    reveal(position);
  });
})();
