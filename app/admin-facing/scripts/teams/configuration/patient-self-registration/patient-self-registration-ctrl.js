'use strict';

angular.module('emmiManager')
    .controller('PatientSelfRegController', ['$scope', 'PatientSelfRegService', '$alert', '$controller', 'PatientIdLabelDropDownService',
        function ($scope, PatientSelfRegService, $alert, $controller, PatientIdLabelDropDownService) {

            $controller('PatientIdLabelDropDownController', {$scope: $scope});

            $scope.idLabelConfigSpanish = {};
            $scope.idLabelConfigEnglish = {};
            $scope.patientSelfRegConfig = {};
            $scope.patientSelfRegConfig.entity = {};
            $scope.patientSelfRegConfig.entity.patientIdLabelType = {};

            $scope.continue = function (form) {
                if (form.$valid) {
                    $scope.whenSaving = true;
                    if ($scope.patientSelfRegConfig.entity && $scope.patientSelfRegConfig.entity.id) {
                        $scope.update();
                    }
                    else {
                        $scope.create();
                    }
                }
            };

            $scope.create = function () {
                PatientSelfRegService.create($scope.team, $scope.patientSelfRegConfig).then(function (response) {
                    $scope.patientSelfRegConfig = response;
                    $scope.createOrUpdateIdLabelConfig();
                    $alert({
                        content: 'The patient self reg configuration has been saved successfully.'
                    });
                })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function () {
                PatientSelfRegService.update($scope.team, $scope.patientSelfRegConfig).then(function (response) {
                    $scope.patientSelfRegConfig = response;
                    $scope.createOrUpdateIdLabelConfig();
                    $alert({
                        content: 'The team self reg configuration has been updated successfully.'
                    });
                })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.updatePatientIDLabelTypeTranslations = function (type) {
                $scope.patientSelfRegConfig.entity.patientIdLabelType = angular.copy(type);
                PatientIdLabelDropDownService.translate(type.typeKey).then(function (response) {
                    angular.forEach(response.content, function (translation) {
                        angular.forEach($scope.languagesAvailable, function (language) {
                            if (language.entity.languageTag === translation.entity.language.languageTag && translation.entity.language.languageTag === 'en') {
                                $scope.idLabelConfigEnglish.config = $scope.idLabelConfigEnglish.config ? $scope.idLabelConfigEnglish.config : {};
                                $scope.idLabelConfigEnglish.config.entity = $scope.idLabelConfigEnglish.config && $scope.idLabelConfigEnglish.config.entity ? $scope.idLabelConfigEnglish.config.entity : {};
                                $scope.idLabelConfigEnglish.config.entity.value = type.isModifiable && $scope.originalIdLabelConfigEnglish && $scope.originalIdLabelConfigEnglish.entity.idLabelType.isModifiable ? $scope.originalIdLabelConfigEnglish.entity.value : translation.entity.value ? translation.entity.value : '';
                                $scope.idLabelConfigEnglish.config.entity.idLabelType = $scope.patientSelfRegConfig.entity.patientIdLabelType;
                                $scope.idLabelConfigEnglish.config.entity.patientSelfRegConfig = $scope.patientSelfRegConfig.entity;
                                $scope.idLabelConfigEnglish.config.entity.language = translation.entity.language;
                            } else if (language.entity.languageTag === translation.entity.language.languageTag && translation.entity.language.languageTag === 'es') {
                                $scope.idLabelConfigSpanish.config = $scope.idLabelConfigSpanish.config ? $scope.idLabelConfigSpanish.config : {};
                                $scope.idLabelConfigSpanish.config.entity = $scope.idLabelConfigSpanish.config && $scope.idLabelConfigSpanish.config.entity ? $scope.idLabelConfigSpanish.config.entity : {};
                                $scope.idLabelConfigSpanish.config.entity.value = type.isModifiable && $scope.originalIdLabelConfigSpanish && $scope.originalIdLabelConfigSpanish.entity.idLabelType.isModifiable ? $scope.originalIdLabelConfigSpanish.entity.value : translation.entity.value ? translation.entity.value : '';
                                $scope.idLabelConfigSpanish.config.entity.idLabelType = $scope.patientSelfRegConfig.entity.patientIdLabelType;
                                $scope.idLabelConfigSpanish.config.entity.patientSelfRegConfig = $scope.patientSelfRegConfig.entity;
                                $scope.idLabelConfigSpanish.config.entity.language = translation.entity.language;
                            }
                        });
                    });
                });
            };
        }])
;
