#!/bin/bash

set -euo pipefail

DEST_DIR="public/browserDetect"
BOOTSTRAP_FILE="$DEST_DIR/supportedBrowsers.js"
FALLBACK_STYLE_SOURCE="scripts/UnsupportedBrowserScreen/styles.css"
FALLBACK_STYLE_DESTINATION="$DEST_DIR/unsupportedBrowserScreen.css"

# Generate the browser detection regex using browserslist policy.
BROWSER_REGEX=$(browserslist-useragent-regexp --allowHigherVersions)

FALLBACK_HTML_BY_LOCALE=$(./node_modules/.bin/tsx ./scripts/UnsupportedBrowserScreen/index.tsx)

mkdir -p "$DEST_DIR"
cp "$FALLBACK_STYLE_SOURCE" "$FALLBACK_STYLE_DESTINATION"

# Single script: UA gate + fallback renderer.
cat > "$BOOTSTRAP_FILE" << EOF
(function () {
    var regexBrowsers = ${BROWSER_REGEX};
    var FALLBACK_HTML_BY_LOCALE = ${FALLBACK_HTML_BY_LOCALE};

    function getFallbackHtml() {
        var browserLanguage =
            (navigator.languages && navigator.languages[0]) || navigator.language || 'pt-BR';
        var normalizedLanguage = browserLanguage.toLowerCase().replace('_', '-');
        var defaultFallbackHtml = FALLBACK_HTML_BY_LOCALE.default || '';

        return FALLBACK_HTML_BY_LOCALE[normalizedLanguage] || defaultFallbackHtml;
    }

    function applyFallback(reason) {
        if (window.__UNSUPPORTED_BROWSER_RENDERED__) {
            return;
        }

        window.__UNSUPPORTED_BROWSER_RENDERED__ = true;
        document.body.setAttribute('data-fallback-reason', reason || 'unknown');
        document.body.innerHTML = getFallbackHtml();
    }

    function renderFallback(reason) {
        if (window.__UNSUPPORTED_BROWSER_RENDERED__) {
            return;
        }

        var fallbackReason = reason || 'unknown';

        if (document.body) {
            applyFallback(fallbackReason);
            return;
        }

        document.addEventListener(
            'DOMContentLoaded',
            function onDomReady() {
                applyFallback(fallbackReason);
            },
            { once: true },
        );
    }

    if (!regexBrowsers.test(navigator.userAgent)) {
        renderFallback('ua-regex-check');
        return;
    }
})();
EOF

echo "File generated successfully:"
echo "- $BOOTSTRAP_FILE"
echo "- $FALLBACK_STYLE_DESTINATION"