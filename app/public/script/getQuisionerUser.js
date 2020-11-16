(function getQuisionerUser() {
  const getQuisionerBtn = document.querySelectorAll("#user-dashboard .user-right .right-content #quisionerBtn");
  if (!getQuisionerBtn) {
    return;
  }
  getQuisionerBtn.forEach((gQBtn) => {
    gQBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: 'Kuisioner ini  hanya bisa diikuti sekali oleh setiap peserta, bahkan jika anda tidak selesai mengerjakannya akan tetap dihitung. Anda yakin tetap ingin mengerjakannya?',
        showDenyButton: true,
        confirmButtonText: `Ya`,
        confirmButtonColor: '#fcc203',
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = `${gQBtn.href}`
        } else if (result.isDenied) {
          Swal.fire('Pikirkan baik-baik dengan keputusan anda ', '', 'info')
        }
      })
    });
  })
}())