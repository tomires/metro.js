angular.module('metro').controller('DijkstraController', ['$http','$window', function($http,$window){
  var metro = this;
  this.nodes = [];
  this.source = 0;
  this.target = 0;
  this.distance = 0;
  $http.get('json/metro.json').success(function(data){
    metro.nodes = data;
  });

  this.go = function(source, target){
    distances = [];
    previous = [];
    visited = []; // true or false

    for(n in metro.nodes){
      distances[n] = 99999;
      previous[n] = -1;
      visited[n] = false;
    }

    distances[source] = 0;

    while (true){
      var min_dist = 99999;
      var curr_node = -1;

      for(n in metro.nodes){
        if(min_dist > distances[n] && !visited[n]){
          min_dist = distances[n];
          curr_node = n;
        }
      }

      if(curr_node == target){
        break;
      }

      visited[curr_node] = true;
      for(e in metro.nodes[curr_node].edges){
        var to = metro.nodes[curr_node].edges[e].to;
        var alt = distances[curr_node] + Number(metro.nodes[curr_node].edges[e].cost);
        if(alt < distances[to]){
          distances[to] = alt;
          previous[to] = curr_node;
        }
      }

    }

    var display = []; // display nodes
    var displayedges = []; // display edges;

    for(n in metro.nodes){
      display[n] = false;
    }

    var curr_node = target;
    this.distance = distances[curr_node];
    while(true){
      display[curr_node] = true;
      for(e in metro.nodes[curr_node].edges){
        if(Number(metro.nodes[curr_node].edges[e].to) == previous[curr_node]){
          displayedges.push(metro.nodes[curr_node].edges[e].via);
        }
      }
      if(curr_node == source){
        break;
      }
      curr_node = previous[curr_node];
    }

    for(n in metro.nodes){
      if(!display[n]){
        $window.document.getElementById("svg").getSVGDocument().getElementById(n).style.setProperty("fill","gray", "");
      }
      for(e in metro.nodes[n].edges){
        var line = metro.nodes[n].edges[e].via;
        var found = false;
        for(d in displayedges){
          if(displayedges[d] == line){
            found = true;
          }
        }
        if(!found){
          $window.document.getElementById("svg").getSVGDocument().getElementById(line).style.setProperty("stroke","gray", "");
        }
      }
    }
  }

  this.test = function(){
    for(n in metro.nodes){
      var node_id = metro.nodes[n].node;
      $window.document.getElementById("svg").getSVGDocument().getElementById(node_id).style.setProperty("stroke","hotpink", "");
      for(e in metro.nodes[n].edges){
        var edge_id = metro.nodes[n].edges[e].via;
        $window.document.getElementById("svg").getSVGDocument().getElementById(edge_id).style.setProperty("stroke","hotpink", "");
      }
    }
  }

}]);
