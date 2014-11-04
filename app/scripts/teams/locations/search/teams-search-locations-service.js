'use strict';
angular.module('emmiManager')
    .service('TeamSearchLocation', function ($http, $q, Session, UriTemplate) {
        var referenceData;

        return {
            save: function (url, locations) {
                return $http.post(UriTemplate.create(url).stringify(), locations).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })

    .directive('clearSearch', [function () {
          return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                
               element.bind('keyup', function (event) {
                    if (event.which === 8 && scope.locationQuery.length === 0 )  {
                        scope.cleanSearch();
                    } 
                });
            }
          };
    }])   
;
