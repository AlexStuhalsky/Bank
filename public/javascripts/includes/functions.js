function cells_contain(cells, row_length, start_index, objects) {
  var cnt = 0;
  for (var i = 0; i < cells.length / row_length; i++) {
    for (var j = start_index, k = 3; k < arguments.length; j++, k++)
      if (cells[i * row_length + j].innerHTML == arguments[k])
        cnt++;

    if (cnt == arguments.length - 3)
      return true;
  }
  return false;
}

function is_int(number) {
  return !isNaN(parseInt(number));
}

function set_value(selectors, value) {
  var length = arguments.length;
  var val = arguments[length - 1];
  for (var i = 0; i < length - 1; i++) {
    $(arguments[i]).val(val);
  }
}

function set_values(selectors, values) {
  var length = arguments.length;
  var num = length / 2;
  for (var i = 0; i < num; i++) {
    $(arguments[i]).val(arguments[num + i]);
  }
}

function get_values(args) {
  var length = args.length;
  var s = args[length - 1];
  var res = {};
  for (var i = 0; i < length - 1; i++) {
    var el = args[i];
    res[el.replace(s, "")] = $(el).val();
  }
  return res;
}

function edit_button_click() {
  var type = $(this).attr("data_type");
  var table_name = '#' + type + '_table';
  var ind = parseInt($(this).attr("ind"));

  var cells = $(table_name + ' td');
  var row_length = $(table_name + ' > tbody > tr:first > th').length;

  var i = ind * row_length;
  var data_id = $(this).attr("data_id");

  if (type == 'rates')
    set_values("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id",
                cells[i + 1].innerHTML, cells[i + 2].innerHTML, cells[i + 3].innerHTML, data_id);
  else if (type == 'clients')
    set_values("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id",
                cells[i + 1].innerHTML, cells[i + 2].innerHTML, cells[i + 3].innerHTML, cells[i + 4].innerHTML, cells[i + 5].innerHTML, data_id);
  else if (type == "employees")
    set_values("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#department_select", "#position_select", "#employee_data_id",
                cells[i + 1].innerHTML, cells[i + 2].innerHTML, cells[i + 3].innerHTML, cells[i + 4].innerHTML, cells[i + 5].innerHTML, cells[i + 6].innerHTML, data_id);
  else if (type == "departments")
    set_values("#department_address", "#department_data_id",
                cells[i + 2].innerHTML, data_id);
  else if (type == "positions")
    set_values("#position_name", "#position_salary", "#position_data_id",
                cells[i + 2].innerHTML, cells[i + 3].innerHTML, data_id);
}

function change() {
  var val = $(this).val();
  var filter = val == "Кредиты" ? "> 0" : "< 0";
  ajax({type: "rates", filter: filter }, function (data) {
    renderEditTable("#rates_table", data);
  });
}

function button_action() {
  var type = $(this).attr('group');
  var table_name = "#" + type + "_table";
  var cells = $(table_name + " td");
  var row_length = $(table_name + " > tbody > tr:first > th").length;

  var act = $(this).attr('act');
  var field_data_error = "Ошибка: одно из полей не введено или содержит ошибку!";
  var invalid_record_error = "Ошбика: невозможно редактировать несуществующую запись!";

  var generate_query = function(name, value_array) {
    var object = get_values(value_array);
    object.type = (act == "accept") ? name + " update" : name + " insert";
    return object;
  };

  try {
    switch (type) {
      case "rates":
        var rate = generate_query("rates", [ "#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "#rate_" ])
        rate.rate_type = $("#rate_select").val();

        if (!rate.name || !is_int(rate.amount) || !is_int(rate.percent))
          throw field_data_error;

        if (cells_contain(cells, row_length, 1, rate.name, rate.amount, rate.percent))
          throw "Ошибка: тариф с такими данными уже используется!";

        if (act == "accept" && !(rate.data_id))
          throw invalid_record_error;

        var is_credit = rate.rate_type == "Кредиты";
        rate.amount = parseInt(rate.amount);
        rate.filter = is_credit ? "> 0" : "< 0";
        rate.amount = is_credit ? rate.amount : -rate.amount;
        rate.percent = parseInt(rate.percent) / 100;

        ajax(rate, function (data) {
          renderEditTable("#rates_table", data);
        });

        set_value("#rate_name", "#rate_amount", "#rate_percent", "#rate_data_id", "");
        break;

      case "clients":
        var client = generate_query("clients", [ "#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "#client_" ])

        if (!client.surname || !client.name || !client.patronymic || !client.birth_date || !client.address)
          throw field_data_error;

        if (cells_contain(cells, row_length, 1, client.surname, client.name, client.patronymic, client.birth_date, client.address))
          throw "Ошибка: клиент с такими данными состоит в базе данных!";

        if (act == "accept" && !(client.data_id))
          throw invalid_record_error;

        ajax(client, function (data) {
          renderEditTable("#clients_table", data);
        });

        set_value("#client_surname", "#client_name", "#client_patronymic", "#client_birth_date", "#client_address", "#client_data_id", "");
        break;

      case "employees":
        var emp = generate_query("employees", [ "#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "#employee_" ]);
        emp.address = $("#department_select").val();
        emp.pos_name = $("#position_select").val();

        if (!emp.surname || !emp.name || !emp.patronymic || !emp.birth_date)
          throw field_data_error;

        if (cells_contain(cells, row_length, 1, emp.surname, emp.name, emp.patronymic, emp.birth_date, emp.address, emp.position))
          throw "Ошибка: сотрудник с такими данными состоит в базе данных!";

        if (act == "accept" && !(emp.data_id))
          throw invalid_record_error;
        
        ajax(emp, function (data) {
          renderEditTable("#employees_table", data);
        });

        set_value("#employee_surname", "#employee_name", "#employee_patronymic", "#employee_birth_date", "#employee_data_id", "");
        $("#department_select").val($("#department_select option:first").text());
        $("#position_select").val($("#position_select option:first").text());
        break;

      case "departments":
        var dep = generate_query("departments", [ "#department_address", "#department_data_id", "#department_" ])

        if (!dep.address)
          throw field_data_error;

        if (cells_contain(cells, row_length, 2, dep.address))
          throw "Ошибка: отдел с таким адресом уже зарегистрирован!";

        if (act == "accept" && !(dep.data_id))
          throw invalid_record_error;

        ajax(dep, function (data) {
          renderEditTable("#departments_table", data);
          ajax({
            type: "employees"
          }, function (data) {
            renderEditTable("#employees_table", data);
          });
        });

        set_value("#department_address", "#department_data_id", "");
        break;

      case "positions":
        var pos = generate_query("positions", [ "#position_name", "#position_salary", "#position_data_id", "#position_" ])

        if (!pos.name || !is_int(pos.salary))
          throw field_data_error;

        if (cells_contain(cells, row_length, 2, pos.name, pos.salary))
          throw "Ошибка: должность с таким названием уже существует!";

        if (act == "accept" && !(pos.data_id))
          throw invalid_record_error;

        pos.salary = parseInt(pos.salary);

        ajax(pos, function (data) {
          renderEditTable("#positions_table", data);
          ajax({
            type: "employees"
          }, function (data) {
            renderEditTable("#employees_table", data);
          });
        });

        set_value("#position_name", "#position_salary", "#position_data_id", "");
    }
  }
  catch (error_message) {
    alert(error_message);
  }
}