var regexBrowsers = /Edge?\/(1{2}[1-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Firefox\/(1{2}[1-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Chrom(ium|e)\/(10[5-9]|1[1-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|(Maci|X1{2}).+ Version\/(16\.([4-9]|\d{2,})|(1[7-9]|[2-9]\d|\d{3,})\.\d+)([,.]\d+|)( \(\w+\)|)( Mobile\/\w+|) Safari\/|Chrome.+OPR\/(12\d|1[3-9]\d|[2-9]\d{2}|\d{4,})\.\d+\.\d+|(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS|CPU iPad OS)[ +]+(1{2}[._]\d+|(1[2-9]|[2-9]\d|\d{3,})[._]\d+)([._]\d+|)|Android:?[ /-](139|1[4-9]\d|[2-9]\d{2}|\d{4,})(\.\d+|)(\.\d+|)|Mobile Safari.+OPR\/([89]\d|\d{3,})\.\d+\.\d+|Android.+Firefox\/(14[2-9]|1[5-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+Chrom(ium|e)\/(139|1[4-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+(UC? ?Browser|UCWEB|U3)[ /]?(15\.([5-9]|\d{2,})|(1[6-9]|[2-9]\d|\d{3,})\.\d+)\.\d+|SamsungBrowser\/(2[89]|[3-9]\d|\d{3,})\.\d+/;
if (!regexBrowsers.test(navigator.userAgent)) {
    document.body.innerHTML = `
        <div style=\"position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background-color: #000; color: #fff; padding: 20px; border-radius: 10px; width: 100%; height: 100%; text-align: center;\">
            <div style=\"font-size: 24px; font-weight: bold; top: 50%; left: 50%; transform: translate(-50%, -50%); position: absolute;\">Your browser is not supported. Please update your browser or use a different browser for a better experience.</div>
        </div>
    `
}
