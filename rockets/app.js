const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let rockets = 100;
let url = new URL(window.location);
if(url.searchParams.get("rockets")) {
    rockets = parseInt(url.searchParams.get("rockets"));
}

const showPath = url.searchParams.get("path");

const population = new Population(rockets, canvasWidth / 2, canvasHeight, 200, showPath);

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

let hue = 0;

function loop() {
hue += 0.001;
hue = hue % 1;
    const color = hslToRgb(hue, 1, 0.5);
    //ctx.fillStyle=`rgb(${color[0]}, ${color[1]}, ${color[2]})`
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    population.update();
    population.show(ctx);

    requestAnimationFrame(loop);
}

loop();