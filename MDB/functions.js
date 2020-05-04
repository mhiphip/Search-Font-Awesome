function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

// Table: data
function getIcons(data) {
var styles = {'solid':'fas','regular':'far','brands':'fab'};
var values = Object.entries(data).reduce((acc, [fk, fv], i) => (acc[i] = {name: fk, label: fv.label, styles: fv.styles, unicode: fv.unicode, prefixes: _.pick(styles, fv.styles), terms: fv.search.terms}, acc), []);
var res = values.filter((it, i) => i <=10);
console.log(res);
return values;
}

// Table functions
function rowFormatter(row) {
var prefixes = row.prefixes;
row.prefix = _.values(prefixes)[0];
row.prefixes = 
_.pairs(prefixes).map(([tk, tv]) => `${tk}: ${tv}\n`);

["icon", "terms", "dom"].forEach(tk => 
row[tk] = RenderTemp(tk, row));
row.dom = _.escape(row.dom);
return row;
} 


// Tables review functions
function getSelections() { 
return $("#table").bootstrapTable('getAllSelections');
}

function UpdateTable($btn) {
var value = $btn.text();
var selects =
$table.bootstrapTable('getAllSelections');
var $options = $table.bootstrapTable('getOptions');
}


// submit icons
function ReviewIcons($review) {
var res = RenderTemp("review", {icons: getSelections()});
$table.bootstrapTable('refresh');
$review.append(res);
}


// Temp/helpers
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

function RenderTemp(temp, data) {
var template = {
  "icon": "<span class=\"badge badge-light\"><i class='{{prefix}} fa-{{name}} fa-3x fa-fw'></i></span>",
  "terms": "<div style='height: 50px' class='mh-25 overflow-auto'>{{#terms}}<span class=\"badge badge-success\">{{.}}</span>{{/terms}}</div>\n",
  "review": "{{#icons}}<a class=\"btn btn-primary btn-light text-dark p-1 animated bounceInLeft\" data-toggle=\"popover\" data-placement=\"top\" data-content=\"{{name}}\" title=\"{{name}}\"><i class=\"{{prefix}} fa-{{name}} fa-3x fa-fw dark-text\" aria-hidden=\"true\"></i></a>{{/icons}}",
  "dom": `<i class=\"{{&prefix}} fa-{{&name}} {{&options}}\"></i>`
};

var res = Mustache.render(template[temp], data);
return res;
}

function GetTemp(tk, data, callback) {
 $.get("data/template.json", function(temp) {
 var render = Mustache.render(temp[tk], data);
  callback(render);
 });
}