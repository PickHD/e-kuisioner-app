(function viewProfileUser() {
  const getBtnProfUpd = document.getElementById("btnProfileSubmit")
  if (!getBtnProfUpd) {
    return;
  }
  getBtnProfUpd.addEventListener("click", (e) => {
    e.preventDefault();
    (function confirmAction() {
      Swal.fire({
        title: 'Apakah Anda Yakin Ingin Memperbaharui Profil?',
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
          document.querySelector('#user-dashboard .user-right .right-content .profile-form-edit form').submit();
        } else if (result.isDenied) {
          Swal.fire('Data Tidak Berubah', '', 'info')
        }
      })
    }());
  });

}())