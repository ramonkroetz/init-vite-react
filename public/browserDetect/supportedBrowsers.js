(function () {
    var regexBrowsers = /Edge?\/(1{2}[1-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Firefox\/(1{2}[1-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Chrom(ium|e)\/(109|1[1-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|(Maci|X1{2}).+ Version\/(16\.([4-9]|\d{2,})|(1[7-9]|[2-9]\d|\d{3,})\.\d+)([,.]\d+|)( \(\w+\)|)( Mobile\/\w+|) Safari\/|(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS|CPU iPad OS)[ +]+(16[._]([6-9]|\d{2,})|(1[7-9]|[2-9]\d|\d{3,})[._]\d+)([._]\d+|)|Android:?[ /-](14[2-9]|1[5-9]\d|[2-9]\d{2}|\d{4,})(\.\d+|)(\.\d+|)|Mobile Safari.+OPR\/([89]\d|\d{3,})\.\d+\.\d+|Android.+Firefox\/(14[4-9]|1[5-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+Chrom(ium|e)\/(14[2-9]|1[5-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+(UC? ?Browser|UCWEB|U3)[ /]?(15\.([5-9]|\d{2,})|(1[6-9]|[2-9]\d|\d{3,})\.\d+)\.\d+|SamsungBrowser\/(29|[3-9]\d|\d{3,})\.\d+/;
    var FALLBACK_HTML_BY_LOCALE = {"pt-br":"<div class=\"unsupported-browser-overlay\"><div class=\"unsupported-browser-card\"><div class=\"unsupported-browser-accent\"></div><h1 class=\"unsupported-browser-title\">Navegador não compatível</h1><p class=\"unsupported-browser-message\">Seu navegador não é compatível ou houve falha no carregamento da aplicação. Atualize o navegador ou tente novamente em outro browser.</p></div></div>","default":"<div class=\"unsupported-browser-overlay\"><div class=\"unsupported-browser-card\"><div class=\"unsupported-browser-accent\"></div><h1 class=\"unsupported-browser-title\">Navegador não compatível</h1><p class=\"unsupported-browser-message\">Seu navegador não é compatível ou houve falha no carregamento da aplicação. Atualize o navegador ou tente novamente em outro browser.</p></div></div>"};

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
