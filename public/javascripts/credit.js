var on_failed = function(jqXHR, textStatus) {
  console.log("Request failed:" + textStatus);
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
  load("fast_edit", function() {
    load_logic();
  });
});