(function viewQuisioner() {
  const getBtnUpdQui = document.getElementById("btnUpdQSubmit")
  if (!getBtnUpdQui) {
    return
  }
  getBtnUpdQui.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Apakah Anda Yakin Ingin Mengubah Kuisioner?',
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
        document.querySelector('#manage-quisioner .user-right .right-content .edit-form form').submit();
      } else if (result.isDenied) {
        Swal.fire('Data Tidak Berubah', '', 'info')
      }
    })
  });

}())