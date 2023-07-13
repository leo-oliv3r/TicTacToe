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

	const getCell = (index) => board[index];

	const dropToken = (index, player) => {
		if (board[index] !== '') {
			return false;
		}
		board[index] = player.getToken();
		return true;
	};

	return { getBoard, dropToken, getCell };
}

function gameController(playerOneName, playerTwoName) {
	let round = 1;
	const board = boardModel();
	const playerOne = Player(playerOneName, 'X');
	const playerTwo = Player(playerTwoName, 'O');

	const winnerCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let activePlayer = playerOne;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
	};

	const getActivePlayer = () => activePlayer;

	const checkForWin = (index) => {
		const possibleCombinatios = winnerCombinations.filter((combinations) =>
			combinations.includes(index)
		);

		const isWinnerCombination = possibleCombinatios.some((combinations) =>
			combinations.every(
				(cell) => board.getCell(cell) === activePlayer.getToken()
			)
		);

		return isWinnerCombination;
	};

	const makePlay = (index) => {
		if (board.dropToken(index, activePlayer)) {
			if (checkForWin(index)) {
				return 'win';
			}
			round += 1;
			if (round > 9) {
				return 'draw';
			}
			switchActivePlayer();
		}
	};

	const resetGame = () => {
		board.forEach((cell) => (cell = ''));
		activePlayer = playerOne;
	};

	return {
		getBoard: board.getBoard,
		makePlay,
		getActivePlayer,
		resetGame,
	};
}

function viewControl() {
	let cells;
	let controller;
	const modal = document.querySelector('.modal');
	const boardElement = document.querySelector('.board');
	const form = document.querySelector('.player-names-form');
	const activePlayerDisplay = document.querySelector(
		`.active-player-display`
	);
	const endgameBanner = document.querySelector('.winner-banner');
	const resetButton = document.querySelector('.reset-btn');

	const printBoardToScreen = () => {
		controller.getBoard().forEach((cell, index) => {
			/* The active class gives the board a black background, that with the gap of the grid
			creates the effect of a tic-tac-toe board. */
			boardElement.classList.add('active');
			boardElement.innerHTML += `<div class="cell" id="${index}">${cell}</div>`;
		});
	};

	const updateActivePlayerDisplay = () => {
		activePlayerDisplay.innerText = `${controller
			.getActivePlayer()
			.getName()}'s "${controller.getActivePlayer().getToken()}" turn!`;
	};

	const displayResult = (condition) => {
		activePlayerDisplay.classList.add('hidden');
		resetButton.classList.remove('hidden');

		cells.forEach((cell) =>
			cell.removeEventListener('click', makePlayView)
		);
		switch (condition) {
			case 'win':
				endgameBanner.innerText = `Congratulations! ${controller
					.getActivePlayer()
					.getName()} has won!`;
				break;

			case 'draw':
				endgameBanner.innerText = "It's a draw!";
				break;

			default:
				break;
		}
	};

	const updateBoard = () => {
		const board = controller.getBoard();
		cells.forEach((cell) => {
			cell.innerText = board[cell.id];
		});
		updateActivePlayerDisplay();
	};

	const makePlayView = (e) => {
		const index = Number(e.target.id);

		switch (controller.makePlay(index)) {
			case 'win':
				displayResult('win');
				break;

			case 'draw':
				displayResult('draw');
				break;

			default:
				break;
		}
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
		cells.forEach((cell) => cell.addEventListener('click', makePlayView));
	};

	const resetGame = () => {
		modal.classList.add('active');
		boardElement.innerHTML = '';
		endgameBanner.innerHTML = ``;
		boardElement.classList.remove('active');
		activePlayerDisplay.classList.remove('hidden');
		resetButton.classList.add('hidden');
		controller.resetGame();
	};

	form.addEventListener('submit', createGame);
	resetButton.addEventListener(`click`, resetGame);
}

viewControl();
