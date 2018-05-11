function load_logic() {
  var render = false;
  var functions = false;
  var translation = false;
  var message_box = false;

  var loaded = function() {
    if (render && functions && translation && message_box) {
      load_table();
    }
  }

  load("translation", function() {
    translation = true;
    loaded();
  });

  load("functions", function() {
    functions = true;
    loaded();
  });

  load("renderTable", function() {
    render = true;
    loaded();
  });

  load("message_box", function() {
    message_box = true;
    loaded();
  });
};

function load_table() {
  var href = $(location).attr("href");
  var url = href.includes("credit") ? "/credit/" : "/deposit/";
  $.ajax({
    method: "POST",
    url: url,
    cache: false
  })
  .done(function(data) {
    renderContractTable("#contracts_table", data);
  })
  .fail(on_failed);
}

function renderContractTable(table_name, data) {
  $(table_name).empty().append("<tbody>").append("<tr>");
  $(table_name + "> tbody > tr")
  .append('<th>№</th>')
  .append('<th>ФИО клиента ' + get_edit_span("clients") + '</th>')
  .append('<th>ФИО сотрудника ' + get_edit_span("employees") + '</th>')
  .append('<th>Тариф ' + get_edit_span("rates") + '</th>')
  .append('<th>Сумма</th>')
  .append('<th>Процент</th>')
  .append('<th>Баланс</th>')
  .append('<th>Дата</th>')
  .append('<th>Адрес ' + get_edit_span("departments") + '</th>');

  for (var c of data) {
    $(table_name + "> tbody").append('<tr class="text-center">' + 
    '<td>' + c.contract_id + '</td>' +
    '<td>' + c.client_surname + ' ' + c.client_name + ' ' + c.client_patronymic + '</td>' +
    '<td>' + c.emp_surname + ' ' + c.emp_name + ' ' + c.emp_patronymic + '</td>' +
    '<td>' + c.rate_name + '</td>' +
    '<td>' + Math.abs(c.rate_amount) + '</td>' +
    '<td>' + c.per_rate * 100 + '%</td>' +
    '<td>' + Math.abs(c.balance) + '</td>' +
    '<td>' + c.date + '</td>' +
    '<td>' + c.address + '</td></tr>');
  }

  $("span[edit_type]").map(function() {
    this.onclick = edit_data.bind(this);
  });
}

function get_edit_span(type) {
  return '<span class="edit-button" edit_type="' + type + '">✎</span>';
}

function button_click() {
  button_action.bind(this)(load_table);
}

function edit_data() {
  var type = $(this).attr("edit_type");
  $("#data_area").empty();

  $.ajax({
    method: "POST",
    url: "/components?type=" + type,
    cache: false
  })
  .done(function(data) {
    $("#data_area").append(data);
    
    $(':submit[act]').map(function() {
      this.onclick = button_click.bind(this);
    });

    data = { type: type };
    if (type == "rates") {
      $("#rate_select").on("change", change);
      var url = $(location).attr("href");
      var is_credit = url.includes("credit");
      data.filter = is_credit ? "> 0" : "< 0";
      $("#rate_select").val((is_credit ? "Кредиты" : "Депозиты"));
    }

    if (type == "employees") {
      edit_ajax({ type: "departments" }, function (data) {
        $("#department_select").empty();
        for (var object of data) 
          $("#department_select").append('<option dep_id="' + object.dep_id + '">' + object.address + '</option>');
      });

      edit_ajax({ type: "positions" }, function (data) {
        $("#position_select").empty();
        for (var object of data) 
          $("#position_select").append('<option pos_id="' + object.pos_id + '">' + object.pos_name + '</option>');
      });
    }

    edit_ajax(data, function(data) {
      renderEditTable("#" + type + "_table", data);
    });
  })
  .fail(on_failed);
}