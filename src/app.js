/* eslint-disable */
'use strict';
function Player(name, token) {
	const capitalizedName = name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const getName = () => capitalizedName;
	const getToken = () => token;

	return { getName, getToken };
}

function boardModel() {
	const board = ['', '', '', '', '', '', '', '', ''];

	const getBoard = () => board;

	const dropToken = (index, player) => {
		if (board[index] !== '') {
			return false;
		}
		board[index] = player.getToken();
		return true;
	};

	return { getBoard, dropToken };
}

function gameController(playerOneName, playerTwoName) {
	const board = boardModel();
	const playerOne = Player(playerOneName, 'X');
	const playerTwo = Player(playerTwoName, 'O');

	let activePlayer = playerOne;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
	};

	const getActivePlayer = () => activePlayer;

	const makePlay = (index) => {
		if (board.dropToken(index, activePlayer)) {
			switchActivePlayer();
		}
	};

	return {
		getBoard: board.getBoard,
		makePlay,
		getActivePlayer,
	};
}

function viewControl() {
	let cells;
	let controller;
	const modal = document.querySelector('.modal');
	const boardElement = document.querySelector('.board');
	const form = document.querySelector('.player-names-form');
	const activePlayerDisplay = document.querySelector(`.active-player-display`);

	const printBoardToScreen = () => {
		controller.getBoard().forEach((cell, index) => {
			/* The active class gives the board a black background, that with the gap of the grid
			creates the effect of a tic-tac-toe board. */
			boardElement.classList.add('active');
			boardElement.innerHTML += `<div class="cell" id="${index}">${cell}</div>`;
		});
	};

	const updateActivePlayerDisplay = () => {
		activePlayerDisplay.innerText = `${controller.getActivePlayer().getName()}'s turn!`;
	};

	const updateBoard = () => {
		const board = controller.getBoard();
		cells.forEach((cell) => {
			cell.innerText = board[cell.id];
		});
		updateActivePlayerDisplay();
	};

	const makePlay = (e) => {
		const index = e.target.id;
		const activePlayer = controller.getActivePlayer();
		controller.makePlay(index, activePlayer);

		updateBoard();
	};

	const createGame = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const formDataObj = Object.fromEntries(formData.entries());

		const playerOneName = formDataObj.playerOneName;
		const playerTwoName = formDataObj.playerTwoName;

		modal.classList.remove('active');

		controller = gameController(playerOneName, playerTwoName);
		printBoardToScreen();
		updateActivePlayerDisplay();
		cells = document.querySelectorAll('.cell');
		cells.forEach((cell) => cell.addEventListener('click', makePlay));
	};
	form.addEventListener('submit', createGame);
}

viewControl();
