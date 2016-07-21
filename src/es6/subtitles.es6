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
    isSubShow = true
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
