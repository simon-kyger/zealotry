export const loadimage = url => {
	return new Promise(resolve=>{
		const image = new Image();
		image.addEventListener(`load`, ()=> resolve(image));
		image.src = url;
	});
}

export const loadjson = name => fetch(`/json/${name}.json`).then(r=> r.json());