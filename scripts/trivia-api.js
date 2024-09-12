class TriviaAPI {
	constructor() {
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

		try {
			const response = await axios.get(url);
			return response.data.results;
		} catch (error) {
			error.message = this.#getErrorMessage(error.data.response_code);
			throw data;
		}
	}
}
