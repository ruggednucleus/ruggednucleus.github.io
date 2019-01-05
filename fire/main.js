function Fire(imageData, width, height, colors) {
    let firePixels = [];
    for(let i = 0; i < width * height; i++) {
        firePixels[i] = 0;
    }

    function update() {
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                spreadFire(y * width + x);
            }
        }
    }

    function spreadFire(i) {
        let decay = Math.random() * 4 / 3 | 0;
        let dst = Math.max(i + (Math.random() * 3 | 0) - 1 - width, 0);
        firePixels[dst] = Math.max(firePixels[i] - decay, 0);
    }

    function draw() {
        for(let i = 0; i < firePixels.length; i++) {
            imageData.data[i * 4 + 0] = colors[firePixels[i]].r;
            imageData.data[i * 4 + 1] = colors[firePixels[i]].g;
            imageData.data[i * 4 + 2] = colors[firePixels[i]].b;
            imageData.data[i * 4 + 3] = colors[firePixels[i]].a;
        }
    }

    return {
        turnOn: function() {
            for(let x = 0; x < width; x++) {
                firePixels[height * width - x - 1] = colors.length - 1;
            }
        },

        turnOff: function() {
            for(let x = 0; x < width; x++) {
                firePixels[height * width - x - 1] = 0;
            }
        },

        render: function() {
            update();
            draw();
            return imageData;
        },
        
        firePixels: firePixels,
    }
}