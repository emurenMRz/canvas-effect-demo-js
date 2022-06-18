import AnimatedCore from "./animated-core.js";

export default class Grayscale extends AnimatedCore {
	#alpha = 0;

	constructor(duration = undefined, alpha = 1) {
		super(duration);
		this.#alpha = alpha;
	}

	effect(src, dst, w, h, level = 1) {
		this.#effect(src, dst, w, h, this.#alpha * level);
	}

	#effect(src, dst, w, h, alpha) {
		const ralpha = 1 - alpha;
		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				const doffset = y * w + x;
				const color = src[doffset];
				const r = color & 0xff;
				const g = (color >> 8) & 0xff;
				const b = (color >> 16) & 0xff;
				const lu = (0.2126 * r + 0.7152 * g + 0.0722 * b) * alpha;
				dst[doffset] = (r * ralpha + lu) | ((g * ralpha + lu) << 8) | ((b * ralpha + lu) << 16) | 0xff << 24;
			}
		}
	}
}
