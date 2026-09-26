/* Blocks every kind of zoom (pinch, double-tap, ctrl+wheel, ctrl +/-/0, iOS gesture)
   on all devices, without swallowing normal taps or typing. */
(function () {
    'use strict';

    var INTERACTIVE = 'input, textarea, select, button, a, label, [contenteditable="true"]';

    function isInteractive(node) {
        if (!node || node.nodeType !== 1) return false;
        return !!(node.closest && node.closest(INTERACTIVE));
    }

    function stop(event) {
        if (event.cancelable) event.preventDefault();
    }

    // 1. Pinch-to-zoom (two or more fingers). One finger still scrolls normally.
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) stop(event);
    }, { passive: false });

    document.addEventListener('touchmove', function (event) {
        if (event.touches.length > 1) stop(event);
    }, { passive: false });

    // 2. iOS Safari's proprietary pinch events.
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (name) {
        document.addEventListener(name, stop, { passive: false });
    });

    // 3. Double-tap zoom. Only the second tap of a genuine double-tap is cancelled,
    //    and never on a form control or button, so fast tapping keeps working.
    var lastEnd = 0;
    var lastTarget = null;

    document.addEventListener('touchend', function (event) {
        var now = Date.now();
        var target = event.target;
        var isDoubleTap = now - lastEnd <= 300 && target === lastTarget;

        if (isDoubleTap && !isInteractive(target)) stop(event);

        lastEnd = now;
        lastTarget = target;
    }, false);

    // 4. Ctrl + wheel (desktop trackpad and mouse).
    document.addEventListener('wheel', function (event) {
        if (event.ctrlKey) stop(event);
    }, { passive: false });

    // 5. Ctrl + '+' / '-' / '=' / '0' (desktop keyboard).
    document.addEventListener('keydown', function (event) {
        if (!event.ctrlKey && !event.metaKey) return;
        if (['+', '-', '=', '0'].indexOf(event.key) !== -1) stop(event);
    });
})();
