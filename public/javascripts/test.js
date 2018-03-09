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

function satellite_click(satellite_num, satellite_res) {
  var res = "fuck";
  var num = parseInt(el(satellite_num).text);
  // foreach(pl in planets_info) {
  //   if (pl.num >= num)
  //     res += pl.name + " ";
  // }
  el(satellite_res).text = res;
}