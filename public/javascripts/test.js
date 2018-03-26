$(document).foundation()

function el(id) {
  return document.getElementById(id);
}

var planets_info = [
  { name: 'Сатурн', num: '17'},
  { name: 'Юпитер', num: '16'},
  { name: 'Уран', num: '14'},
  { name: 'Марс', num: '2'},
  { name: 'Нептун', num: '2'},
  { name: 'Земля', num: '1'},
  { name: 'Плутон', num: '1'}
]

function satellite_click() {
  var res = "";
  // var num = parseInt(el(satellite_num).value);
  var num = 3;
  planets_info.forEach(function(pl) {
    if (parseInt(pl.num) >= num)
      res.concat(pl.name + " ");
  }); 
  el("satellite_num").value = res;
}