const start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click", setGame);

function setGame(){
	let timer;
	const row = document.getElementById("row").value;
	const col = document.getElementById("col").value;
	const mineNum = Math.floor(row*col*0.15);
	
	let mineAnswer = [];
	let mineInfo = [];
	
	for(let i = 0; i < col; i++) {
		mineAnswer.push([]);
		mineInfo.push([]);
		for(let j = 0; j < row; j++) {
			mineAnswer[i].push(0);
			mineInfo[i].push({isHidden: true, number: 0, isMine: false, isFlag: false});
		}
	}
	
	setMineAnswer(mineNum);
	
	setMineInfo();
	
	answerBoard();
	
	makeBoard();

	setTimer();
	
	function setMineAnswer(_mineNum){
		for(let i = 0; i < _mineNum; i++){
			let _col = Math.floor(Math.random()*col);
			let _row = Math.floor(Math.random()*row);
			mineAnswer[_col][_row] = 1;
		}
		let cnt = 0;
		for(let i = 0; i < col; i++){
			for(let j = 0; j < row; j++){
				if(mineAnswer[i][j] == 1) cnt++;
			}
		}
		if(cnt < mineNum) setMineAnswer(mineNum - cnt);
	}
	
	function setMineInfo(){
		const x_dir = [0, 1, 2];
		const y_dir = [0, 1, 2];
		for(let i = 0; i < col; i++){
			for(let j = 0; j < row; j++){
				if(mineAnswer[i][j] == 1) mineInfo[i][j].isMine = true;
				else {
					let cnt = 0;
					for(let dir1 in x_dir){
						for(let dir2 in y_dir){
							let pos_x = parseInt(j)+parseInt(dir1)-1;
							let pos_y = parseInt(i)+parseInt(dir2)-1;
							if(pos_x<row && pos_x>-1 
							   && pos_y<col && pos_y>-1 
							   && (pos_x!=0 || pos_y!=0)
							   && mineAnswer[pos_y][pos_x]==1) cnt++;
						}
					}
					mineInfo[i][j].number = cnt;
				}
			}
		}
	}
	
	function answerBoard(){
		let tableEle = '<table>';
		for(let i = 0; i < col; i++){
			tableEle += '<tr>';
			for(let j = 0; j < row; j++){
				
				if(mineInfo[i][j].isMine) tableEle += '<td class="mine">*</td>';
				else tableEle += '<td class="mine">' + mineInfo[i][j].number + '</td>';
				
			}
			tableEle += '</tr>';
		}
		tableEle += '</table>';
		document.getElementById("answer_board").innerHTML = tableEle;
	}
	
	function makeBoard(){
		let tableEle = '<table>';
		let isEnd = true;
		for(let i = 0; i < col; i++){
			tableEle += '<tr>';
			for(let j = 0; j < row; j++){
				isEnd = isEnd && (mineInfo[i][j].isMine || !mineInfo[i][j].isHidden);
				
				if(mineInfo[i][j].isHidden && mineInfo[i][j].isFlag) tableEle += '<td id="row'+j+'col'+i+'" class="mine flag">F</td>';
				else if(mineInfo[i][j].isHidden) tableEle += '<td id="row'+j+'col'+i+'" class="mine hidden"></td>';
				else if(mineInfo[i][j].isMine) tableEle += '<td id="row'+j+'col'+i+'" class="mine">*</td>';
				else if(mineInfo[i][j].number > '0') tableEle += '<td id="row'+j+'col'+i+
					'" class="mine number'+mineInfo[i][j].number+'">' + mineInfo[i][j].number + '</td>';
				else tableEle += '<td id="row'+j+'col'+i+'" class="mine number0"></td>';
				
			}
			tableEle += '</tr>';
		}
		tableEle += '</table>';
		document.getElementById("game_board").innerHTML = tableEle;
		if(isEnd){
			let cnt = document.getElementById("timer").innerText;
			alert("your record is "+parseInt(cnt/10)+":"+cnt%60);
		} 
		
		setEvent();
	}
	
	function setEvent(){
		let mines = document.getElementsByClassName("mine");
		for(let mine of mines){
			mine.addEventListener("contextmenu", (e) => {
				e.preventDefault();
			});
			mine.addEventListener("mousedown", (e) => {
				let _row = e.target.id.split("row")[1].split("col")[0];
				let _col = e.target.id.split("col")[1];
				let _isLeft = e.button == 0;
				updateInfo(_isLeft, _row, _col);
				makeBoard();
			})
		}
	}
	
	function updateInfo(_isLeft, _row, _col){
		if(_isLeft && mineInfo[_col][_row].isMine) gameEnd();
		else if(_isLeft) expandArea(_row, _col);
		else if(mineInfo[_col][_row].isFlag) mineInfo[_col][_row].isFlag = false;
		else mineInfo[_col][_row].isFlag = true;
	}
	
	function expandArea(_row, _col){
		mineInfo[_col][_row].isHidden = false;
		const x_dir = [0, 1, 2];
		const y_dir = [0, 1, 2];
		if(mineInfo[_col][_row].number == 0){
			for(let dir1 in x_dir){
				for(let dir2 in y_dir){
					let pos_x = parseInt(_row)+parseInt(dir1)-1;
					let pos_y = parseInt(_col)+parseInt(dir2)-1;
					if(pos_x<row && pos_x>-1 
					   && pos_y<col && pos_y>-1 
					   && (pos_x!=0 || pos_y!=0)
					   && mineInfo[pos_y][pos_x].isHidden) expandArea(pos_x, pos_y); 
				}
			}
		}
	}
	
	function setTimer(){
		let cnt = 0;
		document.getElementById("timer").innerHTML = cnt;
		timer = setInterval(check, 1000);
		function check(){
			cnt += 1;
			document.getElementById("timer").innerHTML = cnt;
		}
		
		
	}
		
	function gameEnd(){
		for(let i = 0; i < col; i++){
			for(let j = 0; j < row; j++){
				if(mineInfo[i][j].isMine){
					mineInfo[i][j].isHidden = false;
				}
			}
		}
		clearInterval(timer);
	}
}