'use strict';

angular.module('emmiManager').controller(
    'LocationEditorController',
    function($scope, $location, $alert, Client, $controller, locationResource, Tag, $q,
        focus, Location, LocationService) {

        $scope.cancel = function(locationForm) {
            $scope.hideError();
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

        $scope.saveLocation = function(locationForm) {
            var isValid = locationForm.$valid;
        	$scope.locationFormSubmitted = true;
        	if (isValid) {
                locationForm.$setPristine();
                LocationService.updateLocation($scope.locationToEdit).then(function(response) {
                    angular.copy(response.data, $scope.locationResource);
                    angular.copy(response.data.entity, $scope.location);
                    $scope.cancel();
                });
                _paq.push(['trackEvent', 'Form Action', 'Location Edit', 'Save']);
            } else {
                if (!$scope.locationErrorAlert) {
                    $scope.locationErrorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            }
        };

        $scope.showCancelSave = function(){
        	return !angular.equals($scope.location, $scope.locationToEdit);
        };

        function init() {
            $controller('ViewEditCommon', {
                $scope: $scope
            });

            if (locationResource) {
            	Location.getReferenceData().then(function (refData) {
                    $scope.statuses = refData.statusFilter;
                    $scope.states = refData.state;
                });

                $scope.locationResource = locationResource;
                $scope.location = locationResource.entity; // for the view state
                $scope.edit();
            } else {
                $location.path('/locations');
            }
        }

        init();
    });
