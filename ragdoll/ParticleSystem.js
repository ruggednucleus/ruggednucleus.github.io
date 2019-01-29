let ParticleSystem = function(width, height) {
    this.width = width;
    this.height = height;

    this.lastUpdate = 0;
    this.leftOverTime = 0;
    this.timeStep = 16;
    this.maxSteps = 5;

    this.constraintAccuracy = 3;
}

ParticleSystem.prototype.update = function(pointmasses, circles, gravity, mouse) {
    let currentTime = performance.now();
    let elapsedTime = currentTime - this.lastUpdate;
    this.lastUpdate = currentTime;
    let timeSteps = (elapsedTime + this.leftOverTime) / this.timeStep | 0;
    timeSteps = Math.min(timeSteps, this.maxSteps);
    this.leftOverTime = elapsedTime - (timeSteps * this.timeStep);

    for(let iterations = 0; iterations < timeSteps; iterations++) {
        for(let x = 0; x < this.constraintAccuracy; x++) {
            for(let i = 0; i < pointmasses.length; i++) {
                pointmasses[i].solveConstraints(this.width, this.height);
            }
            for(let i = 0; i < circles.length; i++) {
                circles[i].solveConstraints(this.width, this.height);
            }
        }

        for(let i = 0; i < pointmasses.length; i++) {
            let pointmass = pointmasses[i];
            pointmass.updateInteractions(mouse);
            pointmass.updatePhysics(this.timeStep / 1000, gravity);
        }
    }


}

/*
et Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.add = function(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
}

Vector2.prototype.sub = function(vector) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
}

Vector2.prototype.scale = function(n) {
    return new Vector2(this.x * n, this.y * n);
}

function vmin(v1, v2) {
    return new Vector2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
}

function vmax(v1, v2) {
    return new Vector2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
}

let ParticleSystem = function(c, o, f) {
    this.current_positions = [c];
    this.old_positions = [o];
    this.force_accumulators = [f];
    this.gravity = new Vector2(0, 1);
    this.timeStep = 10;
}

ParticleSystem.prototype.Verlet = function() {
    for(let i = 0; i < this.current_positions.length; i++) {
        let x = this.current_positions[i];
        let temp = x;
        let old = this.old_positions[i];
        let a = this.force_accumulators[i];
console.log(x);
        x = x.add(x).sub(old).add(a.scale(this.timeStep * this.timeStep));
        old = temp;

        this.current_positions[i] = x;
        this.old_positions[i] = old;

        console.log(x, temp, old, a);
    }
}

ParticleSystem.prototype.AccumulateForces = function() {
    for(let i = 0; i < this.force_accumulators.length; i++) {
        this.force_accumulators[i] = this.force_accumulators[i].add(this.gravity);
    }
}

ParticleSystem.prototype.SatisfyConstraints = function() {
    for(let i = 0; i < this.current_positions.length; i++) {
        this.current_positions[i] = vmin(vmax(new Vector2(0, 0), this.current_positions[i]), new Vector2(100, 100));
    }
}

ParticleSystem.prototype.TimeStep = function() {
    this.AccumulateForces();
    this.Verlet();
    this.SatisfyConstraints();
}*/