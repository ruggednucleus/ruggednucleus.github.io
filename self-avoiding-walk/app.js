const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const steps_input = document.getElementById("steps");
const walk_button = document.getElementById("walk");
const reset_button = document.getElementById("reset");

let url = new URL(window.location);

const width = parseInt(url.searchParams.get("width")) || 10;
const height = parseInt(url.searchParams.get("height")) || 10;

const walker = new Walker(width, height);

let steps = 1;

function loop() {
    for(let i = 0; i < steps; i++) {
        walker.walk();
    }
    walker.render(ctx, 40);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

steps_input.addEventListener("change", (e) => {
    steps = parseInt(e.target.value)
});

walk_button.addEventListener("click", () => {
    walker.walk();
});

reset_button.addEventListener("click", () => {
    walker.createboard();
    walker.done = false;
});