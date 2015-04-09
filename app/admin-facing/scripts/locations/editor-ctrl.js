'use strict';

angular.module('emmiManager').controller(
    'LocationEditorController',
    function($scope, $alert, locationResource, focus, Location, LocationService) {

        $scope.cancel = function(locationForm) {
            if ($scope.locationErrorAlert){
                $scope.locationErrorAlert.hide();
            }
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
                });
                _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Save']);
            } else {
                if (!$scope.locationErrorAlert) {
                    $scope.locationErrorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#validation-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
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
