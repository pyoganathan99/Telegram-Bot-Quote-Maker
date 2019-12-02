let htmlToImage = require('html-to-image');
let { JSDOM } = require('jsdom');
let canvas = require('canvas');

let node = new JSDOM(require('fs').readFileSync('index.html').toString());

global.window = node.window;

htmlToImage.toPng(node.window.document.querySelector('main'))
    .then(function (dataUrl) {
        console.log(dataUrl);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });