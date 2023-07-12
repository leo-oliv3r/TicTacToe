/* eslint-disable */
'use strict';
function Player(name, token) {
	const getName = () => name;
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
