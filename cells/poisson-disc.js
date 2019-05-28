function PoissonDisc(width, height, min_distance, samples) {
    let min_distance_2 = min_distance * min_distance;
    let grid_size = min_distance / Math.SQRT2;
    let grid_width = Math.ceil(width / grid_size);
    let grid_height = Math.ceil(height / grid_size);

    let grid = Array(grid_height);
    for(let y = 0; y < grid_height; y++) {
        grid[y] = Array(grid_width);
    }

    let start_point = {
        x: width * Math.random() | 0,
        y: height * Math.random() | 0
    }
    grid[start_point.y / grid_size | 0][start_point.x / grid_size | 0] = start_point;

    let points = [start_point];
    let active_points = [start_point];
    let random = [1, -1];

    while(active_points.length) {
        let created_point = false;
        let active_point_index = Math.random() * active_points.length | 0;
        let active_point = active_points[active_point_index];

        for(let sample = 0; sample < samples; sample++) {
            let can_place = true;

            let new_point = {
                x: active_point.x + (min_distance + min_distance * Math.random() | 0) * random[Math.random() * 2 | 0],
                y: active_point.y + (min_distance + min_distance * Math.random() | 0) * random[Math.random() * 2 | 0]
            }

            if(new_point.x < 0 || new_point.x >= width || new_point.y < 0 || new_point.y >= height) {
                can_place = false;
            }

            let grid_x = new_point.x / grid_size | 0;
            let grid_y = new_point.y / grid_size | 0;

            for(let x = -3; x < 4 && can_place; x++) {
                for(let y = -3; y < 4 && can_place; y++) {
                    if(grid_x + x >= 0 && grid_x + x < grid_width && grid_y + y >= 0 && grid_y + y < grid_height) {
                        let point = grid[grid_y + y][grid_x + x];
                        if(point !== undefined) {
                            if(min_distance_2 > (Math.pow(point.x - new_point.x, 2) + Math.pow(point.y - new_point.y, 2))) {
                                can_place = false;
                            }
                        }
                    }
                }
            }

            if(can_place) {
                created_point = true;
                points.push(new_point);
                active_points.push(new_point);
                grid[grid_y][grid_x] = new_point;
                break;
            }
        }

        if(!created_point) {
            active_points.splice(active_point_index, 1);
        }
    }

    return points;
}