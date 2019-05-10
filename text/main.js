function Shapeshifter(output_ctx) {
    let width = output_ctx.canvas.width;
    let height = output_ctx.canvas.height;
    let textCanvas = TextCanvas(width, height, 10, 10);

    let passivePoints = [];
    let activePoints = [];

    let pointStyle = {
        radius: 4,
    }

    for(let i = 0; i < width * height / 10 / 40; i++) {
        activePoints.push(ShapeshifterPoint(Point(Math.random() * width | 0, Math.random() * height | 0), pointStyle));
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function renderPoints() {
        output_ctx.clearRect(0, 0, width, height);
        for(let i = 0; i < passivePoints.length; i++) {
            passivePoints[i].render(output_ctx);
        }
        for(let i = 0; i < activePoints.length; i++) {
            activePoints[i].render(output_ctx);
        }
        requestAnimationFrame(renderPoints);
    }

    requestAnimationFrame(renderPoints);

    return {
        write: function(string) {
            let points = textCanvas.write(string);
            shuffle(points);
            shuffle(activePoints);
            shuffle(passivePoints);
            let newActivePoints = [];
            for(let i = 0; i < points.length; i++) {
                let point;
                if(activePoints.length) {
                    point = activePoints.pop();
                } else if(passivePoints.length) {
                    point = passivePoints.pop();
                } else {
                    point = ShapeshifterPoint(Point(Math.random() * width | 0, Math.random() * height | 0), pointStyle);
                }
                point.moveTo(points[i]);
                newActivePoints.push(point);
            }
            while(activePoints.length) {
                let point = activePoints.pop();
                point.moveTo(Point(Math.random() * width | 0, Math.random() * height | 0), true);
                passivePoints.push(point);
            }
            activePoints = newActivePoints;
            console.log(activePoints)
        },
        
        clearQueues: function() {
            for(let i = 0; i < activePoints.length; i++) {
                activePoints[i].clearQueue();
            }

            for(let i = 0; i < passivePoints.length; i++) {
                //passivePoints[i].clearQueue();
            }
        },

        resize: function() {
	        width = output_ctx.canvas.width;
			height = output_ctx.canvas.height;
	        textCanvas.resize(width, height);
        },
    }
}

function ShapeshifterPoint(point, style) {
    let passive = false;
    let q = [];

    let pos = point;
    let radius = style.radius;
    let alpha = 0;
    let z = 0;

    function update() {
        if(q.length) {
            let now = performance.now();
            if(now - q[0].start >= q[0].time) {
                let t = now - q[0].start - q[0].time;
                pos.x = q[0].pos.x;
                pos.y = q[0].pos.y;
                z = q[0].z;
                alpha = q[0].alpha;
                q.shift();
                if(q.length) {
                    q[0].start = now - t;
                }
            }
        } else if(passive) {
            q.push({
                pos: {
                    x: pos.x + (40 * Math.random() | 0 ) - 20,
                    y: pos.y + (40 * Math.random() | 0 ) - 20,
                },
                z: z,
                alpha: alpha,
                time: 1000 + Math.random() * 500,
                start: performance.now(),
            });
        }
    }

    function draw(ctx) {
        if(q.length) {
            let t = (performance.now() - q[0].start) / q[0].time;
            ctx.fillStyle = "rgba(255,255,255,"+(alpha + (q[0].alpha - alpha) * t)+")";
        } else {
            ctx.fillStyle = "rgba(255,255,255,"+alpha+")";
        }
        ctx.beginPath();
        if(q.length) {
            let t = (performance.now() - q[0].start) / q[0].time;
            ctx.arc(
                pos.x + (q[0].pos.x - pos.x) * t,
                pos.y + (q[0].pos.y - pos.y) * t,
                radius * (z + (q[0].z - z) * t),
                0, Math.PI * 2);
        } else {
            ctx.arc(pos.x, pos.y, radius * z, 0, Math.PI * 2);
        }
        ctx.fill();
    }

    return {
        moveTo: function(point, p) {
            if(p) {
                passive = true;

                q.push({
                    pos: pos,
                    z: 1 + 2 * Math.random(),
                    alpha: 0.5,
                    time: 1000,
                    start: q.length ? 0 : performance.now(),
                });

                q.push({
                    pos: point,
                    z: 1 * Math.random(),
                    alpha: 0.5,
                    time: 1000 + Math.random() * 500,
                    start: q.length ? 0 : performance.now(),
                });

            } else {

                if(passive) {
                    q = [];
                }

                passive = false;
                
                q.push({
                    pos: pos,
                    z: 1 + 2 * Math.random(),
                    alpha: 0.5,
                    time: 1000,
                    start: q.length ? 0 : performance.now(),
                });

                q.push({
                    pos: point,
                    z: 1,
                    alpha: 1,
                    time: 1000,
                    start: q.length ? 0 : performance.now(),
                });
            }
        },

        clearQueue: function() {
            for(let i = 1; i < q.length; ) {
                q.splice(i, 1);
            }
        },

        render: function(ctx) {
            update();
            draw(ctx);
        }
    }
}

function TextCanvas(w, h, cellWidth, cellHeight) {
	let width = w;
	let height = h;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    let cWidth = width * 0.95;
    let cHeight = height * 0.8;

    function renderText(string) {
	    ctx.textAlign = "center";
        ctx.clearRect(0, 0, width, height);
        let text = string.split("\n");
        let fontSize = cHeight / text.length | 0;
        ctx.font = "bold " + fontSize + "px sans-serif";
        for(let i = 0; i < text.length; i++) {
            while(ctx.measureText(text[i]).width > cWidth) {
                fontSize--;
                ctx.font = "bold " + fontSize + "px sans-serif";
            }
        }
        ctx.fillStyle = "#FFF";
        for(let i = 0; i < text.length; i++) {
            if(text.length === 1) {
	            console.log(text[i], width / 2, cHeight / 2 + fontSize / 2)
                ctx.fillText(text[i], width / 2, cHeight / 2 + fontSize / 2);
            } else {
                ctx.fillText(text[i], width / 2, cHeight / (text.length) + fontSize * i);
            }
        }
    }

    function getPoints() {
        let imgData = ctx.getImageData(0, 0, width, height);
        let points = [];
        for(let x = cellWidth / 2 | 0; x < width; x += cellWidth) {
            for(let y = cellHeight / 2 | 0; y < height; y += cellHeight) {
                if(imgData.data[y * width * 4 + x * 4 + 3]) {
                    points.push(Point(x, y));
                }
            }
        }
        return points;
    }

    return {
        write: function(string) {
            renderText(string);
            return getPoints();
        },
        
        resize: function(w, h) {
	    	console.log(cWidth, cHeight)
	        width = w;
	        height = h;
	        canvas.width = width;
		    canvas.height = height;
		
		    cWidth = width * 0.95;
		    cHeight = height * 0.8;
		    console.log(cWidth, cHeight, ctx)
        },
    }
}

function Point(x, y) {
    return {
        x: x,
        y: y,
    }
}