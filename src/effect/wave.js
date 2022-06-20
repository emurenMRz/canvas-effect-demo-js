import AnimatedCore from "./animated-core.js";

export default class Wave extends AnimatedCore {
	#cx = 0;
	#cy = 0;
	#cycle = 0;
	#amplitude = 0;
	#offset = 0;

	constructor(cx, cy, duration = 1000, cycle = 16, amplitude = 2048, offset = 4) {
		super(duration);
		this.#cx = cx;
		this.#cy = cy;
		this.#cycle = cycle;
		this.#amplitude = amplitude;
		this.#offset = offset;
	}

	effect(src, dst, w, h, level = 1) {
		this.#effect(src, dst, w, h, this.#cx, this.#cy, this.#cycle, level * this.#amplitude, level * this.#offset);
	}

	#effect(src, dst, w, h, cx, cy, cycle, amplitude, offset) {
		const c = cycle / Math.sqrt(w * w + h * h) * Math.PI * 2;
		let dstIndex = 0;
		offset *= Math.PI * 2;
		for (let y = 0; y < h; ++y) {
			const dy = cy - y;
			for (let x = 0; x < w; ++x) {
				const dx = cx - x;
				const r = dx * dx + dy * dy
				const dstOffset = dstIndex + x;
				if (r) {
					const d = Math.sin(Math.sqrt(r) * c + offset) * amplitude / r;
					let sx = x + Math.round(d * dx);
					let sy = y + Math.round(d * dy);
					if (sx < 0) sx = 0; else if (sx >= w) sx = w - 1;
					if (sy < 0) sy = 0; else if (sy >= h) sy = h - 1;
					dst[dstOffset] = src[sy * w + sx];
				} else
					dst[dstOffset] = src[dstOffset];
			}
			dstIndex += w;
		}
	}
}
