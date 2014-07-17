'use strict';

angular.module('emmiManager')
    .factory('Api', ['$http', function ($http) {
        return {
            load: function () {
                return $http.get('webapi', {
                    cache: true,
                    ignoreAuthModule: 'ignoreAuthModule'
                }).then(function (response) {
                    return response.data;
                });
            }
        };
    }])

;