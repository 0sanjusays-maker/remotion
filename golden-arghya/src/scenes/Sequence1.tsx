import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, flicker, track} from '../lib/anim';
import {Fog, Grain, Vignette} from '../components/atmosphere';

/**
 * 0:00 – 0:12  The Descent into Devotion
 * Slow lateral track to the right. Sugarcane in the foreground rips past,
 * the man with the daura holds the middle ground, the village barely moves.
 */
export const Sequence1: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const fadeIn = track(frame, [0, 26], [0, 1], EASE.out);

	// parallax: the closer the layer, the faster it travels
	const bgX = track(frame, [0, 360], [2.4, -1.1], EASE.linear);
	const bgScale = track(frame, [0, 360], [1.16, 1.22], EASE.linear);

	const mgX = track(frame, [0, 360], [-3.2, 3.6], EASE.linear);
	const mgScale = track(frame, [0, 360], [1, 1.09], EASE.out);
	// a walking cadence that is just fast enough to feel alive
	const step = frame / 11;
	const bob = Math.sin(step) * 6 + Math.sin(step * 2) * 2;
	const sway = Math.sin(step) * 0.7;

	const fgX = track(frame, [0, 360], [-18, 44], EASE.linear);
	const fgX2 = track(frame, [0, 360], [-62, 2], EASE.linear);

	const lamp = flicker(frame, 0.06, 1.7);

	return (
		<AbsoluteFill style={{backgroundColor: '#03060e', opacity: fadeIn, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `translateX(${bgX}%) scale(${bgScale})`,
					filter: 'saturate(0.9) contrast(1.04) brightness(1.16)',
				}}
			>
				<Img src={staticFile('art/01-path.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* the single oil lamp burning far down the ghat */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'screen',
					opacity: 0.55 + lamp * 0.35,
					background: `radial-gradient(circle at 50.5% 43%, rgba(255,168,66,0.55) 0%, rgba(255,140,40,0.16) 4%, rgba(255,120,20,0) 15%)`,
				}}
			/>
			<Fog count={6} rgb="150,183,214" opacity={0.4} blur={0} speed={0.7} top={22} spread={46} seed={3} blend="screen" />

			{/* the man with the daura */}
			<div
				style={{
					position: 'absolute',
					left: `${47.5 + mgX * 0.35}%`,
					bottom: '3%',
					height: '70%',
					transform: `translateX(-50%) translateY(${bob}px) rotate(${sway}deg) scale(${mgScale})`,
					transformOrigin: 'bottom center',
					filter: 'brightness(0.16) drop-shadow(0 18px 40px rgba(0,0,0,0.6))',
					opacity: 0.97,
				}}
			>
				<Img
					src={staticFile('art/mg-basket-alpha.png')}
					style={{height: '100%', width: 'auto', display: 'block'}}
				/>
			</div>
			{/* contact shadow on the wet path */}
			<div
				style={{
					position: 'absolute',
					left: `${47.5 + mgX * 0.35}%`,
					bottom: '1.5%',
					width: '15%',
					height: '5%',
					transform: 'translateX(-50%)',
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%)',
					filter: `blur(${width * 0.006}px)`,
				}}
			/>

			<Fog count={5} rgb="176,204,232" opacity={0.34} blur={0} speed={1.5} top={52} spread={40} seed={17} />

			{/* foreground sugarcane, heavily defocused and pushed to the edges */}
			<AbsoluteFill style={{filter: 'blur(12px)', opacity: 0.88}}>
				<div
					style={{
						position: 'absolute',
						left: `${50 + fgX * 0.55}%`,
						bottom: '-10%',
						height: `${height * 1.25}px`,
						transform: 'rotate(-1.5deg)',
						filter: 'brightness(0.045)',
						opacity: 0.82,
					}}
				>
					<Img src={staticFile('art/fg-leaves-alpha.png')} style={{height: '100%', width: 'auto'}} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: `${-68 + fgX2 * 0.6}%`,
						bottom: '-14%',
						height: `${height * 1.4}px`,
						transform: 'rotate(2deg)',
						filter: 'brightness(0.04)',
						opacity: 0.9,
					}}
				>
					<Img
						src={staticFile('art/fg-leaves-alpha.png')}
						style={{height: '100%', width: 'auto', transform: 'scaleX(-1)'}}
					/>
				</div>
			</AbsoluteFill>

			<Fog count={4} rgb="206,226,246" opacity={0.22} blur={0} speed={2.6} top={62} spread={38} seed={29} />

			{/* cold moonlight grade */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(190deg, rgba(10,30,60,0.18) 0%, rgba(4,12,28,0.04) 42%, rgba(2,6,16,0.42) 100%)',
					mixBlendMode: 'multiply',
				}}
			/>
			<Vignette strength={0.62} />
			<Grain opacity={0.05} />
		</AbsoluteFill>
	);
};
