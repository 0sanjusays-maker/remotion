import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, track} from '../lib/anim';
import {COPY} from '../lib/theme';
import {Grain, Motes} from '../components/atmosphere';

/**
 * 1:08 – 1:12  Outro Typography
 * Only the river and the last of the conch. The title breathes in, scales up
 * a fraction, and the film cuts to black on the final frame.
 */
export const Sequence7: React.FC = () => {
	const frame = useCurrentFrame();

	const kickerIn = track(frame, [4, 28], [0, 1], EASE.out);
	const titleIn = track(frame, [16, 46], [0, 1], EASE.out);
	const scale = track(frame, [0, 120], [1, 1.05], EASE.linear);
	const glow = track(frame, [16, 60, 120], [0.35, 1, 0.85], EASE.inOut);
	const halo = track(frame, [0, 70, 120], [0, 0.55, 0.42], EASE.inOut);

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 55% 45% at 50% 54%, rgba(255,164,40,${halo * 0.16}) 0%, rgba(255,140,30,0) 68%)`,
				}}
			/>

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${scale})`,
					paddingBottom: '4%',
				}}
			>
				<div
					style={{
						fontFamily: '"Tiro Devanagari Hindi", serif',
						fontSize: 44,
						letterSpacing: '0.06em',
						color: '#f3e8d6',
						opacity: kickerIn,
						transform: `translateY(${(1 - kickerIn) * 16}px)`,
						textShadow: '0 0 14px rgba(255,214,150,0.55), 0 0 46px rgba(255,180,80,0.28)',
						whiteSpace: 'nowrap',
					}}
				>
					{COPY.kicker}
				</div>

				<div style={{height: 52}} />

				<div
					style={{
						fontFamily: '"Tiro Devanagari Hindi", serif',
						fontSize: 260,
						lineHeight: 1,
						fontWeight: 400,
						letterSpacing: '0.02em',
						opacity: titleIn,
						transform: `scale(${0.965 + titleIn * 0.035})`,
						color: '#ffd257',
						textShadow: `0 0 20px #ffaa00, 0 0 60px rgba(255,150,0,${0.55 * glow}), 0 0 140px rgba(255,120,0,${0.3 * glow})`,
						whiteSpace: 'nowrap',
					}}
				>
					{COPY.title}
				</div>
			</AbsoluteFill>

			<Motes count={44} rgb="255,176,60" opacity={0.75} size={5} rise={1.5} blur={0.4} seed={131} />

			<Grain opacity={0.045} />
		</AbsoluteFill>
	);
};
