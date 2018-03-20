export const loadimage = url => {
	return new Promise(resolve=>{
		const image = new Image();
		image.addEventListener(`load`, ()=> resolve(image));
		image.src = url;
	});
}

export const loadmap = name => {
    return fetch(`/maps/${name}.json`).then(r=> r.json());
}