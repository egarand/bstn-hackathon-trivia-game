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
	startGameForm = document.querySelector(".game__form");

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

startGameForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	await game.start(difficultySelect.value, categorySelect.value);

	const question = game.getCurrentQuestion();
	console.log(question);
});

/*
GAME LOOP:

1. game.start(difficulty, category) to begin a new game. ASYNCHRONOUS; WAIT TIL IT FINISHES.
2. use game.getCurrentQuestion() to get a question object. Display it as HTML on the page.
3. when the user selects and submits an answer, use game.answerCurrentQuestion() to answer it. this method returns true if it was correct, and false if it wasn't correct.
4. if the answer was correct....
	a. use game.goToNextQuestion() to increment the question counter.
	b. use game.hasReachedEnd to check if there are questions left or not.
		i. if no questions are left, tell the user they won! and ask if they want to play again.
		ii. if there are questions left, repeat from step 2.
5. if the answer was incorrect...
	a. tell the user they lost... and ask if they want to play again.
*/
