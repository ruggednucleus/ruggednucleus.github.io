let Circle = function(radius) {
    this.radius = radius;
    this.point;
}

Circle.prototype.solveConstraints = function(width, height) {
    let x = this.point.x;
    let y = this.point.y;
    
    // only do a boundary constraint
    if (y < this.radius)
      y = 2*(this.radius) - y;
    if (y > height-this.radius)
      y = 2 * (height - this.radius) - y;
    if (x > width-this.radius)
      x = 2 * (width - this.radius) - x;
    if (x < this.radius)
      x = 2*this.radius - x;
      
    this.point.x = x;
    this.point.y = y;
}

Circle.prototype.draw = function(ctx) {
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
}

Circle.prototype.attachToPointMass = function(p) {
    this.point = p;
}