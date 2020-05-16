const Leap = require('leapjs')
const robot = require('robotjs')

robot.setMouseDelay(0)

const PINCH_SENSITIVITY = 0.8
const PINCH_HOLD_TIME = 500

let lastPos = [0, 0, 0]
let pinch = false
let holdStart = 0
let pinchHold = false
let isAlt = false

Leap.loop((frame) => {
  try {
    const { interactionBox, hands } = frame
    const [hand] = hands
    if (!hand) {
      lastPos = [0, 0, 0]
      if (pinch) onRelease()
      pinch = false
      pinchHold = false
      return
    }

    const { pinchStrength, stabilizedPalmPosition } = hand
    const roll = hand.roll()

    isAlt = Math.abs(roll) > 1

    const isPinching = pinchStrength >= PINCH_SENSITIVITY

    const justPinched = !pinch && isPinching
    const justReleased = pinch && !isPinching

    const pinchTime = Date.now() - holdStart

    const isHolding = isPinching && (pinchTime >= PINCH_HOLD_TIME)
    const justHolding = !pinchHold && isHolding

    if (justPinched) onPinch()
    if (justReleased) onRelease()
    if (justHolding) onPinchHold()

    pinchHold = isHolding
    pinch = isPinching

    const tip = stabilizedPalmPosition

    const normalized = interactionBox.normalizePoint(tip, true)

    // console.log(normalized)

    lastPos = normalized
  } catch (e) {
    console.log(e.stack)
  }
})

function onPinch () {
  console.log('Pinched')
  holdStart = Date.now()
}

function onRelease () {
  console.log('Released', pinchHold)
  const button = isAlt ? 'right' : 'left'
  if (pinchHold) {
    robot.mouseToggle('up', button)
  } else {
    robot.mouseClick(button)
  }
}

function onPinchHold () {
  console.log('Holding Pinch')
  const button = isAlt ? 'right' : 'left'
  robot.mouseToggle('down', button)
}

setInterval(() => {
  const { width, height } = robot.getScreenSize()

  const [tipX, tipY] = lastPos

  if (!tipX || !tipY) return

  const x = width * tipX
  const y = height * (1 - tipY)

  robot.moveMouse(x, y)
}, 10)
