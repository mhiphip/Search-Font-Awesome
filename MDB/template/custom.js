$(document).ready(function () {
var $table = $('#icons');

$.get("../data/json/icons.json", function(data) {
data = getIcons(data);
data = data.filter((it,i) => i <= 10);
var columns = [];
["name","unicode"].forEach(k => columns.push( {title: k} ));

var dataSet = data.map(it => _.values(it));

var table = $table.DataTable({
data: dataSet, columns: columns
});
console.log(dataSet);
});



});