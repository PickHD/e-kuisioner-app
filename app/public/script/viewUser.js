(function viewUser() {
  const getBtnUpdUsr = document.getElementById("btnUpdUsrSubmit")
  if (!getBtnUpdUsr) {
    return;
  }
  getBtnUpdUsr.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Apakah Anda Yakin Ingin Memperbaharui Data?',
      showDenyButton: true,
      confirmButtonText: `Ya`,
      confirmButtonColor: '#fcc203',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Berhasil Diperbaharui!",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        document.querySelector('#manage-user .user-right .right-content .form-edit form').submit();
      } else if (result.isDenied) {
        Swal.fire('Data Tidak Berubah', '', 'info')
      }
    })
  });
}());
