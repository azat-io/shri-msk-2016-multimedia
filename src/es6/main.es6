'use strict'

const video = document.querySelector('.player__video')
const canvas = document.querySelector('.player__canvas')
const audio = document.querySelector('.player__audio')

const ctx = canvas.getContext('2d')

// 41.708 мс. - Длительность одного кадра в видео 24 кадра в секунду
// Источник: http://cyclowiki.org/wiki/Миллисекунда
const fps = 41.708

let intervalId

video.width = canvas.width = video.offsetWidth
video.height = canvas.height = video.offsetHeight
initCanvas()

function initCanvas () {
  ctx.beginPath()
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawPlayButton()
}

video.addEventListener('play', () => {
  // Размер видео приравниваем к размеру Canvas
  startDrawLoop()
}, false)

video.addEventListener('pause', () => {
  stopDrawLoop()
}, false)

function drawLoop () {
  ctx.drawImage(video, 0, 0, video.width, video.height)
  grayScale()
}

function startDrawLoop () {
  if (typeof intervalId === 'undefined') {
    intervalId = setInterval(() => {
      drawLoop()
    }, fps)
  }
}

function stopDrawLoop () {
  if (typeof intervalId !== 'undefined') {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

function grayScale () {
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
  scratch()
}

function scratch () {
  // Рисуем царапины на плёнке
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  let amountOfScratches = Math.floor(Math.random() * (100 - 0 + 1))
  amountOfScratches -= 97
  if (amountOfScratches > 0) {
    for (let i = 0; i < amountOfScratches; i++) {
      interference()
    }
  }
  ctx.fill()
  function interference () {
    ctx.beginPath()
    let startPoint = {
      x: Math.floor(Math.random() * (canvas.width - 1)),
      y: Math.floor(Math.random() * (canvas.height - 1))
    }

    let endPoint = {
      x: startPoint.x,
      y: Math.floor(Math.random() * (canvas.height - startPoint.y))
    }
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
  }
}

function drawPlayButton () {
  // Рисуем кнопку Play
  // Задаём ширину и высоту кнопки
  let playButton = {
    width: 60,
    height: 70
  }
  ctx.beginPath()
  // Отрисовываем и центрируем
  ctx.moveTo(
    (canvas.width - playButton.width) / 2,
    (canvas.height - playButton.height) / 2)
  ctx.lineTo(
    (canvas.width + playButton.width) / 2,
    canvas.height / 2)
  ctx.lineTo(
    (canvas.width - playButton.width) / 2,
    (canvas.height + playButton.height) / 2)
  ctx.fillStyle = '#fcfcfc'
  ctx.fill()
}

canvas.addEventListener('click', () => {
  if (isSubShow) {
    if (audio.paused) {
      audio.play()
      drawSub()
      addSubTimeout()
    } else {
      audio.pause()
      clearSubTimeout()
      drawPlayButton()
    }
  } else {
    if (video.paused) {
      // Если видео и звук уже остановлены - по клику продолжить воспроизведение,
      video.play()
      audio.play()
    } else {
      // В противном случае остановить видео и звук по клику
      video.pause()
      audio.pause()
      drawPlayButton()
    }
  }
})

const subInput = document.querySelector('.test')
const reader = new FileReader()

let subTimeout

subInput.addEventListener('change', readSubs)

let subData

function readSubs (e) {
  reader.readAsText(e.target.files[0])
  reader.addEventListener('load', () => {
    subData = parser.fromSrt(reader.result, true)
    subData.slice(1)
    console.log(subData)

    video.addEventListener('timeupdate', updateVideo)

    function updateVideo () {
      if (video.currentTime * 1000 >= subData[0].startTime) {
        video.pause()
        drawSub()
        addSubTimeout()
      }
    }
  })
}

function drawSub () {
  if (!isSubShow) {
    console.log('time to show!!!!')
    isSubShow = true
    // ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    let leftPadding = 0.1 * canvas.width
    let topPadding = 0.1 * canvas.height
    let textWidth = 0.8 * canvas.width
    let lineHeight = 24
    ctx.font = '1.5em Oranienbaum, serif'
    for (var i = 0; i < subData[0].text.length; i++) {
      subData[0].text[i]
      ctx.fillText(subData[0].text[i], leftPadding, topPadding + lineHeight * i, textWidth)
    }
  }
}

function addSubTimeout () {
  if (typeof subTimeout === 'undefined') {
    subTimeout = setTimeout(function () {
      subData = subData.slice(1)
      video.play()
      isSubShow = false
    }, subData[0].endTime - subData[0].startTime)
  }
}

function clearSubTimeout() {
  if (typeof subTimeout !== 'undefined') {
    clearTimeout(subTimeout)
    subTimeout = undefined
  }
}

let isSubShow = false
