function select() {
  $(".menu > li").attr("class", "");
  $(this).attr("class", "is-active");
}

$(function () {
  $(".menu > li").map(function() {
    this.onclick = select.bind(this);
  });
});