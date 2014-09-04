'use strict';
angular.module('emmiManager')
    .service('Tag', function ($http, $q, Session, UriTemplate, Client) {
        return {
        	 insertTags: function (clientResource) {
             	if (clientResource){
             	var translatedGroups = [];
             		angular.forEach(clientResource, function(group){
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
                     		clientId: Client.getClient().entity.id
                     	}), translatedGroups).then(function (response) {
                     		return null;
                         });
             	}
             },
             loadGroups: function(){
             	var client = Client.getClient();
             	return $http.get(UriTemplate.create(Session.link.groupsByClientID).stringify({clientId:client.entity.id})).then(function(response){
             		client.tagGroups = [];
             		angular.forEach(response.data.content, function(group){
             			group.entity.title = group.entity.name;
             			group.entity.tags = group.entity.tag;
             			angular.forEach(group.entity.tags, function(tag){
             				tag.text = tag.name;
             			});
             			client.tagGroups.push(group.entity);
             			
             		});
             		return response.data;
             	});
             }
        };

    })
;
