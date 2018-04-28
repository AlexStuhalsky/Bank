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

function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

$(function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });
});

function renderTable(table_name, data) {
  $(table_name).empty().append("<tbody>").append("<tr>");

  for(var name in data[0]) {
    var tmp = translation[name];
    if (tmp) {
      $(table_name + "> tbody > tr").append("<th>" + tmp + "</th>");
    }
  }
  
  for(var object of data) {
    var row = "";
    for (var field in object) {
      if (translation[field]) {
        row += "<td>" + object[field] + "</td>";
      }
    }
    $(table_name + "> tbody").append("<tr class='text-center'>" + row + "</tr>");
  }
}

$(function() {
  var on_failed = function (jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  };

  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: { type: "rates" } 
  })
  .done(function (data) {
    renderTable("#rates_table", data);
  })
  .fail(on_failed);

  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: { type: "clients" } 
  })
  .done(function (data) {
    renderTable("#clients_table", data);
  })
  .fail(on_failed);

  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: { type: "employees" } 
  })
  .done(function (data) {
    renderTable("#employees_table", data);
  })
  .fail(on_failed);

  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: { type: "departments" } 
  })
  .done(function (data) {
    departments = data;
    renderTable("#departments_table", data);

    $("#department_select").empty();
    for(var object of data) {
      $("#department_select").append('<option value="' + object.dep_id + '">' + object.address + '</option>');
    }
  })
  .fail(on_failed);

  $.ajax({
    method: "POST",
    url: "/edit",
    cache: false,
    data: { type: "positions" } 
  })
  .done(function (data) {
    positions = data;
    renderTable("#positions_table", data);

    $("#position_select").empty();
    for(var object of data) {
      $("#position_select").append('<option value="' + object.pos_id + '">' + object.pos_name + '</option>');
    }
  })
  .fail(on_failed);
});