var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/edit', function(req, res, next) {
  res.render("edit", {
    req: req,
    title: "Редактирование записей"
  });
});

router.post('/edit', function(req, res, next) {
  var obj = req.body;
  var type = obj.type;
  var request = new mssql.Request();
  var do_update = type.includes("update");
  var do_insert = type.includes("insert");

  var query = "";
  if (type.includes("clients")) {
    if (do_update) {
      query += "update clients set surname = '" + obj.surname + "', name = '" + obj.name + "', patronymic = '" + obj.patronymic + 
              "', birth_date = '" + obj.birth_date + "', address = '" + obj.address + "' where client_id = " + obj.data_id + ";";
    }
    else if (do_insert) {
      query += "insert into clients values ('" + obj.surname + "', '" + obj.name + "', '" + obj.patronymic + "', '" + obj.birth_date + "', '" + obj.address + "', 0);";
    }
    query += 'select client_id as data_id, surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address from clients;';
  }
  else if (type.includes("employees")) {
    query += "declare @dep_id int = (select dep_id from departments where address = '" + obj.address + "');";
    query += "declare @pos_id int = (select pos_id from positions where pos_name = '" + obj.pos_name + "');";
    if (do_update) {
      query += "update employees set surname = '" + obj.surname + "', name = '" + obj.name + "', patronymic = '" + obj.patronymic + 
              "', birth_date = '" + obj.birth_date + "', dep_id = @dep_id, pos_id = @pos_id where emp_id = " + obj.data_id + ";";
    }
    else if (do_insert) {
      query += "insert into employees values ('" + obj.surname + "', '" + obj.name + "', '" + obj.patronymic + "', '" + obj.birth_date + "', @dep_id, @pos_id);";
    }
    query += "select emp_id as data_id, surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address, pos_name from employees_view;";
  }
  else if (type.includes("rates")) {
    if (do_update) {
      query += "update rates set rate_name = '" + obj.name + "' where rate_id = " + obj.data_id + ";";
    }
    else if (do_insert) {
      query += "insert into rates values (" + obj.amount + ", " + obj.percent + ", '" + obj.name + "', default, default);";
    }
    query += "select rate_id as data_id, rate_name, abs(amount) as amount, cast((per_rate * 100) as varchar(3)) + '%' as per_rate from rates where amount " + obj.filter + ";";
  }
  else if (type.includes("departments")) {
    if (do_update) {
      query += "update departments set address = '" + obj.address + "' where dep_id = " + obj.data_id + ";";
    }
    else if (do_insert) {
      query += "insert into departments values ('" + obj.address + "');";
    }
    query += 'select dep_id as data_id, dep_id, address from departments;';
  }
  else if (type.includes("positions")) {
    if (do_update) {
      query += "update positions set pos_name = '" + obj.name + "', salary = " + obj.salary + " where pos_id = " + obj.data_id + ";";
    }
    else if (do_insert) {
      query += "insert into positions values ('" + obj.name + "', " + obj.salary + ");";
    }
    query += 'select pos_id as data_id, pos_id, pos_name, salary from positions;';
  }

  request.query(query)
  .then(function(records) {
    res.json(records.recordset);
  });
});

module.exports = router;
