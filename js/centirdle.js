class Centirdle {
	constructor(centirdle) {
		let fromStorage = centirdle ? true : false;
		this.start_day = new Date(2022, 4, 3);
		this.null_arr = Array(100).fill(null);
		this.stats = fromStorage ? centirdle.stats : {
			"win-rate": 0.0,
			"wins": 0,
			"plays": 0,
			"streak": 0,
		};
		this.words = fromStorage ? centirdle.words : Array.from(pickFromArray(WORD_BANK, 100));
		this.num_guesses_remaining = fromStorage ? parseInt(centirdle.num_guesses_remaining) : 105;
		this.num_solved = fromStorage ? parseInt(centirdle.num_solved) : 0;
		this.num_guessed = fromStorage ? parseInt(centirdle.num_guessed) : 0;
		this.to_enter = "";
		this.key_index = 0;
		this.page_num = 0;
		this.guesses = fromStorage ? centirdle.guesses : [

		];
		this.corrects = fromStorage ? centirdle.corrects: [

		];

		this.colors = {
			0:"grey",
			1:"yellow",
			2:"green",
		};

		this.settings = {
			"removeSolvedBoards":false,
		};

		this.add_key = (key) => {
			this.to_enter += key;
			this.key_index += 1;
		};

		this.keypress = (word) => {
			const words = Array(...document.getElementsByClassName("board")).map( (i) => i.children[this.num_guessed]);
			for (let row of words) {
				for (let i = 0; i < word.length; i++) {
					row.children[i].innerHTML = word[i];
				};
			};
			
		};

		this.delete_key = () => {
			const words = Array(...document.getElementsByClassName("board")).map( (i) => i.children[this.num_guessed]);
			for (let row of words) {
				row.children[this.key_index-1].innerHTML = "";
			};
			if (this.key_index > 0) this.key_index -= 1;
			this.to_enter = this.to_enter.slice(0, this.enter_word.length-1);
			
		};

		this.enter_word = () => {
			if (this.guesses.includes(this.to_enter.toLowerCase())) return this.createWarning("Word already guessed you sillyhead!");
			let w = this.to_enter;

			for (let i = 0; i < 5; i++) this.delete_key();
			this.to_enter = w;
			this.evalWord(this.to_enter.toLowerCase());
			this.to_enter = "";
			this.key_index = 0;
		};

		this.update_page = (n) => {
			this.page_num = n;
			return this.page_num;
		};
		
		this.shareMessage = async() => await navigator.clipboard.writeText(`
		I solved ${this.num_solved} words in ${this.num_guessed} guesses in today's Centirdle. #Centirdle No. ${this.current_day}
		https://gooseterv.github.io/centirdle
		`);
		
	};

	createWarning(text) {

	};

	resetWords() {
		this.words = Array.from(pickFromArray(WORD_BANK, 100));
		return this.words;
	};



	addWord(guess) {
		const boards = document.getElementsByClassName("board");
		for (let board of boards) {
			
			if ( 
				this.num_guesses_remaining <= 101 && board.children.length < 105 &&
				this.guesses.indexOf(guess) >= 4
			) board.appendChild(...supplyWord(1));
		};
		return boards;

	};

	writeGuess(guess) {
		const boards = document.getElementsByClassName("board");
		/*
		for (let j = 0; j < boards.length; j++) {
			let board = boards[j];
			let solution = Object.keys(evalData)[j];
			let wordEvalData = evalData[solution];
			let evaluated = {
				a:{remaining:0, done:false},
				b:{remaining:0, done:false},
				c:{remaining:0, done:false},
				d:{remaining:0, done:false},
				e:{remaining:0, done:false},
				f:{remaining:0, done:false},
				g:{remaining:0, done:false},
				h:{remaining:0, done:false},
				i:{remaining:0, done:false},
				j:{remaining:0, done:false},
				k:{remaining:0, done:false},
				l:{remaining:0, done:false},
				m:{remaining:0, done:false},
				n:{remaining:0, done:false},
				o:{remaining:0, done:false},
				p:{remaining:0, done:false},
				q:{remaining:0, done:false},
				r:{remaining:0, done:false},
				s:{remaining:0, done:false},
				t:{remaining:0, done:false},
				u:{remaining:0, done:false},
				v:{remaining:0, done:false},
				w:{remaining:0, done:false},
				x:{remaining:0, done:false},
				y:{remaining:0, done:false},
				z:{remaining:0, done:false},
			};
			for (let i = 0; i < 5; i++) {
				let letterElement = board.firstElementChild.children[i];
				let letter = guess[i];
				let count = wordEvalData[letter].count;
				let indexes = wordEvalData[letter].indexes;
				evaluated[letter].remaining = count;
				let currentEvalNum = 0;
				let color = count === 0 ? "grey": (count > 0 && indexes.length >= 1 && indexes[0] === guess.indexOf(letter)) ? "green" : 
					(count > 0 && indexes.length >= 1 && indexes[0] !== -1 && indexes[0] !== guess.indexOf(letter) && guess.split("").filter(l=>l===letter).length === 1 ? "yellow" : 
						(()=>{
							if (count === 1 && indexes.length === 1 && guess.split("").filter(l=>l===letter).length > 1 && !evaluated[letter]) {
								for (let k = 0; k < indexes.length; k++) {
									if (indexes[k] === guess.indexOf(letter)) return "green";
									else if (indexes[k] !== guess.indexOf(letter)) return "yellow";
								};
							} else if (evaluated[letter].done) {
								return "grey";
							};
						})()
					);
				console.log(letter, evaluated[letter])
				
				evaluated[letter].done = true;
				console.log(`Letter is: ${letter}\nIndexes of Letter: ${indexes}\nSolution Word: ${solution}\nPicked Color: ${color}`)
				letterElement.innerText = letter.toUpperCase();
				letterElement.className += ` box-${color}`
			};
			
		};
		*/

		for (let j = 0; j < boards.length; j++) {
			let board = boards[j];
			let word = this.words[j];

			const letters = {};
			for (let i = 0; i < word.length; i++) {
				letters[word[i]] = (letters[word[i]] || 0) + 1;
			};
	
			let row = [0, 0, 0, 0, 0]; // 0 for grey, 1 for yellow, 2 for green
			for (let i = 0; i < word.length; i++) {
				const guessLetter = guess[i];
				if (word[i] === guessLetter) {
					row[i] = 2;
					letters[guessLetter]--;
				};
			};
	
			for (let i = 0; i < word.length; i++) {
				if (row[i] !== 0) continue;
				const guessLetter = guess[i];
				if ((letters[guessLetter] || 0) > 0) {
					row[i] = 1;
					letters[guessLetter]--;
				};
			};
			
			
			
			for (let i = 0; i < 5; i++) {
				const letterBox = board.children[this.guesses.indexOf(guess)].children[i];
				const color = this.colors[row[i]];
				//									console.log(`Letter is: ${guess[i]}\nSolution Word: ${word}\nPicked Color: ${color}`)
				
				if (board.getAttribute("data-solved") !== "true" && this.num_guesses_remaining > 0 && this.num_guessed < 105) {
					
					letterBox.innerText = guess[i].toUpperCase();
					letterBox.className += ` box-${color}`;
				};

			};

			if (row.filter(x => x===2).length === 5 ) {
				this.num_solved++;
				this.corrects.push(word);
				board.children[this.guesses.indexOf(guess)].className += " solution-word";
				board.className += " board-solved";
				board.setAttribute("data-solved", true);
				if (this.settings.removeSolvedBoards) board.remove();
			};
			
		};
		this.addWord(guess);
		
	};

	evalWord(word) {
		console.log(word)
		if (!WORDS.includes(word)) return alert("Word not in valid word bank!");
		if (word.length !== 5) return alert("Word must be 5 characters long!");
		if (this.num_guesses_remaining === 0 || this.num_guessed === 105) return alert("No more guesses remaining!");
		/*

		let data = {};
		for (let w of this.words) {
			data[w] = {};
			for (let letter of word) {
				let appearances = w.split("").filter(l => l === letter);
				let count = appearances.length;
				data[w][letter] = {
					indexes: count <= 1 ? [w.split("").indexOf(letter)] : Array.from((function* () {
						for (let l of appearances) {
							let index = w.indexOf(l);
							w.replace(l, "");
							yield index;
						};
					})()),
					count: count,
				};
			};
		};
		
		*/
		this.guesses.push(word);
		this.writeGuess(word);
		this.num_guessed++;
		this.num_guesses_remaining--;
		localStorage.centirdle = JSON.stringify(window.CENTIRDLE);
		//return data;
		return void(0);
	};


};