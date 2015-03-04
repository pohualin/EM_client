'use strict';

angular.module('emmiManager')
.service('ProfileService', ['API', '$http', 'UriTemplate', function (api, $http, UriTemplate) {
	return {
		update: function (userClient) {
			return $http.put(UriTemplate.create(api.authenticated).stringify(), userClient).then(function(response) {
				return response.data;
			})
		},
		get: function (userClient) {
			return $http.get(userClient.link.getById).then(function(response){
				return response.data;
			})
		}
	}
}])
;