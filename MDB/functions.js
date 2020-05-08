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
acc[i] = {index: i, name: fk, label: fv.label, unicode: fv.unicode, styles: fv.styles, prefixes: styles.filter(it => fv.styles.includes(it.style)), terms: fv.search.terms}, 
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
var keys = ["unicode","prefixes", "terms", "dom"];
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

// Color funcs
function ColorForm() {
var $cpformat = $('#cpformat');
var $data = {"data":[{"name":"Input", "gid": "igr", "values":["default","random","names"]},{"name":"Scheme", "gid": "sgr","values":["complementary","triad","tetrad","splitcomplement"]}, {name: "Format", gid: "fgr", values: ['rgb', 'hsl', 'hex', 'auto']}], id: function() { return this.name.toLowerCase();}};
GetTemp(["select"], $data, function(render) {
$cpformat.append(render);});
}


function ColorFormat($color) {
var $ips = $color.find("select");
var ob = {};
  $ips.each(function() {
  var ip = $(this).attr("id");
  ob[ip] = $(this).val();
  });
return ob;
}

function ColorInput(format, $cps) {
  if (format.input == "random") {
    var data = {'url':'http://colormind.io/api/','method':'POST','data':{'model':'ui'}};
    data.callback = function(data){
  var values = data.result.map(value => RGBToHex(`rgb(${value})`));
  console.log(format);
  format.values = _.object(values, values);
  AddCps(format, $cps);
  };
  httpRq(data);
  }

  if (format.input == "default") {
  var $dcolors = [{id: "cpfront", label: "Front", color: "black", value: "#000"}, {id: "cpback", label: "Back", color: "transparent", value: "transparent"}];
  var values = $dcolors.map(dc => dc.value);
  format.values = _.object(values, values);
  AddCps(format, $cps);
  }
}

function AddCps(data, $cps) {
$cps.colorpicker({format: data.format,
extensions: [{name: 'swatches', options: {colors: data.values, namesAsValues: false}}]});
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

var res = Mustache.render(tdata[temp], data, partial);
return res;
}

function GetTemp(tk, data, callback) {
 $.get("data/json/template.json", function(temp) {
 var render = Mustache.render(getNested(temp, tk), data);
  callback(render);
    });
}
