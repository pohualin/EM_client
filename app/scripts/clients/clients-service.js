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
            insertClient: function (href, name, type, region) {
                $http.post(href, {
                    'name': name,
                    'type': type,
                    'region': region
                }).success(function (response, status, headers, config) {
                    console.log(status);
                    console.dir(response.entity);
                });
            },
            deleteClient: function (id) {

            },
            getClient: function (id) {

            }
        };

    }])
;
