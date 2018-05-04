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

  $("#client").change(changed);
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

function on_failed(jqXHR, textStatus) {
  console.log("Request failed: " + textStatus);
}

function changed() {
  var client_id = $("#client_select").find(":selected").attr("client_id");

  alert(client_id);

  $.ajax({
    method: "POST",
    url: "/user",
    cache: false,
    data: {
      type: "contracts",
      client_id: client_id
    } 
  })
  .done(function (data) {
    $("#contract_select").empty();
    for(var object of data) {
      $("#contract_select").append('<option contract_id="' + object.contract_id + '">' + object.contract_id + ": " + object.amount + '</option>');
    }
  })
  .fail(on_failed);
}