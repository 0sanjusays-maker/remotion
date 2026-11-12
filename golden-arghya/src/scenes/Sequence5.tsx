import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, track} from '../lib/anim';
import {Fog, Grain, LensFlare, Motes, Vignette} from '../components/atmosphere';
import {FamilyGroup} from '../components/silhouettes';

/**
 * 0:48 – 1:00  The Epic Sunrise
 * Hard cut, white flash, and a snap dolly out from 1.8 to 1.0 as the sun
 * clears the river. Everyone goes to pure black against the light.
 */
export const Sequence5: React.FC = () => {
	const frame = useCurrentFrame();

	const snap = track(frame, [0, 15], [1.82, 1], EASE.out);
	const creep = track(frame, [15, 360], [1, 1.075], EASE.linear);
	const cam = snap * creep;

	const shake = frame < 22 ? Math.sin(frame * 2.4) * (22 - frame) * 0.9 : 0;
	const flash = track(frame, [0, 9], [0.92, 0], EASE.out);

	const bleed = track(frame, [0, 200, 360], [0.62, 0.42, 0.3], EASE.inOut);
	const flare = track(frame, [4, 26, 200, 360], [0, 1, 0.82, 0.6], EASE.out);

	return (
		<AbsoluteFill style={{backgroundColor: '#1a0d02', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `scale(${cam}) translate(${shake}px, ${shake * 0.4}px)`,
					filter: 'saturate(1.12) contrast(1.08) brightness(1.02)',
				}}
			>
				<Img src={staticFile('art/05-sunrise.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />

				{/* the family, pure black against the light */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						bottom: '11%',
						height: '49%',
						transform: 'translateX(-50%)',
						filter: 'brightness(0) contrast(1.4) drop-shadow(0 0 26px rgba(255,196,80,0.5))',
					}}
				>
					<FamilyGroup style={{height: '100%', width: 'auto', display: 'block'}} />
				</div>
			</AbsoluteFill>

			{/* light bleeding over the edges of the silhouettes */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'color-dodge',
					opacity: bleed,
					WebkitMaskImage:
						'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.95) 12%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 65%)',
					maskImage:
						'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.95) 12%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 65%)',
					transform: `scale(${1 + (cam - 1) * 0.25})`,
				}}
			>
				<Img src={staticFile('art/05-sunrise.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			<Fog count={5} rgb="255,214,150" opacity={0.3} blur={110} speed={0.7} top={58} spread={26} seed={83} />

			<LensFlare x={50} y={45} intensity={flare} warmth={1} />

			<Motes count={95} rgb="255,198,96" opacity={0.75} size={6} rise={1.1} blur={2.2} seed={101} />

			{/* high contrast gold grade */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 70% 70% at 50% 46%, rgba(255,150,40,0) 30%, rgba(90,40,0,0.32) 100%)',
					mixBlendMode: 'multiply',
				}}
			/>
			<Vignette strength={0.9} tint="10,4,0" />
			<Grain opacity={0.05} />

			<AbsoluteFill style={{backgroundColor: '#fff8e6', opacity: flash}} />
		</AbsoluteFill>
	);
};
