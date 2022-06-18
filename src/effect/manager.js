export default class Manager {
	#drawCanvas = null;
	#workBuffer = null;
	#effects = [];

	constructor(canvas) {
		this.#drawCanvas = canvas;
		if (!this.#drawCanvas.getContext)
			throw new Error("Not support the canvas element.");
		this.#workBuffer = new ImageData(canvas.width, canvas.height);
	}

	updateSize() { this.#workBuffer = new ImageData(this.#drawCanvas.width, this.#drawCanvas.height); }

	add(effect) { this.#effects.push(effect); }

	step(tick) {
		if (!this.#effects.length) return;

		const w = this.#drawCanvas.width;
		const h = this.#drawCanvas.height;

		const ctx = this.#drawCanvas.getContext("2d");
		const imageDataSrc = ctx.getImageData(0, 0, w, h);
		const src = new Uint32Array(imageDataSrc.data.buffer);
		const dst = new Uint32Array(this.#workBuffer.data.buffer);

		for (let i = 0; i < this.#effects.length; ++i) {
			if (i > 0) src.set(dst);
			this.#effects[i].step(tick, src, dst, w, h);
		}

		this.#effects = this.#effects.filter(e => e.alive);

		ctx.putImageData(this.#workBuffer, 0, 0);
	}
}
