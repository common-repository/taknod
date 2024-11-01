var app = angular.module('taknodeApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main.tpl',
    controller: 'main'
  }).otherwise({redirectTo:'/'});
}]);

app.controller('main', ['$scope','$http','$window','$timeout',function($scope,$http,$window,$timeout){
    var s    = $scope;
    s.setPrice = function(pr,proId){
        s.finalPrice = null ;
        s.price=pr;
        s.year = null;
        s.perUser = null;
        s.pr.product = proId ;
    };
    s.setYear = function(type){
        
        s.finalPrice = null ;
        s.year = s.price[type];
        s.perUser = null ;
        s.pr.type = type ;
        s.pr.year = null ;
    };
    s.setPerUser = function(per,year) {
        
        
        s.finalPrice = null ;
        s.prFin = null ;
        s.perUser = per.perUser ;
        s.pr.year = year;
    };
    s.calcPrice = function(p){
        s.finalPrice =Math.round( (s.plan.dollarPrice * p.price) * (1+(s.plan.profit / 100)) ) / 10;
        s.pr.quantity = p.count;
        s.pr.amount = p.price ;
        s.prFin = p ;
        
    };

    s.esLicReq = function() {
        $http.post(s.plan.apiUrl+'/esLicRequest', s.pr,{headers:{'Content-Type': undefined}}).then(function(resp) {
            resp.data.error === 0 ? 
                ($window.location.href=s.plan.apiUrl+"/esGetLic/"+resp.data.licReqCode) :
                alert('error code : '+resp.data.error);
        },function() {
            alert('خطا در اتصال به سرور. لطفا بعد از چند دقیقه مجددا تلاش فرمایید.');
        });

    };
    s.init = function() {
        $timeout(function() {
            angular.forEach(s.plan.price,function(pro,key) {
                
                angular.forEach(pro,function(p,pKey) {
                    if (pKey == 'ENAHE') {
                       s.setPrice(p.price,pKey);
                       s.setYear('new');
                       angular.forEach(s.year,function(yPer,yKey) {
                            if (yKey==1) {
                                s.setPerUser(yPer,yKey);
                                s.calcPrice(yPer.perUser[0]);
                            }
                       });
                    }
                });
            });
        },100);
    };

    s.init();
}]);

app.factory('object', function() {
    return null;
});