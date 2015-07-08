'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController', ['$scope', 'SelfRegistrationService', '$alert',
        function ($scope, SelfRegistrationService, $alert) {

            SelfRegistrationService.get($scope.team).then(function (response) {
                $scope.selfRegConfig = response.entity;
            });

            $scope.continue = function (selfRegForm) {
                $scope.selfRegFormSubmitted = true;
                if (selfRegForm.$valid) {
                    $scope.whenSaving = true;
                    if ($scope.selfRegConfig && $scope.selfRegConfig.id) {
                        $scope.update(selfRegForm);
                    }
                    else {
                        $scope.create(selfRegForm);
                    }
                }
            };

            $scope.create = function (selfRegForm) {
                SelfRegistrationService.create($scope.team, $scope.selfRegConfig).success(function (response) {
                    $scope.selfRegConfig = response.entity;
                    $alert({
                        title: '',
                        content: '<b>' + $scope.team.entity.name + '</b> has been updated successfully.',
                        container: 'body',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                })
                    .error(function () {
                        selfRegForm.code.$setValidity('unique', false);
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function (selfRegForm) {
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
                    .error(function () {
                        selfRegForm.code.$setValidity('unique', false);
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
