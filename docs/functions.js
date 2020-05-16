function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

function getNested(obj, args) {
return args.reduce((obj, level) => obj && obj[level], obj);
}

// Table: data
function getIcons(data) {
var styles = [{"style":"solid","prefix":"fas"},{"style":"regular","prefix":"far"},{"style":"brands","prefix":"fab"}];
var values = _.pairs(data).reduce((acc, [fk, fv], i) => (
acc[i] = {index: i, name: fk, label: fv.label, unicode: fv.unicode, styles: fv.styles, prefixes: styles.filter(it => fv.styles.includes(it.style)), terms: fv.search.terms, svg: _.values(fv.svg)[0].raw}, 
acc[i].prefix = acc[i].prefixes[0].prefix, 
acc), []);
return values;
}

// Table functions
function RowFormatter(value, row, index, field) {
var test = ["icon","unicode","prefixes","terms", "dom"].includes(field);

row.escape = function() {
    return function(text, render) {
      return _.escape(render(text));
    }
}

var value = (test) ? RenderTemp(field, row) :
row[field];
row[field] = (row[field] != undefined) ? row[field] : value;

var wraps = {intb: "<div class='intb'>{{&value}}</div>"};
value = (["terms", "prefixes", "dom"].includes(field)) ? Mustache.render(wraps.intb, {value: value}) : value;
return value;
}

function detailFormatter(index, row) {
var keys = ["name","unicode","prefixes","terms", "dom"];
keys.forEach((k,i) => keys[i] = {key: k, value: RenderTemp(k, row)});
row.detail = RenderTemp("detail", {detail: keys});
return row.detail;
}
      
// Tables: functions
function getSelections() { 
return $table.bootstrapTable('getAllSelections');
}

function GetOptions(type) {
var data = $table.bootstrapTable('getOptions');
  if (type == "Columns") {
  var columns = data.columns[0];
  return columns;
  }
  if (type == undefined) {
  return data;
  }
}


/** Review: icons **/
function GetIcons($this) { 
return $this.find('a[data-type="icon"]');
}

/** Review Funcs **/
function CreatePopup($icon, $el) {
var html = $('#popover').data("temp");

    $el.popover({
    title: function() {
    return $(this).attr("id");
    },
    content: function() {
    return Mustache.render(html, $icon);
    },
    template: `<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body" data-target="${$icon.id}"></div></div>`,
    html: true,
    selector: true,
    container: "body",
    sanitize: false,
    trigger: 'click',
    placement: 'bottom'
    });
}

/** Color Funcs **/
function ColorFormat($color) {
var $ips = $color.find("select");
var $cpip = $("#cpinput");
var values = [];
var ob = {};
  $ips.each(function() {
  var ip = $(this).attr("id");
  ob[ip] = $(this).val();
  });
  $cpip.find("a").each(function() {
  values.push($(this).css("background-color"));
});
  ob.values = values;
return ob;
}

function ColorInput(format, callback) {
  if (format.input == "random") {
  var data = {'url':'http://colormind.io/api/','method':'POST','data':{'model':'ui'}};
$.post(data.url,JSON.stringify(data.data), function(data,status,xhr){}, "json")
.then(data => {
  format.values = data.result.map(value => RGBToHex(`rgb(${value})`));
  callback(format);
  })
  }

  if (format.input == "default") {
  format.values = ["#ffffff","#000000"];
  callback(format);
  }
}

function hexFormatter(index, row) {
return `<span class="badge badge-pill shadow-sm" style="background-color: ${row.hex}">${row.hex}</span>`;
}

function LoadClTable($modal) {
var div = $modal.children().first();
div.attr("id", 'color-modal');
var title = $modal.find(".modal-header");
var body = $modal.find(".modal-body");

title.html("Color List <span class='badge badge-primary'></span>");
body.append("<table id='table-color'></table>");

var options = {
url: 'data/json/colornames.bestof.json',
columns: [{field: "select", checkbox: true}, {field: "hex", title: "hex", formatter: "hexFormatter"}, {field: "name", title: "name"}],
search: true,
height: 450,
clickToSelect: true,
classes: "table table-hover",
theadClasses: "rgba-purple-strong dark-text",
buttonsClass: "btn btn-sm rgba-purple-slight waves-effect"
}

var $clmodal = $('#color-modal');
var $cltb = $('#table-color');
var $mbtns = $clmodal.find("button");
var $save = $mbtns.filter("[data-action='save']");
$cltb.bootstrapTable(options);

$clmodal.on('shown.bs.modal',function () {
$cltb.bootstrapTable('resetView');
});

$cltb.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, name, args) {
var selects = $cltb.bootstrapTable('getAllSelections');
var span = title.find("span");
(selects.length > 0) ? span.text(selects.length) : span.empty();
});
}

function AddCps(data, $cps) {
var temp = `<div class="colorpicker"><div class="colorpicker-saturation"><i class="colorpicker-guide"></i></div><div class="colorpicker-hue"><i class="colorpicker-guide"></i></div><div class="colorpicker-alpha"><div class="colorpicker-alpha-color"></div><i class="colorpicker-guide"></i></div><div class="colorpicker-bar">
<div class="input-group content-justify-center" id="swatches">
<button class="btn btn-sm m-0 z-depth-0 waves-effect" type="button"></button>
</div>
</div></div>`;

$cps.colorpicker({format: data.format, container: true, template: temp}).on('colorpickerCreate',function (e) {
var swatch = e.colorpicker.element.find("#swatches");
var btn = swatch.children().first();
swatch.empty();
  data.values.forEach(vl => {
  nbtn = btn.clone();
  nbtn.attr("value", vl);
  nbtn.css("background-color", vl);
  swatch.append(nbtn);
  });

  swatch.children().on('click', 
  function () {
  e.colorpicker.setValue($(this).val());
  });
});

}

function GetBase64(el) {
var svgst = new XMLSerializer().serializeToString(el);
var svg64 = window.btoa(svgst);
var svgscr = "data:image/svg+xml;base64," + svg64;
return svgscr;
}

function AppendtoCanvas(svgscr, canvas, bg, div) {
var scr;
var imageObj = new Image();
imageObj.src = svgscr;
canvas.width  = 600;
canvas.height = 600;
var context = canvas.getContext("2d");
context.fillStyle = bg;
context.fillRect(0, 0, canvas.width, canvas.height);
context.drawImage(imageObj, 50, 50);
console.log(imageObj.width, imageObj.height);

setTimeout(function() { 
var imageData = context.getImageData(0, 0, imageObj.width, imageObj.height);
context.putImageData(imageData, 50, 50);
}, 800);

var image = new Image();
image.src = canvas.toDataURL("image/png");
div.append(image);
return image.src;

}

// Temp helpers
function httpRq(data) {
var http = new XMLHttpRequest();
http.onreadystatechange = function() {
   if(http.readyState == 4 && http.status == 200) {
    data.callback(JSON.parse(http.responseText));
}
}
http.open(data.method, data.url, true);
http.send(JSON.stringify(data.data));
}

function RenderTemp(temp, data, partial) {
var tdata = $('#template').data("table");
partial = (partial != undefined) ? (_.pick(tdata, partial)) : undefined;

var res = (_.keys(tdata).includes(temp)) ? Mustache.render(tdata[temp], data, partial) : data[temp];
return res;
}

function GetTemp(tk, data, callback) {
 $.get("data/json/template.json",
 function(json) {
 var temp = (_.isArray(tk)) ? getNested(json, tk) : json[tk];
 var render = Mustache.render(temp, data);
  callback(render);
});
}
