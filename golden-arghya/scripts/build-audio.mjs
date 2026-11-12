// Builds the original ambient score & SFX stems for "The Golden Arghya".
// Everything here is synthesised from scratch: noise, sine partials and simple
// filters, so the film ships with a royalty free sound design bed.
//   node scripts/build-audio.mjs
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});

const SR = 32000;
const TAU = Math.PI * 2;

let seed = 20241113;
const rnd = () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

const buf = (seconds) => new Float32Array(Math.ceil(seconds * SR));
const idx = (t) => Math.max(0, Math.min(1, t));

// ---------- filters ----------
const lowpass = (input, cutoff, q = 0.707) => {
	const w = (TAU * cutoff) / SR;
	const alpha = Math.sin(w) / (2 * q);
	const cosw = Math.cos(w);
	const a0 = 1 + alpha;
	const b0 = (1 - cosw) / 2 / a0;
	const b1 = (1 - cosw) / a0;
	const b2 = b0;
	const a1 = (-2 * cosw) / a0;
	const a2 = (1 - alpha) / a0;
	let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
	const out = new Float32Array(input.length);
	for (let i = 0; i < input.length; i++) {
		const x0 = input[i];
		const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
		x2 = x1; x1 = x0; y2 = y1; y1 = y0;
		out[i] = y0;
	}
	return out;
};

const highpass = (input, cutoff, q = 0.707) => {
	const w = (TAU * cutoff) / SR;
	const alpha = Math.sin(w) / (2 * q);
	const cosw = Math.cos(w);
	const a0 = 1 + alpha;
	const b0 = (1 + cosw) / 2 / a0;
	const b1 = -(1 + cosw) / a0;
	const b2 = b0;
	const a1 = (-2 * cosw) / a0;
	const a2 = (1 - alpha) / a0;
	let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
	const out = new Float32Array(input.length);
	for (let i = 0; i < input.length; i++) {
		const x0 = input[i];
		const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
		x2 = x1; x1 = x0; y2 = y1; y1 = y0;
		out[i] = y0;
	}
	return out;
};

const bandpass = (input, freq, q = 1.2) => highpass(lowpass(input, freq * 1.6, q), freq * 0.6, q);

// Schroeder-ish reverb so one-shots sit inside a big riverside space.
const reverb = (input, mix = 0.35) => {
	const combs = [0.0297, 0.0371, 0.0411, 0.0437].map((d) => Math.round(d * SR));
	const allpasses = [0.005, 0.0017].map((d) => Math.round(d * SR));
	let sig = Float32Array.from(input);
	for (const d of combs) {
		const line = new Float32Array(d);
		let p = 0;
		const damped = new Float32Array(sig.length);
		let lp = 0;
		for (let i = 0; i < sig.length; i++) {
			const y = line[p];
			lp = y * 0.6 + lp * 0.4;
			line[p] = sig[i] + lp * 0.79;
			p = (p + 1) % d;
			damped[i] = y;
		}
		for (let i = 0; i < sig.length; i++) sig[i] = sig[i] * 0.62 + damped[i] * 0.4;
	}
	for (const d of allpasses) {
		const line = new Float32Array(d);
		let p = 0;
		for (let i = 0; i < sig.length; i++) {
			const bufv = line[p];
			const y = -sig[i] + bufv;
			line[p] = sig[i] + bufv * 0.5;
			p = (p + 1) % d;
			sig[i] = y;
		}
	}
	const out = new Float32Array(input.length);
	for (let i = 0; i < input.length; i++) out[i] = input[i] * (1 - mix) + sig[i] * mix;
	return out;
};

const fadeEdges = (arr, inSec = 0.05, outSec = 0.6) => {
	const n = arr.length;
	const fi = Math.min(n, Math.round(inSec * SR));
	const fo = Math.min(n, Math.round(outSec * SR));
	for (let i = 0; i < fi; i++) arr[i] *= i / fi;
	for (let i = 0; i < fo; i++) arr[n - 1 - i] *= i / fo;
	return arr;
};

const normalise = (arr, peak = 0.9) => {
	let max = 0;
	for (let i = 0; i < arr.length; i++) max = Math.max(max, Math.abs(arr[i]));
	if (max === 0) return arr;
	const g = peak / max;
	for (let i = 0; i < arr.length; i++) arr[i] *= g;
	return arr;
};

const add = (target, src, gain = 1, offsetSec = 0) => {
	const off = Math.round(offsetSec * SR);
	for (let i = 0; i < src.length; i++) {
		const j = i + off;
		if (j >= 0 && j < target.length) target[j] += src[i] * gain;
	}
	return target;
};

// ---------- wav writer ----------
const writeWav = (name, channels, {stereo = false} = {}) => {
	const chans = stereo ? 2 : 1;
	const frames = channels[0].length;
	const data = Buffer.alloc(frames * chans * 2);
	let p = 0;
	for (let i = 0; i < frames; i++) {
		for (let c = 0; c < chans; c++) {
			const v = Math.max(-1, Math.min(1, channels[c][i]));
			data.writeInt16LE(Math.round(v * 32767), p);
			p += 2;
		}
	}
	const header = Buffer.alloc(44);
	header.write('RIFF', 0);
	header.writeUInt32LE(36 + data.length, 4);
	header.write('WAVE', 8);
	header.write('fmt ', 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(chans, 22);
	header.writeUInt32LE(SR, 24);
	header.writeUInt32LE(SR * chans * 2, 28);
	header.writeUInt16LE(chans * 2, 32);
	header.writeUInt16LE(16, 34);
	header.write('data', 36);
	header.writeUInt32LE(data.length, 40);
	writeFileSync(join(OUT, name), Buffer.concat([header, data]));
	console.log(`${name}  ${(channels[0].length / SR).toFixed(1)}s  ${((data.length + 44) / 1024 / 1024).toFixed(2)} MB`);
};

// ---------- sources ----------
const pinkish = (seconds) => {
	const out = buf(seconds);
	let b0 = 0, b1 = 0, b2 = 0;
	for (let i = 0; i < out.length; i++) {
		const w = noise();
		b0 = 0.99765 * b0 + w * 0.099046;
		b1 = 0.963 * b1 + w * 0.2965164;
		b2 = 0.57 * b2 + w * 1.0526913;
		out[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
	}
	return out;
};

const brownish = (seconds) => {
	const out = buf(seconds);
	let last = 0;
	for (let i = 0; i < out.length; i++) {
		last = (last + 0.02 * noise()) / 1.02;
		out[i] = last * 4.2;
	}
	return out;
};

const slowLfo = (seconds, rate, phase = 0) => {
	const out = buf(seconds);
	for (let i = 0; i < out.length; i++) out[i] = Math.sin(TAU * rate * (i / SR) + phase);
	return out;
};

const crackle = (seconds, density, gain) => {
	const out = buf(seconds);
	const count = Math.round(seconds * density);
	for (let k = 0; k < count; k++) {
		const at = rnd() * (seconds - 0.05);
		const dur = 0.004 + rnd() * 0.02;
		const start = Math.round(at * SR);
		const n = Math.round(dur * SR);
		const amp = gain * (0.15 + rnd() * 0.85);
		const f = 1200 + rnd() * 3600;
		const click = buf(dur);
		for (let i = 0; i < n; i++) click[i] = noise() * Math.pow(1 - i / n, 3);
		const shaped = bandpass(click, f, 2.5);
		add(out, shaped, amp);
	}
	return out;
};

// ---------- stems ----------

// 1. Cold pre-dawn air: wind gusts + dry leaves + a very distant river.
{
	const dur = 16;
	const wind = lowpass(brownish(dur), 320, 0.6);
	const gust = buf(dur);
	const l1 = slowLfo(dur, 0.07);
	const l2 = slowLfo(dur, 0.19, 1.4);
	for (let i = 0; i < wind.length; i++) {
		gust[i] = 0.55 + 0.3 * l1[i] + 0.15 * l2[i];
		wind[i] *= gust[i] * 1.3;
	}
	const hiss = highpass(pinkish(dur), 900);
	for (let i = 0; i < hiss.length; i++) hiss[i] *= 0.05 * (0.5 + 0.5 * l2[i]);
	const leaves = crackle(dur, 7, 0.06);
	const leavesHp = highpass(leaves, 1800);
	const far = lowpass(pinkish(dur), 500, 0.5);
	for (let i = 0; i < far.length; i++) far[i] *= 0.09;
	const out = buf(dur);
	add(out, wind, 1);
	add(out, hiss, 1);
	add(out, leavesHp, 0.55);
	add(out, far, 1);
	fadeEdges(out, 1.2, 2.5);
	writeWav('ambience-cold.wav', [normalise(out, 0.62)]);
}

// 2. River wash, loops forever under the whole film.
{
	const dur = 12;
	const body = lowpass(pinkish(dur), 1400, 0.5);
	const lap = buf(dur);
	for (let k = 0; k < dur * 1.6; k++) {
		const at = rnd() * (dur - 1.2);
		const n = buf(0.9 + rnd() * 0.7);
		const f = 380 + rnd() * 900;
		const src = bandpass(pinkish(n.length / SR), f, 0.8);
		for (let i = 0; i < n.length; i++) {
			const t = i / n.length;
			n[i] = src[i] * Math.sin(Math.PI * t) ** 2.2;
		}
		add(lap, n, 0.5 + rnd() * 0.4);
	}
	const out = buf(dur);
	for (let i = 0; i < out.length; i++) out[i] = body[i] * 0.55 + lap[i] * 0.75;
	const lp = lowpass(out, 2600);
	fadeEdges(lp, 0.9, 0.9);
	writeWav('water-river.wav', [normalise(lp, 0.6)]);
}

// 3. Diya flame crackle for the sindoor scene.
{
	const dur = 10;
	const fire = crackle(dur, 55, 0.5);
	const air = lowpass(brownish(dur), 220);
	for (let i = 0; i < air.length; i++) air[i] *= 0.35;
	const out = buf(dur);
	add(out, highpass(fire, 700), 0.5);
	add(out, air, 0.5);
	fadeEdges(out, 0.6, 1.2);
	writeWav('fire-crackle.wav', [normalise(out, 0.5)]);
}

// 4. Tanpura-ish drone on D — the devotional floor of the whole piece.
{
	const dur = 16;
	const root = 146.83;
	const out = buf(dur);
	const partials = [1, 2, 3, 4, 6];
	partials.forEach((p, pi) => {
		const amp = [0.5, 0.28, 0.16, 0.1, 0.05][pi];
		const det = 1 + (rnd() - 0.5) * 0.0016;
		const lfo = 0.04 + rnd() * 0.05;
		for (let i = 0; i < out.length; i++) {
			const t = i / SR;
			const shimmer = 0.75 + 0.25 * Math.sin(TAU * lfo * t + pi);
			out[i] += Math.sin(TAU * root * p * det * t) * amp * shimmer;
		}
	});
	const fifth = 220;
	for (let i = 0; i < out.length; i++) {
		const t = i / SR;
		out[i] += Math.sin(TAU * fifth * t) * 0.16 * (0.7 + 0.3 * Math.sin(TAU * 0.03 * t));
	}
	const lp = lowpass(out, 1500, 0.5);
	const wet = reverb(lp, 0.25);
	fadeEdges(wet, 2.5, 3.5);
	writeWav('drone-d.wav', [normalise(wet, 0.5)]);
}

// 5. A breathy bansuri phrase in Bhairavi-ish D minor. Original melody.
{
	const notes = [
		[0, 1.6, 293.66], [1.6, 1.0, 261.63], [2.6, 1.4, 233.08], [4.0, 0.9, 220.0],
		[4.9, 1.8, 233.08], [6.7, 1.2, 261.63], [7.9, 1.6, 293.66], [9.5, 2.4, 220.0],
	];
	const dur = 12.4;
	const out = buf(dur);
	for (const [start, len, freq] of notes) {
		const n = Math.round(len * SR);
		const voice = buf(len);
		for (let i = 0; i < n; i++) {
			const t = i / SR;
			const vib = 1 + 0.004 * Math.sin(TAU * 5.2 * t) * Math.min(1, t / 0.35);
			const glide = 0.994 + 0.006 * Math.min(1, t / 0.12);
			let s = 0;
			s += Math.sin(TAU * freq * vib * glide * t) * 1;
			s += Math.sin(TAU * freq * 2 * vib * glide * t) * 0.22;
			s += Math.sin(TAU * freq * 3 * vib * glide * t) * 0.07;
			const breath = noise() * 0.07;
			voice[i] = s * 0.5 + breath;
		}
		const shaped = bandpass(voice, freq * 1.9, 0.9);
		const env = buf(len);
		for (let i = 0; i < n; i++) {
			const t = i / SR;
			const attack = Math.min(1, t / 0.16);
			const rel = Math.min(1, (len - t) / 0.45);
			env[i] = voice[i] * attack * rel;
		}
		const mixed = buf(len);
		for (let i = 0; i < n; i++) mixed[i] = env[i] + shaped[i] * 0.35;
		add(out, mixed, 0.5, start);
	}
	const wet = reverb(out, 0.42);
	fadeEdges(wet, 0.4, 1.2);
	writeWav('flute-phrase.wav', [normalise(wet, 0.62)]);
}

// 6. Dhol / nagada pattern for the sunrise climax.
{
	const step = 0.125; // 8 steps per second
	const pattern = [
		'd', '.', '.', 't', 'D', '.', 't', '.',
		'd', '.', 't', '.', 'D', 't', 'd', '.',
	];
	const bars = 2;
	const dur = pattern.length * step * bars + 2.4;
	const out = buf(dur);
	const hit = (type) => {
		const low = type === 'D';
		const len = low ? 0.42 : 0.2;
		const n = Math.round(len * SR);
		const v = buf(len);
		const f0 = low ? 165 : 420;
		const f1 = low ? 52 : 240;
		for (let i = 0; i < n; i++) {
			const t = i / SR;
			const p = t / len;
			const f = f1 + (f0 - f1) * Math.exp(-t * 26);
			const amp = Math.exp(-p * (low ? 5.5 : 9)) * (1 - Math.exp(-t * 900));
			v[i] = Math.sin(TAU * f * t) * amp;
			if (i < SR * 0.012) v[i] += noise() * 0.35 * (1 - i / (SR * 0.012));
		}
		return v;
	};
	for (let b = 0; b < bars; b++) {
		pattern.forEach((s, i) => {
			if (s === '.') return;
			add(out, hit(s), s === 'D' ? 1 : s === 'd' ? 0.72 : 0.45, b * pattern.length * step + i * step);
		});
	}
	const wet = reverb(out, 0.18);
	writeWav('dhol-loop.wav', [normalise(wet, 0.85)]);
}

// 7. Shankh (conch) — the emotional signature of the film.
{
	const dur = 7;
	const out = buf(dur);
	const base = 233.08;
	const intro = 1.2;
	for (let i = 0; i < out.length; i++) {
		const t = i / SR;
		const bend = 0.94 + 0.06 * Math.min(1, t / 0.9);
		const vib = 1 + 0.008 * Math.sin(TAU * 4.6 * t) * Math.min(1, t / 0.8);
		const env = Math.min(1, t / 0.55) * Math.exp(-Math.max(0, t - intro) * 0.75) * Math.min(1, (dur - t) / 0.9);
		let s = 0;
		s += Math.sin(TAU * base * bend * vib * t) * 1;
		s += Math.sin(TAU * base * 2 * bend * vib * t) * 0.42;
		s += Math.sin(TAU * base * 3 * bend * vib * t) * 0.2;
		s += Math.sin(TAU * base * 4.02 * bend * vib * t) * 0.1;
		const breath = highpass(pinkish(0.1), 1500)[Math.floor((t * 40) % 100)] * 0.09;
		out[i] = (s * 0.55 + breath) * env;
	}
	const wet = reverb(out, 0.55);
	fadeEdges(wet, 0.05, 0.8);
	writeWav('shankh.wav', [normalise(wet, 0.72), normalise(reverb(fadeEdges(Float32Array.from(out), 0.05, 0.8), 0.62), 0.7)], {stereo: true});
}

// 8. Cymbal swell + crash.
{
	const dur = 4;
	const crash = highpass(pinkish(dur), 4200);
	for (let i = 0; i < crash.length; i++) {
		const t = i / SR;
		crash[i] *= Math.exp(-t * 1.6) * Math.min(1, t / 0.02);
	}
	const air = bandpass(pinkish(dur), 9000, 0.6);
	for (let i = 0; i < air.length; i++) air[i] *= 0.16 * Math.exp(-(i / SR) * 1.1);
	const out = buf(dur);
	add(out, crash, 0.85);
	add(out, air, 0.5);
	writeWav('cymbal.wav', [normalise(out, 0.8), normalise(highpass(pinkish(dur), 3800), 0.75)], {stereo: true});
}

// 9. Wading splash for the cold penance cut.
{
	const dur = 3.2;
	const out = buf(dur);
	const body = bandpass(pinkish(1.1), 700, 0.7);
	for (let i = 0; i < body.length; i++) {
		const t = i / SR;
		body[i] *= Math.min(1, t / 0.012) * Math.exp(-t * 3.4);
	}
	add(out, body, 1);
	for (let k = 0; k < 26; k++) {
		const at = 0.05 + rnd() * 1.5;
		const n = buf(0.05);
		const f = 400 + rnd() * 2200;
		const b = bandpass(buf(0.05).map(() => noise()), f, 3);
		for (let i = 0; i < n.length; i++) b[i] *= Math.exp(-(i / n.length) * 6) * 0.6;
		add(out, b, 0.5, at);
	}
	const tail = lowpass(pinkish(dur), 1200);
	for (let i = 0; i < tail.length; i++) tail[i] *= 0.12 * Math.exp(-(i / SR) * 1.2);
	add(out, tail, 1);
	fadeEdges(out, 0.01, 0.7);
	writeWav('splash.wav', [normalise(out, 0.78)]);
}

// 10. Little temple bell for the tender modulation.
{
	const dur = 5;
	const out = buf(dur);
	const freqs = [1046.5, 1568, 2093, 2637, 3140];
	freqs.forEach((f, i) => {
		const amp = [1, 0.5, 0.32, 0.18, 0.1][i];
		const decay = [1.2, 1.8, 2.4, 3.2, 4.2][i];
		for (let k = 0; k < out.length; k++) {
			const t = k / SR;
			out[k] += Math.sin(TAU * f * t) * amp * Math.exp(-t * decay) * Math.min(1, t / 0.004);
		}
	});
	const wet = reverb(out, 0.5);
	writeWav('bell.wav', [normalise(wet, 0.55)]);
}
