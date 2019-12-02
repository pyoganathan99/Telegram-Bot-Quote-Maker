const Jimp = require('jimp');
const fs = require('fs');
const _ = require('lodash');

const server = require('server');
const { get, post } = server.router;

const sendFile = require('./send-file');

const HEIGHT = 1080;
const WIDTH = 1080;

const BORDER = 48;
const PADDING = 72;

const colors = {
    "RED ": 0xf44336ff,
    "PIN ": 0xe91e63ff,
    "PUR ": 0x9c27b0ff,
    "DPU ": 0x673ab7ff,
    "IND ": 0x3f51b5ff,
    "BLU ": 0x2196f3ff,
    "LBL ": 0x03a9f4ff,
    "CYA ": 0x00bcd4ff,
    "TEA ": 0x009688ff,
    "GRE ": 0x4caf50ff,
    "LGR ": 0x8bc34aff,
    "LIM ": 0xcddc39ff,
    "YEL ": 0xffeb3bff,
    "AMB ": 0xffc107ff,
    "ORA ": 0xff9800ff,
    "DOR ": 0xff5722ff,
}

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

    let colorKey = text.split(' ').shift();
    let color;
    if (colors.hasOwnProperty(colorKey)) {
        color = colors[colorKey];
    } else {
        color = _.sample(Object.values(colors));
    }

    try {

        let img = await new Jimp(1080, 1080, 0x131313ff);

        let font = await Jimp.loadFont('font/font.fnt');

        drawBorder(img, color);

        img.print(font, BORDER + PADDING, BORDER + PADDING, {
            text: text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }, WIDTH - 2 * (BORDER + PADDING), HEIGHT - 2 * (BORDER + PADDING))

        img.write('tmp/quote.jpg');

        sendFile('tmp/quote.jpg');

        fs.unlink('tmp/quote.jpg', () => { })

    } catch (e) {
        console.log(e);
    }

}

server(
    {
        port: parseInt(process.env.PORT),
        log: 'emergency',
        security: {
            csrf: false,
        }
    },
    [
        post('/', ctx => {
            console.log(ctx.data);
            createPostAndSend(ctx.data.message.text);
            return 'ok';
        }),
        get('/', () => {
            return "Am working!"
        })
    ]
)