exports.validateEmail = function(value) {
  return value.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
}

exports.validateTel = function(value) {
  return value.match(/^(0[0-9]{1,4}[-]?)?[0-9]{1,4}[-]?[0-9]{4}$/);
}
