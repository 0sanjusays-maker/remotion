import React, {useMemo} from 'react';
import {AbsoluteFill, Img, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import {EASE, flicker, seeded, track} from '../lib/anim';
import {Diya, Fog, Grain, Motes, Vignette} from '../components/atmosphere';
import {SoopTray} from '../components/silhouettes';

/**
 * 0:36 – 0:48  Anticipation of the Sun
 * The camera tilts from the soop up into a sky that turns from violet to
 * magenta to orange, while the water she pours hangs in the air.
 */
export const Sequence4: React.FC = () => {
	const frame = useCurrentFrame();

	const tilt = track(frame, [0, 360], [-3, 17], EASE.inOut);
	const skyScale = track(frame, [0, 360], [1.24, 1.34], EASE.linear);

	// the sky has to visibly change temperature while we watch it
	const wash = interpolateColors(frame, [0, 150, 290, 360], ['#2a1145', '#8d1a63', '#d1441d', '#ff8a1f']);
	const washOpacity = track(frame, [0, 120, 300, 360], [0.5, 0.34, 0.24, 0.16]);
	const glow = track(frame, [0, 240, 360], [0.18, 0.34, 0.55], EASE.inOut);

	const trayX = 50;
	const trayY = track(frame, [0, 360], [22, -10], EASE.out);
	const trayScale = track(frame, [0, 360], [1, 1.16], EASE.linear);

	const drops = useMemo(() => {
		const r = seeded(91);
		return Array.from({length: 9}, () => ({
			x: 16 + r() * 70,
			w: 0.75 + r() * 1.5,
			delay: r() * 190,
			warm: r() > 0.45,
			blur: r() * 2.4,
		}));
	}, []);

	return (
		<AbsoluteFill style={{backgroundColor: '#140a1c', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `translateY(${tilt}%) scale(${skyScale})`,
					filter: 'saturate(1.05) contrast(1.04)',
				}}
			>
				<Img src={staticFile('art/04-sky.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* colour temperature shift, keyed frame by frame */}
			<AbsoluteFill style={{background: wash, opacity: washOpacity, mixBlendMode: 'soft-light'}} />
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 80% 60% at 50% 76%, rgba(255,150,60,${glow}) 0%, rgba(255,120,40,${glow * 0.5}) 34%, rgba(255,110,30,0) 68%)`,
					mixBlendMode: 'screen',
				}}
			/>

			<Fog count={5} rgb="255,196,150" opacity={0.22} blur={120} speed={0.8} top={52} spread={34} seed={61} />

			{/* the soop, silhouetted against the burning sky */}
			<div
				style={{
					position: 'absolute',
					left: `${trayX}%`,
					bottom: '-7%',
					height: '46%',
					transform: `translate(-50%, ${trayY}px) scale(${trayScale})`,
					transformOrigin: 'bottom center',
					filter: 'drop-shadow(0 -14px 44px rgba(255,130,40,0.35))',
				}}
			>
				<SoopTray style={{height: '100%', width: 'auto', display: 'block'}} backlight="#ffb347" />
				{/* the one flame on the tray, riding with the tray */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '38%',
						transform: `translate(-50%, -50%) scale(${0.9 + flicker(frame, 0.07, 5) * 0.08})`,
						mixBlendMode: 'screen',
					}}
				>
					<Diya size={150} glow={1.15} flickerSeed={2} />
				</div>
			</div>

			{/* the water and milk she is pouring, suspended in mid air */}
			<AbsoluteFill style={{mixBlendMode: 'screen'}}>
				{drops.map((d, i) => {
					const local = frame - d.delay;
					const y = track(
						local,
						[-30, 0, 16, 150, 240, 360],
						[-16, -8, 38, 44, 50, 124],
						EASE.linear,
					);
					const stretch = track(local, [16, 150, 240], [7.5, 4.4, 2.2], EASE.inOut);
					const alpha = track(local, [-6, 6, 240, 320, 360], [0, 0.8, 0.78, 0.5, 0]);
					const px = 10 * d.w;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: `${d.x}%`,
								top: `${y}%`,
								width: px,
								height: px * stretch,
								borderRadius: '50% / 44%',
								opacity: alpha,
								transform: 'translate(-50%, -50%)',
								filter: `blur(${d.blur}px)`,
								background: d.warm
									? 'radial-gradient(ellipse 60% 16% at 38% 22%, rgba(255,255,252,0.95), rgba(255,214,170,0.28) 46%, rgba(255,180,120,0.06) 78%)'
									: 'radial-gradient(ellipse 60% 16% at 38% 22%, rgba(252,255,255,0.95), rgba(176,214,248,0.26) 46%, rgba(140,190,235,0.05) 78%)',
								border: '1px solid rgba(255,246,225,0.22)',
								boxShadow: '0 0 22px rgba(255,214,160,0.28)',
							}}
						/>
					);
				})}
			</AbsoluteFill>

			{/* a couple of out of focus drops right on the lens */}
			{[
				{left: '12%', top: '62%', size: 64, delay: 0.0},
				{left: '82%', top: '38%', size: 46, delay: 0.0},
			].map((big, i) => (
				<div
					key={`big-${i}`}
					style={{
						position: 'absolute',
						left: big.left,
						top: big.top,
						width: big.size,
						height: big.size * 1.5,
						borderRadius: '50%',
						background:
							'radial-gradient(ellipse at 36% 26%, rgba(255,255,250,0.55), rgba(255,214,160,0.12) 46%, rgba(255,190,120,0) 76%)',
						filter: 'blur(9px)',
						mixBlendMode: 'screen',
					}}
				/>
			))}

			<Motes count={40} rgb="255,206,140" opacity={0.55} size={4.5} rise={0.8} blur={1.8} seed={71} />

			<Vignette strength={0.8} />
			<Grain opacity={0.055} />
		</AbsoluteFill>
	);
};
