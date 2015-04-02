'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionCreateController', ['$scope', '$location', 'SecretQuestionService', '$alert','$q',
        function ($scope, $location, SecretQuestionService, $alert, $q) {
    	
    	$scope.secretQuestionFormSubmitted = false;
    	$scope.duplicated = false;
    	/**
    	 * When the save button is clicked. Sends all updates
    	 * to the back, then re-binds the form objects with the
    	 * results
    	 */
        $scope.saveOrUpdateSecretQuestion = function(valid) {
            var deferred = $q.defer();
        	if(valid){
        		SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.account.question1.entity, $scope.account.question2.entity).then(function(response) {
                    $scope.secretQuestionEmailSaveSuccesful = true;
                    deferred.resolve(response);
                });
    		} else {
                deferred.reject();
            }
            return deferred.promise;
    	};
    	
    	/**
    	 * When the save button is clicked. Check if the user
    	 * selected 2 same questions or not
    	 */
    	$scope.onChange= function(){
    		if(angular.equals($scope.account.question1.entity.secretQuestion, $scope.account.question2.entity.secretQuestion) &&
    	       !(angular.isUndefined($scope.account.question1.entity.secretQuestion))){
    	    	$scope.loginInterruptForm.secretQuestion2.$setValidity('duplicated', false);
    	    }
    	    else{
    	    	$scope.loginInterruptForm.secretQuestion2.$setValidity('duplicated', true);
    	    }
    	};

       function init(){
                       
    		SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content; 
       		});
          	
          	$scope.account.question1 = SecretQuestionService.createNewResponse();
          	$scope.account.question2 = SecretQuestionService.createNewResponse();
        }
        
        init();
            
        }
    ])
;

