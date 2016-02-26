angular.module('RESTConnection', [])
  .constant('ENDPOINT_URL', 'https://strongloop-backend-jcalleja.c9users.io/api/')
  .service('UserService', ['$http', 'ENDPOINT_URL',
    function($http, ENDPOINT_URL) {
      var service = this,
        path = 'SSFUsers/';

      function getUrl() {
        return ENDPOINT_URL + path;
      }
      service.create = function(user) {
        return $http.post(getUrl(), user);
      };
      service.login = function(user) {
        return $http.post(getUrl() + "login", user);
      };
      service.logout = function(token) {
        return $http({
          url: getUrl() + "logout",
          method: "POST",
          headers: {
            'Authorization': token
          }
        });
      };
    }
  ])
  .service('ServerQuestionService', ['$http', 'ENDPOINT_URL',
    function($http, ENDPOINT_URL) {
      var service = this,
        path = 'Questions/';

      function getUrl() {
        return ENDPOINT_URL + path;
      }
      service.all = function(token) {
        return $http.get(getUrl(), {
          params: {
            access_token: token
          }
        });
      };
    }
  ])
  .service('ServerAnswersService', ['$http', 'ENDPOINT_URL', function($http, ENDPOINT_URL) {
    var service = this,
      path = 'TestResults/';

    function getUrl() {
      return ENDPOINT_URL + path;
    }

    service.create = function(answer, token) {
      return $http({
        url: getUrl(),
        method: "POST",
        data: JSON.stringify(answer),
        headers: {
          'Authorization': token
        }
      });
    };

    service.all = function(userID, token) {
      return $http.get(getUrl() + "?filter[where][userID]=" + userID, {
        params: {
          access_token: token
        }
      });
    };
  }]);