/**
 * @author Erica Garand
 */
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

		this.testCategories = {
			"trivia_categories": [
				{
					"id": 9,
					"name": "General Knowledge"
				},
				{
					"id": 10,
					"name": "Entertainment: Books"
				},
				{
					"id": 11,
					"name": "Entertainment: Film"
				},
				{
					"id": 12,
					"name": "Entertainment: Music"
				},
				{
					"id": 13,
					"name": "Entertainment: Musicals & Theatres"
				},
				{
					"id": 14,
					"name": "Entertainment: Television"
				},
				{
					"id": 15,
					"name": "Entertainment: Video Games"
				},
				{
					"id": 16,
					"name": "Entertainment: Board Games"
				},
				{
					"id": 17,
					"name": "Science & Nature"
				},
				{
					"id": 18,
					"name": "Science: Computers"
				},
				{
					"id": 19,
					"name": "Science: Mathematics"
				},
				{
					"id": 20,
					"name": "Mythology"
				},
				{
					"id": 21,
					"name": "Sports"
				},
				{
					"id": 22,
					"name": "Geography"
				},
				{
					"id": 23,
					"name": "History"
				},
				{
					"id": 24,
					"name": "Politics"
				},
				{
					"id": 25,
					"name": "Art"
				},
				{
					"id": 26,
					"name": "Celebrities"
				},
				{
					"id": 27,
					"name": "Animals"
				},
				{
					"id": 28,
					"name": "Vehicles"
				},
				{
					"id": 29,
					"name": "Entertainment: Comics"
				},
				{
					"id": 30,
					"name": "Science: Gadgets"
				},
				{
					"id": 31,
					"name": "Entertainment: Japanese Anime & Manga"
				},
				{
					"id": 32,
					"name": "Entertainment: Cartoon & Animations"
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

	async getTrivia(amount = 10, difficulty = "easy", category = 0) {
		const url = new URL("api.php", this.baseUrl);
		url.searchParams.append("type", "multiple");
		url.searchParams.append("amount", amount);
		url.searchParams.append("difficulty", difficulty);
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
			if (error.data?.response_code){
				error.message = this.#getErrorMessage(error.data.response_code);
			}
			throw error;
		}
	}

	async getCategories() {
		const url = new URL("api_category.php", this.baseUrl);
		if (this.debugMode) {
			return this.testCategories.trivia_categories;
		}

		try {
			const response = await axios.get(url);
			return response.data.trivia_categories;
		} catch (error) {
			if (error.data?.response_code){
				error.message = this.#getErrorMessage(error.data.response_code);
			}
			throw error;
		}
	}

}

const API = new TriviaAPI(true);
