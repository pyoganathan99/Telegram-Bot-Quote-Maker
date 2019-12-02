const Jimp = require('jimp');
const fs = require('fs');
const _ = require('lodash');

const server = require('server');
const { get } = server.router;

const sendFile = require('./send-file');

const BLUE = 0x2196f3ff;

const HEIGHT = 1080;
const WIDTH = 1080;

const BORDER = 48;
const PADDING = 72;

function drawBorder(img, color) {

    // Top Border
    for (i = 0; i < WIDTH; i++) {
        for (j = 0; j < BORDER; j++) {
            img.setPixelColor(color, i, j);
        }
    }

    // Right Border
    for (i = 0; i < HEIGHT; i++) {
        for (j = WIDTH - BORDER; j < WIDTH; j++) {
            img.setPixelColor(color, j, i);
        }
    }

    // Bottom Border
    for (i = 0; i < WIDTH; i++) {
        for (j = HEIGHT - BORDER; j < HEIGHT; j++) {
            img.setPixelColor(color, i, j);
        }
    }

    // Left Border
    for (i = 0; i < HEIGHT; i++) {
        for (j = 0; j < BORDER; j++) {
            img.setPixelColor(color, j, i);
        }
    }

}

async function createPostAndSend(text) {

    let img = await new Jimp(1080, 1080, 0x131313ff);

    let font = await Jimp.loadFont('font/font.fnt');

    drawBorder(img, BLUE);

    img.print(font, BORDER + PADDING, BORDER + PADDING, {
        text: "Stay low, no matter what. Keep pushing. ❤️",
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, WIDTH - 2 * (BORDER + PADDING), HEIGHT - 2 * (BORDER + PADDING))

    img.write('tmp/quote.jpg');

    sendFile('tmp/quote.jpg');

    fs.unlink('tmp/quote.jpg', () => { })

}

server(
    {
        port: parseInt(process.env.PORT),
        log: 'emergency',
    },
    [
        get('/', ctx => 'hi'),
    ]
)