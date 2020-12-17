class Snake {
    body_parts = [];
    constructor(head_position, head_radius, speed, length) {
        this.head_position = head_position;
        this.head_radius = head_radius;
        this.speed = speed;

        for(let i = 0; i < length; i++) {
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

    curve(ctx) {
        let points = [];
        let rad = Vector.sub(this.head_position, this.body_parts[0]).getRad() + Math.PI / 2;
        points.push(this.head_position.x + this.head_radius * Math.cos(rad), this.head_position.y + this.head_radius * Math.sin(rad));
        for(let i = 0; i < this.body_parts.length - 1; i++) {
            let rad = Vector.sub(this.body_parts[i], this.body_parts[i + 1]).getRad() + Math.PI / 2;
            points.push(this.body_parts[i].x + this.head_radius * Math.cos(rad), this.body_parts[i].y + this.head_radius * Math.sin(rad));
        }
        points.push(this.body_parts[this.body_parts.length - 1].x, this.body_parts[this.body_parts.length - 1].y);
        for(let i = this.body_parts.length - 1; i > 0; i--) {
            let rad = Vector.sub(this.body_parts[i], this.body_parts[i - 1]).getRad() + Math.PI / 2;
            points.push(this.body_parts[i].x + this.head_radius * Math.cos(rad), this.body_parts[i].y + this.head_radius * Math.sin(rad));
        }
        ctx.beginPath();
        drawCurve(ctx, points)
        ctx.closePath();
        ctx.fill();

        function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {
            drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));
            
            if (showPoints) {
              ctx.beginPath();
              for(var i=0;i<ptsa.length-1;i+=2) 
                ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
            }
        }
        function getCurvePoints(pts, tension, isClosed, numOfSegments) {

            // use input value if provided, or use a default value	 
            tension = (typeof tension != 'undefined') ? tension : 0.5;
            isClosed = isClosed ? isClosed : false;
            numOfSegments = numOfSegments ? numOfSegments : 16;
          
            var _pts = [], res = [],	// clone array
                x, y,			// our x,y coords
                t1x, t2x, t1y, t2y,	// tension vectors
                c1, c2, c3, c4,		// cardinal points
                st, t, i;		// steps based on num. of segments
          
            // clone array so we don't change the original
            //
            _pts = pts.slice(0);
          
            // The algorithm require a previous and next point to the actual point array.
            // Check if we will draw closed or open curve.
            // If closed, copy end points to beginning and first points to end
            // If open, duplicate first points to befinning, end points to end
            if (isClosed) {
              _pts.unshift(pts[pts.length - 1]);
              _pts.unshift(pts[pts.length - 2]);
              _pts.unshift(pts[pts.length - 1]);
              _pts.unshift(pts[pts.length - 2]);
              _pts.push(pts[0]);
              _pts.push(pts[1]);
            }
            else {
              _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
              _pts.unshift(pts[0]);
              _pts.push(pts[pts.length - 2]);	//copy last point and append
              _pts.push(pts[pts.length - 1]);
            }
          
            // ok, lets start..
          
            // 1. loop goes through point array
            // 2. loop goes through each segment between the 2 pts + 1e point before and after
            for (i=2; i < (_pts.length - 4); i+=2) {
              for (t=0; t <= numOfSegments; t++) {
          
                // calc tension vectors
                t1x = (_pts[i+2] - _pts[i-2]) * tension;
                t2x = (_pts[i+4] - _pts[i]) * tension;
          
                t1y = (_pts[i+3] - _pts[i-1]) * tension;
                t2y = (_pts[i+5] - _pts[i+1]) * tension;
          
                // calc step
                st = t / numOfSegments;
          
                // calc cardinals
                c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
                c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
                c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
                c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);
          
                // calc x and y cords with common control vectors
                x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
                y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y;
          
                //store points in array
                res.push(x);
                res.push(y);
          
              }
            }
          
            return res;
        }
        function drawLines(ctx, pts) {
            ctx.moveTo(pts[0], pts[1]);
            for(let i=2;i<pts.length-1;i+=2) ctx.lineTo(pts[i], pts[i+1]);
        }

        /*
        ctx.save();

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 5;
        ctx.beginPath();
        // move to the first point
        let rad = Vector.sub(this.head_position, this.body_parts[0]).getRad() + Math.PI / 2;
        ctx.moveTo(this.head_position.x + this.head_radius * Math.cos(rad), this.head_position.y + this.head_radius * Math.sin(rad));

        for (let i = 0; i < this.body_parts.length - 2; i ++)
        {
            let rad = Vector.sub(this.body_parts[i], this.body_parts[i + 1]).getRad() + Math.PI / 2;
            var xc = (this.body_parts[i].x + this.body_parts[i + 1].x) / 2 + this.head_radius * Math.cos(rad);
            var yc = (this.body_parts[i].y + this.body_parts[i + 1].y) / 2 + this.head_radius * Math.sin(rad);
            ctx.quadraticCurveTo(this.body_parts[i].x + this.head_radius * Math.cos(rad), this.body_parts[i].y + this.head_radius * Math.sin(rad), xc, yc);
        }

        
        //ctx.lineTo(this.body_parts[this.body_parts.length - 2].x, this.body_parts[this.body_parts.length - 2].y);
        
        // curve through the last two points
        rad = Vector.sub(this.body_parts[this.body_parts.length - 2], this.body_parts[this.body_parts.length - 1]).getRad() + Math.PI / 2;
        ctx.quadraticCurveTo(this.body_parts[this.body_parts.length - 2].x + this.head_radius * Math.cos(rad), this.body_parts[this.body_parts.length - 2].y + this.head_radius * Math.sin(rad),
                             this.body_parts[this.body_parts.length - 1].x, this.body_parts[this.body_parts.length - 1].y);
        //ctx.stroke();

        for(let i = this.body_parts.length - 1; i > 0; i--) {
            let rad = Vector.sub(this.body_parts[i], this.body_parts[i - 1]).getRad() + Math.PI / 2;
            var xc = (this.body_parts[i].x + this.body_parts[i - 1].x) / 2 + this.head_radius * Math.cos(rad);
            var yc = (this.body_parts[i].y + this.body_parts[i - 1].y) / 2 + this.head_radius * Math.sin(rad);
            ctx.quadraticCurveTo(this.body_parts[i].x + this.head_radius * Math.cos(rad), this.body_parts[i].y + this.head_radius * Math.sin(rad), xc, yc);
        }

        ctx.stroke();
        ctx.closePath();

        ctx.restore();
        */
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