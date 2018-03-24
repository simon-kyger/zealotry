const delay = time => new Promise(resolve=> setTimeout(resolve, time));

export const render = async(ctx, image, backgrounds) => {
    for (let background of backgrounds){
		for (let range of background.ranges){
			for (let x1 = range[0]; x1 < range[1]; ++x1){
				for (let y1 = range[2]; y1 < range[3]; ++y1){
                    await delay(50);
					ctx.drawImage(
						image, 
						16*background.xoff, 
						16*background.yoff, 
						16, 
						16, 
						16*x1, 
						16*y1, 
						16, 
						16);
				}
			}
		}
	}
}