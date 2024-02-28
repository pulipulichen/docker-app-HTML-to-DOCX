const request = require('request');
const sizeOf = require('image-size');

module.exports = function(imageUrl) {
  if (imageUrl.startsWith('data:image/')) {
    return getImageDimensions(imageUrl)
  }
  return new Promise(function(resolve, reject) {
    // Make an HTTP GET request to fetch the image
    // console.log({imageUrl})
    
    try {
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
    }
    catch (e) {
      reject(e)
    }
  })
}

function getImageDimensions(base64Image) {
  // Extract the base64 data from the string (remove the data URL part)
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  // Convert the base64 string to a Buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  // Get the dimensions of the image
  const dimensions = sizeOf(imageBuffer);

  // Return dimensions as a JSON object
  return {
      width: dimensions.width,
      height: dimensions.height
  };
}