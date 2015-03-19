'use strict';

angular.module('emmiManager')
.service('ProfileService', ['API', '$http', 'UriTemplate', '$q', function (api, $http, UriTemplate, $q) {
	return {
		update: function (userClient) {
            if(userClient.email && userClient.login !== null && userClient.login.toUpperCase() === userClient.originalUserClientEmail.toUpperCase()){
                userClient.login = userClient.email;
            }
			return $http.put(UriTemplate.create(userClient.link.self).stringify(), userClient).then(function (response) {
				return response.data;
			});
		},
		get: function (userClient) {
            return $http.get(userClient.link.self).then(function (response) {
                response.data.originalUserClientEmail = response.data.email;
                return response.data;
            });
		},
        verifyPassword: function (userClient, password) {
            return $http.get(UriTemplate.create(userClient.link.verifyPassword).stringify({size: 2, password: password}),
                {override403: true})
                .then(function(response) {
                    return response;
                });
        }
	};
}])
;
