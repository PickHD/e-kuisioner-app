(function delQuisioner() {
  const getBtnDelQui = document.querySelectorAll("#btnDelQui");
  if ( !getBtnDelQui) {
    return
  }
  getBtnDelQui.forEach((gb) => {
    gb.addEventListener("click", (e) => {
      e.preventDefault();
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
            title: "Kuisioner Berhasil Dihapus!",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
          window.location = gb.href
        } else if (result.isDenied) {
          Swal.fire('Data Tidak Terhapus', '', 'info')
        }
      })
    });
  })
}())

