class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static randomVector(magnitude = 1) {
        let vector = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector.setMagnitude(magnitude);
        return vector;
    }

    static fromAngle(deg = 0, magnitude = 1) {
        const vector = Vector.randomVector();
        const rad = deg / 180 * Math.PI;
        vector.x = Math.cos(rad);
        vector.y = Math.sin(rad);
        vector.setMagnitude(magnitude);
        return vector;
    }

    static add(v1, v2) {
        let x = v1.x + v2.x;
        let y = v1.y + v2.y;

        return new Vector(x, y);
    }

    static sub(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;

        return new Vector(x, y);
    }

    static mult(vector, scale) {
        let x = vector.x * scale;
        let y = vector.y * scale;
        return new Vector(x, y);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mult(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    div(scale) {
        this.x /= scale;
        this.y /= scale;
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.magnitude();

        if(m != 0) {
            this.div(m);
        } else {
            this.x = 1;
            this.y = 0;
            this.normalize();
        }
        return this;
    }

    setMagnitude(value) {
        this.normalize();
        this.mult(value);
        return this;
    }

    limit(value) {
        if(this.magnitude() > value) {
            this.setMagnitude(value);
        }
        return this;
    }

    distance(vector) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }

    distanceNoSqrt(vector) {
        return Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    getAngle() {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    setAngle(deg) {
        let mag = this.magnitude();
        let rad = deg / 180 * Math.PI;
        this.x = Math.cos(rad);
        this.y = Math.sin(rad);
        this.setMagnitude(mag);
        return this;
    }
}