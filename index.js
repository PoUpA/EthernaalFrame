const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");
const width = 4026;
const height = 5826;
exports.saveWithFrame = function (imagePathIn, imgPathOut, type = "NF2T", inverted = false) {
  let timestamp = Math.floor(new Date().getTime() / 1000);
  let templatePath = "./assets/template.svg";
  let template = fs.readFileSync(templatePath, "utf8");
  parseString(template, function (err, json) {
    if (err) {
      console.log(err);
    } else {
      //Copy image to assets folder
      let imagePath = pathResolve(imagePathIn);
      //check height and width of input image
      sharp(imagePath)
        .metadata()
        .then(function (metadata) {
          let imgWidth = metadata.width;
          let imgHeight = metadata.height;
          //check if image is of correct dimensions
          if (imgWidth != width || imgHeight != height) {
            throw new Error("Image dimensions must be " + width + "x" + height + " px");
          }
        });
      let extension = path.extname(imagePath);
      let assetPath = "./assets/user_image" + timestamp + extension;
      fs.copyFile(imagePathIn, assetPath, (err) => {
        if (err) throw err;
        json.svg.g[0].image[0].$["xlink:href"] = "../" + assetPath;
        let template = "frame.png";
        switch (type) {
          case "NF2T":
            template = inverted ? "nf2t_frame_black.png" : "nf2t_frame.png";
            break;
          case "FlaNFT":
            template = inverted ? "flanft_frame_black.png" : "flanft_frame.png";
            break;
          case "eNFT":
            template = inverted ? "enft_frame_black.png" : "enft_frame.png";
            break;
        }
        json.svg.g[1].image[0].$["xlink:href"] = template;
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(json);
        let newPath = "./assets/output" + timestamp + ".svg";
        fs.writeFile(newPath, xml, function (err, data) {
          if (err) throw err;
          sharp(newPath)
            .png()
            .toFile(imgPathOut)
            .then(function (info) {
              //remove temp files
              fs.unlink(newPath, function (err) {
                if (err) throw err;
                fs.unlink(assetPath, function (err) {
                  if (err) throw err;
                });
              });
            });
        });
      });
    }
  });
};
exports.saveWithFrameB64 = function (imageB64In, type = "NF2T", inverted = false) {
  let timestamp = Math.floor(new Date().getTime() / 1000);
  let templatePath = "./assets/template.svg";
  let template = fs.readFileSync(templatePath, "utf8");
  let newPath = "./assets/output" + timestamp + "_b64.svg";
  return new Promise((resolve, reject) => {
    parseString(template, async function (err, json) {
      if (err) {
        throw err;
      } else {
        json.svg.g[0].image[0].$["xlink:href"] = imageB64In;
        let template = "frame.png";
        switch (type) {
          case "NF2T":
            template = inverted ? "nf2t_frame_black.png" : "nf2t_frame.png";
            break;
          case "FlaNFT":
            template = inverted ? "flanft_frame_black.png" : "flanft_frame.png";
            break;
          case "eNFT":
            template = inverted ? "enft_frame_black.png" : "enft_frame.png";
            break;
        }
        json.svg.g[1].image[0].$["xlink:href"] = template;
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(json);
        try {
          fs.writeFileSync(newPath, xml);
          const imgBuffer = await sharp(newPath).png().toBuffer();
          fs.unlinkSync(newPath);
          resolve(`data:image/png;base64,${imgBuffer.toString("base64")}`);
        } catch (error) {
          throw err;
        }
      }
    });
  });
};
function pathResolve() {
  return path.resolve(__dirname, path.join.apply(path, arguments));
}
