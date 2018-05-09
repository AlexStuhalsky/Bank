var on_failed = function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
};

function load(file, success, failed=on_failed, path="/javascripts/includes/") {
  $.ajax({
    url: path + file + ".js",
    dataType: "script"
  })
  .done(success)
  .fail(failed);
}

function select() {
  $(".is-active").removeAttr("class");
  $(this).attr("class", "is-active");

  var type = $(".menu > li[class] > a").attr("class");
  $.ajax({
    method: "POST",
    url: "/info",
    cache: false,
    data: { type: type }
  })
  .done(function (data) {
    renderTable("table", data);
  })
  .fail(on_failed);
}

var on_load = function() {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });
};

$(function() {
  var translation = false;
  var render = false;

  var loaded = function () {
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
});