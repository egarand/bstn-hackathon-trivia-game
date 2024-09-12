/*
For connecting to the Open Trivia Databse to retrieve trivia categories and questions.

author: Erica Garand
*/

class TriviaAPI {
	constructor() {}

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

const API = new TriviaAPI();
