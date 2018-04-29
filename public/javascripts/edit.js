var translation = {
  "surname" : "Фамилия",
  "name" : "Имя",
  "patronymic" : "Отчество",
  "birth_date" : "Дата рождения",
  "address" : "Адрес",
  "balance" : "Баланс",
  "amount" : "Сумма",
  "per_rate" : "Ставка",
  "rate_name" : "Название",
  "pos_name" : "Должность",
  "salary" : "Зарплата",
  "dep_id" : "№ Отдела",
  "pos_id" : "ИД должности"
};

function cells_contain(cells, row_length, start_index, objects) {
  for (var i = 0; i < cells.length / row_length; i++) {
    var cnt = 0;
    for (var j = start_index, k = 3; k < arguments.length; j++, k++) {
      if (cells[i*row_length+j].innerHTML == arguments[k]) {
        cnt++;
      }
    }
    if (cnt == arguments.length-3) {
      return true;
    }
  }
  return false;
}

function is_int(number) {
  return !isNaN(parseInt(number));
}

function is_str(line) {
  return line != "";
}

function set_values(selectors, value) {
  var length = arguments.length;
  var val = arguments[length-1];
  for (var i = 0; i < length - 1; i++) {
    $(arguments[i]).val(val);
  }
}

function get_values(selectors, suffix) {
  var length = arguments.length;
  var s = arguments[length-1];
  var res = {};
  for (var i = 0; i < length-1; i++) {
    var el = arguments[i];
    res[el.replace(s, "")] = $(el).val();
  }
  return res;
}

function button_action() {
  var type = $(this).attr('group');
  var act = $(this).attr('act');
  var error_message = "Ошибка: одно из полей не введено или содержит ошибку!";

  if (type == "rates") {
    var cells = $("#rates_table td");
    var row_length = $("#rates_table > tbody > tr:first > th").length;
    var rate = get_values("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "#rate_");

    if (!is_str(rate.name) || !is_int(rate.amount) || !is_int(rate.percent)) {
      alert(error_message);
      return;
    }

    if (cells_contain(cells, row_length, 1, rate.name, rate.amount, rate.percent)) {
      alert("Ошибка: название уже используется!");
      return;
    }

    rate.amount = parseInt(rate.amount);
    rate.percent = parseInt(rate.percent) / 100;

    if (act == "accept") {
      rate.type = "rates update";
      ajax(rate, function(data) {
        renderTable("#rates_table", data);
      }, on_failed);
    }

    if (act == "add") {
      rate.type = "rates insert";
      ajax(rate, function(data) {
        renderTable("#rates_table", data);
      }, on_failed);
    }

    set_values("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "");
  }
  else if (type == "clients") {
    var cells = $("#clients_table td");
    var row_length = $("#clients_table > tbody > tr:first > th").length;
    var client = get_values("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "#client_");

    if (!is_str(client.surname) || !is_str(client.name) || !is_str(client.patronymic) || !is_str(client.birth_date) || !is_str(client.address)) {
      alert(error_message);
      return;
    }

    if (cells_contain(cells, row_length, 1, client.surname, client.name, client.patronymic, client.birth_date, client.address)) {
      alert("Ошибка: клиент с такими данными состоит в базе данных!");
      return;
    }

    if (act == "accept") {
      client.type = "clients update";
      ajax(client, function(data) {
        renderTable("#clients_table", data);
      }, on_failed);
    }

    if (act == "add") {
      client.type = "clients insert";
      ajax(client, function(data) {
        renderTable("#clients_table", data);
      }, on_failed);
    }

    set_values("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "");
  }
  else if (type == "employees") {
    var cells = $("#employees_table td");
    var row_length = $("#employees_table > tbody > tr:first > th").length;
    var emp = get_values("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "#employee_");
    emp.address = $("#department_select option:selected").text();
    emp.pos_name = $("#position_select option:selected").text();

    if (!is_str(emp.surname) || !is_str(emp.name) || !is_str(emp.patronymic) || !is_str(emp.birth_date)) {
      alert(error_message);
      return;
    }

    if (cells_contain(cells, row_length, 1, emp.surname, emp.name, emp.patronymic, emp.birth_date, emp.address, emp.position)) {
      alert("Ошибка: сотрудник с такими данными состоит в базе данных!");
      return;
    }

    if (act == "accept") {
      emp.type = "employees update";
      ajax(emp, function(data) {
        renderTable("#employees_table", data);
      }, on_failed);
    }

    if (act == "add") {
      emp.type = "employees insert";
      ajax(emp, function(data) {
        renderTable("#employees_table", data);
      }, on_failed);
    }

    set_values("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "");
    $("#department_select option:first").attr('selected', 'selected');
    $("#position_select option:first").attr('selected', 'selected');
  }
  else if (type == "departments") {
    var cells = $("#departments_table td");
    var row_length = $("#departments_table > tbody > tr:first > th").length;
    var dep = get_values("#department_address", "#department_data_id", "#department_");

    if (!is_str(dep.address)) {
      alert(error_message);
      return;
    }

    if(cells_contain(cells, row_length, 2, dep.address)) {
      alert("Ошибка: отдел с таким адресом уже зарегистрирован!");
      return;
    }

    if (act == "accept") {
      dep.type = "departments update";
      ajax(dep, function(data) {
        renderTable("#departments_table", data);
        ajax({
          type: "employees"
        }, function(data) {
          renderTable("#employees_table", data);
        }, on_failed);
      }, on_failed);
    }

    if (act == "add") {
      dep.type = "departments insert";
      ajax(dep, function(data) {
        renderTable("#departments_table", data);
        ajax({
          type: "employees"
        }, function(data) {
          renderTable("#employees_table", data);
        }, on_failed);
      }, on_failed);
    }

    set_values("#department_address", "#department_data_id", "");
  }
  else if (type == "positions") {
    var cells = $("#positions_table td");
    var row_length = $("#positions_table > tbody > tr:first > th").length;
    var pos = get_values("#position_name", "#position_salary", "#position_data_id", "#position_");

    if (!is_str(pos.name) || !is_int(pos.salary)) {
      alert(error_message);
      return;
    }

    if (cells_contain(cells, row_length, 2, pos.name, pos.salary)) {
      alert("Ошибка: должность с таким названием уже существует!");
      return;
    }

    pos.salary = parseInt(pos.salary);

    if (act == "accept") {
      pos.type = "positions update";
      ajax(pos, function(data) {
        renderTable("#positions_table", data);
        ajax({
          type: "employees"
        }, function (data) {
          renderTable("#employees_table", data);
        }, on_failed);
      }, on_failed);
    }
    if (act == "add") {
      pos.type = "positions insert";
      ajax(pos, function(data) {
        renderTable("#positions_table", data);
        ajax({
          type: "employees"
        }, function (data) {
          renderTable("#employees_table", data);
        }, on_failed);
      }, on_failed);
    }

    set_values("#position_name", "#position_salary", "#position_data_id", "");
  }
}

function edit_button_click() {
  var type = $(this).attr("data_type");
  var ind = parseInt($(this).attr("ind"));
  var data_id = $(this).attr("data_id");

  if (type == "rates") {
    var cells = $("#rates_table td");
    var row_length = $("#rates_table > tbody > tr:first > th").length;

    $("#rate_name").val(cells[ind*row_length + 1].innerHTML);
    $("#rate_amount").val(cells[ind*row_length + 2].innerHTML);
    $("#rate_percent").val(cells[ind*row_length + 3].innerHTML);
    $("#rate_data_id").val(data_id);
  }
  else if (type == "clients") {
    var cells = $("#clients_table td");
    var row_length = $("#clients_table > tbody > tr:first > th").length;

    $("#client_surname").val(cells[ind*row_length + 1].innerHTML);
    $("#client_name").val(cells[ind*row_length + 2].innerHTML);
    $("#client_patronymic").val(cells[ind*row_length + 3].innerHTML);
    $("#client_birth_date").val(cells[ind*row_length + 4].innerHTML);
    $("#client_address").val(cells[ind*row_length + 5].innerHTML);
    $("#client_data_id").val(data_id);
  }
  else if (type == "employees") {
    var cells = $("#employees_table td");
    var row_length = $("#employees_table > tbody > tr:first > th").length;

    $("#employee_surname").val(cells[ind*row_length + 1].innerHTML);
    $("#employee_name").val(cells[ind*row_length + 2].innerHTML);
    $("#employee_patronymic").val(cells[ind*row_length + 3].innerHTML);
    $("#employee_birth_date").val(cells[ind*row_length + 4].innerHTML);

    var address = cells[ind*row_length + 5].innerHTML;
    $("#department_select option:contains(" + address + ")").attr('selected', 'selected');

    var position = cells[ind*row_length + 6].innerHTML;
    $("#position_select option:contains(" + position + ")").attr('selected', 'selected');
    $("#employee_data_id").val(data_id);
  }
  else if (type == "departments") {
    var cells = $("#departments_table td");
    var row_length = $("#departments_table > tbody > tr:first > th").length;

    $("#department_address").val(cells[ind*row_length + 2].innerHTML);
    $("#department_data_id").val(data_id);
  }
  else if (type == "positions") {
    var cells = $("#positions_table td");
    var row_length = $("#positions_table > tbody > tr:first > th").length;

    $("#position_name").val(cells[ind*row_length + 2].innerHTML);
    $("#position_salary").val(cells[ind*row_length + 3].innerHTML);
    $("#position_data_id").val(data_id);
  }
}

function get_edit_button(type, number, data_id) {
  return '<input data_type="' + type + '" ind="' + number + '" data_id="' + data_id + '" class="button small no-margin" type="button" value="✎"';
}

function renderTable(table_name, data) {
  $(table_name).empty().append("<tbody>").append("<tr>");
  
  $(table_name + "> tbody > tr").append('<th class="small"></th>');
  for(var name in data[0]) {
    var tmp = translation[name];
    if (tmp) {
      $(table_name + "> tbody > tr").append("<th>" + tmp + "</th>");
    }
  }
  
  var type = table_name.substring(1, table_name.length-6);
  var i = 0;
  for(var object of data) {
    var row = '<td class="small">' + get_edit_button(type, i, object.data_id) + "</td>";
    for (var field in object) {
      if (translation[field]) {
        row += "<td>" + object[field] + "</td>";
      }
    }
    $(table_name + "> tbody").append("<tr class='text-center'>" + row + "</tr>");
    i++;
  }

  $(table_name + " input").map(function() {
    this.onclick = edit_button_click.bind(this);
  });
}

function ajax(data, on_success, on_failed) {
  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: data 
  })
  .done(on_success)
  .fail(on_failed);
}

var on_failed = function (jqXHR, textStatus) {
  console.log("Request failed: " + textStatus);
};

function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

$(function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });

  $(':submit').map(function() {
    this.onclick = button_action.bind(this);
  });

  ajax({type: "rates"}, function (data) {
    renderTable("#rates_table", data);
  }, on_failed);

  ajax({type: "clients"}, function (data) {
    renderTable("#clients_table", data);
  }, on_failed);
  
  ajax({type: "employees"}, function (data) {
    renderTable("#employees_table", data);
  }, on_failed);

  ajax({type: "departments"}, function (data) {
    renderTable("#departments_table", data);
    $("#department_select").empty();
    for(var object of data) {
      $("#department_select").append('<option value="' + object.dep_id + '">' + object.address + '</option>');
    }
  }, on_failed);

  ajax({type: "positions"}, function (data) {
    renderTable("#positions_table", data);
    $("#position_select").empty();
    for(var object of data) {
      $("#position_select").append('<option value="' + object.pos_id + '">' + object.pos_name + '</option>');
    }
  }, on_failed);
});