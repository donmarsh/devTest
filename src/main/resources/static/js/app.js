(function(){

  var app = angular.module('notesApp',['ngRoute', 'ngMaterial']);
  
  app.config(['$locationProvider', '$routeProvider',
      function ($locationProvider, $routeProvider) {

        $routeProvider
          .when('/', {
            templateUrl: '/partials/notes-view.html',
            controller: 'notesController'
          })
          .when('/login', {
             templateUrl: '/partials/login.html',
             controller: 'loginController',
          })
          .otherwise('/');
      }
  ]);

  app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
      $rootScope.$on('$routeChangeStart', function (event) {

          if ($location.path() == "/login"){
             return;
          }

          if (!AuthService.isLoggedIn()) {
              console.log('DENY');
              event.preventDefault();
              $location.path('/login');
          }
      });
      $rootScope.loggedIn = false;
      $rootScope.logout = function(){
          console.log("logging out");
          $rootScope.loggedIn = false;
          $location.path("/login");
          AuthService.logOut();
      }
  }]);


  app.service('AuthService',  function($http){
        var loggedUser = null;

        function login (username, password){
            return $http.post("api/login", {username: username, password: password}).then(function(user){
                loggedUser = user;
            }, function(error){
                loggedUser = null;
                console.log("error login");
            })
        }
        function logOut(){
            loggedUser = null;
        }
        function isLoggedIn(){
            return loggedUser != null;
        }
        return {
            login : login,
            isLoggedIn: isLoggedIn
        }
        
  });

  app.controller('loginController', function($scope,$rootScope, AuthService, $location){

    $scope.invalidCreds = false;
    $scope.login = {
        username : null,
        password : null
    };
   
    $scope.login = function(){
        $scope.invalidCreds = false;
        AuthService.login($scope.login.username, $scope.login.password).then(function(user){
            console.log(user);
            $rootScope.loggedIn = true;
            console.log($rootScope);
            $location.path("/");
        }, function(error){
            console.log(error);
            $scope.invalidCreds = true;
        });
        if(!AuthService.isLoggedIn())
        {
            $scope.invalidCreds = true;
        }
    };
  });


  app.controller('notesController', function($scope,$location,$http){

    $scope.isEditCreateView = false;
    $scope.notes = [];
    $scope.note = {};
    
    _refreshNotes();
    $scope.newNoteView = function(){
        $scope.note = {};
        $scope.isEditCreateView = true;
    };
   
    $scope.editNote = function(){
        var method = "";
        if($scope.note.id===undefined)
        {
            method = 'POST';
            $scope.note.creationDate = new Date().toISOString().slice(0, 10);
        }
        else
        {
            method = 'PUT';
        }
        $http({
            method: method,
            url: '/notes',
            data: angular.toJson($scope.note),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(_success, _error);
    }
    
    $scope.clearNote = function () {
        _clearNote()

    }
    $scope.deleteNote = function () {
      var r = confirm("Are you sure you want to delete this note?");
      if (r == true){
        $http({
            method: 'DELETE',
            url: '/notes/' + $scope.note.id
        }).then(_success, _error);
      }
    };
    function _refreshNotes() {
        $scope.notes = [];
        $http({
            method: 'GET',
            url: '/notes'
        }).then(
            function(res) { // success
                $scope.notes = res.data;
            },
            function(res) { // error
                console.log("Error: " + res.status + " : " + res.data);
            }
        );
    }
    function _success(res) {
        _refreshNotes();
        _clearNote();
    }
    function _error(res){
        var data = res.data;
        var status = res.status;
        var header = res.header;
        var config = res.config;
        alert("Error: " + status + ":" + data);
    }
    function _clearNote() {
        $scope.note = {};
        $scope.isEditCreateView = false; 
    };
    $scope.viewNote = function(note){
        $scope.note = note;
        $scope.isEditCreateView = true;
    }
  });

})();