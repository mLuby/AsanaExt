var zeroWidthSpace = '​' // a zero width space is between these: >​<

var hiddenTasks = [];

var checkIfDOMLoadedInterval;
checkIfDOMLoadedInterval = setInterval(checkIfDOMLoaded, 250);
function checkIfDOMLoaded(){
  if(document.querySelectorAll('.bar-row').length > 0){
    clearInterval(checkIfDOMLoadedInterval);
    onDOMLoaded();
  }
};

function onDOMLoaded(){
  console.clear();
  console.log('Tasks loaded');

  // add new style sheet
  var style = document.createElement('style');
  document.head.appendChild(style);
  // add bar-collapsed, bar-uncollapsed CSS classes
  style.sheet.addRule('.bar::before',   "content: '▼'; color: #AAA; position: relative; top: 5px; left: 11px;");
  style.sheet.addRule('.bar-collapsed::before', "content: '▶'; color: #AAA; position: relative; top: 5px; left: 11px; font-size: 10px;");
  style.sheet.addRule('.row-hiding', "display: none;");

  // get bar-rows
  var bars = document.querySelectorAll('.bar-row');
  // for each bar-row, add on click listener
  for (var i = 0; i < bars.length; i++) {
    // on clicking a bar-row
    var bar = bars[i];
    bar.addEventListener('click', toggleSubsequentTasks);
    console.log('Added event listener to pre-loaded bar.');
  }
  function toggleSubsequentTasks(){
    // iterate through tasks
    var clickedElement = this;
    var rows = document.querySelectorAll('table#grid>tbody>tr');
    var reachedSection = false;

    for(var i=0; i<rows.length-1; i++){ // -1 ignores final 'add another task' psuedo-task.
      var row = rows[i];

      if(reachedSection && row.classList.contains('bar-row')){
        reachedSection = false;
      }
      if(reachedSection){
        row.classList.toggle('row-hiding');

        var index = hiddenTasks.indexOf(row)
        if(~index){
          hiddenTasks.splice(index, 1); // remove element from array
          row.classList.remove('row-hiding'); // stop hiding
        } else {
          hiddenTasks.push(row); // add element to array
        }

        hideElements(hiddenTasks);
      }

      if(clickedElement === row){
        reachedSection = true;
        // toggle hiding
        var togglingBar = clickedElement.querySelector('.bar');
        console.log('togglingBar:',togglingBar);
        togglingBar.classList.toggle('bar-collapsed');
      }
    }
  }

  // Asana loads tasks on scroll, so dynamically add the event listener to them.
  // select the node on which to listen for mutations
  var target = document.querySelector('table#grid>tbody');

  // create an observer instance
  var observer = new MutationObserver(function(mutations) {
    hideElements(hiddenTasks); // always rehide hidden tasks when DOM mutates.

    mutations
      .map(function(mutation) {
        if(typeof mutation.addedNodes[0] === 'object'){
          return mutation.addedNodes[0];
        } else{
          return '';
        }
      })
      .filter(function(element){ return typeof element === 'object'; })
      .filter(function(element){ return element.classList.contains('bar-row'); })
      .forEach(function(element){ console.log('Added event listener to dynamically-loaded bar.'); element.addEventListener('click', toggleSubsequentTasks); });
  });

  // configuration of the observer:
  var config = { attributes: true, childList: true, characterData: true };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);

  function hideElements(elements){
    elements.forEach(function(element){
      x.classList.add('row-hiding');
    });
  }
};
