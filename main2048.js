// main2048.js 主逻辑

var board = new Array();
var score = 0;
var hasConflicted = new Array();
var gameoverFlag = false;


$(document).ready(function () {
	newgame();
});

function newgame () {
	init();
	generateOneNumber();
	generateOneNumber();
	$('header h1').css({
		transform: 'rotate(360deg)',
		transition: 'transform 2s ease 0s'
	});
	setTimeout(function(){
		$('header h1').css({
			transform: '',
			transition: ''
	})
	},1000)
}

function init () {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i, j));
			gridCell.css('left',getPosLeft(i, j));
		}
	} 
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	// board[1][0] =2;
	updateBoardView();
	scort = 0;
}

function updateBoardView () {
	$('.number-cell').remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'" ></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			if (board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				// ??why set top & left?
				// i know, for the animation, now it's at the centre, after it take over the Cell
				theNumberCell.css('top', getPosTop(i, j) + 50);
				theNumberCell.css('left', getPosLeft(i, j) + 50);
			}
			else 
			{
				theNumberCell.css('width', '100px');
				theNumberCell.css('height', '100px');
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}

}

function generateOneNumber () {
	if (nospace(board)) {
		return false;
	}
	var randx = ~~(Math.random() * 4);
	var randy = ~~(Math.random() * 4);
	var times = 0;
	while (times < 50) {
		if (board[randx][randy] == 0) {
			break;
		} 
		var randx = ~~(Math.random() * 4);
		var randy = ~~(Math.random() * 4);
		times++;
	}
	if (times == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					randx = i;
					randy = j;
				}
			}
		}
	}
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	board[randx][randy] = randNumber;
	// alert(randx+' '+randy+' '+randNumber+' '+board[randx][randy]);
	showNumberWithAnimation(randx, randy, randNumber);
}



function nospace (board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] == 0) {
				return false;
			}
		}
	}
	return true;
}


$(document).keydown(function (event) {
	switch (event.keyCode) {
		case 37: 
			event.preventDefault();
			if (moveLeft()) {
				setTimeout(function () {
					generateOneNumber();
					print(board);	
				},200);
				setTimeout('isgameover()',300);
			} 
			break;
		case 38:
			event.preventDefault();
			if (moveUp()) {
				setTimeout(function () {
					generateOneNumber();
					print(board);	
				},200);
				setTimeout('isgameover()',300);
			} 
		 	break;
		case 39:
			event.preventDefault();
			if (moveRight()) {
				setTimeout(function () {
					generateOneNumber();
					print(board);	
				},200);
				setTimeout('isgameover()',300);
			} 
		 	break;
		case 40:
			event.preventDefault();
			if (moveDown()) {
				setTimeout(function () {
					generateOneNumber();
					print(board);	
				},200);
				setTimeout('isgameover()',300);
			} 
		 	break;
		dafault:
			break;
	}
});

function isgameover () {
	if (nospace(board) && nomove(board) && !gameoverFlag) {
		gameover();
		// for (var i = 0; i < 4; i++) {
		// 	for (var j = 1; j < 4; j++) {
		// 		board[i][j] = 0;
		// 	}
		// }
	}
}

function gameover () {
	gameoverFlag = true;
	alert('gameover');
}

function moveLeft () {
	if (!canMoveLeft(board)) {
		return false;
	}
	var addScore = 0;
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) 
					{
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						addScore += board[i][k];
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	updateScore(score,addScore);
	setTimeout(function () {
		updateBoardView();
	}, 150)
	return true;
}

function moveRight () {
	if (!canMoveRight(board)) {
		return false;
	}
	var addScore = 0;
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) 
					{
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						addScore += board[i][k];
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	updateScore(score,addScore);	
	setTimeout(function () {
		updateBoardView();
	}, 150)
	return true;
}

function moveUp () {
	if (!canMoveUp(board)) {
		return false;
	}
	var addScore = 0;
	for (var i = 1; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && noBlockVertical(k, j, i, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(k, j, i, board) && !hasConflicted[k][j]) 
					{
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[k][j];
						addScore += board[k][j];
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	updateScore(score,addScore);
	setTimeout(function () {
		updateBoardView();
	}, 150)
	return true;
}

function moveDown () {
	if (!canMoveDown(board)) {
		return false;
	}
	var addScore = 0;
	for (var i = 2; i >= 0; i--) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockVertical(k, j, i, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(i, j, k, board) && !hasConflicted[k][j]) 
					{
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[k][j];
						addScore += board[k][j];
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	updateScore(score,addScore);
	setTimeout(function () {
		updateBoardView();
	}, 150)
	return true;
}

// to debug
function print (board) {
	var str = '';
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			str += board[i][j] + '  ';
		}
		str += '\n';
	}
	console.log(str);
}