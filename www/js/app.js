// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'RESTConnection', 'TKServicesModule', 'chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'templates/landing.html',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })
    .state('lobby', {
      url: '/lobby',
      templateUrl: 'templates/lobby.html',
      controller: 'LobbyCtrl'
    })
    .state('test', {
      abstract: true,
      url: '/test',
      template: '<ion-nav-view></ion-nav-view>'
    })
    .state('test.detail', {
      url: '/question:testID',
      templateUrl: 'templates/question.html',
      controller: 'TestCtrl',
      resolve: {
        testInfo: function($stateParams, TKQuestionsService) {
          return TKQuestionsService.getQuestion($stateParams.testID);
        }
      }
    })
    .state('results', {
      url: '/results',
      templateUrl: 'templates/results.html',
      controller: 'ResultsCtrl'
    });
});
