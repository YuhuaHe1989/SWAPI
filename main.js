var app = angular.module("swapi", []);

//swapi-planets-selector
app.directive("swapiPlanetsSelector", function() {
  return {
    restrict: 'E',
    scope: {
      minresidents: '@'
    },
    templateUrl: function() {
      return 'planetselect.html';
    },
    controller: function($scope, $rootScope, $http) {
      var allPlanets = [];
      for(var i = 1;i < 8;i++){
        $http({
          method: 'GET',
          url: 'http://swapi.co/api/planets/?format=json&page=' + i,
        }).then(function successCallback(resp) {
          var stuff = resp.data.results
          stuff.forEach(function(e) {
            allPlanets.push(e);
          })
          if(i === 8){
            $scope.planets = allPlanets;
            $scope.planetsFiltered = $scope.planets.filter(function(planet) {
              if(planet.residents.length >= $scope.minresidents) return planet;
            });
          }
        },function errorCallback(err) {
          $scope.errorMessage = "Data Fetch failed";
        });
      }

        $scope.addPlanet = function(i) {
         $scope.addname = $scope.planetsFiltered[i].name;

         var residentsOfPlanets = [];
         $scope.planetsFiltered[i].residents.forEach(function(residentUrl) {
           $http({
              method: 'GET',
              url: residentUrl,
            }).then(function successCallback(resp) {
               residentsOfPlanets.push(resp.data);
               if (residentsOfPlanets.length === $scope.planetsFiltered[i].residents.length) {
                  $rootScope.$broadcast('CHANGE', residentsOfPlanets);
               }
            },function errorCallback(err) {

            });

         })
        }
    }
  }
});

//swapi-residents directive
app.directive("swapiResident", function() {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: function() {
      return 'residents.html';
    },

    controller: function($scope, $http) {
       $scope.$on('CHANGE', function(a, residentsRecived){
        console.log('get', residentsRecived);
        $scope.residents = residentsRecived;
      });
    }
  }
});
