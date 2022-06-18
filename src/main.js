import Effect from "./effect";

let auto = false;

const params = {
	duration: 0,
	cycle: 0,
	amplitude: 0,
	offset: 0,
};

addEventListener("load", () => {
	const getDefaultParam = id => {
		const value = document.getElementById(id).value | 0;
		params[id] = value;
		document.getElementById(`now:${id}`).textContent = value;
	};

	auto = document.getElementById("auto").checked;
	getDefaultParam("duration");
	getDefaultParam("cycle");
	getDefaultParam("amplitude");
	getDefaultParam("offset");

	const canvas = document.getElementById("canvas");
	const image = document.getElementById("image");
	const effect = new Effect.Manager(canvas);
	const bgImage = new Image;
	bgImage.src = image.value;
	bgImage.addEventListener("load", () => {
		canvas.width = bgImage.width;
		canvas.height = bgImage.height;
		effect.updateSize();
	}, false);
	image.addEventListener("change", e => bgImage.src = e.currentTarget.value);
	canvas.addEventListener("mousedown", e => {
		e = e || window.event;
		const cx = e.offsetX || e.layerX - e.target.offsetLeft || 0;
		const cy = e.offsetY || e.layerY - e.target.offsetTop || 0;
		effect.add(new Effect.Wave(cx, cy, params.duration, params.cycle, params.amplitude, params.offset));
	});

	effect.add(new Effect.Grayscale(undefined, 1));

	const fps = document.getElementById("fps");
	let lastTick = undefined;
	let lastMinuts = undefined;
	let totalFPS = 0;
	let frameCount = 0;
	const draw = tick => {
		if (!bgImage || !bgImage.complete) {
			setTimeout(() => requestAnimationFrame(draw), 500);
			return;
		}

		if (lastTick === undefined) lastTick = tick;
		totalFPS += 1000 / (tick - lastTick);
		++frameCount;
		lastTick = tick;

		if (lastMinuts === undefined) lastMinuts = tick;
		let minits = (tick - lastMinuts) >= 1000;
		if (minits) lastMinuts = tick;

		if (minits) {
			fps.textContent = `${canvas.width}x${canvas.height}: ${((totalFPS / frameCount) * 1000 | 0) / 1000} fps`;
			totalFPS = 0;
			frameCount = 0;
			if (auto)
				effect.add(new Effect.Wave(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight, params.duration, params.cycle, params.amplitude, params.offset));
		}

		const ctx = canvas.getContext("2d");
		ctx.drawImage(bgImage, 0, 0, canvas.clientWidth, canvas.clientHeight);
		effect.step(tick);
		requestAnimationFrame(draw);
	};
	requestAnimationFrame(draw);
});

document.getElementById("auto").addEventListener("click", function (e) { auto = this.checked });

const setParam = e => {
	if (!params || !e.currentTarget) return;
	const value = e.currentTarget.value | 0;
	const id = e.currentTarget.id;
	params[id] = value;
	document.getElementById(`now:${id}`).textContent = value;
};

document.getElementById("duration").addEventListener("change", setParam);
document.getElementById("cycle").addEventListener("change", setParam);
document.getElementById("amplitude").addEventListener("change", setParam);
document.getElementById("offset").addEventListener("change", setParam);