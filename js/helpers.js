class MockElement {
	constructor(className, children = [], style) {
		this.element = document.createElement("div");
		this.className = className;
		this.children = children;
		this.style = style;
		this.element.className = className;
		this.element.style = style;
		this.element.setAttribute("data-solved", false);
		if (children) this.element.replaceChildren(...children);
	};
	replaceChildren(c) {
		this.children = c;
		this.element.replaceChildren(...c);
	};
};

const pickFromArray =  function * (a, n) {
	let b = new Array(...a);
	for (let i = 0; i<n; i++) {
		let j = b[Math.floor(Math.random()*b.length)];
		b.splice(b.indexOf(j), 1);
		yield j;
	};
};

const fill = (c, t) => {
	// init new array
	let a = new Array();
	// loop through {t} times, adds new copy of {c} to the array each time
	for (let j = 0; j < t; j++) a.push( c );
	return a;
};

const supply = (c, C, t) => {
	return Array(t).fill(null).map(()=>new MockElement(c, Array(...C)).element);
};

const supplyWord = (a) => {
	return Array(a).fill(null).map( ()=>new MockElement("word-row", supply("letter-box", "", 5)).element )
};

const supplyBoard = () => {
	return Array(5).fill(null).map( ()=>new MockElement("board", supplyWord(5) ).element  ); 
};

const supplyRow = () => {
	return Array(20).fill(null).map ( ()=> new MockElement("boards-row hidden", supplyBoard()).element );
};

const pages = {
	1:[0, 2],
	2:[2, 4],
	3:[4, 6],
	4:[6, 8],
	5:[8, 10],
	6:[10, 12],
	7:[12, 14],
	8:[14, 16],
	9:[16, 18],
	10:[18, 20],
};

const paginate = (page) => {
	CENTIRDLE.update_page(page);
	for (let boardRow of document.getElementsByClassName("boards-row")) boardRow.className = "boards-row hidden";
	for (let boardrow of Array(...document.getElementsByClassName("boards-row")).slice(pages[page][0], pages[page][1])) {
		boardrow.className = "boards-row visible";
	};
};

