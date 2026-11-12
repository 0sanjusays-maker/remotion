import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {seeded} from '../lib/anim';

/**
 * Film grain. A tiled noise plate that is re-offset every frame, blended in
 * overlay mode so it bites into the highlights exactly like scanned film.
 */
export const Grain = ({opacity = 0.055}: {opacity?: number}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url(${staticFile('art/grain.png')})`,
				backgroundSize: '512px 512px',
				backgroundPosition: `${(frame * 71) % 512}px ${(frame * 137) % 512}px`,
				mixBlendMode: 'overlay',
				opacity,
				pointerEvents: 'none',
			}}
		/>
	);
};

/** Cinematic edge falloff. `strength` runs 0 -> 1. */
export const Vignette = ({strength = 1, tint = '0,0,0'}: {strength?: number; tint?: string}) => {
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				background: `radial-gradient(ellipse 78% 78% at 50% 48%, rgba(${tint},0) 34%, rgba(${tint},${0.16 * strength}) 62%, rgba(${tint},${0.62 * strength}) 86%, rgba(${tint},${0.9 * strength}) 100%)`,
				boxShadow: `inset 0 0 ${220 * strength}px rgba(0,0,0,${0.55 * strength})`,
			}}
		/>
	);
};

type FogProps = {
	count?: number;
	rgb?: string;
	opacity?: number;
	speed?: number;
	blur?: number;
	seed?: number;
	scale?: number;
	top?: number;
	spread?: number;
	blend?: React.CSSProperties['mixBlendMode'];
};

/** Drifting volumetric fog banks. */
export const Fog = ({
	count = 7,
	rgb = '186,212,238',
	opacity = 0.55,
	speed = 1,
	blur = 90,
	seed = 11,
	scale = 1,
	top = 30,
	spread = 55,
	blend = 'screen',
}: FogProps) => {
	const frame = useCurrentFrame();
	const blobs = useMemo(() => {
		const r = seeded(seed);
		return Array.from({length: count}, () => ({
			x: r() * 130 - 15,
			y: top + r() * spread,
			w: 32 + r() * 46,
			h: 10 + r() * 16,
			sp: 0.3 + r() * 0.9,
			ph: r() * Math.PI * 2,
			op: 0.35 + r() * 0.65,
			rot: (r() - 0.5) * 16,
		}));
	}, [count, seed, top, spread]);

	return (
		<AbsoluteFill style={{opacity, mixBlendMode: blend, filter: `blur(${blur}px)`, pointerEvents: 'none'}}>
			{blobs.map((b, i) => {
				const x = (((b.x + frame * 0.013 * b.sp * speed) % 150) + 150) % 150 - 25;
				const y = b.y + Math.sin(frame * 0.006 * b.sp + b.ph) * 3;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							width: `${b.w * scale}%`,
							height: `${b.h * scale}%`,
							borderRadius: '50%',
							transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
							background: `radial-gradient(ellipse at center, rgba(${rgb},${0.3 * b.op}) 0%, rgba(${rgb},${0.12 * b.op}) 42%, rgba(${rgb},0) 72%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

type MoteProps = {
	count?: number;
	rgb?: string;
	opacity?: number;
	size?: number;
	rise?: number;
	blur?: number;
	seed?: number;
	drift?: number;
	glow?: boolean;
};

/** Golden dust, pollen and floating embers. */
export const Motes = ({
	count = 70,
	rgb = '255,203,110',
	opacity = 0.8,
	size = 5,
	rise = 0.35,
	blur = 1.6,
	seed = 23,
	drift = 1,
	glow = true,
}: MoteProps) => {
	const frame = useCurrentFrame();
	const {height} = useVideoConfig();
	const motes = useMemo(() => {
		const r = seeded(seed);
		return Array.from({length: count}, () => ({
			x: r() * 104 - 2,
			y: r() * 110,
			s: 0.35 + r() * 1.5,
			sp: 0.5 + r() * 1.8,
			sway: 0.4 + r() * 1.6,
			ph: r() * Math.PI * 2,
			op: 0.25 + r() * 0.75,
			tw: 0.02 + r() * 0.07,
		}));
	}, [count, seed]);

	return (
		<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', filter: `blur(${blur}px)`}}>
			{motes.map((m, i) => {
				const travel = ((m.y - (frame * rise * m.sp) / 10) % 118 + 118) % 118 - 9;
				const x = m.x + Math.sin(frame * 0.012 * m.sway + m.ph) * 2.4 * drift;
				const twinkle = 0.55 + 0.45 * Math.sin(frame * m.tw + m.ph);
				const px = size * m.s;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${travel}%`,
							width: px,
							height: px,
							borderRadius: '50%',
							opacity: opacity * m.op * twinkle,
							background: glow
								? `radial-gradient(circle, rgba(255,255,240,${0.95}) 0%, rgba(${rgb},0.75) 38%, rgba(${rgb},0) 72%)`
								: `rgba(${rgb},0.85)`,
							boxShadow: glow ? `0 0 ${px * 3}px rgba(${rgb},0.55)` : undefined,
							transform: `translate(-50%, -50%) scale(${1 + 0.15 * Math.sin(frame * 0.05 + i)})`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

type SmokeProps = {
	rgb?: string;
	opacity?: number;
	blur?: number;
	width?: number;
	x?: number;
	height?: number;
	sway?: number;
	seed?: number;
	rise?: number;
};

/** Curling incense smoke: a column of soft puffs that grow and dissolve. */
export const IncenseSmoke = ({
	rgb = '255,228,196',
	opacity = 0.5,
	blur = 16,
	width = 30,
	x = 50,
	height = 70,
	sway = 26,
	seed = 5,
	rise = 2.2,
}: SmokeProps) => {
	const frame = useCurrentFrame();
	const puffs = useMemo(() => {
		const r = seeded(seed);
		return Array.from({length: 34}, (_, i) => ({
			life: i / 34,
			sp: 0.7 + r() * 0.6,
			ph: r() * Math.PI * 2,
			wob: 0.5 + r() * 0.9,
			sz: 0.6 + r() * 0.9,
			op: 0.5 + r() * 0.5,
		}));
	}, [seed]);

	return (
		<AbsoluteFill style={{pointerEvents: 'none', filter: `blur(${blur}px)`, mixBlendMode: 'screen'}}>
			{puffs.map((p, i) => {
				const life = (p.life + (frame * rise) / 900) % 1;
				const y = 100 - life * height;
				const sx = Math.sin(life * 5.4 * p.wob + p.ph) * sway * life;
				const size = width * (0.18 + life * 1.15) * p.sz;
				const alpha = Math.sin(Math.PI * life) * p.op;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							width: size,
							height: size * 1.25,
							transform: `translate(calc(-50% + ${sx}px), -50%) rotate(${sx * 0.4}deg)`,
							borderRadius: '50%',
							opacity: opacity * alpha,
							background: `radial-gradient(ellipse at 45% 45%, rgba(${rgb},0.5), rgba(${rgb},0.12) 55%, rgba(${rgb},0) 78%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

type FlareProps = {
	x?: number;
	y?: number;
	intensity?: number;
	warmth?: number;
	seed?: number;
};

/** Anamorphic lens flare with ghosts, halo and a horizontal streak. */
export const LensFlare = ({x = 50, y = 44, intensity = 1, warmth = 1}: FlareProps) => {
	const ghosts = [
		{pos: 0.16, size: 26, op: 0.1, hue: '255,214,140'},
		{pos: 0.34, size: 12, op: 0.16, hue: '255,170,90'},
		{pos: 0.52, size: 44, op: 0.07, hue: '255,236,190'},
		{pos: 0.72, size: 18, op: 0.13, hue: '255,150,80'},
		{pos: 0.94, size: 30, op: 0.09, hue: '255,210,160'},
	];
	const gx = (p: number) => x + (50 - x) * p * 2;
	const gy = (p: number) => y + (50 - y) * p * 2;

	return (
		<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity: intensity}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,246,214,${0.9 * warmth}) 0%, rgba(255,196,96,${0.5 * warmth}) 6%, rgba(255,140,40,${0.16 * warmth}) 16%, rgba(255,120,20,0) 40%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 62% 6% at ${x}% ${y}%, rgba(255,240,200,0.55), rgba(255,180,80,0.16) 45%, rgba(255,160,60,0) 72%)`,
					filter: 'blur(6px)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: `linear-gradient(${90}deg, rgba(255,220,150,0) 18%, rgba(255,215,150,0.13) 49%, rgba(255,235,190,0.28) 50%, rgba(255,215,150,0.13) 51%, rgba(255,220,150,0) 82%)`,
					filter: 'blur(22px)',
					transform: 'rotate(-3deg) scale(1.3)',
				}}
			/>
			{ghosts.map((g, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${gx(g.pos)}%`,
						top: `${gy(g.pos)}%`,
						width: `${g.size}%`,
						height: `${g.size * 0.42}%`,
						transform: 'translate(-50%, -50%) rotate(18deg)',
						borderRadius: '50%',
						opacity: g.op * warmth,
						background: `radial-gradient(ellipse at center, rgba(${g.hue},0.85), rgba(${g.hue},0.15) 55%, rgba(${g.hue},0) 78%)`,
						filter: 'blur(2px)',
					}}
				/>
			))}
			<div
				style={{
					position: 'absolute',
					left: `${x}%`,
					top: `${y}%`,
					width: '38%',
					height: '38%',
					transform: 'translate(-50%, -50%)',
					borderRadius: '50%',
					border: `2px solid rgba(255,214,150,${0.12 * warmth})`,
					boxShadow: `0 0 60px rgba(255,190,110,${0.16 * warmth}) inset`,
				}}
			/>
		</AbsoluteFill>
	);
};

/** A lit clay diya, drawn in SVG so it stays razor sharp at any size. */
export const Diya = ({
	size = 220,
	glow = 1,
	flickerSeed = 0,
	lit = true,
}: {
	size?: number;
	glow?: number;
	flickerSeed?: number;
	lit?: boolean;
}) => {
	const frame = useCurrentFrame();
	const wobble = Math.sin(frame * 0.22 + flickerSeed) * 0.06 + Math.sin(frame * 0.61 + flickerSeed * 2) * 0.03;
	return (
		<div style={{width: size, height: size, position: 'relative'}}>
			<div
				style={{
					position: 'absolute',
					inset: '-45%',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,176,74,0.55) 0%, rgba(255,140,40,0.22) 32%, rgba(255,110,20,0) 62%)',
					opacity: lit ? glow : 0,
					transform: `scale(${1 + wobble})`,
					mixBlendMode: 'screen',
				}}
			/>
			<svg viewBox="0 0 200 200" width={size} height={size} style={{position: 'relative'}}>
				<defs>
					<linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#b4571f" />
						<stop offset="1" stopColor="#48200d" />
					</linearGradient>
					<radialGradient id="flameCore" cx="0.5" cy="0.72" r="0.6">
						<stop offset="0" stopColor="#fffdf0" />
						<stop offset="0.4" stopColor="#ffd979" />
						<stop offset="1" stopColor="#ff8a1f" />
					</radialGradient>
				</defs>
				<ellipse cx="100" cy="140" rx="62" ry="18" fill="url(#clay)" />
				<path d="M38 138 C44 168 156 168 162 138 Z" fill="url(#clay)" />
				{lit ? (
					<g transform={`rotate(${wobble * 60} 100 128)`}>
						<path d="M100 60 C112 96 126 108 118 126 C112 140 88 140 82 126 C74 108 88 96 100 60 Z" fill="url(#flameCore)" />
						<ellipse cx="100" cy="120" rx="9" ry="16" fill="#fffbe8" opacity="0.95" />
					</g>
				) : null}
			</svg>
		</div>
	);
};
