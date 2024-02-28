const request = require('request');
const sizeOf = require('image-size');
const sizeOfBuffer = require('buffer-image-size');

module.exports = function(imageUrl) {
  console.log({imageUrl})

  if (imageUrl.startsWith('data:,')) {
    return {
      width: 0,
      height: 0
    }
  }
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
  if (base64Image.startsWith('data:image/svg+xml')) {
    return {
      width: 50,
      height: 50
    }
  }

  // Extract the base64 data from the string (remove the data URL part)
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  // console.log(base64Data.slice(0, 50));

  // Convert the base64 string to a Buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  // Get the dimensions of the image
  const dimensions = sizeOfBuffer(imageBuffer);

  // Return dimensions as a JSON object
  return {
      width: dimensions.width,
      height: dimensions.height
  };
}