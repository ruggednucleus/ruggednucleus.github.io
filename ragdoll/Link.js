let Link = function(p1, p2, restingDistance, stiffness, tearSensitivity, visible) {
    this.p1 = p1;
    this.p2 = p2;

    this.restingDistance = restingDistance;
    this.stiffness = stiffness;
    this.tearSensitivity = tearSensitivity;

    this.visible = visible;
}

Link.prototype.solve = function() {
    let diffX = this.p1.x - this.p2.x;
    let diffY = this.p1.y - this.p2.y;
    let d = Math.sqrt(diffX * diffX + diffY * diffY);

    let difference = (this.restingDistance - d) / d;
    if(d > this.tearSensitivity) {
        this.p1.removeLink(this);
    }

    let im1 = 1 / this.p1.mass;
    let im2 = 1 / this.p2.mass;
    let scalarP1 = (im1 / (im1 + im2)) * this.stiffness;
    let scalarP2 = this.stiffness - scalarP1;

    this.p1.x += diffX * scalarP1 * difference;
    this.p1.y += diffY * scalarP1 * difference;

    this.p2.x -= diffX * scalarP2 * difference;
    this.p2.y -= diffY * scalarP2 * difference;
}

Link.prototype.draw = function(ctx) {
    if(this.visible) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
    }
}