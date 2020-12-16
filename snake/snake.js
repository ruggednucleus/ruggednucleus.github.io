class Snake {
    body_parts = [];
    constructor(head_position, head_radius, speed) {
        this.head_position = head_position;
        this.head_radius = head_radius;
        this.speed = speed;

        for(let i = 0; i < 20; i++) {
            this.body_parts.push(new Vector(head_position.x - (i + 1) * (head_radius * 2), head_position.y));
        }
    }

    update() {
        let direction = Vector.sub(this.body_parts[0], this.head_position);
        direction.setMagnitude(this.head_radius * 2);
        this.body_parts[0] = Vector.add(this.head_position, direction);

        for(let i = 1; i < this.body_parts.length; i++) {
           let direction = Vector.sub(this.body_parts[i], this.body_parts[i - 1]);
           direction.setMagnitude(this.head_radius * 2);
           this.body_parts[i] = Vector.add(this.body_parts[i - 1], direction);
        }
    }

    moveTo(position) {
        if(this.head_position.distance(position) < this.speed) {
            this.head_position = position;
            return;
        }
        let direction = Vector.sub(position, this.head_position);
        direction.setMagnitude(1);
        direction.mult(this.speed);

        this.head_position.add(direction)
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = "#66cc33";
        
        ctx.beginPath();
        ctx.arc(this.head_position.x, this.head_position.y, this.head_radius, 0, Math.PI * 2);
        ctx.fill();

        for(let i = this.body_parts.length - 1; i >= 0; i--) {
            let part = this.body_parts[i];
            ctx.beginPath();
            let size = 1;
            if(i >= this.body_parts.length * 0.6) {
                size = ((this.body_parts.length * 0.4) - (i - this.body_parts.length * 0.6)) / (this.body_parts.length * 0.4);
            }
            ctx.arc(part.x, part.y, this.head_radius * size, 0, Math.PI * 2);
            ctx.fill();
        }

        for(let i = this.body_parts.length - 2; i >= 0; i--) {
            ctx.save();
            let radians = Vector.sub(this.body_parts[i], this.body_parts[i + 1]).getAngle() / 180 * Math.PI;
            ctx.translate(this.body_parts[i].x, this.body_parts[i].y);
            ctx.rotate(radians - Math.PI / 2);
            ctx.beginPath();
            let size1 = 1;
            let size2 = 1;
            if(i >= this.body_parts.length * 0.6) {
                size1 = ((this.body_parts.length * 0.4) - (i - this.body_parts.length * 0.6)) / (this.body_parts.length * 0.4);
            }
            if(i + 1 >= this.body_parts.length * 0.6) {
                size2 = ((this.body_parts.length * 0.4) - (i + 1 - this.body_parts.length * 0.6)) / (this.body_parts.length * 0.4);
            }
            ctx.beginPath();
            ctx.moveTo(this.head_radius * size1, 0);
            ctx.lineTo(this.head_radius * size2, -this.head_radius * 2);
            ctx.lineTo(-this.head_radius * size2, -this.head_radius * 2);
            ctx.lineTo(-this.head_radius * size1, 0);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.head_radius * size1, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.fillStyle = "#79db48";
            ctx.ellipse(0, -this.head_radius * 1.5, this.head_radius * 0.8 * size2, this.head_radius * 0.2 * size2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.save();
        let radians = Vector.sub(this.head_position, this.body_parts[0]).getAngle() / 180 * Math.PI;
        ctx.translate(this.head_position.x, this.head_position.y);
        ctx.rotate(radians - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(this.head_radius, 0);
        ctx.lineTo(this.head_radius, -this.head_radius * 2);
        ctx.lineTo(-this.head_radius, -this.head_radius * 2);
        ctx.lineTo(-this.head_radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath()
        ctx.fillStyle = "#79db48";
        ctx.ellipse(0, -this.head_radius, this.head_radius * 0.8, this.head_radius * 0.2, 0, 0, Math.PI * 2);
        ctx.fill()

        ctx.beginPath();
        ctx.fillStyle = "#79db48";
        ctx.ellipse(0, -this.head_radius * 1.5, this.head_radius * 0.8, this.head_radius * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();


        ctx.save();
        radians = Vector.sub(this.head_position, this.body_parts[0]).getAngle() / 180 * Math.PI;
        ctx.translate(this.head_position.x, this.head_position.y);
        ctx.rotate(radians - Math.PI / 2);
        ctx.fillStyle = "#8f8";
        let size = this.head_radius * 1.3;
        ctx.drawImage(images["snake.png"], -size, -size , size * 2, size * 2 * images["snake.png"].height / images["snake.png"].width);
        ctx.restore();

        ctx.restore();
    }
}