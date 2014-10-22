console.log('bootstrapping');
var currentProjectID;

// Listen for any changes to the URL of any tab.
// see: http://developer.chrome.com/extensions/tabs.html#event-onUpdated
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
  console.log('tab updated');
  // decide if we're ready to inject content script
  if (tab.status !== "complete"){
    return;
  } else if(tab.url.toLowerCase().indexOf("app.asana.com") >= 0){
    console.log('on Asana');
    if(tab.url.indexOf(currentProjectID) === -1){
      currentProjectID = tab.url.slice(tab.url.indexOf('/0/')+3).split('/')[0];
      console.log('new project',currentProjectID,'loaded.');
      
      chrome.pageAction.show(tab.id);

      // inject the content script onto the page
      chrome.tabs.executeScript(null, {"file": "foldAsana.js"});
    }
  } 
});
