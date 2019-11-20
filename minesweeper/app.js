"use strict"

let canvas, ctx, minesweeperBoard, cells, ms;

function loadImages(names, files, onAllLoaded) {
    var i, numLoading = names.length;
    const onload = () => --numLoading === 0 && onAllLoaded(images);
    const images = {};
    for (i = 0; i < names.length; i++) {
        const img = images[names[i]] = new Image;
        img.src = files[i];
        img.onload = onload;
    }   
    return images;
}

function startGame(icons) {
    let size = 0;

    let width =  18 // 10,18,24;
    let height = 14 //  8,14,20;
    let mines =  40 // 10,40,99;

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
    

    ms = new Minesweeper(size, icons, "ontouchstart" in window);
    canvas = ms.canvas;

    document.body.appendChild(canvas);

    ms.start(width, height, mines)

    return
}

function init() {
    loadImages(["flag", "clock"], ["flag_icon.png", "clock_icon.png"], startGame);
}