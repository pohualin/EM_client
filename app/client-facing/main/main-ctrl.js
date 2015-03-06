'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$locale', '$alert', '$compile', 'tmhDynamicLocale', 'account', 'arrays', 'moment', 'MainService',
        function ($scope, $translate, $locale, $alert, $compile, tmhDynamicLocale, account, arrays, moment, MainService) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };
        
        $scope.dismiss = function(){
            console.log('dismiss');
        };
        
        $scope.dostuff = function() {
            $compile('Try it')($scope);
        };
        
        function init(){
            if (account && account.clientResource) {
                $scope.page.setTitle(account.clientResource.entity.name + ' Home');
                $scope.passwordExpiresInDays = 
                    MainService.getPasswordExpiresInDays(account.passwordExpirationTime);
                MainService.loadPolicy(account.clientResource).then(function (response){
                    $scope.content = $scope.dostuff();
                    if ($scope.passwordExpiresInDays >= response.data.passwordExpirationDaysReminder) {
                        var alert = $alert({
                            content: 'Your password will expire in ' +$scope.passwordExpiresInDays+ ' day(s). <a data-ng-click="dismiss()">change password</a>',
                            type: 'warning',
                            placement: 'top',
                            show: true,
                            dismissable: true
                        });
                        window.paul = alert;
                    }
                });
            }
        }

        init();
    }])
;
