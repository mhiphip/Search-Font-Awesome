function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

function getIcons(data) {
var styles = {'solid':'fas','regular':'far','brands':'fab'};
var values = Object.entries(data).reduce((acc, [fk, fv], i) => (acc[i] = {name: fk, label: fv.label, styles: fv.styles, unicode: fv.unicode, prefix: styles[fv.styles[0]], terms: fv.search.terms}, acc), []);
return values;
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

function CreateDivs(data) {
var temp = {
  "list": "{{#pages}}\n<li class=\"nav-item\"><a class=\"nav-link\" data-toggle=\"tab\" href=\"#{{&id}}\">{{&name}}</a></li>\n{{/pages}}",
  "tab": "{{#pages}}<div class=\"tab-pane fade\" id=\"{{&id}}\"></div>{{/pages}}"
}         
temp.list = Mustache.render(temp.list, data);
temp.tab = Mustache.render(temp.tab, data);
return temp;
}
