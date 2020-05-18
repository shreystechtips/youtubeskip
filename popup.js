function pressed() {
  console.log(document.getElementById("submit").value);
  if (
    (document.getElementById("submit").value === "Submit!" &&
      document.getElementById("tssec").value > 0) ||
    document.getElementById("tsmin").value > 0
  ) {
    console.log("hi!");
    document.getElementById("submit").value === "Submitting...";
    const time = Number(
      document.getElementById("tsmin").value * 60 +
        document.getElementById("tssec").value
    );
    overwriteMain(id, time);
    return false;
  }

  function overwriteMain(id, time) {
    fetch(`https://${window.firebaseio}.firebaseio.com/videos/${id}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        t: time,
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
}

let id;

function init() {
  console.log(window.location.href);
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0];
    const v = getAllUrlParams("?" + url.url.split("?")[1]).v;
    id = v;
    document.getElementById("vidid").innerHTML = `Vid ID: ${v}`;
  });
  clicker = document.getElementById("submit");

  clicker.addEventListener(
    "click",
    function (e) {
      e.preventDefault(); // Cancel the native event
      e.stopPropagation(); // Don't bubble/capture the event
      pressed();
    },
    false
  );
  // dialog.addEventListener("click", showDialog, false);
}
document.addEventListener("DOMContentLoaded", init);

function getAllUrlParams(queryString) {
  queryString = queryString.slice(1);
  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split("#")[0];

    // split our query string into its component parts
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split("=");

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue;

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
