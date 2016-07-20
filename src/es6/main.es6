'use strict'

const video = document.querySelector('.player__video')
const canvas = document.querySelector('.player__canvas')
// const audio = document.querySelector('.player__audio')

// 41.708 мс. - Длительность одного кадра в видео 24 кадра в секунду
// ^ http://cyclowiki.org/wiki/Миллисекунда
const fps = 41.708

video.addEventListener('play', () => {
  // Размер видео приравниваем к размеру Canvas
  video.width = canvas.width = video.offsetWidth
  video.height = canvas.height = video.offsetHeight

  let ctx = canvas.getContext('2d')

  setInterval(() => {
   // Импортируем изображение из видео
    ctx.drawImage(video, 0, 0, video.width, video.height)

   // Экспортируем в Canvas
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let px = imageData.data

    // Преобразуем массив, изменяя значения RGB цветов
    for (let i = 0, n = px.length; i < n; i += 4) {
      let value = Math.random() + 2

      let r = px[i]
      let g = px[i + 1]
      let b = px[i + 2]

      let v = 0.5 * r + 0.7 * g + 0.4 * b
      px[i] = px[i + 1] = px[i + 2] = v * value
    }

    ctx.putImageData(imageData, 0, 0)

    // Рисуем кнопку Play

    // Задаём ширину и высоту кнопки
    let playButton = {
      width: 60,
      height: 70
    }
    ctx.beginPath()
    // Центрируем кнопку
    ctx.moveTo((canvas.width - playButton.width) / 2, (canvas.height - playButton.height) / 2)
    ctx.lineTo((canvas.width + playButton.width) / 2, canvas.height / 2)
    ctx.lineTo((canvas.width - playButton.width) / 2, (canvas.height + playButton.height) / 2)
    ctx.fillStyle = '#fcfcfc'
    ctx.fill()
  }, fps)
}, false)
