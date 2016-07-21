var parser = (function () {
  var pItems = {}

     pItems.fromSrt = function (data, ms) {
       var useMs = ms ? true : false

       data = data.replace(/\r/g, '')
       var regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g
       data = data.split(regex)
       data.shift()

       var items = []
       for (var i = 0; i < data.length; i += 4) {
         let textData = data[i + 3].trim().split('\n')
         if (typeof textData.length !== 'undefined') {
           for (var j = 0; j < textData.length; j++) {
             textData[j] = textData[j].trim()
           }
         }
         items.push({
           id: data[i].trim(),
           startTime: useMs ? timeMs(data[i + 1].trim()) : data[i + 1].trim(),
           endTime: useMs ? timeMs(data[i + 2].trim()) : data[i + 2].trim(),
           text: textData
         })
       }

    return items
  }

  pItems.toSrt = function (data) {
    if (!data instanceof Array) return ''
    var res = ''

    for (var i = 0; i < data.length; i++) {
      var s = data[i]

      if (!isNaN(s.startTime) && !isNaN(s.endTime)) {
        s.startTime = msTime(parseInt(s.startTime, 10))
        s.endTime = msTime(parseInt(s.endTime, 10))
      }

      res += s.id + '\r\n'
      res += s.startTime + ' --> ' + s.endTime + '\r\n'
      res += s.text.replace('\n', '\r\n') + '\r\n\r\n'
    }

    return res
  }

  var timeMs = function (val) {
    var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/
    var parts = regex.exec(val)

    if (parts === null) {
      return 0
    }

    for (var i = 1; i < 5; i++) {
      parts[i] = parseInt(parts[i], 10)
      if (isNaN(parts[i])) parts[i] = 0
    }

    // hours + minutes + seconds + ms
    return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4]
  }

  var msTime = function (val) {
    var measures = [ 3600000, 60000, 1000 ]
    var time = []

    for (var i in measures) {
      var res = (val / measures[i] >> 0).toString()

      if (res.length < 2) res = '0' + res
      val %= measures[i]
      time.push(res)
    }

    var ms = val.toString()
    if (ms.length < 3) {
      for (i = 0; i <= 3 - ms.length; i++) ms = '0' + ms
    }

    return time.join(':') + ',' + ms
  }

  return pItems
})()

if (typeof exports === 'object') {
  module.exports = parser
}
