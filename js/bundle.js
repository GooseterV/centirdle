window.CENTIRDLE =  localStorage.centirdle ? new Centirdle(JSON.parse(localStorage.centirdle)) : new Centirdle();

function load() {
	const wrapper = document.getElementById("centirdle-boards");
	wrapper.replaceChildren(...supplyRow());
	paginate(1);
	for (let word of window.CENTIRDLE.guesses) setTimeout(()=>{window.CENTIRDLE.writeGuess(word)}, 5);
	const f = (e)=>{
		if (CENTIRDLE.guesses_remaining <= 0 && !e.code.includes("Arrow")) return CENTIRDLE.createWarning("No more guesses!");
		if (e.code === "Enter") {
			if (CENTIRDLE.to_enter.length === 5 || CENTIRDLE.num_solved === 105) CENTIRDLE.enter_word();
		} else if (e.code === "Backspace") {
			if (CENTIRDLE.key_index > 0) CENTIRDLE.delete_key();
		} else if (e.code === "ArrowRight") {
			if (CENTIRDLE.page_num < 10) paginate(CENTIRDLE.page_num+1);
		} else if (e.code === "ArrowLeft") {
			if (CENTIRDLE.page_num > 1) paginate(CENTIRDLE.page_num-1);
		} else if (String.fromCharCode(e.keyCode).match(/(\w|\s)/g)) {
			if (CENTIRDLE.key_index < 5) CENTIRDLE.add_key(e.key.toUpperCase());
			CENTIRDLE.keypress(CENTIRDLE.to_enter);
		} else {
			CENTIRDLE.createWarning("Key not recognized!");
		};
	};
	document.addEventListener("keydown", f);
	(Array(...document.getElementsByClassName("keyboard-row")).map( i => Array(...i.children)).flat(Infinity)).forEach(
		x => {
			const f = x.id !== "enter-key" && x.id !== "delete-key" && x.id !== "arrow-left-key" && x.id !== "arrow-right-key" ? ()=>{
				if (CENTIRDLE.key_index < 5) CENTIRDLE.add_key(x.innerText);
				CENTIRDLE.keypress(CENTIRDLE.to_enter);
			} : (()=>{
				const g = x.id === "enter-key" ? ()=>{
					if (CENTIRDLE.to_enter.length === 5 || CENTIRDLE.num_solved === 105) CENTIRDLE.enter_word();
				} : ()=>{
					console.log(x.id)
					if (CENTIRDLE.key_index > 0  && x.id !== "arrow-left-key" && x.id !== "arrow-right-key") CENTIRDLE.delete_key();
				};
				return g;
			})();
			x.addEventListener("click", f);
		}
	);
	document.getElementById("arrow-right-key").addEventListener("click", ()=>{
		if (CENTIRDLE.page_num < 10) paginate(CENTIRDLE.page_num+1);
	});
	document.getElementById("arrow-left-key").addEventListener("click", ()=>{
		if (CENTIRDLE.page_num > 1) paginate(CENTIRDLE.page_num-1);
	});
};

load();