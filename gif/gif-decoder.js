function Decoder(DATA) {
    let GIF = {
        imageDescriptors: [],
    };

    function decode() {
        let index = 0;
        let result;

        result = Header(index);
        GIF.header = result.header;
        index = result.index

        result = LogicalScreenDescriptor(index);
        GIF.logicalScreenDescriptor = result.logicalScreenDescriptor;
        index = result.index;

        if(GIF.logicalScreenDescriptor.globalColorTableFlag) {
            result = ColorTable(index, GIF.logicalScreenDescriptor.sizeOfGlobalColorTable);
            GIF.globalColorTable = result.colorTable;
            index = result.index;
        } 

        let EOF = false;
        let GCE;

        while(!EOF) {

            if(DATA[index] === 0x21) {
                switch(DATA[index + 1]) {
                    case 0xF9:
                        result = GraphicControlExtension(index);
                        GCE = result.graphicControlExtension;
                        index = result.index;
                        break;

                    case 0xFE:
                        if(!GIF.comments) {
                            GIF.comments = [];
                        }
                        result = CommentExtension(index);
                        GIF.comments.push(result.commentExtension);
                        index = result.index;
                        break;

                    case 0xFF:
                        if(!GIF.applicationExtensions) {
                            GIF.applicationExtensions = [];
                        }
                        result = ApplicationExtension(index);
                        GIF.applicationExtensions.push(result.applicationExtension);
                        index = result.index;
                        break;
                    
                    default:
                        console.log(DATA[index].toString(16));
                        EOF = true;
                }
            } else {
                switch(DATA[index]) {
                    case 0x2C:
                        result = ImageDescriptor(index, GCE);
                        GIF.imageDescriptors.push(result.imageDescriptor);
                        index = result.index;
                        GCE = undefined;
                        break;

                    case 0x3B:
                        EOF = true;
                        break;

                    default:
                        console.log(index.toString(16));
                        console.log("Error", DATA[index].toString(16));
                        EOF = true;
                }
            }
        }

        return GIF;
    }

    function DataSubBlocks(index) {
        let data_values = [];
        let size = DATA[index];
        index++;

        while(size) {
            for(let i = 0; i < size; i++) {
                data_values.push(DATA[index + i]);
            }
            index += size;

            size = DATA[index];
            index++;
        }

        return {
            dataValues: new Uint8Array(data_values),
            index: index,
        }
    }

    function Header(index) {
        let size = 3;
        let signature = "";
        let version = "";

        for(let i = 0; i < size; i++) {
            signature += String.fromCharCode(DATA[index + i]);
        }
        index += 3;

        for(let i = 0; i < size; i++) {
            version += String.fromCharCode(DATA[index + i]);
        }
        index += 3;

        return {
            header: {
                signature: signature,
                version: version,
            },

            index: index,
        }
    }

    function LogicalScreenDescriptor(index) {
        let logical_screen_width,
            logical_screen_height,
            global_color_table_flag,
            color_resolution,
            sort_flag,
            size_of_global_color_table,
            background_color_index,
            pixel_aspect_ratio;

        logical_screen_width = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        logical_screen_height = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        global_color_table_flag = DATA[index] >> 7;
        color_resolution = (DATA[index] >> 4) & 7;
        sort_flag = (DATA[index] >> 3) & 1;
        size_of_global_color_table = DATA[index] & 7;
        index++;

        background_color_index = DATA[index];
        index++;

        pixel_aspect_ratio = DATA[index];
        index++;

        return {
            logicalScreenDescriptor: {
                logicalScreenWidth: logical_screen_width,
                logicalScreenHeight: logical_screen_height,
                globalColorTableFlag: global_color_table_flag,
                colorResolution: color_resolution,
                sortFlag: sort_flag,
                sizeOfGlobalColorTable: size_of_global_color_table,
                backgroundColorIndex: background_color_index,
                pixelAspectRatio: pixel_aspect_ratio,
            },

            index: index,
        }
    }

    function ColorTable(index, size_of_color_table) {
        let size = 3 * Math.pow(2, size_of_color_table + 1);
        let color_table = new Uint8Array(size);

        for(let i = 0; i < size; i++) {
            color_table[i] = DATA[index + i];
        }

        index += size;

        return {
            colorTable: color_table,
            index: index,
        }
    }

    function ImageDescriptor(index, graphicControlExtension) {
        index++;

        let image_left_position,
            image_top_position,
            image_width,
            image_height,
            local_color_table_flag,
            interlace_flag,
            sort_flag,
            size_of_local_color_table,
            local_color_table,
            table_based_image_data;

        image_left_position = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        image_top_position = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        image_width = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        image_height = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        local_color_table_flag = DATA[index] >> 7;
        interlace_flag = (DATA[index] >> 6) & 1;
        sort_flag = (DATA[index] >> 5) & 1;
        size_of_local_color_table = DATA[index] & 7;
        index++;

        let result;

        if(local_color_table_flag) {
            result = ColorTable(index, size_of_local_color_table);
            local_color_table = result.colorTable;
            index = result.index;
        }

        result = TableBasedImageData(index);
        table_based_image_data = result.TableBasedImageData;
        index = result.index;

        let imageDescriptor = {
            imageLeftPosition: image_left_position,
            imageTopPosition: image_top_position,
            imageWidth: image_width,
            imageHeight: image_height,
            localColorTableFlag: local_color_table_flag,
            interlaceFlag: interlace_flag,
            sortFlag: sort_flag,
            sizeOfLocalColorTable: size_of_local_color_table,
            tableBasedImageData: table_based_image_data,
        }

        if(size_of_local_color_table) {
            imageDescriptor.localColorTable = local_color_table;
        }

        if(graphicControlExtension) {
            imageDescriptor.graphicControlExtension = graphicControlExtension;
        }

        return {
            imageDescriptor: imageDescriptor,
            index: index,
        }
    }

    function TableBasedImageData(index) {
        let LZW_minimum_code_size = DATA[index];
        index++;

        let result = DataSubBlocks(index);

        return {
            TableBasedImageData: {
                LZWMinimumCodeSize: LZW_minimum_code_size,
                imageData: result.dataValues,
            },
            index: result.index,
        }
    }

    function GraphicControlExtension(index) {
        index += 3;

        let disposal_method,
            user_input_flag,
            transparent_color_flag,
            delay_time,
            transparent_color_index;

        disposal_method = (DATA[index] >> 2) & 7;
        user_input_flag = (DATA[index] >> 1) & 1;
        transparent_color_flag = DATA[index] & 1;
        index++;

        delay_time = (DATA[index + 1] << 8) | DATA[index];
        index += 2;

        transparent_color_index = DATA[index];
        index += 2;

        let graphicControlExtension = {
            disposalMethod: disposal_method,
            userInputFlag: user_input_flag,
            transparentColorFlag: transparent_color_flag,
            delayTime: delay_time,
            transparentColorIndex: transparent_color_index,
        }
        
        return {
            graphicControlExtension: graphicControlExtension,
            index: index,
        }
    }

    function CommentExtension(index) {
        index += 2;

        let result = DataSubBlocks(index);
        let comment = "";

        for(let i = 0; i < result.dataValues.length; i++) {
            comment += String.fromCharCode(result.dataValues[i]);
        }

        return {
            commentExtension: {
                commentData: result.dataValues,
                comment: comment,
            },
            index: result.index,
        }
    }

    function ApplicationExtension(index) {
        index += 3;

        let application_identifier = "",
            application_authentication_code = "",
            application_data;

        for(let i = 0; i < 8; i++) {
            application_identifier += String.fromCharCode(DATA[index + i]);
        }
        index += 8;

        for(let i = 0; i < 3; i++) {
            application_authentication_code += String.fromCharCode(DATA[index + i]);
        }
        index += 3;

        result = DataSubBlocks(index);

        return {
            applicationExtension: {
                applicationIdentifier: application_identifier,
                applicationAuthenticationCode: application_authentication_code,
                applicationData: result.dataValues,
            },
            index: result.index,
        }
    }

    return decode();
}