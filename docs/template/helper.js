var $table1 = $('#table1');

$(function() {
  $table1.bootstrapTable({
  classes: "table table-hover table-borderless px-1",
  theadClasses: "default-color white-text",
    columns: [{
      field: 'id',
      title: 'Item ID'
    }, {
      field: 'name',
      title: 'Item Name'
    }, {
      field: 'price',
      title: 'Item Price'
    }],
    data: [{id: 1, name: 'Item 1', price: '$1'}, {id: 2,
    name: 'Item 2', price: '$2'}]
  });
});