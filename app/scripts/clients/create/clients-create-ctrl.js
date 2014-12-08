'use strict';

angular.module('emmiManager')

/**
 * Create new controller
 */
.controller('ClientCreateController', function ($scope, Client, $controller) {

    $controller('ViewEditCommon', {$scope: $scope});

    $scope.clientToEdit = Client.newClient().entity;

    $scope.save = function (isValid) {
        $scope.formSubmitted = true;
        if (isValid && $scope.clientToEdit.salesForceAccount) {
            Client.insertClient($scope.clientToEdit).then(function (response) {
                Client.viewClient(response.data.entity);
            });
        } else {
            $scope.showError();
            // Loop through the form's validation errors and log to Piwik
            var formErrors = $scope.clientForm.$error;
            for (var errorType in formErrors) {
                if (formErrors.hasOwnProperty(errorType)) {
                    for (var i = 0; i < formErrors[errorType].length; i++) {
                        _paq.push(['trackEvent', 'Validation Error', 'Client Create', formErrors[errorType][i].$name+' '+errorType]);
                    }
                }
            }
        }
    };

})

;
