'use strict';
angular.module('emmiManager')
    .service('CreateTeam', function ($http, $q, Session, UriTemplate) {
      return {
          insertTeams: function (team) {
               return $http.post(UriTemplate.create(Session.link.teamsByClientId).stringify({clientId: team.client.id}), team).
                   then(function (response) {
                     return response;
                   });
    	    },
    	    findNormalizedName: function(url, searchString, clientId){
                return $http.get(UriTemplate.create(url).stringify({
                	clientId: clientId , 
                	normalizedName: searchString
                	}
                )).then(function (response) {
                        return response.data;
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
    })

    .directive('uniqueTeamName', ['$popover', 'CreateTeam', '$translate', function ($popover, CreateTeam, $translate) {
          return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                url: '=uniqueUrl',
                team:'=team'
            },      
            link: function (scope, element, attrs, ngModel) {

                element.on('keydown', function() {
                    if (scope.uniquePopup) {
                        scope.uniquePopup.hide();
                        ngModel.$setValidity('unique', true);
                    }
                });

                 element.on('blur', function() {
                	 CreateTeam.findNormalizedName(scope.url, element.val(), scope.team.client.id).then(function (searchResults) {
                        scope.existsTeam = searchResults;
                          if (scope.existsTeam.entity === undefined) {
                            ngModel.$setValidity('unique', true);
                            if (scope.uniquePopup) {
                                scope.uniquePopup.hide();
                            }
                          } else {
                        	 if((scope.team.id !== scope.existsTeam.entity.id)){
                        		 ngModel.$setValidity('unique', false);
                                 if (scope.uniquePopup) {
                                     scope.uniquePopup.show();
                                 }
                                 else {
                                	    $translate('team_edit_page.unique_popup_dialog.name').then(function (title) {
                                            scope.uniquePopup = $popover(element, {
                                                title: title,
                                                placement: 'top-right',
                                                scope: scope,
                                                trigger: 'manual',
                                                show: true,
                                                contentTemplate: 'partials/client/unique_team_popover.tpl.html'
                                            });
                                        });
                                 }
                        	 }
                          }
                    });
                 }) ;  
            }
          };
    }])    

;