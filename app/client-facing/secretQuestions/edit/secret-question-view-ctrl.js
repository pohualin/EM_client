'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionViewController', ['$scope', '$location', 'SecretQuestionService', 
        function ($scope, $location, SecretQuestionService) { 	
    	
       $scope.secretQuestionFormSubmitted = false;
             
       $scope.editSecretQuestion = function () {
    	   $location.path('/editSecretQuestions').replace();
        };
  
       function init(){
   
          	SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content; 
       		});
          	
        	SecretQuestionService.getAllUserSecretQuestionAsteriskResponse().then(function(response) {
            
        	var existingResponse = response.data.content;
            $scope.question1Original = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
            $scope.question1 = angular.copy($scope.question1Original);
                        	
            $scope.question2Original =  existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
            $scope.question2 = angular.copy($scope.question2Original);
        	}); 
        }
        
       init();
            
        }
    ])
;
