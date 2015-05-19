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
            $scope.locationToEdit = angular.copy($scope.locationResource);
            focus('locationName');
            _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Edit']);
        };

        $scope.saveLocation = function(locationForm) {
            var isValid = locationForm.$valid;
        	$scope.locationFormSubmitted = true;
        	if (isValid) {
                LocationService.updateLocation($scope.locationToEdit.entity).then(function(response) {
                    $scope.locationResource = response.data;
                    $scope.cancel(locationForm);
                    $alert({
                        title: '',
                        content: 'The location <b>'+response.data.entity.name+'</b> has been successfully updated.',
                        container: '#messages-container',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
                _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Save']);
            }
        };

        $scope.showCancelSave = function(){
        	return !angular.equals($scope.locationResource, $scope.locationToEdit);
        };

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.locationResource = locationResource;
        $scope.edit();

    });
