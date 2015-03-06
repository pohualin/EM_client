'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$rootScope', '$scope', '$translate', '$locale', '$alert', '$compile', 'tmhDynamicLocale', 'account', 'arrays', 'moment', 'MainService',
        function ($rootScope, $scope, $translate, $locale, $alert, $compile, tmhDynamicLocale, account, arrays, moment, MainService) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };
        
        function init(){
            if (account && account.clientResource) {
                $scope.page.setTitle(account.clientResource.entity.name + ' Home');
                angular.extend($scope.account, account);
                $scope.passwordExpiresInDays = 
                    MainService.getPasswordExpiresInDays(account.passwordExpirationTime);
                MainService.loadPolicy(account.clientResource).then(function (response){
                    if ($scope.passwordExpiresInDays <= response.data.passwordExpirationDaysReminder) {
                        $rootScope.alert = $alert({
                            content: 'Your password will expire in ' +$scope.passwordExpiresInDays+ ' day(s). <a href="#/change_password">change password</a>',
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
