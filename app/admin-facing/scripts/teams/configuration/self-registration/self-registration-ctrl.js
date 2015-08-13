'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController', ['$scope', 'Session', 'teamResource', 'SelfRegistrationService', '$alert', 'PatientSelfRegService',
        function ($scope, Session, teamResource, SelfRegistrationService, $alert, PatientSelfRegService) {

            $scope.team = teamResource;
            $scope.client = teamResource.entity.client;
            $scope.url = Session.link.findBySelfRegCode;

            SelfRegistrationService.get($scope.team).then(function (response) {
                $scope.selfRegConfig = response.entity ? angular.copy(response.entity) : {};
                $scope.originalSelfRegConfig = response.entity ? angular.copy(response.entity) : {};
            });

            PatientSelfRegService.refData($scope.team).then(function (response) {
                $scope.idLabelTypes = response;
            });

            SelfRegistrationService.getLanguages().then(function (response) {
                $scope.languagesAvailable = response;
            });

            $scope.continue = function (selfRegForm) {
                $scope.selfRegFormSubmitted = true;
                $scope.$broadcast('submitSelfRegCode');
                if (selfRegForm.$valid) {
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
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function () {
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
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            }
            ;

            $scope.cancel = function () {
                $scope.selfRegFormSubmitted = false;
                $scope.selfRegConfig = angular.copy($scope.originalSelfRegConfig);
            };
        }])
;
