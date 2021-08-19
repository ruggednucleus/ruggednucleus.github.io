class Stream {
    min_length = 5;
    max_length = 20;
    length = 10;
    decay = 6;
    switch_chance = 0.02;
    constructor(symbols, x, y, max_y) {
        this.symbols = symbols;

        this.start_x = x;
        this.start_y = y;

        this.x = x;
        this.y = y;
        this.max_y = max_y;

        this.stream = [];
        this.stream.push(new Symbol(this.symbols, x, y));

        this.length = (this.max_length - this.min_length) * Math.random() + this.min_length | 0;
    }

    update(fall, deltaTime) {
        if(fall) {
            this.y++;
            if(this.y > this.max_y) {
                this.y = this.start_y;
                this.length = (this.max_length - this.min_length) * Math.random() + this.min_length | 0;
            }

            this.stream.push(new Symbol(this.symbols, this.x, this.y));
        }

        for(let i = 0; i < this.stream.length - this.length; i++) {
            if(this.stream[i].decay(this.decay * deltaTime) <= 0) {
                this.stream.splice(i, 1);
                i--;
            }
        }

        for(let i = 0; i < this.stream.length; i++) {
            if(this.stream[i].green === 255 && Math.random() < this.switch_chance * deltaTime) {
                this.stream[i].randomSymbol();
            }
        }
    }

    render(ctx, size) {
        for(let i = 0; i < this.stream.length - 1; i++) {
            this.stream[i].render(ctx, size); 
        }
        this.stream[this.stream.length - 1].render(ctx, size, true); 
    }
}

class Symbol {
    green = 255;
    symbol;

    constructor(symbols, x, y) {
        this.symbols = symbols;

        this.x = x;
        this.y = y;

        this.randomSymbol();
    }

    randomSymbol() {
        this.symbol = this.symbols[this.symbols.length * Math.random() | 0];
    }

    decay(n) {
        return this.green -= n;
    }

    render(ctx, size, white = false) {
        ctx.fillStyle = white ? "white" : `rgb(0, ${this.green}, 0)`;
        ctx.fillText(this.symbol, this.x * size, this.y * size);
    }
}