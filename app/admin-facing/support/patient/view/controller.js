(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Search users across all clients
     */
        .controller('PatientSupportViewController', ['$scope', 'patient', function ($scope, patientResource) {
            $scope.patientResource = patientResource;
            $scope.page.setTitle('Patient - ' +
                patientResource.entity.firstName + ' ' +
                patientResource.entity.lastName + ' | ClientManager');

            $scope.optOutPreferences = [
                {id: 1, typeKey: 'OPT_OUT_WHOLE_PATIENT'},
                {id: 2, typeKey: 'OPT_OUT_PHONE'},
                {id: 3, typeKey: 'OPT_OUT_EMAIL'}
            ];

        }]);

})(window.angular);
