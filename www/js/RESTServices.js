angular.module('RESTConnection', [])
.constant('ENDPOINT_URL', 'https://strongloop-backend-jcalleja.c9users.io/api/')  
.service('UserService', ['$http', 'ENDPOINT_URL',
function ($http, ENDPOINT_URL) {
var service = this,
path = 'SSFUsers/';
function getUrl() {
  return ENDPOINT_URL + path;
}
service.create = function (user) {
  return $http.post(getUrl(), user);
};
service.login = function(user) {
  return $http.post(getUrl()+"login",user);
};
}]);
