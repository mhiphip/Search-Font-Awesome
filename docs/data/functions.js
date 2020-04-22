function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

function getIcons(icons) {
var styles = {'solid':'fas','regular':'far','brands':'fab'};
var values = Object.entries(icons).reduce((acc, [fk, fv], i) => (acc[i] = {name: fk, label: fv.label, styles: fv.styles, unicode: fv.unicode, prefix: styles[fv.styles[0]], terms: fv.search.terms}, acc), []); return values;
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
var temp = "<div id='{{id}}'>\n{{html}}\n</div>";
var res = Mustache.render(temp, data);
return res;
}