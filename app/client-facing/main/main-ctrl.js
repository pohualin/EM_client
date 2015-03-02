'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$locale', 'tmhDynamicLocale', 'account', 'arrays', 'CredentialsExpiredService',
        function ($scope, $translate, $locale, tmhDynamicLocale, account, arrays, CredentialsExpiredService) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };
        
        function init(){
            if (account && account.clientResource) {
                $scope.page.setTitle(account.clientResource.entity.name + ' Home');
                account.clientResource.link = arrays.convertToObject('rel', 'href',
                        account.clientResource.link);
            }
            
            CredentialsExpiredService.loadPolicy(account.clientResource).then(function (response){
                $scope.policy = response.data;
            });
            
            window.paul = $scope;
        }

        init();
    }])
;
