class Rocket {
    constructor(x, y, fuel, dna) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.angle = 270;

        this.fuel = fuel;

        this.engine = 0;
        this.time = 0;

        this.engines = {
            left: false,
            right: false,
            down: false,
            time: 0,
        };

        this.dist = Infinity;
        this.fitness = 0;

        this.width = 5;
        this.height = 30;

        this.dna = dna;

        this.rotationSpeed = 2;
        this.speed = 0.2;
        this.maxSpeed = 5;
        
        this.done = false;
        this.foundTarget = false;
        this.crashed = false;
        this.outOfBound = false;

        this.path = [{x, y}];
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        if(this.time > 0) {
            this.fuel--;
            this.time -= 1;
        } else {
            const gene = this.dna.next();
            if(gene) {
                this.engine = gene.engine;
                this.time = gene.time;
            }
        }

        if(this.time && this.fuel) {
            switch (this.engine) {
                case 0:
                    this.angle -= this.rotationSpeed;
                    break;

                case 1:
                    this.angle += this.rotationSpeed;
                    break;

                case 2:
                    this.acceleration.add(Vector.fromAngle(this.angle, this.speed));
                    break;
            }
        }

        this.velocity.add(this.acceleration);
        
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        this.position.add(this.velocity);

        this.path.push({x: this.position.x, y: this.position.y});
    }

    calculateDistanceToTarget(x, y) {
        const dist = Math.pow(this.position.x - x, 2) + Math.pow(this.position.y - y, 2);
        if(dist < this.dist) {
            this.dist = dist;
        }
    }

    calcFitness(maxDist) {
//        (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
//        Math.sqrt(this.dist) / maxDist * -maxDist + maxDist;
//console.log(1 - this.dist / maxDist);
        this.fitness = 1 - this.dist / maxDist;
        this.fitness *= this.fitness;
        if(this.foundTarget) {
            this.fitness *= 10;
        }

        if(this.fuel > 0 && this.crashed) {
            this.fitness /= 100;
        }
    }

    checkCollision(x1, y1, x2, y2) {
        const x = this.position.x + this.height * Math.cos(this.angle * Math.PI / 180);
        const y = this.position.y + this.height * Math.sin(this.angle * Math.PI / 180);
        return this.position.x > x1 && this.position.x < x2 && this.position.y > y1 && this.position.y < y2 || x > x1 && x < x2 && y > y1 && y < y2;
    }

    showPath(ctx, color, alpha, points) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        this.path.forEach((point, index) => {
            if(index % points === 0) {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
        ctx.restore();
    }

    show(ctx) {
        ctx.save();

        ctx.fillStyle = "white";
        ctx.translate(this.position.x - this.width / 2, this.position.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillRect(0, 0, this.height * 0.8, this.width);

        ctx.fillStyle = "red";
        ctx.beginPath()
        ctx.moveTo(this.height * 0.8, 0);
        ctx.lineTo(this.height, this.width / 2);
        ctx.lineTo(this.height * 0.8, this.width);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.width);
        ctx.lineTo(this.width, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath()
        ctx.moveTo(0, this.width);
        ctx.lineTo(0, this.width * 2);
        ctx.lineTo(this.width, this.width);
        ctx.closePath();
        ctx.fill();

        
        if(this.time && this.engine === 2) {
            ctx.fillStyle = "orange";
            ctx.beginPath()
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.width * 1.5, this.width / 2);
            ctx.lineTo(0, this.width);
            ctx.closePath();
            ctx.fill();
/*
            const s = this.width * 0.3;
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.moveTo(0, s);
            ctx.lineTo(-this.width * 0.8, this.width / 2);
            ctx.lineTo(0, this.width - s);
            ctx.closePath();
            ctx.fill();*/
        }

        ctx.restore();
    }
}
