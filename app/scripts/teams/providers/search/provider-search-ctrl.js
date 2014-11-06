'use strict';
angular.module('emmiManager')

	.controller('ProviderSearchController', function($scope, $modal, $controller, ProviderSearch){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.providersToAssociateToCurrentTeam = [];

        ProviderSearch.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        $scope.cancel = function () {
            $scope.$hide();
        };

        var newProviderModal = $modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.createNewProvider = function () {
            $scope.hideProviderSearchModal();
        	newProviderModal.$promise.then(newProviderModal.show);
        };

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.destroy);
        };

        $scope.search = function (){
            $scope.noSearch = false;
        	ProviderSearch.search($scope.providerQuery).then( function (providerPage){
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
        	});
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            ProviderSearch.search($scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then( function (providerPage){
                $scope.handleResponse(providerPage, 'searchedProvidersList');
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            ProviderSearch.search($scope.providerQuery, $scope.status, $scope.sortProperty, pageSize).then( function (providerPage){
                $scope.handleResponse(providerPage, 'searchedProvidersList');
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property) {
                if (this.property === property) {
                    if (!this.resetOnNextSet) {
                        if (this.ascending !== null) {
                            // this property has already been sorted on once
                            // the next click after this one should turn off the sort
                            this.resetOnNextSet = true;
                        }
                        this.ascending = !this.ascending;
                    } else {
                        this.reset();
                    }
                } else {
                    this.property = property;
                    this.ascending = true;
                    this.resetOnNextSet = false;
                }
            },
            reset: function () {
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            $scope.sortProperty.setProperty(property);
            $scope.loading = true;
            ProviderSearch.search($scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then( function (providerPage){
                $scope.handleResponse(providerPage, 'searchedProvidersList');
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.handleResponse = function (providerPage, providerPropertyName) {
            if (providerPage) {
                $scope.updateAlreadyAssociatedProviders(providerPage, $scope.teamResource);
                this[providerPropertyName] = providerPage.content;

                $scope.total = providerPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = providerPage.linkList.length; i < l; i++) {
                    var aLink = providerPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = providerPage.link.self;
                $scope.currentPage = providerPage.page.number + 1;
                $scope.currentPageSize = providerPage.page.size;
                $scope.pageSizes = [5, 10, 15, 25];
                $scope.status = providerPage.filter.status;
            } else {
                $scope.total = 0;
                $scope[providerPropertyName] = null;
            }
            $scope.noSearch = false;
            $scope.loading = false;
        };

        $scope.updateAlreadyAssociatedProviders = function (providerPage, currentTeam) {
            angular.forEach(providerPage.content, function (provider) {
                angular.forEach($scope.teamResource.teamProviders, function (teamProvider) {
                	if(provider.entity.id === teamProvider.entity.provider.id) {
                		provider.entity.checked = true;
                		provider.entity.disabled = true;
                	}
                });
            });
        };

        $scope.saveAssociationAndAddAnotherProvider = function () {
        	$scope.associateSelectedProvidersToTeam (true);
        };

        $scope.associateSelectedProvidersToTeam = function (addAnother) {
        	if ($scope.providersToAssociateToCurrentTeam.length > 0) {
	        	ProviderSearch.updateProviderTeamAssociations($scope.providersToAssociateToCurrentTeam, $scope.teamResource).then(function (response) {
	        		$scope.hideProviderSearchModal();
	        		$scope.allProvidersForTeam();
	        		if (addAnother) {
	        			$scope.addProviders();
	        		}
	        	});
        	}
        };

        $scope.onCheckboxChange = function (provider) {
        	 if (provider.entity.checked) {
        		 $scope.providersToAssociateToCurrentTeam.push(provider.entity);
        	 }
        	 else {
             	 $scope.providersToAssociateToCurrentTeam.splice(provider.entity, 1);
        	 }
        };
	})
;
