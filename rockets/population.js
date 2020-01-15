class Population {
    constructor(size, x, y, DNALength) {
        this.size = size;
        this.x = x;
        this.y = y;

        this.fuel = 200;

        this.targetX = canvasWidth / 2;
        this.targetY = canvasHeight * 0.2;
        this.targetRadius = 20;

        this.box = {
            x: canvasWidth * 0.3,
            y: canvasHeight * 0.5,
            width: canvasWidth * 0.4,
            height: 10,
        }

        this.gravity = new Vector(0, 0.1);

        this.matingpool = [];

        this.rockets = [];
        this.deadRockets = [];
        for(let i = 0; i < size; i++) {
            this.rockets.push(new Rocket(x, y, this.fuel, DNA.randomDNA(DNALength, 3, 20)));
        }
    }

    update() {
        if(this.rockets.length) {
            for(let i = 0; i < this.rockets.length; i++) {
                const rocket = this.rockets[i];
                


                rocket.applyForce(this.gravity);
                rocket.update();
                rocket.calculateDistanceToTarget(this.targetX, this.targetY);

                if(rocket.checkCollision(
                    this.targetX - this.targetRadius / 2, this.targetY - this.targetRadius / 2,
                    this.targetX + this.targetRadius / 2, this.targetY + this.targetRadius / 2,))
                {
                    rocket.foundTarget = true;
                } else if(rocket.position.y > canvasHeight ||
                          rocket.checkCollision(this.box.x, this.box.y, this.box.x + this.box.width, this.box.y + this.box.height))
                {
                    rocket.crashed = true;
                } else if(rocket.position.y < 0 || rocket.position.x < 0 ||rocket.position.x > canvasWidth){
                    rocket.outOfBound = true
                }

                if(rocket.done || rocket.crashed || rocket.foundTarget || rocket.outOfBound) {
                    rocket.calculateDistanceToTarget(this.targetX, this.targetY);
                    this.deadRockets.push(rocket);
                    this.rockets.splice(i, 1);
                    i--;
                }
            }
        } else {
            this.evaluate();
            this.selection();
        }
    }

    evaluate() {
        this.matingpool = [];
/*
        let maxDist = 0;
        let minDist = Infinity;
        this.deadRockets.forEach(rocket => {
            if(rocket.dist > maxDist) {
                maxDist = rocket.dist;
            }
            if(rocket.dist < minDist) {
                minDist = rocket.dist;
            }
        });
*/
        const maxDist = Math.pow(this.x - this.targetX, 2) +
                        Math.pow(this.y - this.targetY, 2)

        let maxFitness = 0;
        this.deadRockets.forEach(rocket => {
            rocket.calcFitness(maxDist);
            if(rocket.fitness > maxFitness) {
                maxFitness = rocket.fitness;
            }
        });

        this.deadRockets.forEach(rocket => {
            rocket.fitness /= maxFitness;
            rocket.fitness *= 100;
            for(let i = 0; i < rocket.fitness; i++) {
                this.matingpool.push(rocket);
            }
        });

        console.log(maxFitness);
        this.deadRockets = [];
    }

    selection() {
        for(let i = 0; i < this.size; i++) {
            const a = this.matingpool[Math.random() * this.matingpool.length | 0].dna;
            const b = this.matingpool[Math.random() * this.matingpool.length | 0].dna;

            const dna = DNA.crossover(a, b, 0.1, 3, 20);
            const rocket = new Rocket(this.x, this.y, this.fuel, dna);
            this.rockets.push(rocket);
        }
    }

    show(ctx) {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillRect(this.box.x, this.box.y, this.box.width, this.box.height);
        ctx.restore();

        this.rockets.forEach(rocket => rocket.show(ctx));
    }
}