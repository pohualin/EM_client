'use strict';

angular.module('emmiManager').controller(
    'LocationEditorController',
    function($scope, $location, $alert, Client, $controller, locationResource, Tag, $q,
        focus, Location, LocationService) {

        $scope.cancel = function() {
            $scope.hideError();
            $scope.edit();
        };

        $scope.edit = function() {
            $scope.editMode = true;
            $scope.locationToEdit = angular.copy($scope.location);
            focus('locationName');
        };

        $scope.saveLocation = function(isValid) {
        	$scope.locationFormSubmitted = true;
        	if (isValid) {
                LocationService.updateLocation($scope.locationToEdit).then(function(response) {
                    angular.copy(response.data, $scope.locationResource);
                    angular.copy(response.data.entity, $scope.location);
                    $scope.cancel();
                });
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
        
        /**
         * Show/hide cancel and save link
         * Only show when locationToEdit !== location
         */
        $scope.$watch(function () {
            return angular.equals($scope.location, $scope.locationToEdit);
        }, function (equals) {
            if (equals) {
                $scope.showCancelSave = false;
            } else {
            	$scope.showCancelSave = true;
            }
        });

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
