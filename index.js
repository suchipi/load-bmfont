var fs = require("fs");
var url = require("url");
var path = require("path");
var parseASCII = require("parse-bmfont-ascii");
var parseXML = require("parse-bmfont-xml");
var readBinary = require("parse-bmfont-binary");
var mime = require("mime");
var isBinary = require("./lib/is-binary");

function parseFont(file, data) {
  let binary = false;

  if (isBinary(data)) {
    if (typeof data === "string") data = new Buffer(data, "binary");
    binary = true;
  } else {
    data = data.toString().trim();
  }

  if (binary) {
    return readBinary(data);
  } else if (/json/.test(mime.lookup(file)) || data.charAt(0) === "{") {
    return JSON.parse(data);
  } else if (/xml/.test(mime.lookup(file)) || data.charAt(0) === "<") {
    return parseXML(data);
  } else {
    return parseASCII(data);
  }
}

module.exports = function loadFontSync(opt) {
  if (typeof opt === "string") {
    opt = { uri: opt, url: opt };
  } else if (!opt) {
    opt = {};
  }

  var file = opt.uri || opt.url;

  const data = fs.readFileSync(file, opt);
  return parseFont(file, data);
};
