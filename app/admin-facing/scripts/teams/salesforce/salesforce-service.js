'use strict';
angular.module('emmiManager')
    .service('SalesForce', function ($http, $q, Session, UriTemplate) {
      var referenceData;
      return {

            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.teamsReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },

            findSalesForceAccount: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            }

      };
});    