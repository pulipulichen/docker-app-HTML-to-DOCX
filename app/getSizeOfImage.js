const request = require('request');
const sizeOf = require('image-size');

const { promisify } = require('util');
const sharp = require('sharp');

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

async function getImageDimensionsFromBase64(base64String) {
  // Remove header from base64 string
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  // Decode base64 data
  const buffer = Buffer.from(base64Data, 'base64');
  
  try {
      // Use sharp library to read image dimensions
      const metadata = await sharp(buffer).metadata();
      const { width, height } = metadata;
      return { width, height };
  } catch (error) {
      console.error('Error reading image:', error);
      return null;
  }
}

// Function to get image dimensions from base64 string
async function getImageDimensions(base64Image) {
  try {
      const dimensions = await getImageDimensionsFromBase64(base64Image);
      return dimensions;
  } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
  }
}