function Compressor(data, table_size, compression_size) {
    let table = {};
    let next_code = table_size + 1;

    for(let i = 0; i < table_size; i++) {
        table[String.fromCharCode(i)] = i;
    }

    let prefix = "";
    let code;
    let i = 0;
    let output = [];

    while(i < data.length) {
        code = String.fromCharCode(data[i++]);
        if(table[prefix + code] !== undefined) {
            prefix = prefix + code;
        } else {
            table[prefix + code] = next_code++;
            output.push(table[prefix]);
            prefix = code;
        }
    }

    output.push(table[prefix]);

console.log(table);
    return output;
}