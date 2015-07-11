'use strict';

angular.module('emmiManager')
    .controller('PatientSelfRegController', ['$scope', 'PatientSelfRegService', '$translate', '$q', '$alert',
        function ($scope, PatientSelfRegService, $translate, $q, $alert) {

    PatientSelfRegService.get($scope.team).then(function (response) {
        $scope.patientSelfRegConfig = response.entity;
        if ($scope.patientSelfRegConfig === undefined){
            $scope.patientSelfRegConfig = {};
            $scope.patientSelfRegConfig.idLabelType = 'PATIENT_ID';
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
                title: ' ',
                content: 'The patient self reg configuration has been saved successfully.',
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
        PatientSelfRegService.update($scope.team, $scope.patientSelfRegConfig).success(function (response) {
            $scope.patientSelfRegConfig = response.entity;
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
    };
    $scope.updatePatientIDLabelType = function (idLabelType) {
        if (idLabelType === 'OTHER_ID_LABEL') {
            $scope.patientSelfRegConfig.patientIdLabelSpanish = '';
            $scope.patientSelfRegConfig.patientIdLabelEnglish = '';
        } else {
            var promises = [];
            promises.push($translate(idLabelType + '_SPANISH'));
            promises.push($translate(idLabelType));
            return $q.all(promises).then(function (response) {
                $scope.patientSelfRegConfig.patientIdLabelSpanish = response[0];
                $scope.patientSelfRegConfig.patientIdLabelEnglish = response [1];
            });
        }
        ;
    }
    }])
;
