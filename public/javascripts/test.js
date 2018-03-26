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
  var res = "";
  var num = parseInt(document.getElementById(satellite_num).value);
  planets_info.forEach(function(pl) {
    if (pl.num >= num)
      res += pl.name + " ";
  });
  document.getElementById(satellite_res).innerHTML = res;
}