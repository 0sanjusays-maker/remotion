import {Easing, interpolate} from 'remotion';

export const EASE = {
	linear: Easing.linear,
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.62, 0, 0.36, 1),
	in: Easing.bezier(0.5, 0, 0.75, 0),
	soft: Easing.bezier(0.25, 0.1, 0.25, 1),
	expo: Easing.bezier(0.87, 0, 0.13, 1),
};

export const track = (
	frame: number,
	input: number[],
	output: number[],
	easing: (t: number) => number = Easing.linear,
) =>
	interpolate(frame, input, output, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

// deterministic pseudo random, so every render is identical
export const seeded = (seed: number) => {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
};

// organic light flicker, the way a diya or a fire behaves
export const flicker = (frame: number, speed = 0.08, seed = 0) => {
	const a = Math.sin(frame * speed + seed);
	const b = Math.sin(frame * speed * 2.7 + seed * 1.7);
	const c = Math.sin(frame * speed * 6.1 + seed * 3.3);
	return 0.5 + (a * 0.45 + b * 0.33 + c * 0.22) * 0.5;
};

export const deg = (value: number) => `${value}deg`;

export const pct = (value: number) => `${value}%`;

export const shade = (hex: string, amount: number) => {
	const n = parseInt(hex.replace('#', ''), 16);
	const r = Math.round(Math.min(255, Math.max(0, ((n >> 16) & 255) + amount)));
	const g = Math.round(Math.min(255, Math.max(0, ((n >> 8) & 255) + amount)));
	const b = Math.round(Math.min(255, Math.max(0, (n & 255) + amount)));
	return `rgb(${r}, ${g}, ${b})`;
};
