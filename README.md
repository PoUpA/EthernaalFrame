# Enthernaal framed image generator

## Description

This is a simple utility tool to render a PNG image with the ethernaal frame.

## Usage

```javascript
const saveWithFrame = require("ethernaalframe").saveWithFrame;
saveWithFrame(imagePathIn, imgPathOut, invertedColors);
```

Parameters are the following :
imagePathIn = Source image (path)
imgPathOut = Output PNG (path)
invertedColors = boolean indicating if the frame should be in white or black color (false = white)

Source image must be 4026x5826 px
