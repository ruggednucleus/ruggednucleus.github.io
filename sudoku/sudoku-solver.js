class SudokuSolver {
    constructor(sudoku) {
        this.sudoku = sudoku;
    }

    solve() {
        const dt = performance.now();
        
        const solving_order = [
            this.find_all_possible_numbers,
            this.solve_sole_candidate,
            this.solve_unique_candidate,
            this.find_all_block_and_column_or_row_interactions,
            this.find_all_naked_subsets,
        ];

        const times_used = new Array(solving_order.length).fill(0);

        let total_i = 0;
        for(let i = 0; total_i < 10000 && i < solving_order.length; i++) {
            total_i++
            times_used[i]++;
            if(solving_order[i].bind(this)()) {
                i = -1;
            }
        }

        console.log("Total time: " + (performance.now() - dt), times_used, solving_order);
    }

    find_all_possible_numbers() {
        const dt = performance.now();
        for(let i = 0; i < this.sudoku.board.length; i++) {
            const coords = this.sudoku.toCoords(i);
            this.find_possible_numbers(coords.x, coords.y)
        }

        console.log("Find all possible numbers\nTime: " + (performance.now() - dt));
        
        return false;
    }

    find_possible_numbers(x, y) {
        const cell = this.sudoku.getCell(x, y)

        if(cell.value) {
            return;
        }

        let possible_numbers = new Set(cell.possible_numbers);

        if(!possible_numbers.size) {
            possible_numbers = new Set();
            for(let i = 0; i < this.sudoku.size; i++) {
                possible_numbers.add(i + 1);
            }
        }

        const block = this.sudoku.getBlock(x, y);
        block.forEach(cell => {
            possible_numbers.delete(cell.value);
        });

        const row = this.sudoku.getRow(y);
        row.forEach(cell => {
            possible_numbers.delete(cell.value);
        });

        const column = this.sudoku.getColumn(x);
        column.forEach(cell => {
            possible_numbers.delete(cell.value);
        });

        possible_numbers = [...possible_numbers];

        cell.possible_numbers = possible_numbers;
    }

    solve_sole_candidate() {
        const dt = performance.now();
        let numbers_placed = 0;
       
        for(let i = 0; i < this.sudoku.board.length; i++) {
            const coords = this.sudoku.toCoords(i);
            if(this.check_sole_candidate(coords.x, coords.y)) {
                numbers_placed++;
            }
        }

        console.log("Solve sole candidate\nTime: " + (performance.now() - dt) + "\nNumbers placed: " + numbers_placed);
        
        return numbers_placed;
    }

    check_sole_candidate(x, y) {
        const cell = this.sudoku.getCell(x, y)

        if(cell.value) {
            return;
        }

        if(cell.possible_numbers.length === 1) {
            cell.value = cell.possible_numbers[0];
        }

        return cell.value;
    }

    solve_unique_candidate() {
        const dt = performance.now();
        let numbers_placed = 0;

        for(let i = 0; i < this.sudoku.board.length; i++) {
            const coords = this.sudoku.toCoords(i);
            if(this.check_unique_candidate(coords.x, coords.y)) {
                numbers_placed++;
            }
        }

        console.log("Solve unique candidate\nTime: " + (performance.now() - dt) + "\nNumbers placed: " + numbers_placed)

        return numbers_placed;;
    }

    check_unique_candidate(x, y) {
        const cell = this.sudoku.getCell(x, y);
        if(cell.value) {
            return;
        }

        // Check block;
        let possible_numbers = new Set(cell.possible_numbers);

        const block = this.sudoku.getBlock(x, y);
        block.forEach(other_cell => {
            if(other_cell !== cell && other_cell.value === SudokuCell.EMPTY) {
                other_cell.possible_numbers.forEach(number => {
                    possible_numbers.delete(number);
                });
            }
        });

        if(possible_numbers.size === 1) {
            possible_numbers = [...possible_numbers];
            cell.value = possible_numbers[0];
        }

        return cell.value;
    }
    
    find_all_block_and_column_or_row_interactions() {
        const dt = performance.now();
        let fund_interaction = false;
        for(let x = 0; x < this.sudoku.blocks_in_row; x++) {
            for(let y = 0; y < this.sudoku.blocks_in_column; y++) {
                if(this.find_block_and_column_or_row_interaction(x * this.sudoku.blocks_in_row, y * this.sudoku.blocks_in_column)) {
                    fund_interaction = true;
                }
            }
        }

        console.log("Find all block and column or row interactions\nTime: " + (performance.now() - dt) + "\nFund interaction: " + fund_interaction);
        return fund_interaction;
    }

    find_block_and_column_or_row_interaction(block_x, block_y) {
        const used_numbers = new Set();

        let fund_interaction = false;

        for(let x = block_x; x < block_x + this.sudoku.block_width; x++) {
            for(let y = block_y; y < block_y + this.sudoku.block_height; y++) {
                const cell = this.sudoku.getCell(x, y);
                
                if(cell.value) {
                    continue;
                }

                for(let number_index = 0; number_index < cell.possible_numbers.length; number_index++) {
                    const number = cell.possible_numbers[number_index];
                    if(used_numbers.has(number)) {
                        continue;
                    } else {
                        used_numbers.add(number);
                    }

                    // Check other rows
                    let number_fund_in_other_rows = false;
                    for(let column = block_y; !number_fund_in_other_rows && column < block_y + this.sudoku.block_height; column++) {
                        for(let row = block_x; !number_fund_in_other_rows && row < block_x + this.sudoku.block_width; row++) {
                            if(column !== y) {
                                const other_cell = this.sudoku.getCell(row, column);
                                if(other_cell.possible_numbers.includes(number)) {
                                    number_fund_in_other_rows = true;
                                }
                            }
                        }
                    }

                    // Check other columns
                    let number_fund_in_other_columns = false;
                    for(let row = block_x; !number_fund_in_other_columns && row < block_x + this.sudoku.block_width; row++) {
                        for(let column = block_y; !number_fund_in_other_columns && column < block_y + this.sudoku.block_height; column++) {
                            if(row !== x) {
                                const other_cell = this.sudoku.getCell(row, column);
                                if(other_cell.possible_numbers.includes(number)) {
                                    number_fund_in_other_columns = true;
                                }
                            }
                        }
                    }

                    if(!number_fund_in_other_rows) {
                        let other_empty_cells_in_row = false;
                        for(let i = block_x; !other_empty_cells_in_row && i < block_x + this.sudoku.block_width; i++) {
                            const other_cell = this.sudoku.getCell(i, y);
                            if(other_cell !== cell && !other_cell.value) {
                                other_empty_cells_in_row = true;
                            } 
                        }

                        for(let row = 0; other_empty_cells_in_row && row < this.sudoku.size; row++) {
                            if(row < block_x || row >= block_x + this.sudoku.block_width) {
                                const other_cell = this.sudoku.getCell(row, y);
                                const index = other_cell.possible_numbers.indexOf(number)
                                if(index !== -1) {
                                    other_cell.possible_numbers.splice(index, 1);
                                    fund_interaction = true;
                                }
                            }
                        }
                    }

                    if(!number_fund_in_other_columns) {
                        let other_empty_cells_in_column = false;
                        for(let i = block_y; !other_empty_cells_in_column && i < block_y + this.sudoku.block_height; i++) {
                            const other_cell = this.sudoku.getCell(x, i);
                            if(other_cell !== cell && !other_cell.value) {
                                other_empty_cells_in_column = true;
                            } 
                        }

                        for(let column = 0; other_empty_cells_in_column && column < this.sudoku.size; column++) {
                            if(column < block_y || column >= block_y + this.sudoku.block_height) {
                                const other_cell = this.sudoku.getCell(x, column);
                                const index = other_cell.possible_numbers.indexOf(number)
                                if(index !== -1) {
                                    other_cell.possible_numbers.splice(index, 1);
                                    fund_interaction = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return fund_interaction;
    }

    find_all_naked_subsets() {
        const dt = performance.now();
        let found_subset = false;

        for(let x = 0; x < this.sudoku.size; x++) {
            if(this.find_naked_subset(this.sudoku.getColumn(x))) {
                found_subset = true;
            }
        }

        for(let y = 0; y < this.sudoku.size; y++) {
            if(this.find_naked_subset(this.sudoku.getRow(y))) {
                found_subset = true;
            }
        }

        for(let x = 0; x < this.sudoku.blocks_in_row; x++) {
            for(let y = 0; y < this.sudoku.blocks_in_column; y++) {
                if(this.find_naked_subset(this.sudoku.getBlock(x * this.sudoku.block_width, y * this.sudoku.block_height))) {
                    found_subset = true;
                }
            }
        }

        console.log("Find all naked subsets\nTime: " + (performance.now() - dt) + "\nFund subsets: " + found_subset);
        return found_subset;
    }

    find_naked_subset(cells) {
        const max_numbers = 4;

        let found_subset = false;

        for(let i = 0; i < cells.length - 1; i++) {
            const cell = cells[i];
            if(cell.value || cell.possible_numbers.length > max_numbers) {
                continue;
            }

            const subset = [cell];

            for(let j = i + 1; j < cells.length; j++) {
                const other_cell = cells[j];
                if(other_cell.value || cell.possible_numbers.length !== other_cell.possible_numbers.length) {
                    continue
                }

                let same_numbers = true;
                for(let k = 0; same_numbers && k < cell.possible_numbers.length; k++) {
                    same_numbers = other_cell.possible_numbers.includes(cell.possible_numbers[k]);
                }

                if(same_numbers) {
                    subset.push(other_cell);
                }
            }

            if(subset.length !== cell.possible_numbers.length) {
                continue
            }

            for(let j = 0; j < cells.length; j++) {
                if(subset.includes(cells[j])) {
                    continue
                }

                for(let k = 0; k < cell.possible_numbers.length; k++) {
                    const index = cells[j].possible_numbers.indexOf(cell.possible_numbers[k])
                    if(!cells[j].value && index !== -1) {
                        cells[j].possible_numbers.splice(index, 1);
                        found_subset = true;
                    }
                }
            }
        }

        return found_subset;
    }
}