'use strict';
angular.module('emmiManager')
    .service('TeamSearch', function ($http, Session, UriTemplate, $location) {
    	return {
    	    search: function (query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(Session.link.teams).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    return response.data;
                });
            },
            viewTeam: function (teamEntity) {
                $location.path('/clients/' + teamEntity.client.id + '/teams/' + teamEntity.id + '/view');
            },
            fetchPage: function (href) {
                return $http.get(href).then(function (response) {
                        return response.data;
                    });
            }
    	};
}); 	 