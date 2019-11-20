class Flower {
    constructor(x, y, size, falling) {
        this.falling = falling;
        this.position = new Vector(x, y);
        this.velocity = new Vector((Math.random() * 2 - 1) * 2, (Math.random() - 1) * 5);
        this.accelertion = new Vector();
        this.gravity = new Vector(0, 0.2);
        this.size = size;
        this.life = 1;
        this.decay = 0.02;
        this.colors = [
            "#305ee6", "#0b1f5b", // Blue
            "#14be14", "#0a5c0a", // Green
            "#e63c30", "#5b110b", // Red
            "#8f32d1", "#381353", // Purple
            "#ed8013", "#5f3307", // Orange
            "#0fd6d2", "#075f5e", // Cyan
            "#dde80e", "#5c6006", // Yellow
            "#e61cdb", "#5c0a58"  // Pink
        ];
        this.rotation = Math.random() * 180 / Math.PI;
        this.rotation_speed = (Math.random() * 2 - 1) * 0.1;

        this.colorIndex = Math.random() * this.colors.length;
        this.colorIndex -= this.colorIndex % 2;

        this.shape = Math.random() * 3 | 0;
    }

    done() {
        if(!this.falling) {
            return false;
        }
        return this.life <= 0;
    }

    move() {
        if(this.falling) {
            this.velocity.add(this.gravity);
            this.velocity.mult(1)
            this.position.add(this.velocity);
            if(this.velocity.y > 0) {
                this.life -= this.decay;
            }
            this.rotation += this.rotation_speed;
        } else {
            this.life -= this.decay;
            if(this.life > 0) {
                this.rotation += this.rotation_speed;
            }
        }

        if(this.life < 0) {
            this.life = 0;
        }
    }

    show(ctx) {
        let size = this.size * this.life;
        if(!this.falling) {
            size = (1 - this.life) * this.size;
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.colors[this.colorIndex];
        switch(this.shape) {
            case 0:
                ctx.save();
                for(let i = 0; i < 3; i++) {
                    ctx.rotate(60 * Math.PI / 180);
                    ctx.fillRect(-size / 2, -size / 6, size, size / 3);
                }
                ctx.restore();
                break;

            case 1:
                for(let i = 0; i < 2; i++) {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, size / 2, size / 4, 90 * Math.PI / 180 * i, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case 2:
                ctx.save();
                let s = size * 0.7;
                for(let i = 0; i < 2; i++) {
                    ctx.rotate(45 * Math.PI / 180);
                    ctx.fillRect(-s / 2, -s / 2, s, s);
                }
                ctx.restore();
                break;
        }
        

        ctx.fillStyle = this.colors[this.colorIndex + 1];
        ctx.beginPath();
        ctx.arc(0, 0, size / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}