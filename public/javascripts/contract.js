function choice()
{
  var id = $(this).val();
  $("input[name=" + this.id + "_id]").val(id);
}

$(function () {
  $("select").map(function() {
    $(this).change(choice.bind(this));
    choice.call(this);
  });
});