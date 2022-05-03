const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const output = require("sharp/lib/output");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");

exports.saveWithFrame = function (imagePathIn, imgPathOut, inverted = false) {
  let timestamp = Math.floor(new Date().getTime() / 1000);
  let templatePath = "./assets/template.svg";
  let template = fs.readFileSync(templatePath, "utf8");
  parseString(template, function (err, json) {
    if (err) {
      console.log(err);
    } else {
      //Copy image to assets folder
      let imagePath = resolve(imagePathIn);
      //check height and width of input image
      sharp(imagePath)
        .metadata()
        .then(function (metadata) {
          let width = metadata.width;
          let height = metadata.height;
          //check if image is of correct dimensions
          if (width != 4026 || height != 5826) {
            throw new Error("Image dimensions must be 4026x5826");
          }
        });
      let extension = path.extname(imagePath);
      let assetPath = "./assets/user_image" + timestamp + extension;
      fs.copyFile(imagePathIn, assetPath, (err) => {
        if (err) throw err;
        json.svg.g[0].image[0].$["xlink:href"] = "../" + assetPath;
        json.svg.g[1].image[0].$["xlink:href"] = inverted ? "frame_black.png" : "frame.png";
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
function resolve() {
  return path.resolve(__dirname, path.join.apply(path, arguments));
}
