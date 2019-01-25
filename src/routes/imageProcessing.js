'use strict';

const {resizeImageFromPath, resizeImageFromFile} = require ('../helpers/resizeImage');

const path = require('path');
const os = require('os');

const express = require('express');
const app = express();

const Busboy = require('busboy');

/**
* Retrieve an image from the specified local file path from the HTML form in
* ../public/resize-local.html, and resize it.
* This only works if the specified file path exists in the server.
*/
app.get('/resize-image-path', function(req, res){
    // Retrieve the size from the query string (image will be a square):
    let size = Number(req.query.size);
    //console.log('size='+size);
    let width = size;
    let height = size;

    // Set the format (jpg by default):
    let format = 'jpg';
    //console.log('format='+format);

    // Retrieve the image path from the query string:
    let path = req.query.path;
    //console.log('path='+path);

    // Resize:
    resizeImageFromPath(path, format, width, height).pipe(res);
});

/**
* Retrieve an image from the HTML form in ../public/index.html, and resize it.
* This works in any case.
*/
app.post('/resize-image', function(req, res){

  // Use Busboy API to retrieve the file:
  let busboy = new Busboy({headers: req.headers});

  // Pipe the request into Busboy:
  req.pipe(busboy);

  // Tell Busboy what to do with the file:
  busboy.on('finish', () => {
    let body = req.body;
    // console.log('req.body='+JSON.stringify(body));

    // Retrieve the file size (square file):
    let size = Number(body.size);
    // console.log('size='+size);
    let width = size;
    let height = size;

    // Set the image format (by default, jpg):
    let format = 'jpg';
    //console.log('format='+format);

    // Retrieve the file:
    let fileToShrink = req.files.fileToShrink;
    //console.log('fileToShrink.name='+fileToShrink.name);

    // Resize image:
    resizeImageFromFile(fileToShrink, format, width, height).pipe(res);
  });
});

module.exports = app;
