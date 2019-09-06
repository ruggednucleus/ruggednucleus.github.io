class Boid {
    constructor(position) {
        this.position = position;
        this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.velocity.normalize();
        this.acceleration = new Vector()

        this.maxSpeed = 2;

        this.alignmentRadius = 50;
        this.maxAlignmentForce = 0.5;
        this.alignmentWeight = 1;
        this.showAlignment = false;

        this.cohesionRadius = 50;
        this.maxCohesionForce = 0.1;
        this.cohesionWeight = 1;
        this.showCohesion = false;

        this.separationRadius = 25;
        this.maxSeparationForce = 0.1;
        this.separationWeight = 1.5;
        this.showSeparation = false;

        this.velocity.setMagnitude(this.maxSpeed)
    }

    setForces(forces) {
        this.alignmentRadius = forces.alignmentRadius;
        this.maxAlignmentForce = forces.maxAlignmentForce;
        this.alignmentWeight = forces.alignmentWeight;
        this.showAlignment = forces.showAlignment;

        this.cohesionRadius = forces.cohesionRadius;
        this.maxCohesionForce = forces.maxCohesionForce;
        this.cohesionWeight = forces.cohesionWeight;
        this.showCohesion = forces.showCohesion;

        this.separationRadius = forces.separationRadius;
        this.maxSeparationForce = forces.maxSeparationForce;
        this.separationWeight = forces.separationWeight;
        this.showSeparation = forces.showSeparation;
    }

    edge(width, height) {
        if(this.position.x < 0) {
            this.position.x = width;
        } else if (this.position.x > width) {
            this.position.x = 0;
        }

        if(this.position.y < 0) {
            this.position.y = height;
        } else if (this.position.y > height) {
            this.position.y = 0;
        }
    }

    align(flock) {
        let avg = new Vector();
        let boids = 0;

        for(let boid of flock) {
            let dist = this.position.distance(boid.position);
            if(boid !== this && dist < this.alignmentRadius) {
                avg.add(boid.velocity);
                boids++;
            }
        }

        if(boids > 0) {
            avg.div(boids);
            avg.setMagnitude(this.maxSpeed);
            avg.sub(this.velocity);
            avg.limit(this.maxAlignmentForce);
        }

        return avg;
    }

    cohesion(flock) {
        let avg = new Vector();
        let boids = 0;

        for(let boid of flock) {
            let dist = this.position.distance(boid.position);
            if(boid !== this && dist < this.cohesionRadius) {
                avg.add(boid.position);
                boids++;
            }
        }

        if(boids > 0) {
            avg.div(boids);
            avg.sub(this.position);
            avg.setMagnitude(this.maxSpeed);
            avg.sub(this.velocity);
            avg.limit(this.maxCohesionForce);
        }

        return avg;
    }

    separation(flock) {
        let avg = new Vector();
        let boids = 0;

        for(let boid of flock) {
            let dist = this.position.distance(boid.position);
            if(boid !== this && dist < this.separationRadius) {
                let diff = this.position.copy();
                diff.sub(boid.position);
                diff.normalize();
                diff.div(dist);
                avg.add(diff)
                boids++;
            }
        }

        if(boids > 0) {
            avg.div(boids);
            avg.setMagnitude(this.maxSpeed);
            avg.sub(this.velocity);
            avg.limit(this.maxSeparationForce);
        }
        return avg;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(this.alignmentWeight);
        cohesion.mult(this.cohesionWeight);
        separation.mult(this.separationWeight);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.beginPath();
        let angle = this.velocity.getAngle();

        ctx.moveTo(this.position.x + 5 * Math.cos(angle / 180 * Math.PI), this.position.y + 5 * Math.sin(angle / 180 * Math.PI));
        ctx.lineTo(this.position.x + 5 * Math.cos((angle + 135) / 180 * Math.PI), this.position.y + 5 * Math.sin((angle + 135) / 180 * Math.PI));
        ctx.lineTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + 5 * Math.cos((angle + 225) / 180 * Math.PI), this.position.y + 5 * Math.sin((angle + 225) / 180 * Math.PI));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
/*
        ctx.fillStyle="white";
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        ctx.fill();
  */      
        if(this.showAlignment) {
            ctx.strokeStyle = "blue"
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.alignmentRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        if(this.showCohesion) {
            ctx.strokeStyle = "green"
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.cohesionRadius, 0, Math.PI * 2);
            ctx.stroke();

        }
        if(this.showSeparation) {
            ctx.strokeStyle = "red"
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.separationRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}