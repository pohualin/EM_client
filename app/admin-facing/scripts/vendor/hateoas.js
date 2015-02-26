'use strict';

angular.module('hateoas',[])

    .provider('HateoasInterceptor', ['$httpProvider', function ($httpProvider) {

        return {

            transformAllResponses: function () {
                $httpProvider.interceptors.push('HateoasInterceptor');
            },

            arrayToObject: function (keyItem, valueItem, array) {
                var obj = {};
                angular.forEach(array, function (item) {
                    if (item[keyItem] && item[valueItem]) {
                        obj[item[keyItem]] = item[valueItem];
                    }
                });
                return obj;
            },

            $get: ['$q', function ($q) {
                var me = this;
                return {
                    response: function (response) {

                        if (response && angular.isObject(response.data)) {
                            var data = response.data;
                            if (data.link) {
                                response.data.linkList = data.link;
                                response.data.link = me.arrayToObject('rel', 'href', data.link);
                            }
                        }
                        return response || $q.when(response);
                    }
                };
            }]
        };
    }]);