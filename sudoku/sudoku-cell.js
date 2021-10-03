class SudokuCell {
    static EMPTY = 0
    
    locked = false;
    possible_numbers = [];

    constructor(index, value = SudokuCell.EMPTY) {
        this.index = index;
        this.value = value;
    }

    setPossibleNumbers(numbers) {
        this.possible_numbers = numbers;
    }
}