'use strict';

angular.module('emmiManager')

    .service('ProviderCreate', function ($http, $q, Session, UriTemplate) {
        return {
        	 newProvider: function () {
                 return {
                     firstName: null,
                     middleName: null,
                     lastName: null,
                     email: null,
                     specialty: null
                 };
             },
             create: function (provider, teamResource) {
                 return $http.post(UriTemplate.create(teamResource.link.provider).stringify(), provider)
                     .success(function (response) {
                         return response;
                     });
             }
        };
    })

;