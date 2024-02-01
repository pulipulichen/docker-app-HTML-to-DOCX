const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

const cleanHTML = require('./cleanHTML')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let main = async function () {
  let files = GetFiles()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]

    // if (file.endsWith('.html') === false || file.endsWith('.htm') === false) {
    //   continue
    // }
    
    let filename = path.basename(file)
    //let dirname = path.dirname(file)
    let dirname = '/output/'
    let filenameNoExt = filename
    if (filenameNoExt.indexOf('.') > -1) {
      filenameNoExt = filenameNoExt.slice(0, filenameNoExt.lastIndexOf('.'))
    }

    let tmpFile = await cleanHTML(file)

    // https://stackoverflow.com/a/75518220
    // pandoc --standalone --embed-resources --metadata pagetitle="title" index.md -o index-out.html
    // await ShellExec(`pandoc --standalone --embed-resources --metadata pagetitle="${filenameNoExt}" "${file}" -o "${path.resolve(dirname, filenameNoExt + '.docx')}"`)
    
    await ShellExec(`pandoc --standalone --embed-resources --standalone "${tmpFile}" -o "${path.resolve(dirname, filenameNoExt + '.docx')}"`)
    // await ShellExec(`pandoc --standalone --embed-resources --standalone "${tmpFile}" -o "${path.resolve(dirname, filenameNoExt + '.odt')}"`)
  }
}

main()