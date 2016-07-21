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
