'use strict';

angular.module('emmiManager')
.service('ProfileService', ['API', '$http', 'UriTemplate', '$q', function (api, $http, UriTemplate, $q) {
	return {
		update: function (userClient, password) {
            if(userClient.email && userClient.login && userClient.originalUserClientEmail &&
                userClient.login.toUpperCase() === userClient.originalUserClientEmail.toUpperCase()){
                userClient.login = userClient.email;
            }
            return $http.put(UriTemplate.create(userClient.link.userClientEmail).stringify({password: password}), userClient).then(function (response) {
				var updatedUser = response.data;
                updatedUser.email = updatedUser.email || '';
                return updatedUser;
			});
		},

		get: function (userClient) {
            return $http.get(userClient.link.self).then(function (response) {
                response.data.originalUserClientEmail = response.data.email;
                response.data.email = response.data.email || '';
                return response.data;
            });
		},

        verifyPassword: function (userClient, password) {
            return $http.get(UriTemplate.create(userClient.link.verifyPassword).stringify({size: 2, password: password}),
                {override403: true})
                .then(function(response) {
                    return response;
                });
        },

        /**
         * Set useEmail to true if email and login are same
         */
        setUseEmail: function(userClient){
            if (angular.equals(userClient.email,
                    userClient.login)) {
                userClient.useEmail = true;
            }
        }
	};
}])
;
