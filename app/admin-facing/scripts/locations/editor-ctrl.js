'use strict';

angular.module('emmiManager').controller(
    'LocationEditorController',
    function($scope, $alert, locationResource, focus, Location, LocationService) {

        $scope.cancel = function(locationForm) {
            $scope.locationFormSubmitted = false;
            locationForm.$setPristine();
            $scope.edit();
            _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Cancel']);
        };

        $scope.edit = function() {
            $scope.editMode = true;
            $scope.locationToEdit = angular.copy($scope.location);
            focus('locationName');
            _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Edit']);
        };

        $scope.doNotDeactivateLocation = function(){
            $scope.locationToEdit.active = true;
        };

        $scope.saveLocation = function(locationForm) {
            var isValid = locationForm.$valid;
        	$scope.locationFormSubmitted = true;
        	if (isValid) {
                $scope.whenSaving = true;
                LocationService.updateLocation($scope.locationToEdit).then(function(response) {
                    angular.copy(response.data, $scope.locationResource);
                    angular.copy(response.data.entity, $scope.location);
                    $scope.cancel(locationForm);
                    $alert({
                        content: 'The location <b>'+response.data.entity.name+'</b> has been successfully updated.'
                    });
                }).finally(function () {
                    $scope.whenSaving = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Save']);
            }
        };

        $scope.showCancelSave = function(){
        	return !angular.equals($scope.location, $scope.locationToEdit);
        };

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.locationResource = locationResource;
        $scope.location = locationResource.entity;
        $scope.page.setTitle('Location - ' + $scope.location.name + ' | ClientManager');
        $scope.edit();

    });
