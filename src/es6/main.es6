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

let isSubShow = false

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
