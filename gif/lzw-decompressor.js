function Decompressor(compressed_data, code_size) {
    let table = {};

    let clear_code = 2 ** code_size;
    let end_of_information = clear_code + 1;

    let next = clear_code + 2;

    function createTable() {
        table = {};
        for(let i = 0; i < 2 ** code_size; i++) {
            table[i] = String.fromCharCode(i);
        }
        next = clear_code + 2;
    }

    let compression_size = code_size + 1;

    let out = [];
    let b_out = [];

    let offset = 0;
    let index = 0;

    let old_code;
    let new_code;
    let char = "";

    while(index < compressed_data.length) {
        let byte = compressed_data[index] >> offset & 2 ** compression_size - 1;
        let overflow = offset + compression_size - 8;
        let overflowIndex = 1;

        while(overflow > 0) {
            let next_byte = compressed_data[index + overflowIndex] & 2 ** overflow - 1;
            byte = (next_byte << (compression_size - overflow)) | byte;
            overflowIndex++;
            overflow -= 8;
        }

        offset += compression_size;

        while(offset >= 8) {
            offset -= 8;
            index++;
        }

        b_out.push(byte);

        if(byte === clear_code) {
            createTable();
            compression_size = code_size + 1;
            old_code = undefined;
            continue;
        }

        if(byte === end_of_information) {
            break;
        }

        if(old_code === undefined) {
            old_code = byte;
            out.push(table[old_code]);
            continue;
        }

        new_code = byte;
        if(table[new_code] !== undefined) {
            out.push(table[new_code]);
            char = table[new_code][0];
            table[next++] = table[old_code] + char;
            string = table[new_code];
        } else {
            if(table[old_code] === undefined) {
                console.log(compression_size, old_code, table);
            } 
            char = table[old_code][0];
            out.push(table[old_code] + char);
            table[next++] = table[old_code] + char;
        }

        old_code = new_code;

        if(next > 2 ** compression_size - 1) {
            compression_size++;
            if(compression_size > 12) {
                compression_size = 12;
            }
        }
    }
/*
console.log(table);
console.log(out);
console.log(b_out)
*/
    let output = []; 
    for(let i = 0; i < out.length; i++) {
        for(let j = 0; j < out[i].length; j++) {
            output.push(out[i].charCodeAt(j));
        }   
    }

    return output;
}