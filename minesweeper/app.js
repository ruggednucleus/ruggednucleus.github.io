"use strict"

let canvas, ctx, minesweeperBoard, cells, ms;

function loadImage(src, callback) {
    let image = new Image();
    image.src = src;
    image.onload = () => callback(image);
}

function startGame(flag_icon) {
    let size = 40;

    let width =  8 // 10,18,24;
    let height = 10 //  8,14,20;
    let mines =  10 // 10,40,99;

    let url = new URL(window.location);
    if(url.searchParams.get("width")) {
        width = parseInt(url.searchParams.get("width"));
    }

    if(url.searchParams.get("height")) {
        height = parseInt(url.searchParams.get("height"));
    }

    if(url.searchParams.get("mines")) {
        mines = parseInt(url.searchParams.get("mines"));
    }
    
    if(url.searchParams.get("size")) {
        size = parseInt(url.searchParams.get("size"));
    }

    ms = new Minesweeper(size, flag_icon, "ontouchstart" in window);
    canvas = ms.canvas;

    document.body.appendChild(canvas);

    ms.start(width, height, mines)

    return
}

function init() {
    loadImage("flag_icon.png", startGame);
}
