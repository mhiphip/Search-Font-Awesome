$(document).ready(function () {
// load icons
var $content = $('#content');
var btns = ["getReview","getData","getImage"];
var $review = $('#review');
var $btns =  $('#btn-actions');

$content.load("/directory/icons-2.html", 
function () {
    var $table = $('#table');
    var btns = $btns.find("disabled");

// table events
$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table refresh.bs.table', function (e, name, args) {
    var selects = getSelections();
    var btns = $btns
    .find("button[data-active=table-check]");
    var span = 
    $("[data-text=table-select-length]");
    btns.prop("disabled", !selects.length);
    (selects.length > 0) ?
    span.text(selects.length) : span.empty();
});


// review icons
$('#getReview').on("click", function () {
ReviewIcons($review);
var $ipops = $('[data-toggle="popover"]');
    $.get("directory/popover.html", function (html)
    { 
    $ipops.popover({template: html});
    });
});


});
});