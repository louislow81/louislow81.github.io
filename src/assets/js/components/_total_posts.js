/*
  Get Total Posts from JSON data
  @param {id}
  @param {data}
*/
function totalPosts(id, data) {
  var showTotalItems = document.getElementById(id);
  var getTotalItems = Object.keys(data).length;
  showTotalItems.innerHTML = showTotalItems.innerHTML + getTotalItems;
};
