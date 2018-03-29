var planets_info = [
  { name: 'Сатурн', num: '17'},
  { name: 'Юпитер', num: '16'},
  { name: 'Уран', num: '14'},
  { name: 'Марс', num: '2'},
  { name: 'Нептун', num: '2'},
  { name: 'Земля', num: '1'},
  { name: 'Плутон', num: '1'}
]

function el(id) {
  return document.getElementById(id);
}

function task1(satellite_num, satellite_res) {
  var res = "";
  var num = parseInt(el(satellite_num).value);
  for(var pl of planets_info) {
    if (pl.num >= num)
      res += pl.name + " ";
  }
  el(satellite_res).innerHTML = res;
}

function task2(arr, arr_out, max_min, summ1, summ2, zip_arr, st_desc, st_asc) {
  var line = el(arr).value;
  var splitted = line.split(' ');
  
  var numbers = [];
  for(var s of splitted) {
    var num = parseFloat(s);
    if (!isNaN(num))
      numbers.push(num);
  }
  
  el(arr_out).innerHTML = numbers.join(", ");

  var min = numbers[0], max = numbers[0], min_ind = 0, max_ind = 0;
  for(var i = 1; i < numbers.length; i++) {
    var num = numbers[i]
    if (min > num) {
      min = num;
      min_ind = i;
    }
    if (max < num) {
      max = num;
      max_ind = i;
    }
  }  
  el(max_min).innerHTML = "Максимальный: " + max + " (" + (max_ind+1) + "); Минимальный: " + min + " (" + (min_ind+1) + ")";

  var s1 = 0, s2 = 0;
  for(var i = 0; i < numbers.length; i+=2) {
    s1 += numbers[i]
  }
  el(summ1).innerHTML = "Сумма чисел с нечётными индексами: " + s1 + "";

  for(var i = 1; i < numbers.length; i+=2) {
    s2 += numbers[i]
  }
  el(summ2).innerHTML = "Сумма чисел с чётными индексами: " + s2 + "";

  var zip = [];
  for(var num of numbers) {
    if (Math.abs(num) >= 1)
      zip.push(num);
  }
  el(zip_arr).innerHTML = zip.join(", ");

  numbers.sort(function(a, b) {
    return b - a;
  });
  el(st_desc).innerHTML = numbers.join(", ");

  numbers.reverse();
  el(st_asc).innerHTML = numbers.join(", ");
} 

function task3(line_input, word_num, longest_word, spec_words) {
  var line = el(line_input).value;
  var tmp = line.split(' ');

  var words = [];
  for(var w of tmp) {
    var spl = w.split(',');
    for(var s of spl) {
      if (s != "")
        words.push(s);
    }
  }
  el(word_num).innerHTML = "Количество слов: " + words.length;

  var ind = 0, len = words[0].length;
  for(var i = 0; i < words.length; ++i) {
    var l = words[i].length;
    if (l > len) {
      len =  l;
      ind = i;
    }
  }
  el(longest_word).innerHTML = words[ind] + " (" + ind + ")";

  var sp_words = "";
  for(var w of words) {
    if (w != w.toLowerCase()) {
      sp_words += w + " ";
    }
  }
  el(spec_words).innerHTML = sp_words;  
}

function calc_cash(amount_ui, rate_ui, months_ui, cash_ui) {
  var has_err = false;

  var amount = parseFloat(el(amount_ui).value);
  if (amount <= 0) {
    alert("Сумма должна быть положительной.");
    has_err = true;
  }  
  if (isNaN(amount)) {
    alert("Проверьте значение суммы.");
    has_err = true;
  }
  
  var rate = parseFloat(el(rate_ui).value);
  if (rate <= 0) {
    alert("Процент должен быть больше нуля.");
    has_err = true;
  }  
  if (isNaN(rate)) {
    alert("Проверьте значение процентной ставки.");
    has_err = true;
  }
  
  var months = parseInt(el(months_ui).value);
  if (months <= 0) {
    alert("Количество месяцев должно быть больше нуля.");
    has_err = true;
  }  
  if (isNaN(months)) {
    alert("Проверьте число месяцев.");
    has_err = true;
  }

  if (has_err) return;

  /*
  m = months; a = amount; r = rate;
  cash = a*r^m / (r^(m-1) + r^(m-2) + ... + p + 1)

  pol = (r^(m-1) + r^(m-2) + ... + p + 1)
  */
  rate += 1;
  var pol = 1;
  for (var i = 1; i < months; ++i) {
    pol += Math.pow(rate, i);
  }

  var cash = amount * Math.pow(rate, months) / pol;
  el(cash_ui).innerHTML = "Сумма ежемесячного взноса: " + (Math.round(cash * 100) / 100) + "";
}

function calc_deg(x1_ui, y1_ui, z1_ui, x2_ui, y2_ui, z2_ui, acc_ui, deg_res_ui) {
  var x1 = parseFloat(el(x1_ui).value);
  var y1 = parseFloat(el(y1_ui).value);
  var z1 = parseFloat(el(z1_ui).value);
  
  var x2 = parseFloat(el(x2_ui).value);
  var y2 = parseFloat(el(y2_ui).value);
  var z2 = parseFloat(el(z2_ui).value);

  var x12 = x1 * x2;
  var y12 = y1 * y2;
  var z12 = z1 * z2;
  var num = x12 + y12 + z12;

  var sqrt1 = Math.sqrt(x1*x1 + y1*y1 + z1*z1);
  var sqrt2 = Math.sqrt(x2*x2 + y2*y2 + z2*z2);
  var den = sqrt1 * sqrt2;

  var angle = Math.acos(num/den) * 180 / Math.PI;
  var acc = parseInt(el(acc_ui).value);
  var e = Math.pow(10, acc);
  el(deg_res_ui).innerHTML = "Угол между прямыми:" + Math.round(angle * e) / e;
}