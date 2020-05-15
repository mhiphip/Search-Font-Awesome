var $table = $('#table');
var $tbtbr = $('#tbtoolbar');

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
col.searchable = (!["icon","dom"].includes(col.field)) ? true : false;
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
detailViewIcon: false,
detailFormatter: "detailFormatter",
classes: "table table-hover",
theadClasses: "rgba-purple-strong dark-text",
buttonsClass: "btn btn-sm rgba-purple-slight waves-effect"
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