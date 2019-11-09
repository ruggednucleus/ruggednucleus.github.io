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

    static randomVector() {
        let vector = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector.setMagnitude(1);
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
        } else {
            this.x = 1;
            this.y = 0;
            this.normalize();
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
    }
}