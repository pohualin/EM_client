'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController', ['$scope', 'SelfRegistrationService', '$alert',
        function ($scope, SelfRegistrationService, $alert) {

            SelfRegistrationService.get($scope.team).then(function (response) {
                $scope.selfRegConfig = response.entity;
            });

            $scope.continue = function (valid) {
                $scope.selfRegFormSubmitted = true;
                if (valid) {
                    $scope.whenSaving = true;
                    if ($scope.selfRegConfig && $scope.selfRegConfig.id) {
                        $scope.update();
                    }
                    else {
                        $scope.create();
                    }
                }
            };

            $scope.create = function () {
                SelfRegistrationService.create($scope.team, $scope.selfRegConfig).success(function (response) {
                    $scope.selfRegConfig = response.entity;
                    $alert({
                        title: ' ',
                        content: 'The team self reg configuration has been created successfully.',
                        container: 'body',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                })
                    .error(function (response) {
                        $scope.selfRegForm.$setValidity('unique', false);
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function () {
                SelfRegistrationService.update($scope.team, $scope.selfRegConfig).success(function (response) {
                    $scope.selfRegConfig = response.entity;
                    $alert({
                        title: ' ',
                        content: 'The team self reg configuration has been updated successfully.',
                        container: 'body',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                })
                    .error(function (response) {
                        $scope.selfRegForm.code.$setValidity('unique', false);
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            }
            ;

            /**
             * Reset all validity
             */
            $scope.resetValidity = function (form) {
                form.$setDirty(true);
                form.code.$setValidity('unique', true);
            };
        }])
;
