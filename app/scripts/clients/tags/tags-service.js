'use strict';
angular.module('emmiManager')
    .service('Tag', function ($http, $q, Session, UriTemplate) {
        return {
        	 insertGroups: function (clientResource) {
             	if (clientResource){
             	var translatedGroups = [];
             		angular.forEach(clientResource.tagGroups, function(group){
                     	var groupToInsert = {};
             			groupToInsert.name = group.title;
             			group.group = groupToInsert;
             			group.tags = group.tags;
             			angular.forEach(group.tags, function(t){
             				t.name = t.text;
             			});
             			translatedGroups.push(group);
             		});
                     return $http.post(UriTemplate.create(Session.link.groupsByClientID).stringify({
                     		clientId: clientResource.id
                     	}), translatedGroups).then(function (response) {
                     		return null;
                         });
             	}
             },
             loadGroups: function(clientResource){
            	if(clientResource.entity.id){
	          		clientResource.tagGroups = [];
	             	return $http.get(UriTemplate.create(Session.link.groupsByClientID).stringify({clientId:clientResource.entity.id})).then(function load(response){
	             		
	             		var page = response.data;
	             		angular.forEach(page.content, function(group){
	             			group.entity.title = group.entity.name;
	             			group.entity.tags = group.entity.tag;
	             			angular.forEach(group.entity.tags, function(tag){
	             				tag.text = tag.name;
	             			});
	             			clientResource.tagGroups.push(group.entity);
	             		});
	             		
	             		if (page.link && page.link['page-next']) {
	             				$http.get(page.link['page-next']).then(function(response){
	             				load(response);
	             			});
	             		}
	              	});
            	}
             },
             loadReferenceData: function(){
            	 var responseArray = [];
            	 return $http.get(UriTemplate.create(Session.link.refDataGroups).stringify()).then(function iterateRefGroupPage(response) {
            		 angular.forEach(response.data.content, function (group){
            			 group.title = group.entity.name;
            			 group.tags = group.entity.tag ;
	             			angular.forEach(group.entity.tag, function(tag){
	             				tag.text = tag.name;
	             			});
	             			responseArray.push(group);
	             		});
            		 
            		 if (response.data.link && response.data.link['page-next']) {
          				$http.get(response.data.link['page-next']).then(function(response){
          					iterateRefGroupPage(response);
          				});
            		 } 
              		return responseArray;
                  });
             }
        };
    })
;
