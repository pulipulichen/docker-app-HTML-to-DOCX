const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const getSizeOfImage = require('./getSizeOfImage')


function convertCachedURLToDirectURLPTTImagur(cachedURL) {
  // const regex = /https:\/\/cache\.ptt\.cc\/c\/(https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.png)/;
  // const match = cachedURL.match(regex);
  
  // if (match && match.length >= 2) {
  //   return match[1];
  // }
  if (cachedURL.startsWith('https://cache.ptt.cc/c/https/i.imgur.com/')) {
    cachedURL = cachedURL.slice(cachedURL.lastIndexOf('/') + 1, cachedURL.indexOf('?'))
    cachedURL = 'https://i.imgur.com/' + cachedURL
  }
  
  return cachedURL; // Return the original URL if no match is found
}

function resizeImage(width, height) {
  const maxWidth = 400;
  const maxHeight = 600;

  // Calculate the new dimensions while preserving the aspect ratio
  let newWidth = width;
  let newHeight = height;

  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (width * maxHeight) / height;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
}

module.exports = async function(inputFile) {
  const outputFile = '/tmp/temp.html';

  // Read the HTML file
  let data = fs.readFileSync(inputFile, 'utf8')
  // Load the HTML content into Cheerio
  const $ = cheerio.load(data);

  // =================================================================

  let list 

  // Remove h1 elements with class 'blogger-title'
  $('h1.blogger-title').remove();

  list = $('img')
  for (let i = 0; i < list.length; i++) {
    let item = list.eq(i);

    item.attr('src', convertCachedURLToDirectURLPTTImagur(item.attr('src')))

    const dimensions = await getSizeOfImage(item.attr('src'))
    // console.log(item.attr('src'), dimensions)
    // $(this).css('max-width', '70%');
    // item.attr('width', '50%')

    let {width, height} = resizeImage(dimensions.width, dimensions.height)

    item.attr('width', width)
    item.attr('height', height)
    // item.css('max-width', '14cm');
    // item.css('height', 'auto');

    // console.log(item.attr('src'), height, width)
  }

  // =================================================================

  // Get the modified HTML content
  const modifiedHtml = $.html();

  // console.log(modifiedHtml);

      // Write the modified HTML content to the output file
  fs.writeFileSync(outputFile, modifiedHtml, 'utf8');

  return outputFile
}

