const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");

exports.saveWithFrame = function (imagePathIn, imgPathOut, inverted = false) {
  let templatePath = "./assets/template.svg";
  let template = fs.readFileSync(templatePath, "utf8");
  parseString(template, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var json = result;
      json.svg.g[0].image[0].$["xlink:href"] = "../" + imagePathIn;
      json.svg.g[1].image[0].$["xlink:href"] = inverted ? "frame_black.png" : "frame.png";
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(json);
      let newPath = imagePathIn.replace(".png", ".svg").replace(".jpg", ".svg");
      fs.writeFile(newPath, xml, function (err, data) {
        if (err) console.log(err);        
        sharp(newPath).png().toFile(imgPathOut);
      });
    }
  });
};
function resolve() {
  return path.resolve(__dirname, path.join.apply(path, arguments));
}
