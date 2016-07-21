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
