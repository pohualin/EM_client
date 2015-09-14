'use strict';
angular.module('emmiManager')

	.controller('ProviderListController', ['$scope', '$modal', 'ProviderView', 'TeamLocation', 'TeamProviderService', 'ProviderSearch', '$controller', 'arrays', 'ProviderCreate', 'ClientProviderService', 'Client', '$alert', '$q', 'ClientTeamSchedulingConfigurationService',
        function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client, $alert, $q, ClientTeamSchedulingConfigurationService) {

		$controller('CommonPagination', {$scope: $scope});

		var editProviderModal = $modal({
            scope: $scope,
            template: 'admin-facing/partials/team/provider/edit.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });

		/**
		 * Fetch page of team providers on team page
		 */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderView.fetchPageLink(href).then(function (page) {
                $scope.handleResponse(page, 'listOfTeamProviders');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Edit team provider on a team
         */
		$scope.editProvider = function (teamProvider) {
            $scope.title = '';

			// create a copy for editing
			$scope.teamProviderToBeEdit = angular.copy(teamProvider);
			// save the original for overlay if save is clicked
			$scope.teamProvider = teamProvider;
			// get ClientProvider for external provider id and active status
			TeamProviderService.findClientProviderByClientIdAndProviderId($scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).then(function (response) {
                $scope.originalClientProvider = response;
                $scope.clientProvider = angular.copy(response);

			});

			ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function(schedulingConfig){
	            if (schedulingConfig.entity.useLocation) {
	                // get a list of team locations by team
	                TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function (response) {
	                    $scope.potentialLocations = response;
	                    $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
	                    // get a list of existing team locations by team provider

	                    TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function (response) {
	                        if (response.length > 0) {
	                            $scope.selectedItems = TeamProviderService.buildSelectedItem(response);
	                        } else {
	                            $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
	                        }
	                        // show the dialog box
	                        editProviderModal.$promise.then(editProviderModal.show);
	                    });
	                });
	            } else {
	                $scope.potentialLocations = [];
	                $scope.selectedItems = [];
	                editProviderModal.$promise.then(editProviderModal.show);
	            }
	        });

			_paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Edit']);
		};

		/**
		 * Delete team provider from a team
		 */
        $scope.removeProvider = function (provider) {
            $scope.whenSaving = true;
        	ProviderView.removeProvider(provider, $scope.teamResource).then(function () {
                $scope.refreshLocationsAndProviders();
                $alert({
                    content: 'The provider <b>' + provider.entity.provider.fullName + '</b> has been successfully removed.'
                });
            }).finally(function () {
                $scope.whenSaving = false;
            });
            _paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Remove']);
        };

        /**
         * Add providers to a team
         */
        $scope.addProviders = function (activeTab) {
            if ($scope.providerErrorAlertForCreate) {
                $scope.providerErrorAlertForCreate.hide();
            }
            $scope.associateRequestSubmitted = false;
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function (response) {
                $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response);
            });
       		return ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
   			  var providerTemplate = clientProviders.content && clientProviders.content.length > 0 ? 'admin-facing/partials/team/provider/search-with-client-provider-tabs.html' : 'admin-facing/partials/team/provider/search-without-client-provider-tabs.html';
   			  $scope.activeTab = activeTab ? activeTab : 0;
		      $modal({
   			      scope: $scope,
                  template: providerTemplate,
                  animation: 'none',
                  backdropAnimation: 'emmi-fade',
                  show: true,
                  backdrop: 'static'});
       	   });
        };

        /**
         * Refresh team locations and team providers
         */
        $scope.refreshLocationsAndProviders = function () {
            $scope.loading = true;
            // need to return the promise
            return ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function (schedulingConfiguration) {
                $scope.schedulingConfiguration = schedulingConfiguration;
                if($scope.schedulingConfiguration.entity.useProvider){
                    $scope.teamProviders = {};
                    var promises = [];
                    promises.push(ProviderView.paginatedProvidersForTeam($scope.teamResource));
                    promises.push(TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations));
                    return $q.all(promises).then(function (response) {
                        angular.forEach(response[0].content, function (teamProvider) {
                            $scope.teamProviders[teamProvider.entity.provider.id] = angular.copy(teamProvider.entity.provider);
                        });
                        $scope.handleResponse(response[0], 'listOfTeamProviders');
                        $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response[1]);
                    });
                } else {
                    $scope.loading = false;
                }
            });
        };

        /**
         * Display success alert
         */
        $scope.successAlert = function (providersToAdd, container) {
            var message = (providersToAdd.length === 1) ?
                ' <b>' + providersToAdd[0].provider.fullName + '</b> has been successfully added.' :
                'The selected providers have been successfully added.';
            $alert({
                content: message,
                container: container
            });
        };

        /**
         * Display error alert
         */
        $scope.showError = function () {
            if (!$scope.providerErrorAlertForCreate) {
                $scope.providerErrorAlertForCreate = $alert({
                    content: 'Please correct the below information.',
                    container: '#modal-messages-container',
                    type: 'danger',
                    placement: '',
                    duration: false,
                    dismissable: false
                });
            } else {
                $scope.providerErrorAlertForCreate.show();
            }
        };

        $scope.$on('event:teamLocationSavedWithProvider', function () {
            $scope.refreshLocationsAndProviders();
        });

        function init() {
            $scope.locationsColumnCharLimit = 25;
            $scope.allLocationsForTeam = 'All Locations';
            ProviderSearch.getReferenceData().then(function (refData) {
                $scope.statuses = refData.statusFilter;
            });
            if ($scope.teamResource) {
                ProviderView.specialtyRefData($scope.teamResource).then(function (response) {
                    $scope.specialties = response;
                });
                $scope.client = $scope.teamResource.entity.client;
                $scope.refreshLocationsAndProviders();
            }
        }
        init();
	}]);
