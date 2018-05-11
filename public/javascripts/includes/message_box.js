function messageBox(message, type="caution") {
  $.ajax({
    method: "POST",
    url: "/components?type=" + type,
    cache: false
  })
  .done(function(data) {
    $("#message-box").empty().append(data);
    $("#message-box-text").text(message);
  })
  .fail(on_failed);
}