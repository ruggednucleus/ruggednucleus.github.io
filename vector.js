class Vector {
    constructor(x, y) {
        if(typeof(x) === "number") {
            this.x = x;
        } else {
            this.x = 0;
        }
        
        if(typeof(y) === "number") {
            this.y = y;
        } else {
            this.y = 0;
        }
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    mult(scale) {
        this.x *= scale;
        this.y *= scale;
    }

    div(scale) {
        this.x /= scale;
        this.y /= scale;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.magnitude();

        if(m != 0) {
            this.div(m);
        }
    }

    setMagnitude(value) {
        this.normalize();
        this.mult(value);
    }

    limit(value) {
        if(this.magnitude() > value) {
            this.setMagnitude(value);
        }
    }

    distance(vector) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }

    copy(vector) {
        return new Vector(this.x, this.y);
    }

    getAngle() {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }
}