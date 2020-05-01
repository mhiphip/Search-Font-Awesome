$(document).ready(function () {
var $icons = $("#icons");

  $icons.dataTable({
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
  
var $review = $("#review");
console.log($review);
$review.load("/template/Button/button icons.html", function(html) {
console.log(html);
});

});