'use strict';

var app = angular.module('Notebox', ['ui.bootstrap']);

/*
* Use the Masonry Library to handle the grid layout
*/
app.directive('masonry', function() {
  return {
    restrict: 'AC',
    controller: function($scope) {
      return $scope.$watch(function(e) {
        $scope.masonry.reloadItems();
        return $scope.masonry.layout();
      });
    },
    link: function(scope, elem, attrs) {
      var container=elem[0];
      var options='';
      return scope.masonry = new Masonry(container,options);
    }
  };
  
});

app.controller("AppController", function($rootScope ,$scope, $timeout, $location, $sce, $modal) {
  // set the background image
  var random = Math.floor((Math.random() * 13) + 1);
  $scope.bgcol = "#ABCFC7 url('../images/bg" + random.toString() + ".jpg') center center fixed no-repeat";
    
	$scope.notes = true;

	$scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function () {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    $scope.openApps = function() {
    	chrome.tabs.update({
            url:'chrome://apps'
        });
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);

	// get all the current notes
	chrome.runtime.sendMessage({appRequest: "notes"}, function(response) {
	  $scope.notes = response.allNotes;

	  $scope.$apply();
	});

	// we need to put a watch on any incoming notes
	window.addEventListener("storage", displayStorageEvent, true);

	function displayStorageEvent(e) {
	    if (e.key == 'notebox') {
	        $scope.notes = JSON.parse(e.newValue);
	        $scope.$apply();
	    }
	};

	$scope.removeNote = function(index) {
		// remove from scope
		$scope.notes.splice(index, 1);
		$scope.$apply();
		// remove from local storage
		localStorage.setItem("notebox", JSON.stringify($scope.notes));
	};

  $scope.clear = function() {
    if (angular.element(document.getElementsByClassName("slideout")).hasClass("slide-left")) {
      angular.element(document.getElementsByClassName("slideout")).removeClass("slide-left");
    };
  };

	$scope.modalShown = false;
	$scope.expandText = function(note) {
		$scope.modalcontent = note.text;
    $scope.title = note.title;
    $scope.url = note.url;
		$scope.modalShown = true;
    angular.element(document.getElementsByClassName("slideout")).addClass("slide-left");
	};

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.addNote = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'addNoteContent.html',
      controller: ModalInstanceCtrl,
      size: size
    });

    modalInstance.result.then(function (res) {
      // add the note
      var clippedData = {},
        storedItems;
      clippedData["text"] = res.notecontent;
      clippedData["type"] = "text";
      clippedData["url"] = "";
      clippedData["title"] = res.notetitle;

      // get localstorage
      if (localStorage.getItem("notebox")) {
        storedItems = JSON.parse(localStorage.getItem("notebox"));
      }

      if (!storedItems) {
        storedItems = [clippedData];
      } else {
        storedItems.push(clippedData);
      }

      localStorage.setItem("notebox", JSON.stringify(storedItems));

      // get all the current notes
      chrome.runtime.sendMessage({appRequest: "notes"}, function(response) {
        $scope.notes = response.allNotes;

        $scope.$apply();
      });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

});

var ModalInstanceCtrl = function ($scope, $modalInstance) {
  $scope.ok = function (notetitle, notecontent) {
    $modalInstance.close({notetitle: notetitle, notecontent: notecontent});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

/*
* Filter to limit the string to 250 characters
*/
app.filter('trimstring', function($filter) {
    return function(input) {
    	if (input.length < 250) {
    		return input;
    	} else {
    		return $filter('limitTo')(input, 250) + '...';
    	}
    };
  });


