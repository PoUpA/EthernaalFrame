const sharp = require("sharp");
const fs = require("fs");
const saveWithFrame = require("./index.js").saveWithFrame;
const saveWithFrameB64 = require("./index.js").saveWithFrameB64;
saveWithFrame("./input/test.png", "./output/test_framed.png", "NF2T", false);
const img = getB64Img("./input/test.png").then(async (img) => {
  const test = await saveWithFrameB64(img, "NF2T", false);
  fs.writeFileSync("./output/test_framed_b64.txt", test);
});

async function getB64Img(path) {
  const img = await sharp(path).toBuffer();
  return `data:image/png;base64,${img.toString("base64")}`;
}
