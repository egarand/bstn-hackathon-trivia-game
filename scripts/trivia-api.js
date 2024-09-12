class TriviaAPI {
	constructor(debugMode = false) {
		this.debugMode = debugMode

		// TEMPORARY TESTING DATA
		this.testQuestions = {
			"response_code": 0,
			"results": [
			{
				"type": "multiple",
				"difficulty": "hard",
				"category": "Geography",
				"question": "What is the name of rocky region that spans most of eastern Canada?",
				"correct_answer": "Canadian Shield",
				"incorrect_answers": [
					"Rocky Mountains",
					"Appalachian Mountains",
					"Himalayas"
				]
			},
			{
				"type": "multiple",
				"difficulty": "hard",
				"category": "Entertainment: Video Games",
				"question": "What Pok&eacute;mon&#039;s Base Stat Total does not change when it evolves?",
				"correct_answer": "Scyther",
				"incorrect_answers": [
					"Pikachu",
					"Sneasel",
					"Larvesta"
				]
			},
			{
				"type": "multiple",
				"difficulty": "easy",
				"category": "Entertainment: Video Games",
				"question": "In Night In The Woods, where does Gregg work?",
				"correct_answer": "Snack Falcon",
				"incorrect_answers": [
					"Ol&#039; Pickaxe",
					"Video Outpost &quot;Too&quot;",
					"Food Donkey"
				]
			},
			{
				"type": "multiple",
				"difficulty": "medium",
				"category": "History",
				"question": "When Christopher Columbus sailed to America, what was the first region he arrived in?",
				"correct_answer": "The Bahamas Archipelago",
				"incorrect_answers": [
					"Florida",
					"Isthmus of Panama",
					"Nicaragua"
				]
			},
			{
				"type": "multiple",
				"difficulty": "easy",
				"category": "Entertainment: Video Games",
				"question": "What is the first weapon you acquire in Half-Life?",
				"correct_answer": "A crowbar",
				"incorrect_answers": [
					"A pistol",
					"The H.E.V suit",
					"Your fists"
				]
			}
			]
		}
	}

	baseUrl = "https://opentdb.com/";

	#getErrorMessage(code) {
		// session token related codes not included
		switch (code) {
			case 1:
				return "The API doesn't have enough questions for this query.";
			case 2:
				return "Query contains an invalid parameter.";
			case 5:
				return "Too many requests; only allowed 1 every 5 seconds.";
			default:
				return "Unknown error";
		}
	}

	async getTrivia(amount = 10, category = 0) {
		const url = new URL("api.php", this.baseUrl);
		url.searchParams.append("type", "multiple");
		url.searchParams.append("amount", amount);
		if (category) {
			url.searchParams.append("category", category);
		}

		if (this.debugMode) {
			return this.testQuestions.results;
		}

		try {
			const response = await axios.get(url);
			return response.data.results;
		} catch (error) {
			error.message = this.#getErrorMessage(error.data.response_code);
			throw data;
		}
	}






}
