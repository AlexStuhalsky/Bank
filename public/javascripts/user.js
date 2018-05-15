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

var contract_date = null;
var contract_balance = 0;
var contract_per = 0;

function render(data) {
  renderTable("#table", data);
  $("#graph_placeholder").empty();
  $("#graph").removeAttr("hidden");
  $("#graph").empty();
  renderGraph(data);
}

function contract_changed() {
  var contract_id = $("#contract_select option:selected").attr("contract_id");
  var client_id = $("#client_select option:selected").attr("client_id");

  ajax({
    type: "contract-info",
    contract_id: contract_id
  }, function(data) {
    var obj = data[0];
    contract_balance = parseInt(obj.balance);
    contract_per = parseFloat(obj.per_rate);
    contract_date = obj.date;

    ajax({
      type: "payments",
      client_id: client_id,
      contract_id: contract_id
    }, function (arr) {
      render(arr);
      $("#controls").removeAttr("style");
    });

    $("#contract_balance").text(Math.abs(obj.balance) + "р.");
    $("#employee_name").text(obj.emp_surname + " " + obj.emp_name + " " + obj.emp_patronymic);
    $("#rate_info").text(obj.rate_type + ' ' + obj.rate_name + ": " + Math.abs(obj.rate_amount) + "р. под " + obj.per_rate*100 + "%");
  });
}

function make_payment() {
  var contract_id = $("#contract_select option:selected").attr("contract_id");
  var client_id = $("#client_select option:selected").attr("client_id");
  var cash = $("#cash").val();

  if (isNaN(parseInt(cash))) {
    messageBox("Ошибка: сумма введена неверно!", "error");
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

function renderGraph(data) {
  var data1 = [], data2 = [], labels = [];
  var balance = contract_balance;
  var len = data.length;
  var date = null;

  var lbl1 = null, lbl2 = null;

  if (len > 0) {
    var i = len > 10 ? len-10 : 0;
    for (var j = len-1; j >= i; j--) {
      data1.unshift(Math.abs(balance));
      labels.unshift(data[j].date);
      balance += data[j].amount;
    }
    date = new Date(data[len-1].date);
    lbl1 = "История выплат";
    lbl2 = "Рост кредита";
  }
  else {
    date = new Date(contract_date);
    lbl1 = "История взносов";
    lbl2 = "Рост депозита";
  }

  balance = contract_balance;
  for (i = 0; i < 3; i++) {
    balance += Math.round(balance * contract_per);
    data2.push(Math.abs(balance));
    date.setDate(date.getDate() + 30);
    labels.push(date.toISOString().substring(0, 10));
  } 

  var green = 'rgba(57, 219, 116, 0.5)',
      blue = 'rgba(23, 121, 186, 1)',
      red = 'rgba(204, 76, 56, 0.25)';

  var ctx = $("#graph")[0].getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: lbl1,
        lineTension: 0,
        data: data1,
        backgroundColor: green,
        borderColor: blue,
        pointBackgroundColor: blue,
        borderWidth: 1
      }, {
        label: lbl2,
        lineTension: 0,
        data: data1.concat(data2),
        backgroundColor: red,
        borderColor: blue,
        pointBackgroundColor: blue,
        borderWidth: 1
      }]
    }
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

  $("#calc_amount").click(calc_amount);
  $("#calc_cash").click(calc_cash);
};

$(function() {
  var translation = false;
  var render = false;
  var message_box = false;

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

  load("message_box", function() {
    message_box = true;
    loaded();
  });
})

function calc_amount() {
  var amount, rate, months;

  try {
    amount = parseInt($("#amount").val());
    if (amount <= 0)
      throw "Сумма должна быть положительной.";

    if (isNaN(amount))
      throw "Проверьте значение суммы.";
    
    rate = parseInt($("#rate").val());
    if (rate < 0 || rate > 100 )
      throw "Процент должен быть больше 0 и меньше 100.";

    if (isNaN(rate))
      throw "Проверьте значение процентной ставки.";
    
    months = parseInt($("#period").val());
    if (months <= 0)
      throw "Количество месяцев должно быть больше нуля.";

    if (isNaN(months))
      throw "Проверьте число месяцев.";
  }
  catch (message) {
    messageBox(message, "error");
    return;
  }

  rate = rate / 100 + 1;
  var cash = amount * Math.pow(rate, months);
  $("#final_amount").text("Конечная сумма кредита: " + (Math.round(cash * 100) / 100));
}

function calc_cash() {
  var amount, rate, months;

  try {
    amount = parseInt($("#credit_amount").val());
    if (amount <= 0)
      throw "Сумма должна быть положительной.";

    if (isNaN(amount))
      throw "Проверьте значение суммы.";
    
    rate = parseInt($("#credit_rate").val());
    if (rate < 0 || rate > 100 )
      throw "Процент должен быть больше 0 и меньше 100.";

    if (isNaN(rate))
      throw "Проверьте значение процентной ставки.";
    
    months = parseInt($("#credit_period").val());
    if (months <= 0)
      throw "Количество месяцев должно быть больше нуля.";

    if (isNaN(months))
      throw "Проверьте число месяцев.";
  }
  catch (message) {
    messageBox(message, "error");
    return;
  }

  rate = rate / 100 + 1;
  var pol = 0;
  for (var i = 1; i <= months; ++i) {
    pol += Math.pow(rate, i);
  }

  var cash = amount * Math.pow(rate, months) / pol;
  $("#credit_cash").text("Сумма ежемесячного взноса: " + (Math.round(cash * 100) / 100));
}