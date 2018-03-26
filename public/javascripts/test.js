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
  for(pl in planets_info) {
    if (pl.num >= num)
      res += pl.name + " ";
  }
  alert("bitch");
  el("satellite_num").value = res;
}