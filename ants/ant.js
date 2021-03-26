class Ant {
    constructor(position = new Vector(0, 0), scale) {
        this.maxSpeed = 2 * scale;
        this.steerStrength = 4 * scale;
        this.wanderStrength = 0.2;

        this.position = position;
        this.velocity = new Vector(0, 0);
        this.desiredDirection = new Vector(0, 0);

        this.last_position;
    }

    update(deltaTime) {
        //const desiredDirection = Vector.sub(target, this.position).normalize();
        this.desiredDirection = Vector.add(this.desiredDirection, Vector.randomVector().mult(this.wanderStrength)).normalize();

        const desiredVelocity = Vector.mult(this.desiredDirection, this.maxSpeed);
        const desiredSteeringForce = Vector.sub(desiredVelocity, this.velocity).mult(this.steerStrength);
        const acceleration = desiredSteeringForce;
        acceleration.limit(this.steerStrength);

        this.last_position = this.position.copy();

        this.velocity = Vector.add(this.velocity, Vector.mult(acceleration, deltaTime)).limit(this.maxSpeed);
        this.position.add(this.velocity);
    }

    draw(image, path_drawer) {
        ctx.save()
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.getRad());
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }
}