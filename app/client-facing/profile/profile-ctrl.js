'use strict';

angular.module('emmiManager')
	.controller('ProfileCtrl', ['$scope', '$alert', '$modal', 'userClientReqdResource', 'ProfileService',
        function($scope, $alert, $modal, userClientReqdResource, ProfileService){
	
    /**
     * Set edit mode for userClientForm
     */
    $scope.setEditMode = function(value){
        $scope.editMode = value;
    };

    /**
     * Set edit mode for editEmailForm 
     */
    $scope.setEmailEditMode = function(value){
        $scope.emailEditMode = value;
    };
    
    /**
     * Show error alert
     */
    $scope.formValidationError = function (message) {
        var content = message ? message : 'Please correct the below information.';
        if (!$scope.errorAlert) {
            $scope.errorAlert = $alert({
                title: ' ',
                content: content,
                container: '#message-container',
                type: 'danger',
                show: true,
                dismissable: false
            });
        } else {
            $scope.errorAlert.show();
        }
    };
    
    /**
     * Hide error alert
     */
    $scope.hideErrorAlert = function(){
        if($scope.errorAlert){
            $scope.errorAlert.hide();
        }
    };

    function init(){
        $scope.userClient = userClientReqdResource;
        ProfileService.setUseEmail($scope.userClient);
    }
    
    init();
}])
;
