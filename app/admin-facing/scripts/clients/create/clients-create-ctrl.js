'use strict';

angular.module('emmiManager')

/**
 * Create new controller
 */
    .controller('ClientCreateController', ['$scope', 'Client', '$controller', '$location', 'focus',
        function ($scope, Client, $controller, $location, focus) {

        $controller('ViewEditCommon', {$scope: $scope});

        $scope.editMode = true;

        $scope.clientToEdit = Client.newClient().entity;

        $scope.cancel = function () {
            $scope.editMode = false;
            $location.path('clients').search($scope.currentRouteQueryString);
        };

        if ($scope.cancelClickDereg) {
            $scope.cancelClickDereg();
        }
        $scope.cancelClickDereg = $scope.$on('$unsaved-form-cancel-clicked', function () {
            $scope.editMode = true;
            focus('clientName');
        });

        $scope.save = function (clientForm) {
            $scope.formSubmitted = true;
            if (clientForm.$valid && $scope.clientToEdit.salesForceAccount) {
                clientForm.$setPristine();
                Client.insertClient($scope.clientToEdit).then(function (response) {
                    Client.viewClient(response.data.entity);
                });
                _paq.push(['trackEvent', 'Form Action', 'Client Create', 'Save']);
            } else {
                $scope.showError();
                // Loop through the form's validation errors and log to Piwik
                var formErrors = $scope.clientForm.$error;
                for (var errorType in formErrors) {
                    if (formErrors.hasOwnProperty(errorType)) {
                        for (var i = 0; i < formErrors[errorType].length; i++) {
                            _paq.push(['trackEvent', 'Validation Error', 'Client Create', formErrors[errorType][i].$name + ' ' + errorType]);
                        }
                    }
                }
            }
        };

    }])

;
