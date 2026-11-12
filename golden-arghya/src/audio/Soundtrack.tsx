import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {EASE, track} from '../lib/anim';

/**
 * The whole sound design, mixed in code. Everything is an original synth
 * stem rendered by scripts/build-audio.mjs — no sampled or licensed music.
 */
const Stem: React.FC<{
	src: string;
	from: number;
	durationInFrames: number;
	volume: (frame: number) => number;
	loop?: boolean;
}> = ({src, from, durationInFrames, volume, loop}) => (
	<Sequence from={from} durationInFrames={durationInFrames} layout="none">
		<Audio src={staticFile(src)} volume={volume} loop={loop} />
	</Sequence>
);

export const Soundtrack: React.FC = () => {
	return (
		<>
			{/* cold pre-dawn air, dry leaves, a river far away */}
			<Stem
				src="audio/ambience-cold.wav"
				from={0}
				durationInFrames={390}
				volume={(f) => track(f, [0, 30, 330, 390], [0, 0.62, 0.5, 0.12], EASE.inOut) * 0.9}
			/>

			{/* the river, under the whole film */}
			<Stem
				src="audio/water-river.wav"
				from={0}
				durationInFrames={2160}
				loop
				volume={(f) =>
					track(
						f,
						[0, 360, 720, 1100, 1440, 1800, 2040, 2160],
						[0.16, 0.26, 0.34, 0.24, 0.2, 0.24, 0.3, 0.26],
						EASE.inOut,
					)
				}
			/>

			{/* diya flame close to the microphone */}
			<Stem
				src="audio/fire-crackle.wav"
				from={360}
				durationInFrames={360}
				volume={(f) => track(f, [0, 24, 300, 360], [0, 0.52, 0.42, 0], EASE.inOut)}
			/>

			{/* tanpura-like drone carrying the devotion */}
			<Stem
				src="audio/drone-d.wav"
				from={300}
				durationInFrames={1740}
				loop
				volume={(f) =>
					track(
						f,
						[0, 90, 700, 1100, 1400, 1600, 1900, 2040],
						[0, 0.34, 0.42, 0.3, 0.38, 0.5, 0.26, 0],
						EASE.inOut,
					)
				}
			/>

			{/* the melodic line that stands in for the vocal */}
			<Stem
				src="audio/flute-phrase.wav"
				from={360}
				durationInFrames={1680}
				loop
				volume={(f) =>
					track(
						f,
						[0, 60, 300, 340, 700, 1080, 1200, 1400, 1520, 1780, 1900, 2020],
						[0, 0.5, 0.56, 0.16, 0.06, 0.1, 0.52, 0.4, 0.62, 0.5, 0.22, 0],
						EASE.inOut,
					)
				}
			/>

			<Stem
				src="audio/splash.wav"
				from={714}
				durationInFrames={100}
				volume={() => 0.8}
			/>

			<Stem
				src="audio/bell.wav"
				from={1080}
				durationInFrames={160}
				volume={(f) => track(f, [0, 10, 120, 160], [0, 0.42, 0.28, 0], EASE.inOut)}
			/>

			{/* the climax: dhol, cymbal, conch */}
			<Stem
				src="audio/dhol-loop.wav"
				from={1440}
				durationInFrames={372}
				loop
				volume={(f) => track(f, [0, 26, 300, 372], [0, 0.7, 0.62, 0], EASE.inOut)}
			/>
			<Stem
				src="audio/cymbal.wav"
				from={1440}
				durationInFrames={120}
				volume={(f) => track(f, [0, 4, 60, 120], [0, 0.78, 0.4, 0], EASE.inOut)}
			/>
			<Stem
				src="audio/shankh.wav"
				from={1442}
				durationInFrames={210}
				volume={(f) => track(f, [0, 8, 120, 210], [0, 0.85, 0.6, 0], EASE.inOut)}
			/>

			{/* one last conch over the tail of the river */}
			<Stem
				src="audio/shankh.wav"
				from={2052}
				durationInFrames={108}
				volume={(f) => track(f, [0, 14, 80, 108], [0, 0.3, 0.2, 0], EASE.inOut)}
			/>
		</>
	);
};
