'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionCreateController', ['$scope', '$location', 'SecretQuestionService', '$alert', 'account',
        function ($scope, $location, SecretQuestionService, $alert, account) {

    	$scope.secretQuestionFormSubmitted = false;
    	$scope.duplicated = false;
    	/**
    	 * When the save button is clicked. Sends all updates
    	 * to the back, then re-binds the form objects with the
    	 * results
    	 */
        $scope.saveOrUpdateSecretQuestion = function(valid) {
        	$scope.secretQuestionFormSubmitted = true;
        	if(valid){
        		SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question1.entity, $scope.question2.entity);
	        	$alert({
					title: ' ',
					content: 'Your security questions have been updated successfully.',
					container: 'body',
					type: 'success',
					placement: 'top',
				    show: true,
				    duration: 5,
				    dismissable: true
				});
	        	$location.path('/');
    		} else {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            }

    	};

    	/**
    	 * When the save button is clicked. Check if the user
    	 * selected 2 same questions or not
    	 */
    	$scope.onChange= function(){
    		if(angular.equals($scope.question1.entity.secretQuestion, $scope.question2.entity.secretQuestion) &&
    	       !(angular.isUndefined($scope.question1.entity.secretQuestion))){
    	    	$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', false);
    	    }
    	    else{
    	    	$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', true);
    	    }
    	};

        /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
    	$scope.notNow = function () {
            SecretQuestionService.notNow(account);
            $location.path('/');

        };

       function init(){

    		SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content;
       		});

          	$scope.question1 = SecretQuestionService.createNewResponse();
          	$scope.question2 = SecretQuestionService.createNewResponse();
        }

        init();

        }
    ])
;
