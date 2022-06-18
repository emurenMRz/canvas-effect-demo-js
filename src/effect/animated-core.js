export default class AnimatedCore {
	#duration = 0;
	#maxDuration = 0;
	#lastTime = 0;

	constructor(duration = undefined) { this.#duration = this.#maxDuration = duration; }

	get alive() { return this.#duration === undefined || this.#duration > 0; }

	step(tick, src, dst, w, h) {
		if (this.#duration === undefined)
			this.effect(src, dst, w, h);
		else {
			if (this.#duration <= 0) return;
			if (!this.#lastTime) this.#lastTime = tick;
			this.effect(src, dst, w, h, this.#duration / this.#maxDuration);
			this.#duration -= tick - this.#lastTime;
			this.#lastTime = tick;
		}
	}

	effect(src, dst, w, h, level = 1) { }
}
