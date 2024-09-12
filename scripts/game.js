class TriviaGame {
	constructor() {}

	#questions;
	#currentQuestion;
	#points;

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

	get currentQuestion() {
		// TODO returns a copy of a question object, with answers in one array & scrambled.
	}

	goToNextQuestion() {
		// TODO returns true if there is a next question, and makes currentQuestion return that. if there is no next question, returns false.

	}

	answerCurrentQuestion(answer) {
		// TODO if that's correct, mark the question answered correctly, increment points, return true. if that's incorrect, return false.
	}
}
