'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$locale', 'tmhDynamicLocale', 'account', 'SecretQuestionService',
        function ($scope, $translate, $locale, tmhDynamicLocale, account, SecretQuestionService) {
        $scope.today = new Date();
        $scope.isSecretQuestion = false;
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };

        if (account && account.clientResource) {
            $scope.page.setTitle(account.clientResource.entity.name + ' Home');
			angular.extend($scope.account, account);
        }
        
        if($scope.authenticated){
        	SecretQuestionService.getAllUserSecretQuestionResponse().then(function(response) {
        		if(response.data.content.length === 2){
        			$scope.isSecretQuestion = true;
        		}
        	}); 
        }
    }])
;
