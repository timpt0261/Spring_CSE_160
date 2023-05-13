// Maze generator function
// Credit goes to chatgpt
function generateMaze(rows, cols) {
    // Create a grid
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill("#");
    }

    // Starting point
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    grid[startRow][startCol] = "S";

    // Recursive depth-first search
    function dfs(row, col) {
        // Define the four directions: up, right, down, left
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        directions.sort(() => Math.random() - 0.5); // Randomize the order of directions

        for (let i = 0; i < directions.length; i++) {
            const [dx, dy] = directions[i];
            const newRow = row + 2 * dx; // Jump two steps
            const newCol = col + 2 * dy; // Jump two steps

            // Check if the new cell is within the grid
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (grid[newRow][newCol] === "#") {
                    grid[row + dx][col + dy] = " "; // Open the wall
                    grid[newRow][newCol] = " "; // Open the new cell
                    dfs(newRow, newCol); // Recursively visit the new cell
                }
            }
        }
    }

    dfs(startRow, startCol);

    // Finishing point
    const endRow = Math.floor(Math.random() * rows);
    const endCol = Math.floor(Math.random() * cols);
    grid[endRow][endCol] = "E";

    return grid;
}

