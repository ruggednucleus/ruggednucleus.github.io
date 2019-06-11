class Maze {
    maze;

    constructor(width, height, new_path) {
        this.width = width;
        this.height = height;
        this.new_path = new_path;

        this.generateMaze()

        console.log(this);
    }

    generateMaze() {
        this.maze = Array(this.width * this.height);
        
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.maze[y * this.width + x] = new Point(x, y, this);
            }
        }

        let active_point = this.maze[Math.random() * this.maze.length | 0];
        let active_points = [active_point];
        active_point.visited = true;

        while(active_points.length) {
            if(Math.random() < this.new_path) {
                active_point = active_points[Math.random() * active_points.length | 0];
            }

            let point = active_point;
            let neighbors = point.unvisitedNeighbors();

            if(neighbors.length) {
                let neighbor = neighbors[Math.random() * neighbors.length | 0];
                point.pathTo(neighbor);
                neighbor.pathTo(point);
                active_points.push(neighbor);
                active_point = neighbor;
            } else {
                for(let i = 0; i < active_points.length; i++) {
                    if(active_points[i] === point) {
                        active_points.splice(i, 1);
                        break;
                    }
                }

                active_point = active_points[Math.random() * active_points.length | 0];
            }
        }
    }

    index(x, y) {
        return y * this.width + x;
    }

    pointAt(x, y) {
        return this.maze[this.index(x, y)];
    }

    static Render(maze, ctx, size) {
        let width = maze.width;
        let height = maze.height;

        ctx.canvas.width = width * size * 2 + size;
        ctx.canvas.height = height * size * 2 + size;

        for(let i = 0; i < maze.maze.length; i++) {
            let point = maze.maze[i];
            let x = point.x * 2 + 1;
            let y = point.y * 2 + 1;

            ctx.fillRect((x - 1) * size, (y - 1) * size, size, size);

            if(!point.path.north) { ctx.fillRect((x) * size, (y - 1) * size, size, size) }
            if(!point.path.west) { ctx.fillRect((x - 1) * size, (y) * size, size, size) }
        }

        ctx.fillRect(width * size * 2, 0, size, height * size * 2);
        ctx.fillRect(0, height * size * 2, width * size * 2 + size, size);
/*
        ctx.fillStyle = "white";
        ctx.fillRect((width / 2 | 0) * size * 2 + size, 0, size, size);
        ctx.fillRect((width / 2 | 0) * size * 2 + size, height * size * 2, size, size);*/
    }
}

class Point {
    visited = false;
    path = {
        north: false,
        south: false,
        east: false,
        west: false
    }

    constructor(x, y, maze) {
        this.x = x;
        this.y = y;
        this.maze = maze;
    }

    index() {
        return this.y * this.maze.width + this.x;
    }

    pathTo(point) {
        this.visited = true;

        let x = this.x - point.x;
        let y = this.y - point.y;

        if(y > 0) { this.path.north = true }
        if(y < 0) { this.path.south = true }
        if(x > 0) { this.path.west = true }
        if(x < 0) { this.path.east = true }
    }

    neighbors() {
        let neighbors = [];

        if(this.x - 1 >= 0)               { neighbors.push(this.maze.pointAt(this.x - 1, this.y)) }
        if(this.x + 1 < this.maze.width)  { neighbors.push(this.maze.pointAt(this.x + 1, this.y)) }
        if(this.y - 1 >= 0)               { neighbors.push(this.maze.pointAt(this.x, this.y - 1)) }
        if(this.y + 1 < this.maze.height) { neighbors.push(this.maze.pointAt(this.x, this.y + 1)) }

        return neighbors;
    }

    unvisitedNeighbors() {
        let neighbors = this.neighbors();
        for(let i = 0; i < neighbors.length; i++) {
            if(neighbors[i].visited) {
                neighbors.splice(i, 1);
                i--;
            }
        }
        return neighbors;
    }
}