function renderTableHeader(table_name, data) {
  for (var name in data[0]) {
    var tmp = translation[name];
    if (tmp)
      $(table_name + "> tbody > tr").append("<th>" + tmp + "</th>");
  }
}

function renderTableRow(object) {
  var row = "";
  for (var field in object) {
    if (translation[field]) {
      row += "<td>" + object[field] + "</td>";
    }
  }
  return row;
}

function renderTable(table_name, data) {
  $(table_name).empty().append("<tbody>").append("<tr>");
  renderTableHeader(table_name, data);
  
  for(var object of data) {
    var row = renderTableRow(object);
    $(table_name + "> tbody").append("<tr class='text-center'>" + row + "</tr>");
  }
}

function get_edit_button(type, number, data_id) {
  return '<input data_type="' + type + '" ind="' + number + '" data_id="' + data_id + '" class="button small no-margin" type="button" value="✎"';
}

function renderEditTable(table_name, data) {
  $(table_name).empty().append("<tbody>").append("<tr>");
  $(table_name + "> tbody > tr").append('<th class="small"></th>');
  renderTableHeader(table_name, data);

  var i = 0;
  var type = table_name.substring(1, table_name.length - 6);

  for(var object of data) {
    var row = '<td class="small">' + get_edit_button(type, i, object.data_id) + "</td>";
    row += renderTableRow(object);
    $(table_name + "> tbody").append("<tr class='text-center'>" + row + "</tr>");
    i++;
  }

  $(table_name + " input").map(function () {
    this.onclick = edit_button_click.bind(this);
  });
}