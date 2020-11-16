(function addQuisioner() {
  const getBtnAddQSubmit = document.getElementById("btnAddQSubmit")
  if (!getBtnAddQSubmit) {
    return;
  }
  getBtnAddQSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Apakah Anda Yakin Ingin Menambah Kuisioner?',
      showDenyButton: true,
      confirmButtonText: `Ya`,
      confirmButtonColor: '#fcc203',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Berhasil Ditambahkan!",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        document.querySelector('#manage-quisioner .user-right .right-content .next-form form').submit();
      } else if (result.isDenied) {
        Swal.fire('Data Tidak Berubah', '', 'info')
      }
    })
  });
}())