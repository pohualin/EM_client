'use strict';

emmiManager.service('Client', ['$http', function ($http) {
        return {
            getClients: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (name, type, region) {

            },
            deleteClient: function (id) {

            },
            getClient: function (id) {

            }
        };

    }])
;
