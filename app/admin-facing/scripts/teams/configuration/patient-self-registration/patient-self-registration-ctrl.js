'use strict';

angular.module('emmiManager')
    .controller('PatientSelfRegController', ['$scope', 'PatientSelfRegService', function ($scope, PatientSelfRegService) {

    PatientSelfRegService.get($scope.team).then(function (response) {
        $scope.patientSelfRegConfig = response.entity;
    });

    $scope.continue = function (form) {
        if (form.$valid) {
            $scope.whenSaving = true;
            if ($scope.patientSelfRegConfig && $scope.patientSelfRegConfig.id) {
                $scope.update();
            }
            else {
                $scope.create();
            }
        }
    };

    $scope.create = function () {
        PatientSelfRegService.create($scope.team, $scope.patientSelfRegConfig).success(function (response) {
            $scope.patientSelfRegConfig = response.entity;
        })
        .finally(function () {
            $scope.whenSaving = false;
        });
    };

    $scope.update = function () {
        PatientSelfRegService.update($scope.team, $scope.patientSelfRegConfig).success(function (response) {
            $scope.patientSelfRegConfig = response.entity;
        })
        .finally(function () {
            $scope.whenSaving = false;
        });
    };

    }])
;
