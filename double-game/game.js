class Game {
    width = 5;
    height = 7;
    board = [];

    states = {
        idle: 1,
        find_merging_blocks: 2,
        find_falling_blocks: 3,
        animating_merging_blocks: 4,
        animating_falling_blocks: 5,
    }

    state = 1;

    animation_start = 0;
    animation_time = 500;

    animation_merge_time = 200;
    animation_fall_time = 200;

    min_block = 1;
    max_block_multi = 4;

    current_block = 1;

    blocks_moved = [];
    merging_blocks = [];

    constructor() {
        this.create_new_board();
    }

    position_to_index(x, y) {
        return y * this.width + x;
    }

    create_new_board() {
        this.board = [];
        for(let y = 0; y < this.height;y++) {
            for(let x = 0; x < this.width; x++) {
                this.board.push(new Block(0, x, y));
            }
        }
    }

    place_block(coloum) {
        if(this.state !== this.states.idle) {
            console.log("Please wait!");
            return
        }

        if(this.board[this.position_to_index(coloum, this.height - 1)].value !== 0) {
            console.log("Coloum full... Try somewhere else.");
            return;
        }

        for(let y = 0; y < this.height; y++) {
            if(this.board[this.position_to_index(coloum, y)].value === 0) {
                this.board[this.position_to_index(coloum, y)].value = this.current_block;
                this.blocks_moved = [this.board[this.position_to_index(coloum, y)]];
                this.board[this.position_to_index(coloum, y)].fallFrom(coloum, this.height);
                break;
            }
        }

        this.current_block = (Math.random() * this.max_block_multi) + this.min_block | 0;

        this.state = this.states.animating_falling_blocks;
        this.animation_start = performance.now();
        this.animation_time = this.animation_fall_time;
    }

    find_falling_blocks() {
        this.blocks_moved = [];
        let found_falling_blocks = false;

        for(let x = 0; x < this.width; x++) {
            for(let y = 1; y < this.height; y++) {
                let block = this.board[this.position_to_index(x, y)];
                if(block.value !== 0) {
                    let falling_to = y;
                    for(let i = y - 1; i >= 0; i--) {
                        if(this.board[this.position_to_index(x, i)].value === 0) {
                            falling_to = i;
                        } else {
                            break;
                        }
                    }

                    if(falling_to !== y) {
                        let new_block = this.board[this.position_to_index(x, falling_to)];
                        new_block.value = block.value;
                        new_block.fallFrom(x, y);
                        block.value = 0;

                        this.blocks_moved.push(new_block);
                        found_falling_blocks = true;
                    }
                }
            }
        }

        if(found_falling_blocks) {
            this.animation_start = performance.now();
            this.animation_time = this.animation_fall_time;
            this.state = this.states.animating_falling_blocks;
        } else {
            this.state = this.states.idle;
        }
    }

    find_merging_blocks() {
        this.merging_blocks = [];

        this.blocks_moved.forEach(block => {
            let merge_with = [];
            let merge_up = false;
            if(block.value !== 0) {
                if(block.x - 1 >= 0 && this.board[this.position_to_index(block.x - 1, block.y)].value === block.value) {
                    merge_with.push(this.board[this.position_to_index(block.x - 1, block.y)]);
                }

                if(block.x + 1 < this.width && this.board[this.position_to_index(block.x + 1, block.y)].value === block.value) {
                    merge_with.push(this.board[this.position_to_index(block.x + 1, block.y)]);
                }

                if(block.y + 1 < this.height && this.board[this.position_to_index(block.x, block.y + 1)].value === block.value) {
                    //merge_with.push(this.board[this.position_to_index(block.x, block.y + 1)]);
                }

                if(block.y - 1 >= 0 && this.board[this.position_to_index(block.x, block.y - 1)].value === block.value) {
                    merge_with.push(this.board[this.position_to_index(block.x, block.y - 1)]);
                    if(merge_with.length === 1) {
                        merge_up = true;
                    }
                }

                if(merge_with.length) {
                    if(merge_up) {
                        merge_with[0].add_merge(block);
                        block.value = 0;
                        this.merging_blocks.push(merge_with[0]);
                    } else {
                        merge_with.forEach(block_to_be_eaten => {
                            block.add_merge(block_to_be_eaten);
                            block_to_be_eaten.value = 0;
                        });
                        this.merging_blocks.push(block);
                    }
                }
/* 
                if(merge_with.length) {
                    if(merge_with.length === 1) {
                        merge_with[0].add_merge(block);
                        block.value = 0;
                        this.merging_blocks.push(merge_with[0]);
                    } else {
                        merge_with.forEach(block_to_be_eaten => {
                            block.add_merge(block_to_be_eaten);
                            block_to_be_eaten.value = 0;
                        });
                        this.merging_blocks.push(block);
                    }
                }
*/
            }
        });

        if(this.merging_blocks.length) {

            this.merging_blocks.forEach(block => {
                block.start_merge();
            });
            this.animation_start = performance.now();
            this.animation_time = this.animation_merge_time;
            this.state = this.states.animating_merging_blocks;
        } else {
            this.state = this.states.find_falling_blocks;
        }
    }

    match_blocks() {

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let value = this.board[x][y];
                if(value === 0) {
                    continue;
                }
                let found_match = false;

                if(y - 1 >= 0 && this.board[x][y - 1] === value) {
                    this.board[x][y - 1] *= 2;
                    found_match = true;
                }

                if(x - 1 >= 0 && this.board[x - 1][y] === value) {
                    this.board[x - 1][y] *= 2;
                    found_match = true;
                }

                if(x + 1 < this.width && this.board[x + 1][y] === value) {
                    this.board[x + 1][y] *= 2;
                    found_match = true;
                }

                if(found_match) {
                    this.board[x].splice(y, 1);
                    this.board[x].push(0);
                }
            }
        }

        return;

        this.blocks_moved.forEach(block => {
            let found_match = false;

            if(block.y - 1 >= 0 && this.board[x][y - 1] === block.value) {
                this.board[x][y - 1] *= 2;
                found_match = true;
            }

            if(block.y - 1 >= 0 && this.board[x][y - 1] === block.value) {
                this.board[x][y - 1] *= 2;
                found_match = true;
            }
        });
    }

    animate() {
        let time = performance.now() - this.animation_start;

        if(time >= this.animation_time) {
            /*
                To do:
                Find matches and falling blocks
            */
            this.blocks_moved.forEach(block => {
                block.setIdle();
            });

            if(this.state === this.states.animating_falling_blocks) {
                this.state = this.states.find_merging_blocks;
            }

            if(this.state === this.states.animating_merging_blocks) {
                this.merging_blocks.forEach(block => {
                    block.end_merge();
                });
                this.blocks_moved = this.merging_blocks;
                this.state = this.states.find_merging_blocks;
            }
        }
    }

    update() {
        switch(this.state) {
            case this.states.find_falling_blocks:
                this.find_falling_blocks();
                break;

            case this.states.find_merging_blocks:
                this.find_merging_blocks();
                break;

            case this.states.animating_falling_blocks:
                this.animate();
                break;

            case this.states.animating_merging_blocks:
                this.animate();
                break;

        }
    }

    render(ctx, block_size) {
        let time = (performance.now() - this.animation_start) / this.animation_time;

        ctx.fillStyle = "#2f2f2f";
        ctx.fillRect(0, 0, this.width * block_size, this.height * block_size);

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.board[this.position_to_index(x, y)].render(ctx, block_size, time);
            }
        }
    }
}