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
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

function changed() {
  var client_id = $("#client_select").find(":selected").attr("client_id");

  alert(client_id);

  ajax({
    type: "contracts",
    client_id: client_id
  }, function (data) {
    $("#contract_select").empty();
    for(var object of data)
      $("#contract_select").append('<option contract_id="' + object.contract_id + '">' + object.contract_id + ": " + object.amount + '</option>');
  });
}

var on_load = function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });

  $("#client").change(changed);
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