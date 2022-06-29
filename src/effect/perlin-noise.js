import AnimatedCore from "./animated-core.js";

export default class PerlinNoise extends AnimatedCore {
	#alpha = 0;
	#permutation = null;

	constructor(duration = undefined, alpha = 1) {
		super(duration);
		this.#alpha = alpha;
		this.#permutation = this.#noiseTable;
	}

	effect(src, dst, w, h, level = 1) {
		this.#effect(src, dst, w, h, this.#alpha * level);
	}

	#effect(src, dst, w, h, alpha) {
		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				const doffset = y * w + x;
				const color = src[doffset];
				const r = color & 0xff;
				const g = (color >> 8) & 0xff;
				const b = (color >> 16) & 0xff;
				const noise = this.#octavePerlin(x / w * 4, y / h * 4);
				const n = noise * alpha + 1;
				const rn = r * n > 255 ? 255 : r * n;
				const gn = g * n > 255 ? 255 : g * n;
				const bn = b * n > 255 ? 255 : b * n;
				dst[doffset] = rn | (gn << 8) | (bn << 16) | 0xff << 24;
			}
		}
	}

	get #noiseTable() {
		const base = [...Array(256)].map((v, i) => i);
		for (const i in base) {
			const j = Math.random() * base.length | 0;
			[base[i], base[j]] = [base[j], base[i]];
		}
		return base.concat(base);
	}

	#perlin(x, y, z) {
		const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
		const lerp = (t, a, b) => a + t * (b - a);
		const grad = (hash, x, y, z) => {
			hash &= 0xf;
			const u = hash < 8 ? x : y;
			const v = hash < 4 ? y : hash == 12 || hash == 14 ? x : z;
			return ((hash & 0x1) === 0 ? u : -u) + ((hash & 0x2) === 0 ? v : -v);
		};

		const xi = x & 0xff;
		const yi = y & 0xff;
		const zi = z & 0xff;
		const xf = x - (x | 0);
		const yf = y - (y | 0);
		const zf = z - (z | 0);
		const u = fade(xf);
		const v = fade(yf);
		const w = fade(zf);

		const p = this.#permutation;
		const A = p[xi + 0] + yi, AA = p[A] + zi, AB = p[A + 1] + zi;
		const B = p[xi + 1] + yi, BA = p[B] + zi, BB = p[B + 1] + zi;

		return lerp(w,
			lerp(v,
				lerp(u, grad(p[AA], xf, yf, zf), grad(p[BA], xf - 1, yf, zf)),
				lerp(u, grad(p[AB], xf, yf - 1, zf), grad(p[BB], xf - 1, yf - 1, zf))
			),
			lerp(v,
				lerp(u, grad(p[AA + 1], xf, yf, zf - 1), grad(p[BA + 1], xf - 1, yf, zf - 1)),
				lerp(u, grad(p[AB + 1], xf, yf - 1, zf - 1), grad(p[BB + 1], xf - 1, yf - 1, zf - 1))
			)
		);
	}

	#octavePerlin(x, y = 0, z = 0, octaves = 1, persistence = 0.5) {
		let total = 0;
		let frequency = 1;
		let amplitude = 1;
		let maxValue = 0;

		for (let i = 0; i < octaves; ++i) {
			total += this.#perlin(x * frequency, y * frequency, z * frequency) * amplitude;
			maxValue += amplitude;
			amplitude *= persistence;
			frequency *= 2;
		}

		return total / maxValue;
	}
}