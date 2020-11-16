(function quisionerUser() {
  let getSubmitBtn = document.getElementById("getSubmitQui");
  let getMenuBtn = document.getElementById("getMenuBtn");

  if (!getSubmitBtn || !getMenuBtn) {
    return
  }

  getSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      title: 'Apakah Anda Sudah Yakin Dengan Jawabannya?',
      showDenyButton: true,
      confirmButtonText: `Ya`,
      confirmButtonColor: '#fcc203',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        let getCheckInput = document.querySelectorAll("#user-quisioner .user-right .right-content #getCheck")
        let setResult = document.getElementById("result");
        let tempArray = []
        for (let i = 0; i < getCheckInput.length; i++) {
          if (getCheckInput[i].checked) {
            tempArray.push(getCheckInput[i].value)
            setResult.value = tempArray;
          }
        }
        document.querySelector('#user-quisioner .user-right .right-content form').submit();
      } else if (result.isDenied) {
        Swal.fire('Jawaban Tetap Tersimpan', '', 'info')
      }
    })

  });

  getMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      title: 'Apakah Anda Yakin Ingin Pergi Sebelum Menyelesaikan Kuisioner?',
      showDenyButton: true,
      confirmButtonText: `Ya`,
      confirmButtonColor: '#fcc203',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = `${getMenuBtn.href}`
      } else if (result.isDenied) {
        Swal.fire('Jawaban Tetap Tersimpan', '', 'info')
      }
    })
  });
}())