#!/bin/bash

# Destination file
DEST_FILE="public/browserDetect/supportedBrowsers.js"

# Generate the browser detection code using browserslist-useragent-regexp
BROWSER_REGEX=$(browserslist-useragent-regexp --allowHigherVersions)

BACKGROUND_COLOR="#000"
TEXT_COLOR="#fff"
TEXT_NOT_SUPPORTED="Your browser is not supported. Please update your browser or use a different browser for a better experience."

# Generate the new file with the dynamic logic
cat > "$DEST_FILE" << EOF
var regexBrowsers = ${BROWSER_REGEX};
if (!regexBrowsers.test(navigator.userAgent)) {
    document.body.innerHTML = \`
        <div style=\"position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background-color: ${BACKGROUND_COLOR}; color: ${TEXT_COLOR}; padding: 20px; border-radius: 10px; width: 100%; height: 100%; text-align: center;\">
            <div style=\"font-size: 24px; font-weight: bold; top: 50%; left: 50%; transform: translate(-50%, -50%); position: absolute;\">${TEXT_NOT_SUPPORTED}</div>
        </div>
    \`
}
EOF

echo "File $DEST_FILE generated successfully!"