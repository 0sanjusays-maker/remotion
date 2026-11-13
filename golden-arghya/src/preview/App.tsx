import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Player, PlayerRef} from '@remotion/player';
import {GoldenArghya} from '../GoldenArghya';
import {DURATION_IN_FRAMES, FPS, HEIGHT, SCENE_LIST, WIDTH} from '../lib/timeline';
import '../fonts';
import './style.css';

const ART = [
	'art/01-path.jpg',
	'art/02-ghat-bokeh.jpg',
	'art/03-river-twilight.jpg',
	'art/04-sky.jpg',
	'art/05-sunrise.jpg',
	'art/06-water-gold.jpg',
	'art/07-mother.jpg',
	'art/fg-diya.jpg',
	'art/mg-basket-alpha.png',
	'art/fg-leaves-alpha.png',
	'art/mg-vrati-water-alpha.png',
	'art/mg-soop-alpha.png',
	'art/mg-climax-alpha.png',
	'art/mg-blessing-alpha.png',
	'art/grain.png',
];

const timecode = (frame: number) => {
	const total = frame / FPS;
	const m = Math.floor(total / 60);
	const s = Math.floor(total % 60);
	const f = Math.floor(frame % FPS);
	return `${m}:${String(s).padStart(2, '0')}.${String(f).padStart(2, '0')}`;
};

const useQuery = () => useMemo(() => new URLSearchParams(window.location.search), []);

export const App: React.FC = () => {
	const query = useQuery();
	const frameParam = query.get('frame');
	const isStill = frameParam !== null;
	const initialFrame = Math.max(0, Math.min(DURATION_IN_FRAMES - 1, Number(frameParam ?? 0) || 0));

	const playerRef = useRef<PlayerRef>(null);
	const [playing, setPlaying] = useState(!isStill);
	const [frame, setFrame] = useState(initialFrame);
	const [ready, setReady] = useState(false);
	const [muted, setMuted] = useState(false);

	// make sure every plate is decoded before we call the frame "ready"
	useEffect(() => {
		let cancelled = false;
		const loads = ART.map(
			(src) =>
				new Promise<void>((resolve) => {
					const img = new Image();
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = src;
				}),
		);
		Promise.all(loads).then(() => {
			if (cancelled) return;
			const afterPaint = () => requestAnimationFrame(() => setReady(true));
			if (document.fonts?.ready) {
				document.fonts.ready.then(afterPaint);
			} else {
				afterPaint();
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;
		const onFrame = (e: {detail: {frame: number}}) => setFrame(e.detail.frame);
		const onPlay = () => setPlaying(true);
		const onPause = () => setPlaying(false);
		player.addEventListener('frameupdate', onFrame);
		player.addEventListener('play', onPlay);
		player.addEventListener('pause', onPause);
		return () => {
			player.removeEventListener('frameupdate', onFrame);
			player.removeEventListener('play', onPlay);
			player.removeEventListener('pause', onPause);
		};
	}, []);

	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;
		if (muted) player.mute();
		else player.unmute();
	}, [muted]);

	const toggle = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;
		if (player.isPlaying()) player.pause();
		else player.play();
	}, []);

	useEffect(() => {
		if (isStill) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				toggle();
			}
			if (e.code === 'ArrowRight') playerRef.current?.seekTo(Math.min(DURATION_IN_FRAMES - 1, frame + 30));
			if (e.code === 'ArrowLeft') playerRef.current?.seekTo(Math.max(0, frame - 30));
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [frame, toggle, isStill]);

	useEffect(() => {
		if (isStill) return;
		// the browser may block audio until the first gesture; visuals start anyway
		const id = window.setTimeout(() => playerRef.current?.play(), 260);
		return () => window.clearTimeout(id);
	}, [isStill]);

	const activeScene = SCENE_LIST.findIndex(
		(s) => frame >= s.from && frame < s.from + s.duration,
	);

	const playerStyle: React.CSSProperties = {
		width: '100%',
		height: '100%',
	};

	if (isStill) {
		return (
			<div className="still" style={{opacity: ready ? 1 : 0}}>
				<Player
					ref={playerRef}
					component={GoldenArghya}
					durationInFrames={DURATION_IN_FRAMES}
					fps={FPS}
					compositionWidth={WIDTH}
					compositionHeight={HEIGHT}
					initialFrame={initialFrame}
					style={playerStyle}
					controls={false}
					acknowledgeRemotionLicense
					numberOfSharedAudioTags={24}
				/>
			</div>
		);
	}

	return (
		<div className="room">
			<header className="masthead">
				<div className="mark">
					<span className="mark-eyebrow">A Chhath Puja film · 72 seconds</span>
					<h1>
						The Golden <em>Arghya</em>
					</h1>
				</div>
				<div className="tagline">
					<span>2.5D parallax</span>
					<span>Golden hour</span>
					<span>Original score</span>
				</div>
			</header>

			<main className="stage">
				<div className={`screen ${ready ? 'is-ready' : ''}`}>
					<Player
						ref={playerRef}
						component={GoldenArghya}
						durationInFrames={DURATION_IN_FRAMES}
						fps={FPS}
						compositionWidth={WIDTH}
						compositionHeight={HEIGHT}
						style={playerStyle}
						controls={false}
						loop
						clickToPlay={false}
						doubleClickToFullscreen
						acknowledgeRemotionLicense
						numberOfSharedAudioTags={24}
					/>
					{!playing ? (
						<button className="veil" onClick={toggle} aria-label="Play">
							<span className="play">
								<svg viewBox="0 0 24 24" width="34" height="34">
									<path d="M8 5.5v13l11-6.5z" fill="currentColor" />
								</svg>
							</span>
							<span className="veil-label">Play the film</span>
						</button>
					) : null}
				</div>

				<div className="timeline">
					<div className="chapters">
						{SCENE_LIST.map((scene, i) => (
							<button
								key={scene.label}
								className={`chapter ${i === activeScene ? 'is-active' : ''}`}
								style={{flex: scene.duration}}
								onClick={() => {
									playerRef.current?.seekTo(scene.from);
									playerRef.current?.play();
								}}
								title={scene.label}
							>
								<span className="chapter-bar" />
								<span className="chapter-time">{scene.timecode}</span>
							</button>
						))}
					</div>
					<div className="transport">
						<button className="transport-btn" onClick={toggle}>
							{playing ? 'Pause' : 'Play'}
						</button>
						<span className="readout">{timecode(frame)}</span>
						<span className="now">{SCENE_LIST[activeScene]?.label ?? 'The Golden Arghya'}</span>
						<button className="transport-btn ghost" onClick={() => setMuted((m) => !m)}>
							{muted ? 'Sound off' : 'Sound on'}
						</button>
					</div>
				</div>
			</main>

			<footer className="credits">
				<span>Direction, art plates, compositing & score generated for this cut.</span>
				<span>रचना · छठ पूजा</span>
			</footer>
		</div>
	);
};
