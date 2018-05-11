function on_failed(jqXHR, textStatus) {
  console.log("Request failed: " + textStatus);
}

function load(file, success, failed=on_failed, path="/javascripts/includes/") {
  $.ajax({
    url: path + file + ".js",
    dataType: "script"
  })
  .done(success)
  .fail(failed);
}

function ajax(data, success, method="POST", failed=on_failed) {
  $.ajax({
    method: method,
    url: "/user",
    cache: false,
    data: data
  })
  .done(success)
  .fail(on_failed);
}

function select() {
  $(".is-active").removeAttr("class");
  $(this).attr("class", "is-active");
}

function client_changed() {
  var client_id = $("#client_select option:selected").attr("client_id");

  ajax({
    type: "contracts",
    client_id: client_id
  }, function (data) {
    $("#contract_select").empty();
    for (var obj of data)
      $("#contract_select").append('<option contract_id="' + obj.contract_id + '">' + obj.contract_id + ": " + obj.rate_name + ' (' + obj.rate_type + ')</option>');
    $("#contract_select").val("");
  });
}

function render(data) {
  renderTable("#table", data);
  //draw graphic here
}

function contract_changed() {
  var contract_id = $("#contract_select option:selected").attr("contract_id");
  var client_id = $("#client_select option:selected").attr("client_id");

  ajax({
    type: "payments",
    client_id: client_id,
    contract_id: contract_id
  }, function (data) {
    render(data);
    $("#controls").removeAttr("style");
  });

  ajax({
    type: "contract-info",
    contract_id: contract_id
  }, function(data) {
    var obj = data[0];
    $("#contract_balance").text(obj.balance + "р.");
    $("#employee_name").text(obj.emp_surname + " " + obj.emp_name + " " + obj.emp_patronymic);
    $("#rate_info").text(obj.rate_type + ' ' + obj.rate_name + ": " + obj.rate_amount + "р. под " + obj.per_rate*100 + "%");
  });
}

function make_payment() {
  var contract_id = $("#contract_select option:selected").attr("contract_id");
  var client_id = $("#client_select option:selected").attr("client_id");
  var cash = $("#cash").val();

  if (isNaN(parseInt(cash))) {
    alert("Ошибка: сумма введена неверно!");
    return;
  }

  ajax({
    type: "pay",
    client_id: client_id,
    contract_id: contract_id,
    cash: cash
  }, function(data) {
    render(data);
    $("#cash").val("");
  });
}

var on_load = function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });

  $("#controls").attr("style", "display: none");
  $("#client_select").change(client_changed);
  $("#contract_select").change(contract_changed);
  $("#pay").click(make_payment);

  $("#client_select").val("");
};

$(function() {
  var translation = false;
  var render = false;

  var loaded = function() {
    if (translation && render) {
      on_load();
    }
  }

  load("translation", function() {
    translation = true;
    loaded();
  });

  load("renderTable", function() {
    render = true;
    loaded();
  });
})