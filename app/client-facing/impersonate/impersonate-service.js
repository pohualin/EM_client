'use strict';

angular.module('emmiManager')
    .factory('ImpersonationService', ['$rootScope', '$http', 'API', '$window', '$location',
        function ($rootScope, $http, API, $window, $location) {

            return {
                /**
                 * Call the authenticated link with a special parameter that will make
                 * the back-end authenticate as the passed client id
                 *
                 * @param clientId to become an administrator of
                 * @param next route to go to after impersonation is successful
                 * @returns {*}
                 */
                impersonate: function (clientId, nextRoute) {
                    nextRoute = nextRoute || '/';
                    var current = $location.path();
                    var promise = $http.get(API.authenticated, {
                        ignoreAuthModule: 'ignoreAuthModule',
                        params: {
                            'impersonate-client': clientId
                        },
                        headers: {
                            'X-Requested-Url': $location.path(nextRoute).absUrl()
                        }
                    }).success(function () {
                        $location.path('/');
                    }).error(function (response) {
                        if (response.url) {
                            $window.location.href = response.url;
                        } else {
                            $location.path('/');
                        }
                    });
                    $location.path(current);
                    return promise;
                }

            };

        }])
;
