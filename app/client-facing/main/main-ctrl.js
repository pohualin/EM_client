'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$locale', 'tmhDynamicLocale', 'account', 'arrays', 'moment', 'CredentialsExpiredService',
        function ($scope, $translate, $locale, tmhDynamicLocale, account, arrays, moment, CredentialsExpiredService) {
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
                CredentialsExpiredService.loadPolicy(account.clientResource).then(function (response){
                    $scope.policy = response.data;
                    var passwordExpirationMoment = moment(account.passwordExpirationTime);
                    var now = moment(new Date());
                    $scope.passwordExpiresInDays = passwordExpirationMoment.diff(now, 'days');
                });
            }
            window.paul = $scope;
        }

        init();
    }])
;
