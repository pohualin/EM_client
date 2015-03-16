'use strict';

angular.module('emmiManager')
.service('ProfileService', ['API', '$http', 'UriTemplate', '$q', function (api, $http, UriTemplate, $q) {
	return {
		update: function (userClient) {
			return $http.put(UriTemplate.create(userClient.link.self).stringify(), userClient).then(function (response) {
				return response.data;
			});
		},
		get: function (userClient) {
            return $http.get(userClient.link.self).then(function (response) {
                return response.data;
            });
		},
        verifyPassword: function (userClient, password) {
            return $http.get(userClient.link.verifyPassword, {password: password}).then(function(response){
                return response.data;
            });
        }
	};
}])
;
