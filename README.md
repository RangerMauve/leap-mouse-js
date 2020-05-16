# leap-mouse-js
Control mouse with a [Leapmotion](https://developer-archive.leapmotion.com/documentation/javascript/index.html) and [RobotJS](https://robotjs.io/)

```
# Set up leap motion and run their daemon
# Set up node.js and node-gyp on your system
git clone git@github.com:RangerMauve/leap-mouse-js.git
cd leap-mouse-js
npm install
node index.js
```

## How it works

- Listens to LeapMotion events through JS API
- Get hand position within LeapMotion's Interaction Box
- Normalize to [0-1]
- Multiply x and y by width and height of screen
- Set the mouse position using robot JS on each frame
- Detect pinching (0.8 threshold)
- Holding pinch > 500ms is mouse down
- Releasing pinch after hold is mouse up
- Quickly pinching and releasing is a regular click
- Hold your palm horizontally when pinching for left mouse, vertically for right mouse
