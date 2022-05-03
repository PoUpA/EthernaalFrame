# Enthernaal framed image generator

## Description

This is a simple utility tool to render a PNG image with the ethernaal frame.

## Installation

```
npm install ethernaalframe
```

## Usage

```javascript
const saveWithFrame = require("ethernaalframe").saveWithFrame;
let imagePathIn = "test.png";
let imagePathOut = "framed_test.png";
let template = "NF2T";
let invertedColors = false;
saveWithFrame(imagePathIn, imgPathOut, template, invertedColors);
```

Parameters are the following :

imagePathIn = Source image (path)

imgPathOut = Output PNG (path)

template = "eNFT", "flaNFT", "NF2T"

invertedColors = boolean indicating if the frame should be in white or black color (false = black)

Source image must be 4026x5826 px

templates for "eNFT", "flaNFT", "NF2T" are in /assets/
