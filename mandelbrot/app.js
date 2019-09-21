"use strict";

let canvas, gl;

let minI
let maxI
let minR
let maxR

function loadShaderAsync(shaderURL, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", shaderURL, true);
    req.onload = function() {
        if(req.status < 200 || req.status >= 300) {
            callback("Could not load " + shaderURL);
        }
        callback(null, req.responseText);
    }
    req.send();
}

function Init() {
    async.map({
        vsText: "mandl.vs.glsl",
        fsText: "mandl.fs.glsl"
    }, loadShaderAsync, RunDemo);
}

function RunDemo(loadErrors, loadedShaders) {
    // Attach callbacks
    window.addEventListener("resize", OnResizeWindow);
    window.addEventListener("wheel", OnZoom);
    window.addEventListener("mousemove", OnMouseMove);

    canvas = document.getElementById("gl-surface");
    gl = canvas.getContext("webgl");

    // Create shader program
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, loadedShaders.vsText);
    gl.compileShader(vs);
    if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.log("Vertex shader error:", gl.getShaderInfoLog(vs));
    }

    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, loadedShaders.fsText);
    gl.compileShader(fs);
    if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.log("Fragment shader error:", gl.getShaderInfoLog(fs));
    }

    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Shader program link error:", gl.getShaderInfoLog(program));
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.log("Shader program validate error:", gl.getShaderInfoLog(program));
    }

    gl.useProgram(program);

    // Get uniform locations
    let uniforms = {
        viewportDimensions: gl.getUniformLocation(program, "viewportDimensions"),
        minI: gl.getUniformLocation(program, "minI"),
        maxI: gl.getUniformLocation(program, "maxI"),
        minR: gl.getUniformLocation(program, "minR"),
        maxR: gl.getUniformLocation(program, "maxR")
    }

    let vpDimensions = [canvas.width, canvas.height];
    minI = -2.0;
    maxI =  2.0;
    minR = -2.0;
    maxR =  2.0;

    // Create buffers
    let vertexBuffer = gl.createBuffer();
    let vertices = [
        -1, 1,
        -1, -1,
        1, -1,

        -1, 1,
        1, 1,
        1, -1
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vPosAttrib = gl.getAttribLocation(program, "vPos");
    gl.vertexAttribPointer(
        vPosAttrib,
        2, gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(vPosAttrib);

    OnResizeWindow();

    let thisframetime;
    let lastframetime = performance.now();
    let dt;
    let frames = [];
    let lastPrintTime = performance.now();

    let loop = function() {
        // FPS
        thisframetime = performance.now();
        dt = thisframetime - lastframetime;
        lastframetime = thisframetime;
        frames.push(dt);
        if(lastPrintTime + 750 < thisframetime) {
            lastPrintTime = thisframetime;
            let avg = 0;
            for(let i = 0; i < frames.length; i++) {
                avg += frames[i];
            }
            avg /= frames.length;
            document.title = (1000 / avg | 0) + " fps";
        }
        frames = frames.slice(0, 250);


        // Draw
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.uniform2fv(uniforms.viewportDimensions, vpDimensions);
        gl.uniform1f(uniforms.minI, minI);
        gl.uniform1f(uniforms.maxI, maxI);
        gl.uniform1f(uniforms.minR, minR);
        gl.uniform1f(uniforms.maxR, maxR);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop)

    function OnResizeWindow() {
        if(!canvas) {
            return;
        }
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        vpDimensions = [canvas.width, canvas.height];

        let oldRealRange = maxR - minR;
        maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4 + minR;
        let newRealRange = maxR - minR;
        minR -= (newRealRange - oldRealRange) / 2;
        maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4 + minR;

        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function OnZoom(e) {
        let imaginaryRange = maxI - minI;
        let newRange;
        if(e.deltaY < 0) {
            newRange = imaginaryRange * 0.90;
        } else {
            newRange = imaginaryRange * 1.10;
        }

        let delta = newRange - imaginaryRange;
        minI -= delta / 2;
        maxI = minI + newRange;

        OnResizeWindow();
    }
    
    function OnMouseMove(e) {
        if(e.buttons === 1) {
            let iRange = maxI - minI;
            let rRange = maxR - minR;

            let iDelta = (e.movementY / canvas.height) * iRange;
            let rDelta = (e.movementX / canvas.width) * rRange;

            minI += iDelta;
            maxI += iDelta;
            minR -= rDelta;
            maxR -= rDelta;
        }
    }
}