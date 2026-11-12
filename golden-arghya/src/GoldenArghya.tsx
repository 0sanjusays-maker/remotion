import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Soundtrack} from './audio/Soundtrack';
import {SCENES} from './lib/timeline';
import {Sequence1} from './scenes/Sequence1';
import {Sequence2} from './scenes/Sequence2';
import {Sequence3} from './scenes/Sequence3';
import {Sequence4} from './scenes/Sequence4';
import {Sequence5} from './scenes/Sequence5';
import {Sequence6} from './scenes/Sequence6';
import {Sequence7} from './scenes/Sequence7';

/**
 * A shared SVG filter used to warp anything standing in the river.
 * feTurbulence + feDisplacementMap keeps the distortion resolution
 * independent, so it still bites at 4K.
 */
const SharedFilters: React.FC = () => (
	<svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
		<defs>
			<filter id="waterRipple" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
				<feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves={2} seed={7} result="noise" />
				<feDisplacementMap in="SourceGraphic" in2="noise" scale={9} xChannelSelector="R" yChannelSelector="G" />
			</filter>
		</defs>
	</svg>
);

export const GoldenArghya: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<SharedFilters />

			<Sequence from={SCENES.descent.from} durationInFrames={SCENES.descent.duration}>
				<Sequence1 />
			</Sequence>
			<Sequence from={SCENES.sindoor.from} durationInFrames={SCENES.sindoor.duration}>
				<Sequence2 />
			</Sequence>
			<Sequence from={SCENES.penance.from} durationInFrames={SCENES.penance.duration}>
				<Sequence3 />
			</Sequence>
			<Sequence from={SCENES.anticipation.from} durationInFrames={SCENES.anticipation.duration}>
				<Sequence4 />
			</Sequence>
			<Sequence from={SCENES.sunrise.from} durationInFrames={SCENES.sunrise.duration}>
				<Sequence5 />
			</Sequence>
			<Sequence from={SCENES.blessing.from} durationInFrames={SCENES.blessing.duration}>
				<Sequence6 />
			</Sequence>
			<Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
				<Sequence7 />
			</Sequence>

			<Soundtrack />
		</AbsoluteFill>
	);
};
