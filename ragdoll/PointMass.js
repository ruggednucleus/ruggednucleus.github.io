let PointMass = function(x, y) {
    this.x = x;
    this.y = y;

    this.lastX = x;
    this.lastY = y;

    this.accX = 0;
    this.accY = 0;

    this.mass = 1;

    this.links = [];

    this.pinned = false;
    this.pinX = 0;
    this.pinY = 0;
}

PointMass.prototype.updatePhysics = function(timeStep, gravity) {
    this.applyForce(0, this.mass * gravity);

    let velX = this.x - this.lastX;
    let velY = this.y - this.lastY;

    velX *= 0.99;
    velY *= 0.99;

    let nextX = this.x + velX + 0.5 * this.accX * (timeStep * timeStep);
    let nextY = this.y + velY + 0.5 * this.accY * (timeStep * timeStep);

    this.lastX = this.x;
    this.lastY = this.y;

    this.x = nextX;
    this.y = nextY;

    this.accX = 0;
    this.accY = 0;
}

PointMass.prototype.updateInteractions = function(mouse) {
    if(mouse.down) {
        let distance = this.distPointToSegmentSquared(mouse.px, mouse.py, mouse.x, mouse.y, this.x, this.y);
        if(mouse.left) {
            if(distance < mouse.influenceSize) {
                this.lastX = this.x - (mouse.x - mouse.px) * mouse.influenceScalar;
                this.lastY = this.y - (mouse.y - mouse.py) * mouse.influenceScalar;
            }
        } else {
            if(distance < mouse.tearSize) {
                this.links = [];
            }
        }
    }
}

PointMass.prototype.solveConstraints = function(width, height) {
    for(let i = 0; i < this.links.length; i++) {
        this.links[i].solve();
    } 

    if(this.x < 1) {
        this.x = 2 * 1 - this.x;
    }

    if(this.x > width - 1) {
        this.x = 2 * (width - 1) - this.x;
    }

    if(this.y < 1) {
        this.y = 2 * 1 - this.y;
    }

    if(this.y > height - 1) {
        this.y = 2 * (height - 1) - this.y;
    }

    if(this.pinned) {
        this.x = this.pinX;
        this.y = this.pinY;
    }
}

PointMass.prototype.distPointToSegmentSquared = function(lineX1, lineY1, lineX2, lineY2, pointX, pointY) {
    let vx = lineX1 - pointX;
    let vy = lineY1 - pointY;
    let ux = lineX2 - lineX1;
    let uy = lineY2 - lineY1;
    
    let len = ux*ux + uy*uy;
    let det = (-vx * ux) + (-vy * uy);
    if ((det < 0) || (det > len)) {
      ux = lineX2 - pointX;
      uy = lineY2 - pointY;
      return Math.min(vx*vx+vy*vy, ux*ux+uy*uy);
    }
    
    det = ux*vy - uy*vx;
    return (det*det) / len;
}

PointMass.prototype.applyForce = function(fx, fy) {
    this.accX += fx / this.mass;
    this.accY += fy / this.mass;
}

PointMass.prototype.attachTo = function(P, restingDistance, stiffness, tearSensitivity, visible) {
    let link = new Link(this, P, restingDistance, stiffness, tearSensitivity, visible);
    this.links.push(link);
}

PointMass.prototype.removeLink = function(link) {
    for(let i = 0; i < this.links.length; i++) {
        if(this.links[i] === link) {
            this.links.splice(i, 1);
            return;
        }
    }
}

PointMass.prototype.pinTo = function(x, y) {
    this.pinned = true;
    this.pinX = x;
    this.pinY = y;
}

PointMass.prototype.draw = function(ctx) {
    if(this.links.length) {
        for(let i = 0; i < this.links.length; i++) {
            this.links[i].draw(ctx);
        }
    } else {
    //    ctx.moveTo(this.x + 2, this.y);
    //    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    }
}