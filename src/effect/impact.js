import AnimatedCore from "./animated-core.js";

export default class Impact extends AnimatedCore {
	#cx = 0;
	#cy = 0;
	#force = 0;
	#weight = 0;
	#radius = undefined;
	#cycle = 0;
	#amplitude = 0;
	#offset = 0;

	constructor(cx, cy, force = 5, radius = undefined, weight = 2, duration = 1000, cycle = 16, amplitude = 2048, offset = 4) {
		super(duration);
		this.#cx = cx;
		this.#cy = cy;
		this.#force = force;
		this.#radius = radius;
		this.#weight = weight;
		this.#cycle = cycle;
		this.#amplitude = amplitude;
		this.#offset = offset;
	}

	effect(src, dst, w, h, level = 1) {
		let radius = this.#radius;
		if (radius === undefined)
			radius = Math.sqrt((w >> 1) ** 2 + (h >> 1) ** 2);
		const force = level ** this.#force;
		radius *= 1 - force;
		this.#effect(src, dst, w, h, this.#cx, this.#cy, this.#cycle, this.#amplitude, this.#offset, radius, force * this.#weight);
	}

	#effect(src, dst, w, h, cx, cy, cycle, amplitude, offset, radius, weight) {
		const c = cycle / Math.sqrt(w * w + h * h) * Math.PI * 2;
		let dstIndex = 0;
		offset *= Math.PI * 2;
		for (let y = 0; y < h; ++y) {
			const dy = cy - y;
			for (let x = 0; x < w; ++x) {
				const dx = cx - x;
				const r = dx * dx + dy * dy
				const dstOffset = dstIndex + x;
				let srcOffset = dstOffset;
				if (r) {
					const distance = Math.sqrt(r);
					if (distance < radius - weight || distance > radius + weight)
						continue;
					const depth = Math.sin(distance * c + offset);
					const d = depth * amplitude / r;
					let sx = x + Math.round(d * dx);
					let sy = y + Math.round(d * dy);
					if (sx < 0) sx = 0; else if (sx >= w) sx = w - 1;
					if (sy < 0) sy = 0; else if (sy >= h) sy = h - 1;
					srcOffset = sy * w + sx;
				}
				dst[dstOffset] = src[srcOffset];
			}
			dstIndex += w;
		}
	}
}
