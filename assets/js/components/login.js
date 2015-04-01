function onSuccess(message) {
  location.href = '/login';
}

function onError(err) {
  swal({
    title: 'Oops...',
    text: err.responseJSON.message,
    type: 'error'
  });
}

module.exports = {
  path: '/login',
  onSuccess: onSuccess,
  onError: onError
};