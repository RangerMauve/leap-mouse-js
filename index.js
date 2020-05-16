const Leap = require('leapjs')
const robot = require('robotjs')

robot.setMouseDelay(0)

const PINCH_SENSITIVITY = 0.8

let lastPos = [0, 0, 0]
let pinch = false

Leap.loop((frame) => {
	console.log(frame)
  try {
    const { interactionBox, hands } = frame
    const [hand] = hands
    if (!hand) {
      lastPos = [0, 0, 0]
      if (pinch) onRelease()
      pinch = false
      return
    }

    const { pinchStrength, palmPosition } = hand

    const isPinching = pinchStrength >= PINCH_SENSITIVITY

    const justPinched = !pinch && isPinching
    const justReleased = pinch && !isPinching

    pinch = isPinching

    if (justPinched) onPinch()
    if (justReleased) onRelease()

    const tip = palmPosition

    const normalized = interactionBox.normalizePoint(tip, true)

    // console.log(normalized)

    lastPos = normalized
  } catch (e) {
    console.log(e.stack)
  }
})

function onPinch () {
  console.log('Pinched')
  robot.mouseToggle('down')
}

function onRelease () {
  console.log('Released')
  robot.mouseToggle('up')
}

setInterval(() => {
  const { width, height } = robot.getScreenSize()

  const [tipX, tipY] = lastPos

  if (!tipX || !tipY) return

  const x = width * tipX
  const y = height * (1 - tipY)

  robot.moveMouse(x, y)
}, 10)
