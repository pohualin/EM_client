'use strict';

angular.module('emmiManager')
.service('ErrorMessageTranslateService', ['$q', '$translate',
        function ($q, $translate) {
            return {
            	/**
            	 * Get lock error messages from database
            	 */
            	getLockErrorMessages: function() {
    				var deferred = $q.defer();
    		        var promises = [];
    		        var ERROR_MESSAGE = [];
    		        $translate('global.messages.error.lockPart1').then(function(translated){
    		        	ERROR_MESSAGE.LOCK_PART_1 = translated;
    		            deferred.resolve(ERROR_MESSAGE);
    		        });
    		        promises.push(deferred.promise);
    		        $translate('global.messages.error.lockPart2').then(function(translated){
    		        	ERROR_MESSAGE.LOCK_PART_2 = translated;
    		            deferred.resolve(ERROR_MESSAGE);
    		        });
    		        promises.push(deferred.promise);
    		        $translate('global.messages.error.lockExpired').then(function(translated){
    		        	ERROR_MESSAGE.LOCK_EXPIRED = translated;
    		            deferred.resolve(ERROR_MESSAGE);
    		        });
    		        promises.push(deferred.promise);
    		        
    		        $q.all(promises).then(function(){
    		        	deferred.resolve(ERROR_MESSAGE);
    		        });
    		        return deferred.promise;
    			}            
            };
        }
    ]);