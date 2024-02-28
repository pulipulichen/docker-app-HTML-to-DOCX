const request = require('request');
const sizeOf = require('image-size');
const sizeOfBuffer = require('buffer-image-size');

const xml2js = require('xml2js');

module.exports = async function(imageUrl) {
  console.log({imageUrl})

  if (imageUrl.startsWith('data:,')) {
    return {
      width: 0,
      height: 0
    }
  }
  else if (imageUrl.startsWith('data:image/svg+xml,')) {
    return await extractSvgDimensions(imageUrl)
  }
  else if (imageUrl.startsWith('data:image/')) {
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

function extractSvgDimensions(base64Svg) {
  return new Promise((resolve, reject) => {
    const base64Data = base64Svg.replace(/^data:image\/svg\+xml,/, '').trim();
    // console.log(base64Data);
    // Convert the base64 string to SVG text
    let svgText
    if (base64Data.startsWith('<svg')) {
      svgText = base64Data
    }
    else {
      const svgBuffer = Buffer.from(base64Data, 'base64');
      svgText = svgBuffer.toString('utf-8');
    }
      
    // Parse the SVG to get width and height
    xml2js.parseString(svgText, (err, result) => {
      if (err) {
        console.error('Error parsing SVG:', err);
        return;
      }

      const svgRoot = result.svg;
      let width = svgRoot.$.width || 'unknown';
      let height = svgRoot.$.height || 'unknown';

      // Attempt to extract dimensions from the viewbox if width or height are missing
      if (width === 'unknown' || height === 'unknown') {
        if (svgRoot.$.viewBox) {
          const viewboxValues = svgRoot.$.viewBox.split(' ');
          if (width === 'unknown') width = viewboxValues[2]; // Assumes viewbox is "min-x min-y width height"
          if (height === 'unknown') height = viewboxValues[3];
        }
      }

      // console.log(JSON.stringify({ width, height }));
      resolve({ width, height })
    });
  })
    
}