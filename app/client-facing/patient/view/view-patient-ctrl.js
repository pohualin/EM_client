'use strict';

angular.module('emmiManager')
    .controller('ViewPatientController', ['$scope', 'patientResource',
        function( $scope, patientResource){
            $scope.patientResource = patientResource;
        }
    ])
;
