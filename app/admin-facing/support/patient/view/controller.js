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
        }]);

})(window.angular);
