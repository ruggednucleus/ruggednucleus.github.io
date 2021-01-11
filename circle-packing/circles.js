class CirclePacker {
    circles = [];
    amount = 100;
    max_circles = 1000;
    constructor(image_data) {
        this.image_data = image_data;
    }

    newText(image_data) {
        this.image_data = image_data;
    }

    update() {
        for(let circle of this.circles) {
            if(this.image_data.data[circle.y * this.image_data.width * 4 + circle.x * 4 + 1] > 0) {
                circle.grow(1)
                if(circle.collision(this.circles)) {
                    circle.grow(-1);
                }
            } else {
                circle.grow(-1);
            }
        }

        for(let i = 0; i < this.circles.length; i++) {
            if(this.circles[i].r < 1) {
                this.circles.splice(i, 1);
                i--;
            }
        }

        for(let i = 0; i < this.amount && this.circles.length < this.max_circles; i++) {
            let x = Math.random() * this.image_data.width | 0;
            let y = Math.random() * this.image_data.height | 0;
            let circle = new Circle(x, y);
            if(this.image_data.data[y * this.image_data.width * 4 + x * 4 + 1] > 0 && !circle.collision(this.circles)) {
                this.circles.push(circle);
            }
        }
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        for(let circle of this.circles) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 1;
    }

    collision(circles) {
        for(let circle of circles) {
            if(circle !== this) {
                if(Math.pow(this.x - circle.x, 2) + Math.pow(this.y - circle.y, 2) <= Math.pow(this.r + circle.r, 2)) {
                    return true;
                }
            }
        }

        return false;
    }

    grow(n) {
        this.r += n;
    }
}