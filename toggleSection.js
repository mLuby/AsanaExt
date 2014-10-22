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

  // get bar-rows
  var bars = document.querySelectorAll('.bar-row');
  // for each bar-row, add on click listener
  for (var i = 0; i < bars.length; i++) {
    // on clicking a bar-row
    bars[i].addEventListener('click', toggleSubsequentTasks);
    console.log('Added event listener to pre-loaded bar.');
  }
  function toggleSubsequentTasks(){
    // iterate through tasks
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
      if(this === rows[i]){
        reachedSection = true;
        // toggle hiding
        this.hasAttribute('hiding') ? this.removeAttribute('hiding') : this.setAttribute('hiding', true);
        var hiding = this.hasAttribute('hiding');
        if(hiding){
          this.querySelector('.grid-cell').setAttribute('style','border-left: 5px solid black;');
        } else {
          this.querySelector('.grid-cell').setAttribute('style','');        
        }
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