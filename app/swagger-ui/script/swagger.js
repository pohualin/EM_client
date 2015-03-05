// jshint ignore: start
$(function () {
    var apiUrl = window.location.protocol + '//' + window.location.host;
    if (window.location.pathname.indexOf('/swagger-ui/index.html') > 0) {
        apiUrl += window.location.pathname.substring(0, window.location.pathname.indexOf('/swagger-ui/index.html'));
    }
    apiUrl += '/api-docs' + window.location.search;
    window.swaggerUi = new SwaggerUi({
        url: apiUrl,
        'dom_id': 'swagger-ui-container',
        supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
        onComplete: function (swaggerApi, swaggerUi) {
            $('pre code').each(function (i, e) {
                hljs.highlightBlock(e);
            });
        },
        onFailure: function (data) {
            log('Unable to Load SwaggerUI');
        },
        docExpansion: 'none'
    });

    window.swaggerUi.load();
});
