$(document).ready(function () {
var btns = ["getReview","getData","getIcons"];
var $btntb =  $('#btn-actions');
var $content = $('#content');
var $review = $('#review');
var $color = $('#color');

// helper divs
var $tdom = $('#template');
var $popov = $('#popover');
var $spin = $('#spinner');
var dcolors = [{id: "cpfront", label: "Front", css: "color"}, {id: "cpback", label: "Back", css: "background-color"}];
var css = _.pluck(dcolors, "css");

$.get("data/json/template 2.json", function(temp) { 
$tdom.data({table: temp});
});

$.get("directory/popover-2.html", function(html) { 
$popov.data({temp: html});
});

var mdata = [{"icon":"columns","value":"Table","actions":["Arrange","Select"],"input":"content"},{"icon":"fill-drip","value":"Color","actions":["Arrange","Format"],"input":"color"},{"icon":"trash","value":" Delete","input":"delete"},{"icon":"download","value":"Export","input":"export"}];

var data = {id: "#getIcons", list: mdata};
GetTemp("btndp", data, function(render) {
var dp = $(data.id).next();
dp.html(render);
});

// Tables
$content.load("directory/icons-2.html", 
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


/** content: table **/
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
var selects = getSelections();

$table.bootstrapTable('refreshOptions', {
filterOptions: { filterAlgorithm: "or"}});

var value = el.val().toLowerCase();
var columns = GetOptions("Columns");
columns = _.pluck(_.filter(columns, {searchable: true}), "field");
var data = $table.bootstrapTable("getData");
data = data.filter((it,i) => JSON.stringify(_.pick(it, columns)).indexOf(value) > -1);
var ids = _.pluck(data, "name");
$table.bootstrapTable('filterBy', {name: ids});
$table.bootstrapTable('checkBy', {field: 'name', values: _.pluck(selects,"name")});
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

// toggle view (change class)
$table.on('toggle.bs.table', function (e, cardView, args) {
var $intb = $(".intb");
var $incv = $(".incv");
$intb.toggleClass("incv", cardView);
$incv.toggleClass("intb", !cardView);
});

$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, name, args) {
UpdateToolbars();
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
  console.log(data);
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
  $cpip.trigger("color.format", [data, sl]);
  });
});

// color events
$cpip.on("color.format", function (e, data, el) {
var $ip = $(this);
var spin = $ip.find(".spinner-border");
var target = data.target;

  if (target == "input") {
  var format = ColorFormat($color);
  console.log(format);
  
  switch (format.input) {
  case "list":
  $("#modal").load("color-table.html", 
  function (html) {
  var modal = $("#color-modal");
  var colortable = $("#color-table");
  modal.modal('show');
  });
  break;
  }

  ColorInput(format, function(res) {
    spin.show();
    $ip.find(".badge").remove();
    res.check = function () {
    return (lightOrDark(this) == "light") ? "dark": "light";
    };
    setTimeout(function() { 
      var pills = 
      RenderTemp("pills", res);
      $cpip.append(pills);
      spin.hide();
      }, 800);
  });
  }
});

// color event
});
});


/** Review **/
$review.on("format.all", function(e,input, el) {
var $cpip = $("#cpinput");
var $exp = $("#export");
var $extres = $("#export-result");
var format = ColorFormat($color);
var colors = format.values;
var icons = $review.find("a");

if (input.input == "color") {
var css = input.css;

  if (input.value == "Spread") {
  icons.each(function (index) {
  var icon = $(this);
  var values = [];
  dcolors.forEach(dc => 
  values.push(icon.css(dc.css)));
  console.log(values);
  
  var cls = colors.filter((cl,i) => 
  !values.includes(cl));
  var ind = _.random(0, cls.length - 1);
  var cl = cls[ind];
  $(this).css(css, cl);
  });
  }

  if (input.value == "Pick") {
  var dfc = css.find(c => c != dc.css);
  colors = [];
  $cpip.find(".active").each(function() {
  colors.push($(this).attr("value"));
  });
  icons.css(css, colors[0]);
  }

  if (input.value == "Transparent") {
  icons.css(css, "#ffffff");
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

var click = el.attr("data-click");
  if (click == undefined) {
  el.attr("data-click", 1);
  el.click();
  }
  else {
  console.log(input);
  console.log(click);
  }
}

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

$dpms.each(function () {
  $(this).on("click", function () {
  var link = $(this);
  var data = link.data();
  $dpms.removeClass("active");
  $(this).addClass("active");
  ArrangeSecs(data.input);
  $review.trigger("format.all", [data, link]);
  });
  });
});

/** load icons **/
$review.on("load.icons", function(event) {
var $ticons = getSelections();
$review.append(_.pluck($ticons, "icon"));

var $ricons = GetIcons($(this));
var html2 = $popov.data().temp;

// find new icons
var $nricons = $ricons.not("[data-toggle]");
$nricons.each(function() {
$(this).attr("id", _.uniqueId('icon_'));
});

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
var $input = $div.find("[data-input='color']");        
var $tbs = $div.find("[data-type='toolbar']");

// add cp
$input.each(function() {
    var input = $(this);
    input.attr("data-target", `#${id}`);
    var dc = _.find(dcolors, {label: 
    input.attr("data-label")});
    input.attr("value", dc.value);
});

var format = ColorFormat($color);
AddCps(format, $cps);

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
var selects = getSelections();

(selects.length > 0) ? tbact.removeClass("disabled") : tbact.addClass("disabled");

(selects.length > 0) ?
tbtxt.text("-" + selects.length) : tbtxt.empty();

var ipops = GetIcons($('#review'));


(ipops.length > 0) ? icact.removeClass("disabled") : icact.addClass("disabled"); 
(ipops.length > 0) ? 
ictxt.text("-" + ipops.length) : ictxt.empty();
}

});