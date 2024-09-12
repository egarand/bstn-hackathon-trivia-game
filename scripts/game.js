/**
 * @author Erica Garand
 */
class TriviaGame {
	constructor() {}

	#questions;
	#currentQuestion;
	#points;

	/** Queries a new set of 10 questions for the given difficulty and category, and resets the points. */
	async start(difficulty = "easy", category = 0) {
		this.#points = 0;
		this.#currentQuestion = 0;
		this.#questions = await API.getTrivia(10, difficulty, category);
		this.#questions.forEach(q => {
			q.answeredCorrectly = false;
		});
	}

	get questionsTotal() { return this.#questions.length; }
	get questionsCorrect() { return this.#points; }
	// note: if we implement a skip button, should check if unanswered questions remain
	get hasReachedEnd() { return this.#currentQuestion >= this.questionsTotal; }

	/**
	 * @returns The current question with the answer choices randomly shuffled. if there are no more questions left, returns null instead.
	 */
	getCurrentQuestion() {
		if (this.hasReachedEnd) {
			return null;
		}
		const q = this.#questions[this.#currentQuestion];
		return {
			question: q.question,
			choices: this.#shuffle([q.correct_answer, ...q.incorrect_answers]),
			category: q.category,
			difficulty: q.difficulty
		};
	}

	goToNextQuestion() {
		// note: if we implement a skip button, should search for a question that is not answered yet until none remain
		this.#currentQuestion++;
	}

	/**
	 * @param {string} answer The user's answer for the current question, from the given options
	 * @returns True if the answer was correct; False if it was incorrect; null if there were no questions left.
	 */
	answerCurrentQuestion(answer) {
		if (this.hasReachedEnd) {
			return null;
		}

		const question = this.#questions[this.#currentQuestion];
		if (answer === question.correct_answer){
			question.answeredCorrectly = true;
			this.#points++;
			return true;
		}
		return false;
	}

	// Fisher-Yates shuffle algorithm
	// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	#shuffle(items) {
		for (let i = items.length - 1; i > 0; i--) {
			const randomIdx = Math.floor(Math.random() * (i + 1));
			[items[i], items[randomIdx]] = [items[randomIdx], items[i]];
		}
		return items;
	}
}

const game = new TriviaGame();

const difficultySelect = document.querySelector("#difficult"),
	categorySelect = document.querySelector("#category"),
	startGameForm = document.querySelector(".game__form"),
	prizeLadder = document.querySelector(".game__prize-ladder"),
	questionCard = document.querySelector(".game__card"),
	questionForm = questionCard.querySelector("form");

API.getCategories()
	.then((categories) => {
		categorySelect.textContent = "";
		for (const category of categories) {
			let option = document.createElement("option");
			option.setAttribute("value", category.id);
			option.textContent = category.name;
			categorySelect.append(option);
		}
	});

startGameForm.addEventListener("submit", (event) => {
	event.preventDefault();
	gameLoop();
});

async function gameLoop() {
	await game.start();
	displayScore();
	displayQuestion(game.getCurrentQuestion());
	const radioBtns = questionForm.querySelectorAll("input[type=radio]");

	console.log("example question", game.getCurrentQuestion());

	for (const radio of radioBtns) {
		radio.addEventListener("change", choiceListener);
	}

	function choiceListener(event) {
		for (const radio of radioBtns) {
			radio.setAttribute("disabled", true);
		}
		const answer = event.currentTarget.value;
		const wasCorrect = game.answerCurrentQuestion(answer);
		if (wasCorrect) {
			displayScore();
			event.currentTarget.parentElement.classList.add("game__answer--correct");

			game.goToNextQuestion();
			if (game.hasReachedEnd) {
				displayRestart("You won! :)");
			} else {
				setTimeout(() => {
					displayQuestion(game.getCurrentQuestion());
				}, 5000);
			}
		} else {
			event.currentTarget.parentElement.classList.add("game__answer--incorrect");
			displayRestart("You lost... :(");
		}
	}
}

/**
 * Use on the text for questions and answer choices to make sure they display correctly.
 * @param {string} text
 * @returns {string}
*/
function decodeEntities(text) {
    var el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
}

function displayQuestion(question) {
	for (const choice of questionForm.querySelectorAll("input[type=radio]")) {
		choice.removeAttribute("disabled");
		choice.classList.remove("game__answer--correct");
		choice.classList.remove("game__answer--incorrect");
	}

	// TODO should update the game__card (stored in questionCard) with current question
}

function displayScore() {
	// TODO should update the score ladder to reflect current score
	// game.questionsCorrect
}

function displayRestart(message) {
	// TODO should show the message (which says if they won or lost), and tell the user to restart the game
}
