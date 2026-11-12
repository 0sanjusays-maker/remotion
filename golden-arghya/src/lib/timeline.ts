export const FPS = 30;
export const DURATION_IN_FRAMES = 2160; // 72 seconds
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const SCENES = {
	descent: {from: 0, duration: 360, label: 'The Descent into Devotion', timecode: '0:00'},
	sindoor: {from: 360, duration: 360, label: 'The Sindoor of Faith', timecode: '0:12'},
	penance: {from: 720, duration: 360, label: 'The Cold Penance', timecode: '0:24'},
	anticipation: {from: 1080, duration: 360, label: 'Anticipation of the Sun', timecode: '0:36'},
	sunrise: {from: 1440, duration: 360, label: 'The Epic Sunrise', timecode: '0:48'},
	blessing: {from: 1800, duration: 240, label: 'The Blessing & Return', timecode: '1:00'},
	outro: {from: 2040, duration: 120, label: 'Outro Typography', timecode: '1:08'},
} as const;

export const SCENE_LIST = [
	SCENES.descent,
	SCENES.sindoor,
	SCENES.penance,
	SCENES.anticipation,
	SCENES.sunrise,
	SCENES.blessing,
	SCENES.outro,
];
