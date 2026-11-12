import React from 'react';
import {Composition} from 'remotion';
import {GoldenArghya} from './GoldenArghya';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './lib/timeline';
import './fonts';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="GoldenArghya"
		component={GoldenArghya}
		durationInFrames={DURATION_IN_FRAMES}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
	/>
);
