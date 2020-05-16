$(document).ready(function () {
var $btntb =  $('#btn-actions');
var $content = $('#content');
var $review = $('#review');
var $color = $('#color');

// helper divs
var $tdom = $('#template');
var $modal = $('#modal');
var $popov = $('#popover');
var $spin = $('#spinner');
var dcolors = [{id: "cpfront", label: "Front", css: "color"}, {id: "cpback", label: "Back", css: "background-color"}];
var $selects = [];

/** Load Events **/
// 0 
$.get("data/json/template 2.json", function(temp) { 
$tdom.data({table: temp});
});

$.get("directory/popover.html", function(html) { 
$popov.data({temp: html});
});

$modal.load("directory/modal.html");

/** Toolbar Buttons **/
var mdata = [{"icon":"columns","value":"Table","actions":["Arrange","Select"],"input":"content"},{"icon":"fill-drip","value":"Color","actions":["Arrange","Format"],"input":"color"},{"icon":"trash","value":" Delete","input":"delete"},{"icon":"download","value":"Export","input":"export"}];

// getIcons
GetTemp("btndp", {list: mdata}, function(render) {
var dp = $("#getIcons").next();
dp.html(render);

var $dpms = dp.children();
$dpms.on("click", function () {
  var link = $(this);
  var data = link.data();
  ArrangeSecs(data.input);
  $review.trigger("format.all", [data, link]);
  });
});

// getReview
$('#getReview').on("click", function () {
$review.trigger("load.icons");
$selects = [];
$table.bootstrapTable('refresh');
UpdateToolbars();
});

/** 1. Tables **/
// load table
$content.load("directory/icons.html", 
function (html) {
var $table = $('#table');
var $tbformat = $('#tbformat');
var $tbtbs = $('#tbtoolbar');
var $search = $('#tbsearch');

var list = [{input: "refresh", icon: "sync"}, {input: "toggleView", icon: "toggle-on"}, {input: "Columns", icon: "th-list", toggle: true}];
$tbtbs.html(RenderTemp("tbtoolbar", {list: list}));

$table.on('load-success.bs.table', function (e, data, status) {
var columns = GetOptions("Columns");
columns = columns.map(cl => _.pick(cl,["field", "visible"]));
var dp = $tbtbs.find(".dropdown-menu");
dp.html(RenderTemp("dpmenu", {list: columns}));
});

$tbformat.find("button").on("click", function(e) {
var $link = $(this);
$table.trigger("format", [$link.data(), $link]);
});

$search.on("change", function(e) {
var $ip = $(this);
$table.trigger("format", [$ip.data(), $ip]);
});

// 1 
// table events
$table.on('format', function (e, data, el) {
var input = data.input;

switch (input) {
case "Columns":
 var inputs = {all: ['showAllColumns', 'hideAllColumns'], field: ['showColumn', 'hideColumn']};
  var ips = el.parent().find("input");
  ips.on("change", function (e) {
  var ip = $(this);
  var data = ip.data();
  var inputs = {all: ['showAllColumns', 'hideAllColumns'], field: ['showColumn', 'hideColumn']};
  
  (data.field == "all") ? ips.prop("checked", ip.prop("checked")) : undefined;
  
  var values = (data.field == "all") ? inputs.all : inputs.field;
  input = (ip.prop("checked")) ? values[0] : values[1];
  $table.bootstrapTable(input,data.field);
  });
break;

case "search":
$table.bootstrapTable('refreshOptions', {
filterOptions: { filterAlgorithm: "or"}});

var value = el.val().toLowerCase();
var columns = GetOptions("Columns");
columns = _.pluck(_.filter(columns, {searchable: true}), "field");
var data = $table.bootstrapTable("getData");
data = data.filter((it,i) => JSON.stringify(_.pick(it, columns)).indexOf(value) > -1);
var ids = _.pluck(data, "name");
$table.bootstrapTable('filterBy', {name: ids});
break;

case "search-clear":
$search.val("").change();
$search.focus();
break;

default:
$table.bootstrapTable(input);
break;
}
});

// 1 
// toggle view (change class)
$table.on('toggle.bs.table', function (e, cardView, args) {
var $intb = $(".intb");
var $incv = $(".incv");
$intb.toggleClass("incv", cardView);
$incv.toggleClass("intb", !cardView);
});

$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, name, args) {
var selects = getSelections();
$selects = $selects.concat(selects);
$selects = _.uniq($selects);
UpdateToolbars();
});

/** 2. Review: load **/
$review.on("load.icons", function(e) {
var $this = $(this);
var $ticons = $selects;
$this.append(_.pluck($ticons, "icon"));

var $ricons = GetIcons($this);
var $nricons = $ricons.not("[data-toggle]");

// format popover
$nricons.removeClass("btn-light").toggleClass("animated bounceInLeft");$nricons.find("i").removeClass("fa-2x").addClass("fa-3x");
$nricons.attr("data-toggle", "popover");

// add data
$nricons.each(function() {
var $icon = $(this);
$icon.attr("id", _.uniqueId('icon_'));
var icon = _.find($ticons, {name: $icon.data("name")});

if (icon != undefined) {
$icon.data(icon);
var obj = {detail: detailFormatter(icon.index, icon), id: $icon.attr("id"), color: dcolors};
icon = Object.assign(icon, obj);
CreatePopup(icon, $icon);
}
});

// 2. review: popover
var $ricons = $review.find('[data-toggle="popover"]');

$ricons.on('inserted.bs.popover', function () {
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
var $input = $div.find("[data-input='color']");        
var $tbs = $div.find("[data-type='toolbar']");

// add cp
$input.attr("value", function(){
var css = $(this).data("css");
return $this.css(css);});
var format = ColorFormat($color);
AddCps(format, $cps);

// input event
$input.on("change", function() {
var data = $(this).data();
$this.trigger("format", [data, $(this)]);
});

// toolbar event
$tbs.find("a").each(function(e) {
    var $tb = $(this);
    $tb.attr("data-target", `#${id}`);
    $tb.click(function () { 
    $tb.toggleClass("animated bounce");
    FormatIcon($tb); });
});
});
// !popover

$ricons.on("format", function(e,data,el) {
var $ricon = $(this);
  if (data.input == "color") {
  $ricon.css(data.css, el.val());
  }
    
  if (input == "delete") {
    $ricon.popover("hide");
    $ricon.toggleClass("animted bounceOutUp");
    setTimeout(function() { 
    $ricon.remove(); 
    UpdateToolbars();
    }, 800);
  }
});
// !icon format
});

/** Colors **/
$color.load("directory/color.html", function () {
var $clbtns = $("#clbtns");
var $cpformat = $("#cpformat");
var $cpip = $("#cpinput");
$cpip.prepend($spin.html());

var dps =  [{input: "color", icon: "arrows-alt-h", value: "Spread"}, {input: "color", icon: "mouse-pointer", value: "Pick"}, {input: "color", icon: "stop", value: "Transparent"}];

var $data = {"data":[{"name":"Input", icon: "list-ul", "gid": "igr", "values":["default","random","list"]}, {name: "Format", icon: "swatchbook", gid: "fgr", values: ['rgb', 'hsl', 'hex', 'auto']}], id: function() { return this.name.toLowerCase();}};

// render colors
GetTemp("clbtns", {data: dcolors, select: dps}, function (render) {
$clbtns.append(render);
  var $btns = $clbtns.find("button");
  var sl = $clbtns.find("select");
  $btns.on("click", function (e) {
  var ip = $(this);
  var data = ip.data();
  ip.data("value", sl.val());
  $review.trigger("format.all", [data, ip]);
});

GetTemp("select", $data, 
function(render) {
  $cpformat.html(render); 
  var $sformat = $cpformat.find("button");
  
  $sformat.on("click", function (e) {
  var ip = $(this);
  var data = ip.data();
  var sl = $(data.input);
  sl.data("value", sl.val());
$cpip.trigger("color.format", [data,sl]);
  });
});

// color events
$cpip.on("color.format", function (e, data, el) {
var $ip = $(this);
var spin = $ip.find(".spinner-border");
spin.hide();
var target = data.target;

var callback = function (res) {

  spin.show(); $ip.find("a").remove();
  res.check = function () {
  return (lightOrDark(this) == "light") ?
  "dark": "light";};
  setTimeout(function() { 
  var pills = RenderTemp("pills", res);
  $ip.append(pills);
      var $links = $ip.find("a");
      $links.find("span").hide();
      $links.on("click", function(e) {
      var link = $(this);
      link.toggleClass("active");
      link.find("span").toggle();
      });
      spin.hide();
    }, 500);
};

if (target == "input") {
  var format = ColorFormat($color); 
  
  switch (format.input) {
  case "list":
  var $modal = $("#modal");
  LoadClTable($modal);
  var $clmodal = $('#color-modal');
  $clmodal.modal("show");
  
  var $cltb = $('#table-color');
  var $mbtns = $clmodal.find("button");
  var $save = 
  $mbtns.filter("[data-action='save']");
  $save.one("click", function () {
  var selects = $cltb
  .bootstrapTable('getAllSelections');
  selects = _.pluck(selects, "hex");
  format.values = selects;
  callback(format);
  });
  break;
  default: 
  ColorInput(format, callback);
  break;
  }
}
});

// !color event
});
});


/** Review **/
$review.on("format.all", function(e, input, el) {
var $cpip = $("#cpinput");
var $exp = $("#export");
var $extres = $("#export-result");
var format = ColorFormat($color);
var colors = format.values;
var icons = $review.find("a");

if (input.input == "color") {
var css = _.pluck(dcolors, "css");

if (input.value == "Spread") {
  icons.each(function (index) {
  var icon = $(this);
  var values = css.map(c => icon.css(c));
  var cls = colors.filter((cl,i) => 
  !values.includes(cl));
  var ind = _.random(0, cls.length - 1);
  $(this).css(input.css, cls[ind]);
  });
}

if (input.value == "Pick") {
  colors = [];
  var atvs = $cpip.find(".active");
  var colors = [];
  atvs.each(function(){ 
  colors.push($(this).attr("value"))});
  var ind = _.random(0, colors.length);
  icons.css(input.css, colors[ind]);
}

if (input.value == "Transparent") {
  icons.css(input.css, "#ffffff");
}
}

if (input.input == "delete") {
icons.toggleClass("animted bounceOutUp");
icons.remove();
ArrangeSecs("content");
UpdateToolbars();
}

if (input.input == "export") {
var $svgs = $exp.find("#svgs");
var $cvd = $("#canvas");
var $cv = $cvd.find("canvas").first();
$svgs.empty();
$extres.empty();

icons.each(function () {
  var icon = $(this);
  var svg = icon.data("svg");
  $svgs.append(svg);
  $cvd.append($cv.clone());
  var last = $svgs.find("svg").last();
  var canvas = $cvd.find("canvas").last();
  var bg = icon.css("background-color");
  last.attr("height", "512");
  last.attr("width", "512");
  var path = last.find("path");
  last.attr("data-id", icon.attr("id"));
  last.attr("data-background", bg);
  path.attr("fill", icon.css("color"));
  var svgst = GetBase64(last.get(0));
  var base64 = AppendtoCanvas(svgst, canvas.get(0), bg, $extres);
  icon.data("base64", base64);
});

var $data = [];
icons.each(function (e) {
var data = $(this).data();
var keys = ["name","unicode","prefixes","terms", "dom","svg"];
var obj = keys.reduce((acc, k) => (acc[k] = data[k], acc), {});
$data.push(obj);
});
}
});
});

function ArrangeSecs(input) {
var $divs = $('.card > div');

var $dids = [];
$divs.each(function(index) {
var div = {index: index, id: $(this).attr("id"), hidden: $(this).prop("hidden")};
$dids.push(div);
});

var ip = $dids.find(div => div.id == input);

if (ip != undefined) {
$(`#${input}`).prop("hidden", false).show("slow");
 $divs.filter(function(index) {
 return index > 1 & $(this).attr("id") !=
 input;
}).hide("slow");
}

}

function UpdateToolbars() {
var tbact = $("[data-active=table-check]");
var tbtxt = tbact.find("span");
var icact = $("[data-active=icon-check]");
var ictxt = icact.find("span");

($selects.length > 0) ? tbact.removeClass("disabled") : tbact.addClass("disabled");

($selects.length > 0) ?
tbtxt.text("-" + $selects.length) : tbtxt.empty();

var ipops = GetIcons($('#review'));

(ipops.length > 0) ? icact.removeClass("disabled") : icact.addClass("disabled"); 
(ipops.length > 0) ? 
ictxt.text("-" + ipops.length) : ictxt.empty();
}


});