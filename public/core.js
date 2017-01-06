var scotchTodo = angular.module('scotchTodo',[]);

// controller!
function mainController($scope, $http) {
  $scope.formData={};
  // 페이지에 랜딩하면 todo를 띄워줘야지!
  $http.get('/api/todos')
    .success(function(data){
      $scope.todos= data;
      console.log(data);
    });
    .error(function(data){
      console.log('ERROR: '+data);
    });
  //만들자 todo
  $scope.createTodo= function(){
    $http.post('/api/todos',$scope.formData)
      .success(function(data){
        $scope.formData={}; // clear the form data;
        $scope.todos = data;
        console.log(data);
      });
      .error(function(data){
        console.log('ERROR: '+data);
      });

  };
  //todo를 주깁시다
  $scope.deleteTodo = function(id){
    $http.delete('/api/todos/'+id)
      .success(function(data){
        $scope.todos = data;
        console.log(data);
      });
      .error(function(data){
        console.log('ERROR: '+data);
      });
  };
};
