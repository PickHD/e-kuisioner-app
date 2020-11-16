(function suspendAccUser() {
  const getBtnSus = document.getElementById("btnSusSubmit")
  if (!getBtnSus) {
    return;
  }
  getBtnSus.addEventListener("click", (e) => {
    e.preventDefault();
    const getInputCheck = document.getElementById("getChecked");
    if (!getInputCheck) {
      return;
    }
    if (getInputCheck.checked) {
      Swal.fire({
        title: 'Apakah Anda Yakin Ingin Menonaktifkan Akun?',
        showDenyButton: true,
        confirmButtonText: `Ya`,
        confirmButtonColor: '#fcc203',
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Terimakasih Atas Partisipasinya. Anda Akan Terlogout Otomatis",
            icon: 'info',
            showConfirmButton: false,
            timer: 1500
          })
          document.querySelector('#user-dashboard .user-right .right-content .suspend-form form').submit();
        } else if (result.isDenied) {
          Swal.fire('Pikirkan Kembali Dengan Keputusan Anda', '', 'info')
        }
      })
    } else {
      Swal.fire('Mohon Untuk Centang Persyaratan Terlebih Dahulu.', '', 'warning')
    }
  });
}())