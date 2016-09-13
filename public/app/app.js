angular.module('app', [])

 .controller('MainController', function($scope, Main){
  $scope.data = {flights: []};
  $scope.filterLocation = function(flight){
    var city = flight.city.toLowerCase();
    var country = flight.country.toLowerCase();
    city = city.concat(flight.city);
    country = country.concat(flight.country);
    return city.indexOf($scope.searchCriteria) > -1 || country.indexOf($scope.searchCriteria) > -1;
  }
  $scope.getData = function(){
    $scope.dataLoading = true;
    $scope.noResults = false;
    Main.retrieve($scope.leaveDate, $scope.returnDate, $scope.anytime,$scope.airport)
    .then(function(response){
      if(response === "error"){
        $scope.noResults = true;
        return;
      }
      $scope.data.flights = [];
      $scope.dataLoading=false;
      for(var i = 0;i < response.data.Quotes.length;i++){
        var price = response.data.Quotes[i].MinPrice;
        var destinationId = response.data.Quotes[i].OutboundLeg.DestinationId;
        var places = response.data.Places;
        if(price <= $scope.budget){
          // console.log(response.data.Quotes[i]);
          for(var j = 0; j< places.length;j++){
            if(places[j].PlaceId === destinationId){
              var cityName = response.data.Places[j].CityName;
              var countryName = response.data.Places[j].CountryName;
            }
          }
        $scope.data.flights.push({price: price, city: cityName, country: countryName});
        }
      }
      $scope.noResults = $scope.data.flights.length === 0 ? true: false;
    });

  }
})

.factory('Main', function($http){
  var retrieve = function(leaveDate, returnDate, anytime, airport){
    console.log("retrieving data");
    return $http.get('/skyscanner',{params:{"leave": leaveDate, "return": returnDate, "anytime": anytime, "airport":airport}});
  }

  return {
    retrieve: retrieve
  };
})
