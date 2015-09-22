'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController', ['$scope', 'Session', 'teamResource', 'SelfRegistrationService', '$alert', 'PatientSelfRegService', '$popover',
        function ($scope, Session, teamResource, SelfRegistrationService, $alert, PatientSelfRegService, $popover) {

            $scope.team = teamResource;
            $scope.client = teamResource.entity.client;

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

            /**
             * on click of continue on self-registration code section
             * @param selfRegForm
             * @param $event
             */
            $scope.continue = function (selfRegForm, $event) {
                $scope.selfRegFormSubmitted = true;
                if (selfRegForm.$valid) {
                    $scope.whenSaving = true;
                    if ($scope.selfRegConfig && $scope.selfRegConfig.id) {
                        $scope.update(selfRegForm, $event);
                    }
                    else {
                        $scope.create(selfRegForm, $event);
                    }
                }
            };

            /**
             * create a new self-registration code
             * error scenario will invalidate the code field on form, and show a popover message
             * @param selfRegForm
             * @param $event
             */
            $scope.create = function (selfRegForm, $event) {
                SelfRegistrationService.create($scope.team, $scope.selfRegConfig).success(function (response) {
                    $scope.originalSelfRegConfig = angular.copy(response.entity);
                    $scope.selfRegConfig = angular.copy(response.entity);
                    $alert({
                        content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                    });
                    selfRegForm.$setPristine(true);
                })
                    .error(function (response, status) {
                        $scope.errorHandler(response, status, selfRegForm, $event);
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                        $scope.outlineSelfRegCard = false;
                    });
            };

            /**
             * update the existing self-registration code for a given team
             * error scenario will invalidate the code field on form, and show a popover message
             * @param selfRegForm
             * @param $event
             */
            $scope.update = function (selfRegForm, $event) {
                SelfRegistrationService.update($scope.team, $scope.selfRegConfig).success(function (response) {
                    $scope.selfRegConfig = angular.copy(response.entity);
                    $scope.originalSelfRegConfig = angular.copy(response.entity);
                    $alert({
                        content: 'The team self reg configuration has been updated successfully.'
                    });
                    selfRegForm.$setPristine(true);
                })
                    .error(function (response, status) {
                        $scope.errorHandler(response, status, selfRegForm, $event);
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                        $scope.outlineSelfRegCard = false;
                    });
            };

            /**
             * handles the error case for create/update self-registration code
             * @param response  the conflicting selfRegConfig that already has the code the user is trying to enter, duplicates not allowed
             * @param status    error response status
             * @param selfRegForm
             * @param $event    the element for the popover
             */
            $scope.errorHandler = function (response, status, selfRegForm) {
                if (status === 406) {
                    selfRegForm.code.$setValidity('unique', false);
                        $scope.conflictingConfig = angular.copy(response.entity);
                        $scope.uniquePopup = $popover(angular.element($('#code')), {
                            placement: 'top-right',
                            scope: $scope,
                            trigger: 'manual',
                            show: true,
                            contentTemplate: 'admin-facing/partials/team/configuration/self-registration/unique_self_reg_code_popover.tpl.html'
                        });
                }
            };

            /**
             * Reset all validity
             */

            $scope.resetValidity = function (form) {
                $scope.outlineSelfRegCard = true;
                $scope.showPatientDetailsOutline = false;
                form.$setDirty(true);
                form.code.$setValidity('unique', true);
                if ($scope.uniquePopup) {
                    $scope.uniquePopup.hide();
                }
                delete $scope.conflictingConfig;

            };

            /**
             * on click of cancel button for self-registration edit section
             */
            $scope.cancel = function (form) {
                $scope.outlineSelfRegCard = false;
                form.$setPristine(true);
                $scope.selfRegFormSubmitted = false;
                $scope.selfRegConfig.code = $scope.originalSelfRegConfig.code ? angular.copy($scope.originalSelfRegConfig.code) : {'code': ''};
                if ($scope.uniquePopup) {
                    $scope.uniquePopup.hide();
                }
                delete $scope.conflictingConfig;
            };

            $scope.$on('event-updateCardOutline', function () {
                    $scope.outlineSelfRegCard = false;
                    $scope.showPatientDetailsOutline = true;
                }
            );

            $scope.$on('event-resetPatientDetailsOutline', function () {
                    $scope.showPatientDetailsOutline = false;
                }
            );

        }])
;
