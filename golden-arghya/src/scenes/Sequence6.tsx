import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, flicker, track} from '../lib/anim';
import {Fog, Grain, Motes, Vignette} from '../components/atmosphere';
import {MotherAndChild} from '../components/silhouettes';

/**
 * 1:00 – 1:08  The Blessing & Return
 * Golden water, caustics crawling over everything, a child at her feet and a
 * piece of thekua passed down. The energy comes all the way down here.
 */
export const Sequence6: React.FC = () => {
	const frame = useCurrentFrame();

	const pan = track(frame, [0, 240], [2.2, -2.6], EASE.linear);
	const push = track(frame, [0, 240], [1.14, 1.2], EASE.linear);
	const caustic = track(frame, [0, 240], [0.2, 0.5], EASE.inOut);
	const fadeOut = track(frame, [222, 240], [0, 1], EASE.inOut);

	const wave = flicker(frame, 0.05, 4);

	return (
		<AbsoluteFill style={{backgroundColor: '#1b0f04', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translateX(${pan}%) scale(${push})`}}>
				<Img
					src={staticFile('art/06-water-gold.jpg')}
					style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.05) brightness(0.96)'}}
				/>
			</AbsoluteFill>

			{/* caustic light webs dancing across the frame */}
			<AbsoluteFill style={{mixBlendMode: 'screen', opacity: caustic, filter: 'blur(26px)'}}>
				{Array.from({length: 9}).map((_, i) => {
					const x = ((i * 37 + frame * 0.45) % 130) - 15;
					const y = 30 + ((i * 53 + frame * 0.2) % 60);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: `${x}%`,
								top: `${y}%`,
								width: `${18 + (i % 4) * 7}%`,
								height: '9%',
								transform: 'translate(-50%, -50%) rotate(-18deg)',
								borderRadius: '50%',
								background: 'radial-gradient(ellipse at center, rgba(255,224,160,0.5), rgba(255,190,110,0) 70%)',
							}}
						/>
					);
				})}
			</AbsoluteFill>

			<Fog count={4} rgb="255,214,158" opacity={0.26} blur={100} speed={0.6} top={52} spread={30} seed={97} />

			{/* the wet stone ghat they are standing on */}
			<AbsoluteFill
				style={{
					top: 'auto',
					height: '20%',
					background:
						'linear-gradient(180deg, rgba(14,7,2,0) 0%, rgba(12,6,2,0.72) 26%, rgba(7,4,1,0.96) 62%, rgba(5,3,1,1) 100%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: '0%',
					right: '0%',
					bottom: '18.4%',
					height: '2px',
					background:
						'linear-gradient(90deg, rgba(255,190,110,0) 8%, rgba(255,206,140,0.5) 34%, rgba(255,226,180,0.6) 52%, rgba(255,196,120,0.35) 72%, rgba(255,190,110,0) 94%)',
					filter: 'blur(3px)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: '46%',
					bottom: '16.5%',
					height: '55%',
					transform: 'translateX(-50%)',
					filter: 'brightness(0.17) contrast(1.25) drop-shadow(0 0 34px rgba(255,190,90,0.3))',
					opacity: 0.97,
				}}
			>
				<MotherAndChild style={{height: '100%', width: 'auto', display: 'block'}} backlight="#ffd070" />
			</div>

			{/* their shadows pooling on the wet stone */}
			<div
				style={{
					position: 'absolute',
					left: '20%',
					right: '12%',
					bottom: '14%',
					height: '5%',
					background: 'radial-gradient(ellipse at 55% 40%, rgba(0,0,0,0.85), rgba(0,0,0,0) 72%)',
					filter: 'blur(14px)',
				}}
			/>

			<Motes count={38} rgb="255,206,130" opacity={0.5} size={5} rise={0.5} blur={2.4} seed={113} />

			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 55% at 46% 44%, rgba(255,190,100,${0.1 + wave * 0.06}), rgba(255,150,60,0) 70%)`,
					mixBlendMode: 'screen',
				}}
			/>
			<Vignette strength={0.55 + 0.4 * track(frame, [0, 200], [0, 1], EASE.inOut)} tint="8,3,0" />
			<Grain opacity={0.05} />

			<AbsoluteFill style={{backgroundColor: '#000', opacity: fadeOut}} />
		</AbsoluteFill>
	);
};
