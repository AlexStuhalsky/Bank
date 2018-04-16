var translation = {
  "surname" : "Фамилия",
  "name" : "Имя", 
  "patronymic" : "Отчество"
}

function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

$(function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });
});

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

function changed() {
  var value = $("#client").find(":selected").text();
  var splitted_value = value.split(' ');
  
  var client = { 
    surname: splitted_value[0],
    name: splitted_value[1],
    patronymic: splitted_value[2]
  };

  $.ajax({
    method: "POST",
    url: "/user",
    cache: false,
    data: client 
  })
  .done(renderTable)
  .fail(function (jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });
}

$(function () {
  $("#client").change(changed);
});