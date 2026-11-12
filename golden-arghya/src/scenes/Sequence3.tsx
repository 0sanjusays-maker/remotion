import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, flicker, track} from '../lib/anim';
import {Fog, Grain, Motes, Vignette} from '../components/atmosphere';
import {PrayingWoman} from '../components/silhouettes';

/**
 * 0:24 – 0:36  The Cold Penance
 * Water level camera. She stands waist deep in the current, a diya on a leaf
 * races across the lens, and the river breathes under her.
 */
export const Sequence3: React.FC = () => {
	const frame = useCurrentFrame();

	const push = track(frame, [0, 360], [1.14, 1.26], EASE.linear);
	const drift = track(frame, [0, 360], [0.6, -0.8], EASE.linear);
	const breath = Math.sin(frame / 46) * 7;

	// the diya sweeps the foreground from left to right
	const diyaX = track(frame, [0, 360], [-30, 126], EASE.inOut);
	const diyaBob = Math.sin(frame / 26) * 9;
	const diyaTilt = Math.sin(frame / 33) * 3;

	const fade = track(frame, [0, 20], [0, 1], EASE.out);
	const waterLine = 58;

	return (
		<AbsoluteFill style={{backgroundColor: '#04070e', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `scale(${push}) translate(${drift}%, ${breath * 0.12}px)`,
					filter: 'saturate(0.68) brightness(0.95) contrast(1.06) hue-rotate(-6deg)',
				}}
			>
				<Img src={staticFile('art/03-river-twilight.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* cold night wash */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(9,22,46,0.32) 0%, rgba(6,16,36,0.14) 40%, rgba(3,9,22,0.5) 100%)',
					mixBlendMode: 'multiply',
				}}
			/>

			<Fog count={7} rgb="150,180,214" opacity={0.4} blur={110} speed={0.9} top={30} spread={34} seed={13} />

			{/* expanding rings where she breaks the surface */}
			{Array.from({length: 3}).map((_, i) => {
				const cycle = (frame + i * 42) % 126;
				const p = cycle / 126;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '50%',
							top: `${waterLine}%`,
							width: `${18 + p * 46}%`,
							height: `${(18 + p * 46) * 0.16}%`,
							transform: 'translate(-50%, -50%)',
							borderRadius: '50%',
							border: `1.5px solid rgba(180,214,255,${0.24 * (1 - p)})`,
							filter: 'blur(2px)',
						}}
					/>
				);
			})}

			{/* she is distorted by the water she is standing in */}
			<AbsoluteFill style={{opacity: fade}}>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						bottom: `${100 - waterLine}%`,
						height: '38%',
						transform: `translate(-50%, ${-breath}px)`,
						filter: 'url(#waterRipple) brightness(0.24) contrast(1.25) drop-shadow(0 0 14px rgba(150,196,255,0.3))',
					}}
				>
					<PrayingWoman style={{height: '100%', width: 'auto', display: 'block'}} backlight="#7fb4ea" />
				</div>
				{/* her reflection, torn apart by the current */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: `${waterLine}%`,
						height: '18%',
						transform: 'translate(-50%, 0) scaleY(-1)',
						opacity: 0.22,
						filter: 'blur(6px) brightness(0.5)',
						WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 72%)',
						maskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 72%)',
					}}
				>
					<PrayingWoman style={{height: '100%', width: 'auto', display: 'block'}} backlight="#7fb4ea" />
				</div>
			</AbsoluteFill>

			<Fog count={5} rgb="196,220,244" opacity={0.16} blur={90} speed={1.8} top={44} spread={26} seed={41} />

			{/* where she breaks the surface */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: `${waterLine}%`,
					width: '30%',
					height: '3.4%',
					transform: 'translate(-50%, -50%)',
					background:
						'radial-gradient(ellipse at center, rgba(206,228,255,0.5), rgba(180,210,245,0.12) 46%, rgba(150,190,235,0) 72%)',
					filter: 'blur(6px)',
					mixBlendMode: 'screen',
				}}
			/>

			{/* the floating diya, right in front of the lens */}
			<div
				style={{
					position: 'absolute',
					left: `${diyaX}%`,
					bottom: '-3%',
					width: '27%',
					transform: `translate(-50%, ${diyaBob}px) rotate(${diyaTilt}deg)`,
					mixBlendMode: 'screen',
					filter: `saturate(1.15) brightness(${1.02 + flicker(frame, 0.1, 3) * 0.12})`,
					opacity: 0.96,
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: '-26%',
						background: 'radial-gradient(circle at 50% 42%, rgba(255,150,52,0.34), rgba(255,110,20,0) 62%)',
						filter: 'blur(18px)',
					}}
				/>
				<Img src={staticFile('art/fg-diya.jpg')} style={{width: '100%', display: 'block', position: 'relative'}} />
			</div>

			<Motes count={22} rgb="255,170,90" opacity={0.4} size={4} rise={0.7} blur={1.6} seed={53} />

			{/* deep water shadow at the bottom of frame */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(2,6,14,0) 62%, rgba(2,6,14,0.72) 100%)',
				}}
			/>
			<Vignette strength={0.7} />
			<Grain opacity={0.06} />
		</AbsoluteFill>
	);
};
