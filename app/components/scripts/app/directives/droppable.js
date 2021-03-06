var droppable = angular.module('droppable', []);

droppable.directive('droppable', function() {
    return {
        scope: {
          drop: '&', // parent
          bin: '=' // bi-directional scope
        },
        link: function(scope, element) {
            // again we need the native object
          var el = element[0];
          el.addEventListener('dragover', function(e) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              if (e.preventDefault) e.preventDefault();
              this.classList.add('over');
              return false;
            },
            false
          );
          el.addEventListener(
              'dragenter',
              function(e) {
                  this.classList.add('over');
                  return false;
              },
              false
          );
          el.addEventListener(
              'dragleave',
              function(e) {
                  this.classList.remove('over');
                  return false;
              },
              false
          );
          el.addEventListener(
              'drop',
              function(e) {
                  var binId = this.id;
                  var item = document.getElementById(e.dataTransfer.getData('Text'));
                  this.appendChild(item);
                  // call the passed drop function
                  scope.$apply(function(scope) {
                      var fn = scope.drop();
                      if ('undefined' !== typeof fn) {
                        fn(item.id, binId);
                      }
                  });
              },
              false
          );
        }
    }
});