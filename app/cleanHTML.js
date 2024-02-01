const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

module.exports = function(inputFile) {
  const outputFile = '/tmp/temp.html';

  // Read the HTML file
  let data = fs.readFileSync(inputFile, 'utf8')

  // if (data.indexOf('class="blogger-title"') === -1) {
  //   return inputFile
  // }

  // Load the HTML content into Cheerio
  const $ = cheerio.load(data);

    // =================================================================

  // Remove h1 elements with class 'blogger-title'
  $('h1.blogger-title').remove();

  $('img').each(function () {
    // $(this).css('max-width', '70%');
    // $(this).attr('width', '50%')
    $(this).css('height', 'auto')
  });

  // =================================================================

  // Get the modified HTML content
  const modifiedHtml = $.html();

      // Write the modified HTML content to the output file
  fs.writeFileSync(outputFile, modifiedHtml, 'utf8');

  return outputFile
}

