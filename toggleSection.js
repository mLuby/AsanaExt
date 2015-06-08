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
  style.sheet.addRule('.bar::before',   "content: '▼'; color: black; position: relative; top: 6px; left: 10px;");
  style.sheet.addRule('.bar-collapsed::before', "content: '▶'; color: red; position: relative; top: 6px; left: 10px;");

  // get bar-rows
  var bars = document.querySelectorAll('.bar-row');
  // for each bar-row, add on click listener
  for (var i = 0; i < bars.length; i++) {
    // on clicking a bar-row
    bars[i].addEventListener('click', toggleSubsequentTasks);
    bars[i].classList.add('bar-uncollapsed');
    console.log('Added event listener to pre-loaded bar.');
  }
  function toggleSubsequentTasks(){
    // iterate through tasks
    var clickedElement = this;
    console.log('clicked this:', clickedElement);
    var rows = document.querySelectorAll('table#grid>tbody>tr');
    var reachedSection = false;
    var hiding;

    for(var i=0; i<rows.length-1; i++){ // -1 ignores final 'add another task' psuedo-task.
      if(reachedSection && rows[i].classList.contains('bar-row')){
        reachedSection = false;
      }
      if(reachedSection){
        hiding ? rows[i].style['display'] = 'none' : rows[i].setAttribute('style','');
      }
      if(clickedElement === rows[i]){
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
};
