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

	return { getBoard };
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

	return { getBoard: board.getBoard, getActivePlayer, switchActivePlayer };
}

function viewControl() {
	let controller;
	const modal = document.querySelector('.modal');
	const boardElement = document.querySelector('.board');
	const form = document.querySelector('.player-names-form');
	const activePlayerDisplay = document.querySelector(`.active-player-display`);

	const printBoardToScreen = () => {
		controller.getBoard().forEach((cell) => {
			/* The active class gives the board a black background, that whith the gap of the grid
			creates the effect of the tic-tac-toe board. */
			boardElement.classList.add('active');
			boardElement.innerHTML += `<div class="cell">${cell}</div>`;
		});
	};

	const toggleModal = () => {
		modal.classList.toggle('active');
	};

	const updateActivePlayerDisplay = () => {
		activePlayerDisplay.innerText = `${controller.getActivePlayer().getName()}'s turn!`;
	};

	const createGame = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const formDataObj = Object.fromEntries(formData.entries());

		const playerOneName = formDataObj.playerOneName;
		const playerTwoName = formDataObj.playerTwoName;

		controller = gameController(playerOneName, playerTwoName);
		toggleModal();
		printBoardToScreen();
		updateActivePlayerDisplay();
	};

	form.addEventListener('submit', createGame);
}

viewControl();
