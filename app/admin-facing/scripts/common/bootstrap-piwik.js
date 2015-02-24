/*jshint -W079 */
'use strict';

var _paqSiteId = (window.location.hostname.match('qa6')) ? 6 : 4; // dev6 site ID = 4, qa6 site ID = 6
var _paq = _paq || [];
if (window.location.hostname.match(/(dev6|qa6)/)) { // only track dev and qa, not local
    _paq.push(['enableLinkTracking']);
    (function () {
        var u = (('https:' === document.location.protocol) ? 'https' : 'http') + '://devpiwik.emmisolutions.com/';
        _paq.push(['setTrackerUrl', u + 'piwik.php']);
        _paq.push(['setSiteId', _paqSiteId]);
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.defer = true;
        g.async = true;
        g.src = u + 'piwik.js';
        s.parentNode.insertBefore(g, s);
    })();
}
