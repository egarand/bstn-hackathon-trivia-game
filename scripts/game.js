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
	// note: if we implement a skip button, should check if unanswered questions remain
	get hasReachedEnd() { return this.#currentQuestion >= this.questionsTotal; }

	}

	goToNextQuestion() {
		// note: if we implement a skip button, should search for a question that is not answered yet until none remain
		this.#currentQuestion++;
	}

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
}
