'use strict';

angular.module('emmiManager')
    .controller('PatientSelfRegController', ['$scope', 'PatientSelfRegService', '$alert',
        function ($scope, PatientSelfRegService, $alert) {

    PatientSelfRegService.get($scope.team).then(function (response) {
        $scope.patientSelfRegConfig = response.entity;
        if ($scope.patientSelfRegConfig === undefined){
            $scope.patientSelfRegConfig = {};
            $scope.patientSelfRegConfig.idLabelType = 'PATIENT_SELF_REG_LABEL_PATIENT_ID';
                $scope.updatePatientIDLabelType($scope.patientSelfRegConfig.idLabelType);
        }
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
            $alert({
                content: 'The patient self reg configuration has been saved successfully.'
            });
        })
        .finally(function () {
            $scope.whenSaving = false;
        });
    };

    $scope.update = function () {
        PatientSelfRegService.update($scope.team, $scope.patientSelfRegConfig).success(function (response) {
            $scope.patientSelfRegConfig = response.entity;
            $alert({
                content: 'The team self reg configuration has been updated successfully.'
            });
        })
        .finally(function () {
            $scope.whenSaving = false;
        });
    };

    $scope.updatePatientIDLabelType = function (idLabelType) {
        PatientSelfRegService.translate(idLabelType, $scope.patientSelfRegConfig);
    };

    }])
;
