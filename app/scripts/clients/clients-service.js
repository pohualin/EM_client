'use strict';
angular.module('emmiManager')
    .service('Client', ['$http', function ($http) {
        return {
            getClients: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (href, client) {
                return $http.post(href, client).success(function (response, status) {
                    return response;
                });
            },
            deleteClient: function (id) {

            },
            getClient: function (id) {

            },
            getReferenceData: function (href) {
                return $http.get(href, {
                    cache: true
                }).then(function (response) {
                    return response.data;
                });
            }
        };

    }])
;
