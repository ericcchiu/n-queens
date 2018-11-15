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

const genValidSolutions = (currBoard) => { 
  const resultArr = []; 
  console.log(currBoard)
  
  // const sepBoard = currBoard.rows(); 
  for (let row = 0; row < currBoard.n; row++) { 
    for (let col = 0; col < currBoard.n; col++) { 
      if (currBoard.board[row][col] === 0) {
        currBoard.board[row][col] = 1;
        if (!currBoard.hasAnyRooksConflicts()) {
          let copyCurrBoard = {...currBoard}
          resultArr.push(copyCurrBoard); 
        }
        currBoard.board[row][col] = 0;
        } 
    }
  }
  return resultArr; 
}

const numRooks = (board) => { 
  var numPieces = 0 ;
    for (let i = 0; i < board.n; i++) { 
      for (let j = 0 ; j < board.n; j++) { 
        numPieces += board.board[i][j]; 
      }
    }
  return numPieces;
}

window.findNRooksSolution = function(n) {
  let emptyMatrix = makeEmptyMatrix(n)
  let currBoard = new Board(emptyMatrix)
  for (let row = 0; row < n; row++){
    for (let col = 0; col < n; col++) { 
      currBoard.board[row][col] = 1;
      if (currBoard.hasAnyRooksConflicts()) {
        currBoard.board[row][col] = 0;
      }
    }
  }

  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(currBoard.rows()));
  return currBoard.board;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {

  let permutations = []; 
  let emptyMatrix = makeEmptyMatrix(n)
  let newBoard = new Board(emptyMatrix)
  console.log(newBoard)
  const backTrackRecursive = (board => { 
    //console.log(board.rows());
    if (numRooks(board) === n ) { 
      if (!permutations.includes(board.board)) { 
        permutations.push(board.board); 
  
      }
    } else { 
      let validBoards = genValidSolutions(board); 

      validBoards.forEach((singleBoard) => { 
        backTrackRecursive(singleBoard).bind(this); 
      }); 
    }
  });
  backTrackRecursive(newBoard).bind(this);
  return permutations.length;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  // console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  // console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
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
      this.board = matrix;
      this.n = matrix.length
      this.hasAnyRooksConflicts = this.hasAnyRooksConflicts.bind(this);
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
    let currRow = this.board[rowIndex];
    let counter = 0;
    for (let i = 0; i < this.n; i++){
        counter += currRow[i];
    }
    return (counter > 1) ? true : false
  }

  // test if any rows on this board contain conflicts
  hasAnyRowConflicts() {
    for (let i = 0; i < this.n; i++){
      if (this.hasRowConflictAt(i)){
        return true;
      }
    }
    return false;
  }



  // COLUMNS - run from top to bottom
  // --------------------------------------------------------------
  //
  // test if a specific column on this board contains a conflict
  hasColConflictAt(colIndex) {
    let counter = 0;
    for (let i = 0; i < this.n; i++) {
      counter += this.board[i][colIndex];
    }
    return (counter > 1) ? true : false
  }

  // test if any columns on this board contain conflicts
  hasAnyColConflicts() {
    for (let i = 0; i < this.n; i++) {
      if (this.hasColConflictAt(i)) {
        return true;
      }
    }
    return false;
  }



  // Major Diagonals - go from top-left to bottom-right
  // --------------------------------------------------------------
  //
  // test if a specific major diagonal on this board contains a conflict

  hasMajorDiagonalConflictAt(majorDiagonalColumnIndexAtFirstRow) {
    let majorIndex = majorDiagonalColumnIndexAtFirstRow;
    let counter = 0; 
    // Iterate from input given to boardlength 
    for (let i = 0; i < this.n; i++) { 
      if ( majorIndex + i >= 0 && majorIndex + i < this.n) { 
        counter += this.board[i][majorIndex + i];
      }
    }
    return (counter > 1) ? true: false
  }

  // test if any major diagonals on this board contain conflicts
  hasAnyMajorDiagonalConflicts() {
    for (let i = -this.n + 1; i < this.n; i++) {
      if (this.hasMajorDiagonalConflictAt(i)) {
        return true;
      }
    }
    return false;
  }

  // Minor Diagonals - go from top-right to bottom-left
  // --------------------------------------------------------------
  //
  // test if a specific minor diagonal on this board contains a conflict
  hasMinorDiagonalConflictAt(minorDiagonalColumnIndexAtFirstRow) {
    let counter = 0;
    let minorIndex = minorDiagonalColumnIndexAtFirstRow;
    for (let i = 0; i < this.n; i++){
      if (minorIndex-i >= 0 && minorIndex-i < this.n){
        counter += this.board[i][minorIndex-i];
      }
    }
    return (counter > 1) ? true : false
  }

  // test if any minor diagonals on this board contain conflicts
  hasAnyMinorDiagonalConflicts() {
    for (let i = 0; i <= 2 * (this.n - 1); i++){
      if (this.hasMinorDiagonalConflictAt(i)) {
        return true;
      }
    }
  return false;
  }

  }