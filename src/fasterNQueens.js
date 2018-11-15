/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

const genValidRooksSolutions = (currBoard) => { 
  const resultArr = [];
  let row = numRooks(currBoard)
  let maxColIndex = Math.ceil(currBoard.n / 2); 

  if (row > 0) { 
    maxColIndex = currBoard.n; 
  }
   
  for (let col = 0; col < maxColIndex; col++) { 
    if (currBoard.matrix[row][col] === 0) {
      currBoard.matrix[row][col] = 1;
      if (!currBoard.hasAnyRooksConflicts()) {
        let matrixCopy = deep2DCopy(currBoard.matrix);
        let copyCurrBoard = new Board(matrixCopy);
        resultArr.push(copyCurrBoard); 
        
      }
      currBoard.matrix[row][col] = 0;
      } 
  }
  return resultArr; 
}


const deep2DCopy = (matrix) => {
  let copy = [];
  for (let i = 0; i < matrix.length; i++) {
    copy.push(matrix[i].slice());
  }
  return copy;
}

const invertThis = (matrix) => { 
  
  const copyMatrix = deep2DCopy(matrix);

  for (let i = 0; i < matrix.length; i++) { 
    copyMatrix[i].reverse()
  }
  
  return JSON.stringify(copyMatrix);
}

const genValidQueensSolutions = (currBoard) => {
  const resultArr = [];
  let row = numRooks(currBoard)
  let maxColIndex = Math.ceil(currBoard.n / 2); 

  if (row > 0) { 
    maxColIndex = currBoard.n; 
  }

  for (let col = 0; col < maxColIndex; col++) { 
    if (currBoard.matrix[row][col] === 0) {
      currBoard.matrix[row][col] = 1;
      if (!currBoard.hasAnyQueensConflicts()) {
        let matrixCopy = deep2DCopy(currBoard.matrix);
        let copyCurrBoard = new Board(matrixCopy);
        resultArr.push(copyCurrBoard); 
      }
      currBoard.matrix[row][col] = 0;
      } 
  }
  return resultArr; 
}



const numRooks = (board) => { 
  var numPieces = 0 ;
    for (let i = 0; i < board.n; i++) { 
      for (let j = 0 ; j < board.n; j++) { 
        numPieces += board.matrix[i][j]; 
      }
    }
  return numPieces;
}


window.findNRooksSolution = function(n) {
  let emptyMatrix = makeEmptyMatrix(n)
  let currBoard = new Board(emptyMatrix)
  for (let row = 0; row < n; row++){
    for (let col = 0; col < n; col++) { 
      currBoard.matrix[row][col] = 1;
      if (currBoard.hasAnyRooksConflicts()) {
        currBoard.matrix[row][col] = 0;
      }
    }
  }
  return currBoard.matrix;
};


window.countNRooksSolutions = function(n) {
  let permutations = []; 
  let emptyMatrix = makeEmptyMatrix(n)
  let newBoard = new Board(emptyMatrix)
  const backTrackRecursive = (board => { 
    if (numRooks(board) === n ) {
      let invertedArr = invertThis(board.matrix); // returns an inverted stringified arr 
      let stringifiedSolution = JSON.stringify(board.matrix);
      if (!permutations.includes(invertedArr)) { 
        permutations.push(invertedArr); 
      }
      
      if (!permutations.includes(stringifiedSolution)) { 
        permutations.push(stringifiedSolution); 
      }
    } else { 
      let validBoards = genValidRooksSolutions(board); 

      validBoards.forEach((singleBoard) => { 
        backTrackRecursive(singleBoard); 
      }); 
    }
  });
  backTrackRecursive(newBoard);
  // if (n <2) return 1; 
  return permutations.length;
};


window.findNQueensSolution = function(n) {
  if (n === 2 || n === 3) { return makeEmptyMatrix(n);}
  let solution = []; 
  let emptyMatrix = makeEmptyMatrix(n)
  let newBoard = new Board(emptyMatrix)
  const backTrackRecursive = (board => { 
    if (numRooks(board) === n ) {
      solution = board.matrix; 
    } else { 
      let validBoards = genValidQueensSolutions(board); 
      validBoards.forEach((singleBoard) => { 
        backTrackRecursive(singleBoard); 
      }); 
    }
  });
  backTrackRecursive(newBoard);
  return solution;
};


window.countNQueensSolutions = function(n) {
 let permutations = []; 
 let emptyMatrix = makeEmptyMatrix(n)
 let newBoard = new Board(emptyMatrix)

 const backTrackRecursive = (board => { 
   if (numRooks(board) === n ) {
     let invertedArr = invertThis(board.matrix); // returns an inverted stringified arr 
     let stringifiedSolution = JSON.stringify(board.matrix);
     if (!permutations.includes(invertedArr)) { 
       permutations.push(invertedArr); 
     }

     if (!permutations.includes(stringifiedSolution)) { 
       permutations.push(stringifiedSolution); 
     }
   } else { 
     let validBoards = genValidQueensSolutions(board); 

     validBoards.forEach((singleBoard) => { 
       backTrackRecursive(singleBoard); 
     }); 
   }
 });
 backTrackRecursive(newBoard);
 // if (n <2) return 1; 
 //console.log(permutations);
 return permutations.length;
};


var makeEmptyMatrix = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
};


  class Board {
    constructor(matrix){
      this.matrix = matrix;
      this.n = matrix.length
    }

  getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex) {
    return colIndex - rowIndex;
  }

  getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex) {
    return colIndex + rowIndex;
  }

  hasAnyRooksConflicts(){
    return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
  }

  hasAnyQueenConflictsOn(rowIndex, colIndex){
    return (
      this.hasRowConflictAt(rowIndex) ||
      this.hasColConflictAt(colIndex) ||
      this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
      this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
    );
  }

  hasAnyQueensConflicts() {
    return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
  }

  isInBounds(rowIndex, colIndex) {
    return (
      0 <= rowIndex && rowIndex < this.n &&
      0 <= colIndex && colIndex < this.n
    );
  }

  hasRowConflictAt(rowIndex) {
    let currRow = this.matrix[rowIndex];
    let counter = 0;
    for (let i = 0; i < this.n; i++){
        counter += currRow[i];
    }
    return (counter > 1) ? true : false
  }

  hasAnyRowConflicts() {
    for (let i = 0; i < this.n; i++){
      if (this.hasRowConflictAt(i)){
        return true;
      }
    }
    return false;
  }

  hasColConflictAt(colIndex) {
    let counter = 0;
    for (let i = 0; i < this.n; i++) {
      counter += this.matrix[i][colIndex];
    }
    return (counter > 1) ? true : false
  }

  hasAnyColConflicts() {
    for (let i = 0; i < this.n; i++) {
      if (this.hasColConflictAt(i)) {
        return true;
      }
    }
    return false;
  }

  hasMajorDiagonalConflictAt(majorDiagonalColumnIndexAtFirstRow) {
    let majorIndex = majorDiagonalColumnIndexAtFirstRow;
    let counter = 0; 
    // Iterate from input given to boardlength 
    for (let i = 0; i < this.n; i++) { 
      if ( majorIndex + i >= 0 && majorIndex + i < this.n) { 
        counter += this.matrix[i][majorIndex + i];
      }
    }
    return (counter > 1) ? true: false
  }

  hasAnyMajorDiagonalConflicts() {
    for (let i = -this.n + 1; i < this.n; i++) {
      if (this.hasMajorDiagonalConflictAt(i)) {
        return true;
      }
    }
    return false;
  }

  hasMinorDiagonalConflictAt(minorDiagonalColumnIndexAtFirstRow) {
    let counter = 0;
    let minorIndex = minorDiagonalColumnIndexAtFirstRow;
    for (let i = 0; i < this.n; i++){
      if (minorIndex-i >= 0 && minorIndex-i < this.n){
        counter += this.matrix[i][minorIndex-i];
      }
    }
    return (counter > 1) ? true : false
  }

  hasAnyMinorDiagonalConflicts() {
    for (let i = 0; i <= 2 * (this.n - 1); i++){
      if (this.hasMinorDiagonalConflictAt(i)) {
        return true;
      }
    }
  return false;
  }

  }