import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, flicker, track} from '../lib/anim';
import {Grain, IncenseSmoke, Motes, Vignette} from '../components/atmosphere';

/**
 * 0:12 – 0:24  The Sindoor of Faith
 * Extremely slow dolly in. The shot opens focused on the incense smoke and
 * racks to her face exactly when the vocals land at 0:16.
 */
export const Sequence2: React.FC = () => {
	const frame = useCurrentFrame();

	const dolly = track(frame, [0, 360], [1.02, 1.15], EASE.linear);
	const bgDolly = track(frame, [0, 360], [1, 1.07], EASE.linear);

	// rack focus, frame 104 -> 136 (0:15.5 - 0:16.5)
	const rack = track(frame, [104, 136], [0, 1], EASE.inOut);
	const faceBlur = 6.5 - 6.5 * rack;
	const smokeBlur = 1.5 + 12 * rack;
	const bgBlur = 9 - 5 * rack;

	const light = flicker(frame, 0.09, 2.3);
	const pulse = track(frame, [0, 40], [0, 1], EASE.out);

	return (
		<AbsoluteFill style={{backgroundColor: '#050404', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `scale(${bgDolly})`,
					filter: `blur(${bgBlur}px) saturate(1.08) brightness(1.12)`,
				}}
			>
				<Img src={staticFile('art/02-ghat-bokeh.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* the mother, keyed into the darkness of the ghat */}
			<AbsoluteFill
				style={{
					opacity: pulse,
					transform: `scale(${dolly})`,
					filter: `blur(${faceBlur}px) saturate(1.06)`,
					WebkitMaskImage:
						'radial-gradient(ellipse 74% 82% at 52% 46%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.92) 62%, rgba(0,0,0,0) 92%)',
					maskImage:
						'radial-gradient(ellipse 74% 82% at 52% 46%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.92) 62%, rgba(0,0,0,0) 92%)',
				}}
			>
				<Img
					src={staticFile('art/07-mother.jpg')}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '48% 38%'}}
				/>
			</AbsoluteFill>

			{/* lamp light spilling up into her face from below frame */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'screen',
					opacity: 0.35 + light * 0.4,
					background:
						'radial-gradient(ellipse 62% 46% at 38% 108%, rgba(255,138,38,0.5) 0%, rgba(255,104,20,0.2) 34%, rgba(255,90,10,0) 66%)',
				}}
			/>

			{/* a breath of the same bokeh in front, so she sits inside the scene */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'screen',
					opacity: 0.2,
					transform: `scale(${bgDolly * 1.03})`,
					filter: 'blur(6px)',
				}}
			>
				<Img src={staticFile('art/02-ghat-bokeh.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* incense: sharp at first, then it is the thing that goes soft */}
			<div style={{position: 'absolute', inset: 0, filter: `blur(${smokeBlur}px)`, mixBlendMode: 'screen'}}>
				<IncenseSmoke x={21} width={34} height={96} opacity={1} blur={8} seed={4} rise={2.6} />
				<IncenseSmoke x={28} width={18} height={74} opacity={0.7} blur={6} seed={9} rise={3.4} />
				<IncenseSmoke x={16} width={12} height={58} opacity={0.55} blur={5} seed={14} rise={4.2} />
			</div>

			<Motes count={26} rgb="255,164,72" opacity={0.5} size={4} rise={0.9} blur={1.2} seed={31} />

			<Vignette strength={0.95} />
			<Grain opacity={0.055} />
		</AbsoluteFill>
	);
};
