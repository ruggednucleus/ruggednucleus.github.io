function EncoderDebug(logical_screen_descriptor, image_descriptors, global_color_table, application_extensions, comment_extensions) {
    let encoded_gif = [];

    global_color_table = global_color_table || [];
    application_extensions = application_extensions || [];
    comment_extensions = comment_extensions || [];

    Header("GIF", "89a");
    LogicalScreenDescriptor(logical_screen_descriptor);
    ColorTable(global_color_table);
    ApplicationExtensions(application_extensions);
    CommentExtensions(comment_extensions);
    ImageDescriptors(image_descriptors);
    Trailer();

    function Header(signature, version) {
        for(let i = 0; i < signature.length; i++) {
            encoded_gif.push(signature.charCodeAt(i), "Signature"); // Signature
        }
    
        for(let i = 0; i < version.length; i++) {
            encoded_gif.push(version.charCodeAt(i), "Version"); // Version
        }
    }

    function DataSubBlocks(data) {
        let index = 0;
        for(let i = 0; i < data.length; i++) {
            if(i === index) {
                encoded_gif.push(Math.min(255, data.length - index), "Block Size");
                index += Math.min(255, data.length - index);
            }
            encoded_gif.push(data[i], "Data");
        }
    }

    function BlockTerminator() {
        encoded_gif.push(0x00, "Block Terminator");
    }

    function LogicalScreenDescriptor(logical_screen_descriptor) {
        encoded_gif.push(logical_screen_descriptor.logicalScreenWidth & 0xFF, "Logical Screen Width") // Logical Screen Width
        encoded_gif.push(logical_screen_descriptor.logicalScreenWidth >> 8, "Logical Screen Width") // Logical Screen Width

        encoded_gif.push(logical_screen_descriptor.logicalScreenHeight & 0xFF, "Logical Screen Height") // Logical Screen Height
        encoded_gif.push(logical_screen_descriptor.logicalScreenHeight >> 8, "Logical Screen Height") // Logical Screen Height

        let packed_fields = logical_screen_descriptor.globalColorTableFlag << 7; // Global Color Table Flag
        packed_fields |= logical_screen_descriptor.colorResolution << 4; // Color Resolution
        packed_fields |= logical_screen_descriptor.sortFlag << 3; // Sort Flag
        packed_fields |= logical_screen_descriptor.sizeOfGlobalColorTable; // Size Of Global Color Table

        encoded_gif.push(packed_fields, "Packed Fields") // Packed Fields
        encoded_gif.push(logical_screen_descriptor.backgroundColorIndex, "Background Color Index"); // Background Color Index
        encoded_gif.push(logical_screen_descriptor.pixelAspectRatio, "Pixel Aspect Ratio") // Pixel Aspect Ratio
    }

    function ColorTable(color_table) {
        for(let i = 0; i < color_table.length; i++) {
            encoded_gif.push(color_table[i], "Color Table"); // Color Table
        }
    }

    function ImageDescriptors(image_descriptors) {
        for(let i = 0; i < image_descriptors.length; i++) {
            let image = image_descriptors[i];
            if(image.graphicControlExtension) {
                GraphicControlExtension(image.graphicControlExtension);
            }

            encoded_gif.push(0x2C, "Image Separator"); // Image Separator
            
            encoded_gif.push(image.imageLeftPosition & 0xFF, "Image Left Position") // Image Left Position
            encoded_gif.push(image.imageLeftPosition >> 8, "Image Left Position") // Image Left Position

            encoded_gif.push(image.imageTopPosition & 0xFF, "Image Top Position") // Image Top Position
            encoded_gif.push(image.imageTopPosition >> 8, "Image Top Position") // Image Top Position

            encoded_gif.push(image.imageWidth & 0xFF, "Image Width") // Image Width
            encoded_gif.push(image.imageWidth >> 8, "Image Width") // Image Width

            encoded_gif.push(image.imageHeight & 0xFF, "Image Height") // Image Height
            encoded_gif.push(image.imageHeight >> 8, "Image Height") // Image Height

            let packed_fields = image.localColorTableFlag << 7; // Local Color Table Flag 
            packed_fields |= image.interlaceFlag << 6; // Interlace Flag
            packed_fields |= image.sortFlag << 5; // Sort Flag
            packed_fields |= image.sizeOfLocalColorTable; // Size Of Local Color Table

            encoded_gif.push(packed_fields, "Packed Fields") // Packed Fields

            if(image.localColorTableFlag) {
                ColorTable(image.localColorTable, "Local Color Table") // Local Color Table
            }

            TableBasedImageData(image.tableBasedImageData);
        }
    }

    function TableBasedImageData(table_based_image_data) {
        encoded_gif.push(table_based_image_data.LZWMinimumCodeSize, "LZW Minimum Code Size"); // LZW Minimum Code Size
        DataSubBlocks(table_based_image_data.imageData) // Image Data
        BlockTerminator();
    }

    function GraphicControlExtension(graphic_control_extension) {
        encoded_gif.push(0x21, "Extension Introducer") // Extension Introducer
        encoded_gif.push(0xF9, "Graphic Control Lable") // Graphic Control Lable
        encoded_gif.push(0x04, "Block Size") // Block Size

        let packed_fields = 0;
        packed_fields |= graphic_control_extension.disposalMethod << 2; // Disposal Method
        packed_fields |= graphic_control_extension.userInputFlag << 1; // User Input Flag
        packed_fields |= graphic_control_extension.transparentColorFlag; // Transparent Color Flag

        encoded_gif.push(packed_fields, "Packed Fields"); // Packed Fields

        encoded_gif.push(graphic_control_extension.delayTime & 0xFF, "Delay Time"); // Delay Time
        encoded_gif.push(graphic_control_extension.delayTime >> 8, "Delay Time"); // Delay Time

        encoded_gif.push(graphic_control_extension.transparentColorIndex, "Transparent Color Index"); // Transparent Color Index

        BlockTerminator();
    }

    function ApplicationExtensions(application_extensions) {
        for(let i = 0; i < application_extensions.length; i++) {
            let AE = application_extensions[i];
            
            encoded_gif.push(0x21, "Extension Introducer") // Extension Introducer
            encoded_gif.push(0xFF, "Extension Lable") // Extension Label
            encoded_gif.push(0x0B, "Block Size"); // Block Size
            
            for(let j = 0; j < AE.applicationIdentifier.length; j++) {
                encoded_gif.push(AE.applicationIdentifier.charCodeAt(j), "Application Identifier"); // Application Identifier
            }
    
            for(let j = 0; j < AE.applicationAuthenticationCode.length; j++) {
                encoded_gif.push(AE.applicationAuthenticationCode.charCodeAt(j), "Application Authentication Code"); // Application Authentication Code
            }
    
            DataSubBlocks(AE.applicationData); // Application Data
            BlockTerminator();
        }
    }

    function CommentExtensions(comment_extensions) {
        for(let i = 0; i < comment_extensions.length; i++) {
            let comment = comment_extensions[i];
            encoded_gif.push(0x21, "Extension Introducer") // Extension Introducer
            encoded_gif.push(0xFE, "Comment Label") // Comment Label
           
            DataSubBlocks(comment.commentData); // Comment Data
            BlockTerminator();
        }
    }

    function Trailer() {
        encoded_gif.push(0x3B, "Trailer"); // Trailer
    }

    return encoded_gif;
}