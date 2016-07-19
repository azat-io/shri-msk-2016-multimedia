const video = document.querySelector('.player__video')
const canvas = document.querySelector('.player__canvas')
// const audio = document.querySelector('.player__audio')

// 41.708 мс. - Длительность одного кадра в видео 24 кадра в секунду
// ^ http://cyclowiki.org/wiki/Миллисекунда
const fps = 41.708

video.addEventListener('play', () => {
  video.width = canvas.width = video.offsetWidth
  video.height = canvas.height = video.offsetHeight

  let context = canvas.getContext('2d')

  setInterval(() => {
   // Импортируем изображение из видео
    context.drawImage(video, 0, 0, video.width, video.height)

   // Экспортируем в Canvas
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    let px = imageData.data

    // Преобразуем массив, изменяя значения RGB цветов
    for (var i = 0, n = px.length; i < n; i += 4) {
      let value = Math.random() + 1

      let r = px[i]
      let g = px[i + 1]
      let b = px[i + 2]

      let v = 0.2126 * r + 0.7152 * g + 0.0722 * b
      px[i] = px[i + 1] = px[i + 2] = v * value
    }

    context.putImageData(imageData, 0, 0)
  }, fps)
}, false)
