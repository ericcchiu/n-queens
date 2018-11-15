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
  
  // const sepBoard = currBoard.rows(); 
  for (let row = 0; row < currBoard.rows().length; row++) { 
    for (let col = 0; col < currBoard.rows().length; col++) { 

      console.log('first', currBoard.rows());
      currBoard.togglePiece(row, col);
      console.log('second', currBoard.rows());
      currBoard.togglePiece(row, col);

      

      // if (currBoard.rows()[row][col] === 0) {
      //   currBoard.togglePiece(row, col);
      //   if (!currBoard.hasAnyRooksConflicts()) {
      //      let copyCurrBoard = {...currBoard}
      //      resultArr.push(copyCurrBoard); 
      //   }
      //   currBoard.togglePiece(row, col);
      // } 
    }
  }
  return resultArr; 
}

const numRooks = (board) => { 
  var numPieces = 0 ;
    for (let i = 0; i < board.rows().length; i++) { 
      for (let j = 0 ; j < board.rows().length; j++) { 
        numPieces += board.rows()[i][j]; 
      }
    }
  return numPieces;
}

window.findNRooksSolution = function(n) {
  let solution = makeEmptyMatrix(n);
  let currBoard = new Board(solution)
  for (let row = 0; row < n; row++){
    for (let col = 0; col < n; col++) { 
      currBoard.togglePiece(row,col);
      if (currBoard.hasAnyRooksConflicts()) {
        currBoard.togglePiece(row,col);
      }
    }
  }

  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(currBoard.rows()));
  return currBoard.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // let solutionCount = 0; //fixme
  // let priorResults = [];
  // let currResult = findNRooksSolution(n);
  // if (!priorResults.includes(JSON.stringify(currResult))) {
  //   priorResults.push(JSON.stringify(currResult));
  //   solutionCount++;
  // }

  // // console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  // return solutionCount;
  let permutations = []; 
  let solutionCount = permutations.length 
  let solution = makeEmptyMatrix(n);
  let newBoard = new Board(solution)
  console.log(newBoard.rows()); 

  const backTrackRecursive = (board => { 
    //console.log(board.rows());
    if (numRooks(board) === n ) { 
      if (!permutations.includes(board.rows())) { 
        permutations.push(board.rows()); 
  
      }
    } else { 
      let validBoards = genValidSolutions(board); 
      //console.log('ValidBoards line 86', validBoards)

      // validBoards.forEach((singleBoard) => { 
      //   backTrackRecursive(singleBoard); 
      // }); 
    }
  });
  backTrackRecursive(newBoard);
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



  class OurBoard {
    constructor(n){
      this.board = makeEmptyMatrix(n);
    }

  rows(){
    return _(_.range(this.get('n'))).map(function(rowIndex) {
      return this.get(rowIndex);
    }, this);
  }

  togglePiece(row, col){

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
      0 <= rowIndex && rowIndex < this.get('n') &&
      0 <= colIndex && colIndex < this.get('n')
    );
  }

  hasRowConflictAt(rowIndex) {
    let currRow = this.attributes[rowIndex];
    let counter = 0;
    for (let i = 0; i < currRow.length; i++){
        counter += currRow[i];
    }
    return (counter > 1) ? true : false
  }

  // test if any rows on this board contain conflicts
  hasAnyRowConflicts() {
    for (let i = 0; i < this.attributes['n']; i++){
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
    for (let i = 0; i < this.attributes['n']; i++) {
      counter += this.attributes[i][colIndex];
    }
    return (counter > 1) ? true : false
  }

  // test if any columns on this board contain conflicts
  hasAnyColConflicts: function() {
    for (let i = 0; i < this.attributes['n']; i++) {
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
    for (let i = 0; i < this.attributes['n']; i++) { 
      if ( majorIndex + i >= 0 && majorIndex + i < this.attributes['n']) { 
        counter += this.attributes[i][majorIndex + i];
      }
    }
    return (counter > 1) ? true: false
  }

  // test if any major diagonals on this board contain conflicts
  hasAnyMajorDiagonalConflicts() {
    for (let i = -this.attributes['n'] + 1; i < this.attributes['n']; i++) {
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
    for (let i = 0; i < this.attributes['n']; i++){
      if (minorIndex-i >= 0 && minorIndex-i < this.attributes['n']){
        counter += this.attributes[i][minorIndex-i];
      }
    }
    return (counter > 1) ? true : false
  }

  // test if any minor diagonals on this board contain conflicts
  hasAnyMinorDiagonalConflicts() {
    for (let i = 0; i <= 2 * (this.attributes['n'] - 1); i++){
      if (this.hasMinorDiagonalConflictAt(i)) {
        return true;
      }
    }
  return false;
  }

  }