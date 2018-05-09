var on_failed = function (jqXHR, textStatus) {
  console.log("Request failed: " + textStatus);
};

function ajax(data, success, method="POST", failed=on_failed) {
  $.ajax({
    method: method,
    url: "/edit",
    cache: false,
    data: data
  })
  .done(success)
  .fail(failed);
}

function load(file, success, failed=on_failed, path="/javascripts/includes/") {
  $.ajax({
    url: path + file + ".js",
    dataType: "script"
  })
  .done(success)
  .fail(failed);
}

$(function() {
  var page = false;
  var render = false;
  var functions = false;
  var translation = false;

  var loaded = function() {
    if (data && functions && translation) {
      on_load();
    }
  }

  ajax(null, function(data) {
    $("#data").append(data);
    page = true;
    loaded();
  }, "GET");

  load("functions", function() {
    functions = true;
    on_load();
  });

  load("translation", function() {
    translation = true;
    loaded();
  });

  load("renderTable", function() {
    render = true;
    loaded();
  });
});

function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

var on_load = function() {
  $("#rate_select").map(function() {
    this.onchange = change.bind(this);
  });

  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });

  $(':submit').map(function() {
    this.onclick = button_action.bind(this);
  });

  ajax({ type: "rates", filter: "> 0" }, function (data) {
    renderEditTable("#rates_table", data);
  });

  ajax({ type: "clients" }, function (data) {
    renderEditTable("#clients_table", data);
  });

  ajax({ type: "employees" }, function (data) {
    renderEditTable("#employees_table", data);
  });

  ajax({ type: "departments" }, function (data) {
    renderEditTable("#departments_table", data);
    $("#department_select").empty();
    for (var object of data) 
      $("#department_select").append('<option dep_id="' + object.dep_id + '">' + object.address + '</option>');
  });

  ajax({ type: "positions" }, function (data) {
    renderEditTable("#positions_table", data);
    $("#position_select").empty();
    for (var object of data) 
      $("#position_select").append('<option pos_id="' + object.pos_id + '">' + object.pos_name + '</option>');
  });
};