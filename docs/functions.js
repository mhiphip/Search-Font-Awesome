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
      
// Tables review functions
function getSelections() { 
return $table.bootstrapTable('getSelections');
}

function GetIcons($this) { 
return $this.find('a[data-type="icon"]');
}

/** Review Funcs **/
function CreatePopup($icon, $el) {
var html = $('#popover').data().temp;

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
function ColorForm(dcolors) {
var $review = $('#review');
var $color = $('#color');
var $cpbtns = $('#cpbtns');
var $cpformat = $('#cpformat');
var $cpip = $("#cpinput");
var dps =  [{input: "color", icon: "arrows-alt-h", value: "Spread"}, {input: "color", icon: "mouse-pointer", value: "Pick"}, {input: "color", icon: "stop", value: "Transparent"}];

var $data = {"data":[{"name":"Input", "gid": "igr", "values":["default","random","names"]},{"name":"Scheme", "gid": "sgr","values":["complementary","triad","tetrad","splitcomplement"]}, {name: "Format", gid: "fgr", values: ['rgb', 'hsl', 'hex', 'auto']}], id: function() { return this.name.toLowerCase();}};

GetTemp("select", $data, function(render) {
  $cpformat.html(render);
  var format = {format: "rgb", values:
  ["#ffffff","#000000"]};
  var pills = RenderTemp("pills", format);
  $cpip.html(pills);
});

GetTemp("cpbtns", {data: dcolors}, 
function(render) {
  $cpbtns.html(render);
  var dp = $cpbtns.find(".dropdown-menu");
  
  GetTemp("btndp", {list: dps}, 
  function(brender) {
  dp.html(brender);
  dp.find("a").on("click", function () {
  var link = $(this);
  link.attr("data-label", 
  link.parent().attr("data-label"));
  link.attr("data-value",
  link.attr("value"));
  $review.trigger("format-all",
  [link.data(), link]);
  });
  });
});
}

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
  console.log("random");
  var data = {'url':'http://colormind.io/api/','method':'POST','data':{'model':'ui'}};
  data.callback = function(data){
  console.log("Get Result");
  format.values = data.result.map(value => RGBToHex(`rgb(${value})`));
  callback(format);
  };
  httpRq(data);
  }

  if (format.input == "default") {
  format.values = ["#ffffff","#000000"];
  callback(format);
  }
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
var res = (tdata[temp] != undefined) ? Mustache.render(tdata[temp], data, partial) : data[temp];
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
