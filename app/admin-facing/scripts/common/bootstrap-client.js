'use strict';

(function () {
    // load the initial web-api
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('/webapi-client')
        .success(function (data) {
            var api = {};
            angular.forEach(data.link, function (item) {
                if (item.rel && item.href) {
                    api[item.rel] = item.href;
                }
            });
            // save as a constant
            angular.module('emmiManager.api', [])
                .constant('API', api);

            // load the main application
            angular.element(document).ready(function () {
                angular.bootstrap(document, ['emmiManager']);
            });
        })
        .error(function (data, response) {
            window.location = '/maintenance.html';
            console.log('Backend Down', data, response);
        });
})();
