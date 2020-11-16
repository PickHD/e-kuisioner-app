(function delUser() {

  const getBtnDelUser = document.getElementById("btnDelete");
  if (!getBtnDelUser) {
    return;
  }
  getBtnDelUser.addEventListener("click", (e) => {
    e.preventDefault();
    (function confirmAction() {
      Swal.fire({
        icon: "warning",
        title: 'Apakah Anda Yakin Ingin Menghapus Data?',
        showDenyButton: true,
        confirmButtonText: `Ya`,
        confirmButtonColor: '#fcc203',
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "User Berhasil Dihapus!",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
          window.location = `${getBtnDelUser.href}`
        } else if (result.isDenied) {
          Swal.fire('Data Tidak Terhapus', '', 'info')
        }
      })
    }());
  });

}());