'use strict';

angular.module('emmiManager')
    .controller('SelfRegistrationController',['$scope', 'SelfRegistrationService', '$alert',
        function($scope, SelfRegistrationService, $alert){

        SelfRegistrationService.getSelfRegCode($scope.team).then(function(response){
            $scope.selfRegConfig = response.entity;
        });

        $scope.saveSelfRegistrationCode = function (valid) {
            if (valid) {
                $scope.whenSaving = true;
                $scope.selfRegFormSubmitted = true;
                SelfRegistrationService.saveOrUpdateSelfRegCode($scope.team, $scope.selfRegConfig).success(function (response)
                    {
                        $scope.selfRegConfig = response.entity;
                        $alert({
                            title: ' ',
                            content: 'The team phone configuration have been updated successfully.',
                            container: 'body',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    })
                    .error(function(response){
                        $scope.saveOrUpdateFailed = true;
                    })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            }
        };
    }])
;
