const request = require('request');
const sizeOf = require('image-size');


module.exports = function(imageUrl) {
  return new Promise(function(resolve, reject) {
    // Make an HTTP GET request to fetch the image
    request({ url: imageUrl, encoding: null }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Get image dimensions
        const dimensions = sizeOf(body);
        resolve(dimensions)
        // console.log(`Image width: ${dimensions.width}px`);
        // console.log(`Image height: ${dimensions.height}px`);
      } else {
        reject(error);
      }
    });
  })
}