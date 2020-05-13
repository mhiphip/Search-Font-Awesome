$(document).ready(function () {
var btns = ["getReview","getData","getIcons"];
var $btntb =  $('#btn-actions');
var $content = $('#content');
var $review = $('#review');
var $color = $('#color');
var $tdom = $('#template');
var $popov = $('#popover');
var dcolors = [{id: "cpfront", label: "Front", css: "color"}, {id: "cpback", label: "Back", css: "background-color"}];

$.get("data/json/template 2.json", function(temp) { 
$tdom.data({table: temp});
});

$.get("directory/popover-2.html", function(html) { 
$popov.data({temp: html});
});

ColorForm();

var mdata = [{"icon":"columns","value":"Table","actions":["Arrange","Select"],"input":"content"},{"icon":"fill-drip","value":"Color","actions":["Arrange","Format"],"input":"color"},{"icon":"trash","value":" Delete","input":" delete"},{"icon":"download","value":"Export","input":"export"}];

var data = {id: "#getIcons", list: mdata};
GetTemp("btndp", data, function(render) {
var dp = $(data.id).next();
dp.html(render);
});

// Tables
$content.load("/directory/icons-2.html", 
function () {
var $table = $('#table');
$table.on('check.bs.table', function (row, $element) {
var index = $element.index;
});

// table events
// toggle view (change class)
$table.on('toggle.bs.table', function (e, cardView, args) {
var $intb = $(".intb");
var $incv = $(".incv");
    if (cardView == true) {
    $intb.removeClass("intb")
        .addClass("incv");
    }
    
    if (cardView == false) {
    $incv.removeClass("incv")
        .addClass("intb");
    }
});

$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, name, args) {
UpdateToolbars();
});

/** color button **/
$color.find("button").on("click", function (event) {
var $cpip = $("#cpinput");
var format = ColorFormat($color);
  ColorInput(format, function(res) {
  var pills = RenderTemp("pills", res);
  $cpip.html(pills);
  });
});

// review icons
$('#getReview').on("click", function () {
$review.trigger("load.icons");
$table.bootstrapTable('refresh');
$table.bootstrapTable('refresh');
UpdateToolbars();
});

/** Icon Events **/
var $gIc = $('#getIcons');
var $dpms = $gIc.next().children();
$dpms.attr("data-target", "#review");

$dpms.on("click", function () {
var data = $(this).data();
$dpms.removeClass("active");
$(this).addClass("active");
ArrangeSecs(data.input);
});

/** load icons **/
$review.on("load.icons", function(event) {
var $ticons = getSelections();
$review.append(_.pluck($ticons, "icon"));

var $ricons = GetIcons($(this));
var html2 = $popov.data().temp;

// find new icons
var $nricons = $ricons.not("[data-toggle]");
$nricons.each(function() {$(this).attr("id", _.uniqueId('icon_'))});


// format popover
$nricons.removeClass("btn-light").toggleClass("animated bounceInLeft");
$nricons.attr("data-toggle", "popover"); $nricons.find("i").removeClass("fa-2x").addClass("fa-3x");

// add data
$nricons.each(function() {
var $this = $(this);
var icon = $ticons.find(ic => ic.name == $this.data("name"));

if (icon != undefined) {
$this.data(icon);
icon.detail = detailFormatter(icon.index, icon);
icon.id = $this.attr("id");
icon.color = dcolors;
CreatePopup(icon, $this);
}
});

// ----
$('[data-toggle="popover"]').on('inserted.bs.popover', function () {
var $this = $(this); 
var id = $this.attr("id");
var $pops = $(".popover");
var $div = $pops.find(`[data-target="${id}"]`);

// toggle popover
($pops.length > 1) ? $pops.first().popover("hide") : $pops;

// find icon css
dcolors.forEach(dc => dc.value = $this.css(dc.css));

// popover childs
var $cps = $div.find("[id^='cp']");
var $fcolors = $div.find(".dropdown-menu");
var $input = $div.find("[data-input='color']");        
var $tbs = $div.find("[data-type='toolbar']");

// add cp
$input.each(function() {
    var $input = $(this);
    $input.attr("data-target", `#${id}`);
    var dc = _.find(dcolors, {label: 
    $input.attr("data-label")});
    $input.val(dc.value).change();
});

var format = ColorFormat($color);
AddCps(format, $cps);
console.log(format);

$fcolors.one("click", function(){
var $fcolor = $(this);
var data = $fcolor.data();
var $input = $fcolor.find("input");

// change input
$fcolor.children().on("click", function(e) {
    $input.val($(this).text()).change();
    });
});

// input event
$input.on("change", function () { FormatIcon($(this)); });

// toolbar event
$tbs.find("a").each(function(e) {
    var $tb = $(this);
    $tb.attr("data-target", `#${id}`);
    
    $tb.click(function () { 
    $tb.toggleClass("animated bounce");
    FormatIcon($tb); });
});
});
});

});


function FormatIcon($input) {
var input = $input.attr("data-input");
var id = $input.attr("data-target");
var $el = $(id);

  if (input == "color") {
    var dc = _.find(dcolors, {label:  $input.attr("data-label")});
    $el.css(dc.css, $input.val());
  }
    
  if (input == "delete") {
    $el.popover("hide");
    $el.toggleClass("animted bounceOutUp");
    setTimeout(function() { 
    $el.remove(); UpdateToolbars();
    }, 800);
  }
}


function ArrangeSecs(input) {
var $divs = $('.card > div');
var $dids = [];
$divs.each(function(index) {
var div = {index: index, id: $(this).attr("id"), hidden: $(this).prop("hidden")};
$dids.push(div);
});

$(`#${input}`).prop("hidden",false).show("slow");
 $divs.filter(function(index) {
 return index > 1 & $(this).attr("id") !=
 input;
}).hide("slow");
  
}

function UpdateToolbars() {
var tbact = $("[data-active=table-check]");
var tbtxt = tbact.find("span");
var icact = $("[data-active=icon-check]");
var ictxt = icact.find("span");

var selects = $table.bootstrapTable('getSelections');

(selects.length > 0) ? tbact.removeClass("disabled") : tbact.addClass("disabled");

(selects.length > 0) ?
tbtxt.text("-" + selects.length) : tbtxt.empty();

var ipops = $('#review').find('a[data-type="icon"]');
(ipops.length > 0) ? icact.removeClass("disabled") : icact.addClass("disabled"); 
(ipops.length > 0) ? 
ictxt.text("-" + ipops.length) : ictxt.empty();
}

});