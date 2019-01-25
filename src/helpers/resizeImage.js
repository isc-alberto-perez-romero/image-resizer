'use strict';

const fs = require('fs');
const sharp = require ('sharp');
const path = require('path');
const streamifier = require('streamifier');

/**
* Function that resizes an image and pipes it into a Sharp transform object.
*
* The resized file is specified in the provided imagePath String.
*
* @author Alberto Pérez Romero.
* @param {string} imagePath The image path for the file to be resized.
* @param {string} format The image format. Expected formats would be: png,
*													jpg, jpeg, and gif.
* @param {number} width The width at which the image will be resized.
* @param {number} height The height at which the image will be resized.
* @param {function} callback A function to be called once the resizing is done.
* @returns The callback function with null as the first parameter, and the
*						resized image's data as the second.
*/
const resizeImageFromPath = (imagePath, format, width, height, callback) => {

  // Create a read stream from the image path:
	const readStream = fs.createReadStream(path.resolve(__dirname, imagePath));

  // Create the Sharp transform object:
	let transform = sharp();

  // Set the image format, if provided:
	if(format){
		transform = transform.toFormat(format);
	}

  // Set the width and height:
	if(width || height){
		transform = transform.resize(width, height);
	}

  // Return the resized image.
  if(callback) {
    return callback(null, readStream.pipe(transform));
  } else {
    return readStream.pipe(transform);
  }
};

/**
* Function that resizes an image and pipes it into a Sharp transform object.
*
* The resized file is directly provided.
*
* @author Alberto Pérez Romero.
* @param {File} fileToShrink The file to be resized, as received from an
*                             HTTP Request object processed by Busboy.
* @param {string} format The image format. Expected formats would be: png,
*													jpg, jpeg, and gif.
* @param {number} width The width at which the image will be resized.
* @param {number} height The height at which the image will be resized.
* @param {function} callback A function to be called once the resizing is done.
* @returns The callback function with null as the first parameter, and the
*						resized image's data as the second.
*/
const resizeImageFromFile = (fileToShrink, format, width, height, callback) => {

  // Create a read stream from the image file:
  let fileBuffer = fileToShrink.data;
  fileBuffer.name = fileToShrink.name;
  let fileReadStream = streamifier.createReadStream(fileBuffer);

  // Create the Sharp transform object:
  let transform = sharp();

  // Set the image format, if provided:
	if(format){
		transform = transform.toFormat(format);
	}

  // Set the width and height:
	if(width || height){
		transform = transform.resize(width, height);
	}

  // Return the resized image.
  if(callback) {
    return callback(null, fileReadStream.pipe(transform));
  } else {
    return fileReadStream.pipe(transform);
  }
};

module.exports = {
  resizeImageFromPath,
  resizeImageFromFile
};
