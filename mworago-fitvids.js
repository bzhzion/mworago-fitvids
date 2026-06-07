/*
 * KpopifyFitVids 1.0
 * Based on FitVids 1.1 by Chris Coyier + Dave Rupert
 * Rewritten in vanilla JS — no jQuery, YouTube toujours 16:9 (56.25%)
 */
;(function () {
    'use strict';

    if (!document.getElementById('fit-vids-style')) {
        var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}' +
                  '.fluid-width-video-wrapper iframe,' +
                  '.fluid-width-video-wrapper object,' +
                  '.fluid-width-video-wrapper embed{position:absolute;top:0;left:0;width:100%;height:100%;}';
        var style = document.createElement('style');
        style.id = 'fit-vids-style';
        style.textContent = css;
        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }

    function fitVids(container, options) {
        var settings = { customSelector: null, ignore: null };
        if (options) {
            for (var k in options) { if (options.hasOwnProperty(k)) settings[k] = options[k]; }
        }

        var selectors = [
            'iframe[src*="player.vimeo.com"]',
            'iframe[src*="youtube.com"]',
            'iframe[src*="youtu.be"]',
            'iframe[src*="youtube-nocookie.com"]',
            'iframe[src*="kickstarter.com"][src*="video.html"]',
            'iframe[src*="facebook.com"]',
            'object',
            'embed'
        ];

        if (settings.customSelector) { selectors.push(settings.customSelector); }

        var ignoreSelector = '.fitvidsignore';
        if (settings.ignore) { ignoreSelector += ', ' + settings.ignore; }

        var allVideos = Array.from(container.querySelectorAll(selectors.join(',')));

        allVideos = allVideos.filter(function (el) {
            if (el.tagName.toLowerCase() === 'object' &&
                el.parentNode.tagName.toLowerCase() === 'object') return false;
            return true;
        });

        allVideos = allVideos.filter(function (el) {
            return !el.closest(ignoreSelector);
        });

        var count = fitVids._count || 0;

        allVideos.forEach(function (el) {
            var tag = el.tagName.toLowerCase();

            if (tag === 'embed' && el.parentNode.tagName.toLowerCase() === 'object') return;
            if (el.parentNode.classList.contains('fluid-width-video-wrapper')) return;

            var src = el.getAttribute('src') || '';
            var aspectRatio;

            if (src.indexOf('youtube.com') !== -1 ||
                src.indexOf('youtu.be') !== -1 ||
                src.indexOf('youtube-nocookie.com') !== -1) {
                aspectRatio = 9 / 16;
            } else {
                var heightAttr = el.getAttribute('height');
                var widthAttr  = el.getAttribute('width');

                function parseAttr(val) {
                    if (!val) return NaN;
                    var trimmed = val.trim();
                    if (/[%a-zA-Z]/.test(trimmed)) return NaN;
                    var n = parseInt(trimmed, 10);
                    return isNaN(n) ? NaN : n;
                }

                var w = parseAttr(widthAttr);
                var h = (tag === 'object' || (heightAttr && !isNaN(parseAttr(heightAttr))))
                            ? parseAttr(heightAttr)
                            : el.offsetHeight;

                if (isNaN(w) || w <= 0) w = el.offsetWidth  || 16;
                if (isNaN(h) || h <= 0) h = el.offsetHeight || 9;

                aspectRatio = h / w;
            }

            if (!el.getAttribute('name')) {
                el.setAttribute('name', 'fitvid' + count);
                count++;
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'fluid-width-video-wrapper';
            wrapper.style.paddingTop = (aspectRatio * 100) + '%';
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            el.removeAttribute('height');
            el.removeAttribute('width');
        });

        fitVids._count = count;
    }

    fitVids._count = 0;

    function init() { fitVids(document.body); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.kpopifyFitVids = fitVids;

}());
