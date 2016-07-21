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
