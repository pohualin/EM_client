'use strict';

angular.module('emmiManager')
      	.controller('MainCtrl', ['$rootScope', '$scope', '$translate', '$locale', '$alert', '$compile', 'tmhDynamicLocale', 'account', 'arrays', 'moment', 'MainService', 'SecretQuestionService',
    	     function ($rootScope, $scope, $translate, $locale, $alert, $compile, tmhDynamicLocale, account, arrays, moment, MainService, SecretQuestionService ) {
        $scope.today = new Date();
        $scope.isSecretQuestion = false;
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };
        
        
        if($scope.authenticated){
        	SecretQuestionService.getAllUserSecretQuestionAsteriskResponse($scope.account.id).then(function(response) {
        		if(response.data.content.length === 2){
        			console.log($scope.account.id);
        			$scope.isSecretQuestion = true;
        		}
        	}); 
        }
        
        function init(){
            if (account && account.clientResource) {
                $scope.page.setTitle(account.clientResource.entity.name + ' Home');
                angular.extend($scope.account, account);
                $scope.passwordExpiresInDays = 
                    MainService.getPasswordExpiresInDays(account.passwordExpirationTime);
                MainService.loadPolicy(account.clientResource).then(function (response){
                    if ($scope.passwordExpiresInDays <= response.data.passwordExpirationDaysReminder) {
                        $alert({
                            content: 'Your password will expire in ' +$scope.passwordExpiresInDays+ ' days.',
                            template: 'client-facing/main/password-reminder-alert.tpl.html',
                            type: 'warning',
                            placement: 'top',
                            show: true,
                            dismissable: true
                        });
                    }
                });
            }
        }

        init();
    }])
;
