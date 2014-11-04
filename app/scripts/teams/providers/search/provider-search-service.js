'use strict';

angular.module('emmiManager')

	.service('ProviderSearch', function ($http, $q, Session, UriTemplate) {
        var referenceData;
		return {
			search: function (query, status, sort, pageSize) {
				return $http.get(UriTemplate.create(Session.link.providers).stringify({name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
				})).then(function (response) {
					return response.data;
				});
			},
			getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.providersReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });
            },
            updateProviderTeamAssociations: function (providersToAssociateToCurrentTeam, teamResource) {
                return $http.post(UriTemplate.create(teamResource.link.teamProviders).stringify(), providersToAssociateToCurrentTeam)
                    .success(function (response) {
                        return response;
                    });
            }
		};
	})

;