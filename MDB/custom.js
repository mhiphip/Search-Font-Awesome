$(document).ready(function () {
  $('#default').dataTable({

    columnDefs: [{
      orderable: false,
      className: 'select-checkbox select-checkbox-all',
      targets: 0
    }],
    select: {
      style: 'multi',
      selector: 'td:first-child'
    }
  });
  

var $example = $('#example');
$example.load("/directory/icons.html");
console.log($example.html());

});