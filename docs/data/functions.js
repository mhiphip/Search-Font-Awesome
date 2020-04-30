function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

// icons
function getIcons(data) {
var exts = {prefix: function() {return this.prefixes[0]},
class: function() {return Mustache.render("<i class=\'{{&prefix}} fa-{{&name}}\'></i>", this)}
};

var styles = {'solid':'fas','regular':'far','brands':'fab'};
var values = Object.entries(data).reduce((acc, [fk, fv], i) => (acc[i] = {name: fk, label: fv.label, styles: fv.styles, unicode: fv.unicode, prefixes: fv.styles.map(st => styles[st]), terms: fv.search.terms}, acc[i] = Object.assign(acc[i], exts), acc), []);
return values;
}

// submit icons
function SubmitIcons() {
var $review = $("#review");
var icons = $table.bootstrapTable('getAllSelections');
RenderTemp("icons", {icons: icons}, function(render){ $review.find("> div").append(render);});
}

function getSelect() {
var temp = {
  "names": $table.bootstrapTable('getAllSelections').map(row => row.name),
  "text": function () {
    return (!this.names.length) ? '' : `You selected <strong>${this.names.length}</strong> icons:\n`;
  }
}
var text = temp.text() + temp.names.join(', ');
return text;
}


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

function UpdateCps(data) {
$(data.id).colorpicker({format: data.format, container: true, extensions: [{name: 'swatches', options: {colors: {'s1': '#000', 's2': '#000', 's3': '#000', 's4': '#000'},
namesAsValues: false}}]}).on('colorpickerChange colorpickerCreate', function (e) {
var colors = e.color.generate(data.scheme);
colors.forEach(function (color, i) {
var colorStr = color.string(),
swatch = e.colorpicker.picker.find('.colorpicker-swatch[data-name="s' + (i + 1) + '"]');
swatch.attr('data-value', colorStr)
.attr('title', colorStr).find('> i')
.css('background-color', colorStr);
 });});
}

function RenderTemp(tk, data, callback) {
 $.get("data/template.json", function(temp) {
 var render = Mustache.render(temp[tk], data);
 console.log(temp[tk] + render);
  callback(render);
 });
}