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

	return { getBoard: board.getBoard };
}

function viewControl() {
	let controller;
	const modal = document.querySelector('.modal');
	const boardElement = document.querySelector('.board');
	const form = document.querySelector('.player-names-form');

	const printBoardToScreen = () => {
		controller.getBoard().forEach((cell) => {
			boardElement.innerHTML += `<div class="cell">${cell}</div>`;
		});
	};

	const toggleModal = () => {
		modal.classList.toggle('active');
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
	};

	form.addEventListener('submit', createGame);
}

viewControl();
