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
		startGameForm.addEventListener("submit", (event) => {
			event.preventDefault();
			gameLoop();
		});
	});


async function gameLoop() {
	await game.start(difficultySelect.value, categorySelect.value);
	displayScore();
	displayMessage("Good luck!");
	displayQuestion(game.getCurrentQuestion());
	const radioBtns = questionForm.querySelectorAll("input[type=radio]");

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
				displayMessage("You won! Play again?");
			} else {
				setTimeout(() => {
					displayQuestion(game.getCurrentQuestion());
				}, 5000);
			}
		} else {
			event.currentTarget.parentElement.classList.add("game__answer--incorrect");
			displayMessage("You lost... Play again?");
			displayScore(0);
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
	questionCard.querySelector(".game__question").textContent = decodeEntities(question.question);

	const choiceEls = questionForm.querySelectorAll(".game__answer"),
		radioBtns = questionForm.querySelectorAll("input[type=radio]");
	for (let i = 0; i < question.choices.length; i++) {
		radioBtns[i].checked = false;
		radioBtns[i].removeAttribute("disabled");
		choiceEls[i].classList.remove("game__answer--correct");
		choiceEls[i].classList.remove("game__answer--incorrect");

		radioBtns[i].setAttribute("value", question.choices[i]);
		choiceEls[i].querySelector("label").textContent = decodeEntities(question.choices[i]);
	}
}

function displayScore(score = game.questionsCorrect) {
	const prizeAmounts = prizeLadder.querySelectorAll(".game__prize-amount");
	for (const prize of prizeAmounts) {
		prize.classList.remove("game__prize-amount--selected");
	}
	const currentPrize = prizeAmounts.length - 1 - score;
	prizeAmounts[currentPrize].classList.add("game__prize-amount--selected");
}

function displayMessage(message) {
	const messageEl = document.querySelector(".game__user-msg");
	messageEl.textContent = message;
}
