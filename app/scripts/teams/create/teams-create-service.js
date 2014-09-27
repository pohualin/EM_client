'use strict';
angular.module('emmiManager')
    .service('CreateTeam', function ($http, $q, Session, UriTemplate, $location) {
      var selectedTeam;
      var referenceData;
      return {
          insertTeams: function (team) {
               return $http.post(UriTemplate.create(Session.link.teamsByClientId).stringify({clientId: team.client.id}), team).
                   then(function (response) {
                     return response;
                   });
          },
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.clientsReferenceData).then(function (response) {
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