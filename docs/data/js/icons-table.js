var $table = $('#table');

var columns = [
{field: "state", checkbox: true},
{field: "icon", title:"icon"},
{field: "name", title:"name"},
{field: "label", title:"label"},
{field: "unicode", title:"unicode"},
{field: "prefixes", title:"prefixes"},
{field: "dom", title:"dom"},
{field: "terms", title:"terms"},
{field: "styles", title:"styles", visible: false},
{field: "prefix", title:"prefix", visible: false}
];
  
columns.forEach((col,i) => {
col.formatter = "RowFormatter";
columns[i] = col;
});

var options = {
url: 'data/json/icons.json',
responseHandler: function (data) {
data = getIcons(data);
return data;
}, 
uniqueId: "name",
columns: columns,
clickToSelect: true,
detailView: true,
detailFormatter: "detailFormatter",
classes: "table table-hover",
theadClasses: "rgba-purple-strong dark-text",
sortable: true,
showRefresh: true,
buttonsClass: "btn rgba-indigo-strong btn-sm px-3",
buttonsAlign: "left",
search: true,
searchAlign: "left",
showColumns: true,
showToggle: true,
showColumns: true,
showColumnsToggleAll: true
}    

// Events
$(function() {
$.extend($.fn.bootstrapTable.defaults, 
  {
  pagination: true,
  pageSize: 50,
  height:600
  });
  $.extend($.fn.bootstrapTable.columnDefaults, {
  sortable: true
});

// default
$table.bootstrapTable(options);
});