const overlay = document.getElementById('wheel-overlay');

// toggle visibility on IPC
window.api.onToggle(() => {
    overlay.classList.toggle('hidden');
    // if hiding, also blur to let clicks pass through
    if (overlay.classList.contains('hidden')) {
        overlay.blur();
    }
});

// clicks outside = hide
overlay.addEventListener('click', e => {
    if (e.target === overlay) {
        window.api.hideWheel();
        overlay.classList.add('hidden');
    }
});

// Escape = hide
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        window.api.hideWheel();
        overlay.classList.add('hidden');
    }
});
