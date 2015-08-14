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

            $scope.create = function (selfRegForm, $event) {
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
                    .error(function (response, status) {
                        if (status === 406) {
                            selfRegForm.code.$setValidity('unique', false);
                            if ($scope.uniquePopup) {
                                $scope.uniquePopup.show();
                            }
                            else {
                                $scope.conflictingConfig = angular.copy(response.entity);
                                $scope.uniquePopup = $popover(angular.element($event.currentTarget), {
                                    placement: 'top-right',
                                    scope: $scope,
                                    trigger: 'manual',
                                    show: true,
                                    contentTemplate: 'admin-facing/partials/team/configuration/self-registration/unique_self_reg_code_popover.tpl.html'
                                });
                            }
                        }

                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function (selfRegForm, $event) {
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
                    .error(function (response, status) {
                        if (status === 406) {
                            selfRegForm.code.$setValidity('unique', false);
                            if ($scope.uniquePopup) {
                                $scope.uniquePopup.show();
                            }
                            else {
                                $scope.conflictingConfig = angular.copy(response.entity);
                                $scope.uniquePopup = $popover(angular.element($event.currentTarget), {
                                    placement: 'top-right',
                                    scope: $scope,
                                    trigger: 'manual',
                                    show: true,
                                    contentTemplate: 'admin-facing/partials/team/configuration/self-registration/unique_self_reg_code_popover.tpl.html'
                                });
                            }
                        }

                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            }
            ;

            /**            * Reset all validity
             */

            $scope.resetValidity = function (form) {
                form.$setDirty(true);
                form.code.$setValidity('unique', true);
                if ($scope.uniquePopup) {
                    $scope.uniquePopup.hide();
                }
            };

            $scope.cancel = function () {
                $scope.selfRegFormSubmitted = false;
                $scope.selfRegConfig = angular.copy($scope.originalSelfRegConfig);
            };
        }])
;
