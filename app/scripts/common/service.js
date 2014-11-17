'use strict';

angular.module('emmiManager').service(
		'CommonService',
		function($http, arrays, UriTemplate) {

			this.convertPageContentLinks = function(resource) {
				if (resource.content) {
					angular.forEach(resource.content, function(content) {
						content.link = arrays.convertToObject('rel', 'href',
								content.link);
					});
				}
			};

			this.fetchPage = function(href) {
				return $http.get(href).then(function(response) {
					return response.data;
				});
			};
			
		});
