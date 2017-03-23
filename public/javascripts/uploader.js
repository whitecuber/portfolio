window.onload = (function() {
  document.getElementById('item-uploader').addEventListener('change', (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    console.log(file)
    if (file.type.indexOf('image') < 0) {
      return false;
    }

    reader.onload = function(e) {
      document.getElementById('item-preview').setAttribute('src', e.target.result)
    }

    reader.readAsDataURL(file)
  })
})