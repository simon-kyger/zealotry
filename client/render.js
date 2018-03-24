const delay = time => new Promise(resolve=> setTimeout(resolve, time));

export const render = async(ctx, image, tiles) => {
    for (let tile of tiles){
		for (let range of tile.ranges){
			for (let x1 = range[0]; x1 < range[1]; ++x1){
				for (let y1 = range[2]; y1 < range[3]; ++y1){
                    //await delay(2);
					ctx.drawImage(
						image, 
						tile.width*tile.xoff, 
						tile.height*tile.yoff, 
						tile.width, 
						tile.height, 
						tile.width*x1, 
						tile.height*y1, 
						tile.width, 
						tile.height);
				}
			}
		}
	}
}