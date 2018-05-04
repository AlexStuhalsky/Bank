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
  "pos_id" : "ИД должности",
  "rate_type" : "Класс тарифа"
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
  return line.trim() != "";
}

function set_value(selectors, value) {
  var length = arguments.length;
  var val = arguments[length-1];
  for (var i = 0; i < length - 1; i++) {
    $(arguments[i]).val(val);
  }
}

function set_values(selectors, values) {
  var length = arguments.length;
  var num = length / 2;
  for (var i = 0; i < num; i++) {
    $(arguments[i]).val(arguments[num+i]);
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
  var table_name = "#" + type + "_table";
  var cells = $(table_name + " td");
  var row_length = $(table_name + " > tbody > tr:first > th").length;

  var act = $(this).attr('act');
  var error_message = "Ошибка: одно из полей не введено или содержит ошибку!";
  var error = "Ошбика: невозможно редактировать несуществующую запись!";

  switch (type) {
  case "rates":
    var rate = get_values("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "#rate_");
    rate.rate_type = $("#rate_select").val();

    if (!is_str(rate.data_id)) {
      alert(error);
    }
    else {
      if (!is_str(rate.name) || !is_int(rate.amount) || !is_int(rate.percent)) {
        alert(error_message);
        return;
      }

      if (cells_contain(cells, row_length, 1, rate.rate_type, rate.name, rate.amount, rate.percent)) {
        alert("Ошибка: тариф с такими данными уже используется!");
        return;
      }

      rate.amount = parseInt(rate.amount);
      rate.amount = rate.rate_type == "Кредит" ? rate.amount : -1 * rate.amount;
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
    }
    set_value("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "");
    $("#rate_select").val($("#rate_select option:first").text());
    break;

  case "clients":
    var client = get_values("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "#client_");

    if (!is_str(client.data_id)) {
      alert(error);
    }
    else {
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
    }
    set_value("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "");
    break;

  case "employees":
    var emp = get_values("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "#employee_");
    emp.address = $("#department_select").val();
    emp.pos_name = $("#position_select").val();

    if (!is_str(emp.data_id)) {
      alert(error);
    }
    else {
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
    }
    set_value("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "");
    $("#department_select").val($("#department_select option:first").text());
    $("#position_select").val($("#position_select option:first").text());
    break;

  case "departments":
    var dep = get_values("#department_address", "#department_data_id", "#department_");

    if (!is_str(dep.data_id)) {
      alert(error);
    }
    else {
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
    }
    set_value("#department_address", "#department_data_id", "");
    break;

  case "positions":
    var pos = get_values("#position_name", "#position_salary", "#position_data_id", "#position_");

    if (!is_str(pos.data_id)) {
      alert(error);
    }
    else {
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
    }
    set_value("#position_name", "#position_salary", "#position_data_id", "");
  }
}

function edit_button_click() {
  var type = $(this).attr("data_type");
  var table_name = '#' + type + '_table';
  var ind = parseInt($(this).attr("ind"));
  
  var cells = $(table_name + ' td');
  var row_length = $(table_name + ' > tbody > tr:first > th').length;
  
  var i = ind * row_length;
  var data_id = $(this).attr("data_id");

  switch (type) {
  case 'rates':
    set_values("#rate_select", "#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id",
               cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML, cells[i+4].innerHTML, data_id);
    break;
  case "clients":
    set_values("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id",
               cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML, cells[i+4].innerHTML, cells[i+5].innerHTML, data_id);
    break;
  case "employees":
    set_values("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#department_select", "#position_select", "#employee_data_id",
               cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML, cells[i+4].innerHTML, cells[i+5].innerHTML, cells[i+6].innerHTML, data_id);
    break;
  case "departments":
    set_values("#department_address", "#department_data_id",
               cells[i+2].innerHTML, data_id);
    break;
  case "positions":
    set_values("#position_name", "#position_salary", "#position_data_id",
               cells[i+2].innerHTML, cells[i+3].innerHTML, data_id);
    break;
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
  
  var i = 0;
  var type = table_name.substring(1, table_name.length-6);
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
      $("#department_select").append('<option dep_id="' + object.dep_id + '">' + object.address + '</option>');
    }
  }, on_failed);

  ajax({type: "positions"}, function (data) {
    renderTable("#positions_table", data);
    $("#position_select").empty();
    for(var object of data) {
      $("#position_select").append('<option pos_id="' + object.pos_id + '">' + object.pos_name + '</option>');
    }
  }, on_failed);
});