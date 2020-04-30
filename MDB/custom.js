$(document).ready(function () {
var $exp = $("#review");
$exp.load("template/review.html");


  $('#icons').dataTable({
  // select
    columnDefs: [{
      orderable: false,
      className: 'select-checkbox select-checkbox-all',
      targets: 0
    }],
    
    select: {
      style: 'multi',
      selector: 'td:first-child'
    },
  // info
  info: true
  });

});