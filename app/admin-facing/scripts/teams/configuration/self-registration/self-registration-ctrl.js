'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController', ['$scope', 'teamResource', 'SelfRegistrationService', '$alert', 'PatientSelfRegService',
        function ($scope, teamResource, SelfRegistrationService, $alert, PatientSelfRegService) {

            $scope.team = teamResource;
            $scope.client = teamResource.entity.client;

            SelfRegistrationService.get($scope.team).then(function (response) {
                $scope.selfRegConfig = response.entity ? response.entity : {};
                $scope.originalSelfRegConfig = response.entity ? response.entity : {};
            });

            PatientSelfRegService.refData($scope.team).then(function (response) {
                $scope.idLabelTypes = response;
            });

            SelfRegistrationService.getLanguages().then(function (response) {
                $scope.languagesAvailable = response;
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
                    $scope.originalSelfRegConfig = angular.copy(response.entity);
                    $scope.selfRegConfig = angular.copy(response.entity);
                    $alert({
                        title: '',
                        content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.',
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
                    $scope.selfRegConfig = angular.copy(response.entity);
                    $scope.originalSelfRegConfig = angular.copy(response.entity);
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
