class Block {
    states = {
        idle: 1,
        falling: 2,
        merging: 3,
    }

    state = 1;

    falling_from_x = 0;
    falling_from_y = 0;

    merging_blocks = [];

    constructor(value, position_x, position_y) {
        this.value = value;
        this.x = position_x;
        this.y = position_y;
    }

    setIdle() {
        this.state = this.states.idle;
    }

    add_merge(block) {
        this.merging_blocks.push(block);
    }

    start_merge() {
        this.state = this.states.merging;
    }

    end_merge() {
        this.setIdle();
        this.value += this.merging_blocks.length;
        this.merging_blocks = [];
    }

    fallFrom(x, y) {
        this.state = this.states.falling;
        this.falling_from_x = x;
        this.falling_from_y = y;
    }

    render(ctx, block_size, animation_time) {
        switch(this.state) {
            case this.states.idle:
                this.render_idle(ctx, block_size);
                break;

            case this.states.falling:
                this.render_fall(ctx, block_size, animation_time);
                break;
            
            case this.states.merging:
                this.render_merge(ctx, block_size, animation_time);
        }
    }

    render_idle(ctx, block_size) {
        if(this.value === 0) {
            return;
        }

        ctx.save();
        ctx.translate(this.x * block_size + block_size * 0.5, this.y * block_size + block_size * 0.5);
        ctx.fillStyle = ColourGenerator.generate(this.value);
        ctx.beginPath();
        ctx.roundRect((-block_size * 0.45) | 0, (-block_size * 0.45) | 0, (block_size * 0.9) | 0, (block_size * 0.9) | 0, block_size * 0.1)
        ctx.fill();

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${block_size * 0.5}px monospace`;
        ctx.fillText(2**this.value, 0, 0, block_size * 0.9)
        ctx.restore();
    }

    render_fall(ctx, block_size, animation_time) {
        let position_x = this.falling_from_x - ((this.falling_from_x - this.x) * animation_time);
        let position_y = this.falling_from_y - ((this.falling_from_y - this.y) * animation_time);

        ctx.save();
        ctx.translate(position_x * block_size + block_size * 0.5, position_y * block_size + block_size * 0.5);
        ctx.fillStyle = ColourGenerator.generate(this.value);
        ctx.beginPath();
        ctx.roundRect((-block_size * 0.45) | 0, (-block_size * 0.45) | 0, (block_size * 0.9) | 0, (block_size * 0.9) | 0, block_size * 0.1)
        ctx.fill();

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${block_size * 0.5}px monospace`;
        ctx.fillText(2**this.value, 0, 0, block_size * 0.9)
        ctx.restore();
    }

    render_merge(ctx, block_size, animation_time) {
        ctx.save();
        ctx.translate(this.x * block_size + block_size * 0.5, this.y * block_size + block_size * 0.5);
        ctx.fillStyle = ColourGenerator.generate(this.value);
        ctx.beginPath();
        ctx.roundRect((-block_size * 0.45) | 0, (-block_size * 0.45) | 0, (block_size * 0.9) | 0, (block_size * 0.9) | 0, block_size * 0.1)
        ctx.fill();

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${block_size * 0.5}px monospace`;
        ctx.fillText(2**this.value, 0, 0, block_size * 0.9)
        ctx.restore();

        this.merging_blocks.forEach(block => {
            let position_x = block.x - ((block.x - this.x) * animation_time);
            let position_y = block.y - ((block.y - this.y) * animation_time);

            ctx.save();
            ctx.translate(position_x * block_size + block_size * 0.5, position_y * block_size + block_size * 0.5);
            ctx.fillStyle = ColourGenerator.generate(this.value);
            ctx.beginPath();
            ctx.roundRect((-block_size * 0.45) | 0, (-block_size * 0.45) | 0, (block_size * 0.9) | 0, (block_size * 0.9) | 0, block_size * 0.1)
            ctx.fill();

            ctx.fillStyle = "#FFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${block_size * 0.5}px monospace`;
            ctx.fillText(2**this.value, 0, 0, block_size * 0.9)
            ctx.restore();
        });
    }
}