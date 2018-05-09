function load_logic() {
  var render = false;
  var functions = false;
  var translation = false;

  var loaded = function() {
    if (render && functions && translation) {
      on_load();
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
};

function edit_data() {
  var type = $(this).attr("edit_type");
  $("#data_area").empty();

  $.ajax({
    method: "GET",
    url: "/edit?type=" + type,
    cache: false
  })
  .done(function(data) {
    $("#data_area").append(data);
    
    $(':submit[act]').map(function() {
      this.onclick = button_action.bind(this);
    });

    data = { type: type };
    if (type == "rates") {
      $("#rate_select").on("change", change);
      var url = $(location).attr("href");
      var is_credit = url.includes("credit");
      data.filter = is_credit ? "> 0" : "< 0";
      $("#rate_select").val((is_credit ? "Кредиты" : "Депозиты"));
    }

    edit_ajax(data, function(data) {
      renderEditTable("#" + type + "_table", data);
    });
  })
  .fail(on_failed);
}

function on_load() {
  $("button[edit_type]").map(function() {
    this.onclick = edit_data.bind(this);
  });
}