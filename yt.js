if (location.pathname === "/watch") {
  const urlParams = getAllUrlParams(location.search);
  if (
    !(
      (urlParams.hasOwnProperty("t") && urlParams.t > 0) ||
      urlParams.hasOwnProperty("skiploaded")
    )
  ) {
    console.log(urlParams.v);
    fetch(
      `https://${window.firebaseio}.firebaseio.com/videos/${urlParams.v}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.hasOwnProperty("t") && data.t > 10) {
          insertParam("t", data.t);
        }
        console.log(data);
      });
  }
}

function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  var kvp = location.search.substr(1).split("&");

  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split("=");

    if (x[0] == key) {
      x[1] = value;
      kvp[i] = x.join("=");
      break;
    }
  }

  if (i < 0) {
    kvp[kvp.length] = [key, value].join("=");
  }

  //this will reload the page, it's likely better to store this until finished
  location.search = kvp.join("&");
}

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
