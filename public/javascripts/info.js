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
  "salary" : "Зарплата"
};

function renderTable(data) {
  $("table").empty().append("<tbody>").append("<tr>");

  for(var name in data[0]) {
    var tmp = translation[name];
    if (tmp) {
      $("tbody > tr").append("<th>" + tmp + "</th>");
    }
  }
  
  for(var object of data) {
    var row = "";
    for (var field in object) {
      if (translation[field]) {
        row += "<td>" + object[field] + "</td>";
      }
    }
    $("tbody").append("<tr class='text-center'>" + row + "</tr>");
  }
}

function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
  var request_type = $(this).children().first().attr("class");
  $.ajax({
    method: "POST",
    url: "/info",
    cache: false,
    data: { type: request_type }
  })
  .done(renderTable)
  .fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });
}

$(function() {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });
});