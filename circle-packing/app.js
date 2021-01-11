const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const text_canvas = document.createElement("canvas");
const text_ctx = text_canvas.getContext("2d");
text_canvas.width = canvas.width;
text_canvas.height = canvas.height;

let image_data = writeText(text_ctx, animals[animals.length * Math.random() | 0]);
const circlePacker = new CirclePacker(image_data);

let last_text = performance.now();

function loop() {
    if(performance.now() - last_text > 3000) {
        write(animals[animals.length * Math.random() | 0]);
        last_text = performance.now();
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.putImageData(image_data, 0, 0);
    circlePacker.update();
    circlePacker.draw(ctx);
    requestAnimationFrame(loop);
}
loop();

function getTime(seperator = ":") {
    const date = new Date();
    let hours = date.getHours();
    if(hours < 10) {
        hours = "0" + hours;
    }
    let minutes = date.getMinutes();
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    let seconds = date.getSeconds();
    if(seconds < 10) {
        seconds = "0" + seconds;
    }

    return `${hours}${seperator}${minutes}${seperator}${seconds}`;
}

function write(text) {
    image_data = writeText(text_ctx, text);
    circlePacker.newText(image_data);
}

function writeText(ctx, text) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let font_size = canvas.height;
    let resize_text = true;
    let font = `${font_size}px monospace`;
    let i = 0;
    while(resize_text && i < 1000) {
        i++;
        ctx.font = font;
        let text_size = ctx.measureText(text);
        if(text_size.width > canvas.width || text_size.actualBoundingBoxAscent + text_size.actualBoundingBoxDescent > canvas.height) {
            font_size--;
            font = `${font_size}px monospace`;
        } else {
            resize_text = false;
        }
    }
    ctx.font = font;
    ctx.fillStyle = "white";
    let text_size = ctx.measureText(text);
    let height = text_size.actualBoundingBoxAscent + text_size.actualBoundingBoxDescent;
    let offsetX = canvas.width * 0.5 - text_size.width * 0.5;
    let offsetY = canvas.height * 0.5 - height * 0.5;
    //ctx.strokeRect(offsetX, offsetY, text_size.width, height);
    ctx.fillText(text, offsetX, offsetY + text_size.actualBoundingBoxAscent);
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);