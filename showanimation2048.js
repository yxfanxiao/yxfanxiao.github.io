// showanimation2048.js 动画效果逻辑

function showNumberWithAnimation(i, j, randNumber) {
	var numberCell = $('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getNumberBackgroundColor(randNumber));
	numberCell.css('color',getNumberColor(randNumber));
	numberCell.text(randNumber);
	numberCell.animate({
		width: '100px',
		height: '100px',
		top: getPosTop(i, j),
		left: getPosLeft(i, j)
	},50);
}

function showMoveAnimation (fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top: getPosTop(tox, toy),
		left: getPosLeft(tox, toy)
 	},200);
}

function updateScore (score,addScore) {
	$('#score').text(score);
	if (addScore > 0) {
		var $i = $('<b>').text('+'+addScore);
		$i.css({position:"fixed",left:"380px",top:"350px",fontSize:'1.5em',fontFamily:"Arial"});
		$('body').append($i);
		$i.animate({
			opacity:'0',
			top: '300px',
			'font-size': '2em'
		},1000,function(){
			$i.remove();
		});
	}

}
