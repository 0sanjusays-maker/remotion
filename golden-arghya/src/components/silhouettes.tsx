import React from 'react';

type Props = {
	style?: React.CSSProperties;
	fill?: string;
	backlight?: string;
};

const backlightGradient = (id: string, color: string) => (
	<radialGradient id={id} cx="0.5" cy="0.3" r="0.72">
		<stop offset="0%" stopColor={color} stopOpacity="0.5" />
		<stop offset="100%" stopColor={color} stopOpacity="0" />
	</radialGradient>
);

/**
 * A woman standing waist deep, hands folded, sari pulled over her head.
 * Drawn in three quarter profile so the namaste and the drape both read
 * against the water even at a distance.
 */
export const PrayingWoman: React.FC<Props> = ({style, fill = '#03060b', backlight = '#9cc8f5'}) => (
	<svg viewBox="0 0 300 420" style={style} preserveAspectRatio="xMidYMax meet">
		<defs>{backlightGradient('pw', backlight)}</defs>
		<g fill={fill}>
			{/* the sari pulled back over the crown, falling behind her shoulder */}
			<path d="M108 128C86 172 76 226 72 282C86 290 100 282 104 266C108 218 118 168 130 138Z" />
			{/* head with the hair knotted at the nape, and a nose in profile */}
			<ellipse cx="152" cy="86" rx="27" ry="31" />
			<ellipse cx="126" cy="80" rx="13" ry="16" />
			<path d="M177 82C184 85 187 92 184 99C181 105 176 108 170 108L172 96Z" />
			<path d="M136 108C142 122 162 124 172 112L174 128L134 128Z" />
			{/* neck */}
			<path d="M138 112L170 112L174 142L134 142Z" />
			{/* shoulders and torso */}
			<path d="M150 132C186 132 208 148 216 174C222 200 224 232 222 262L94 262C92 232 94 200 102 174C110 148 124 132 150 132Z" />
			{/* the folded hands, pushed forward so they break the outline */}
			<path d="M196 176C216 184 228 200 230 214C232 228 222 238 208 236C194 234 184 222 182 208C179 192 184 182 196 176Z" />
			{/* her arm rising into the namaste */}
			<path d="M186 148C204 158 216 172 220 190L196 200C190 184 180 172 168 164Z" />
			{/* the drape of the sari falling over her right side */}
			<path d="M100 176C90 208 86 244 88 278C98 284 108 278 110 266C108 232 112 198 120 176Z" />
			{/* sari skirt, disappearing into the river */}
			<path d="M96 252C84 304 78 366 76 420L224 420C220 366 214 304 204 252C170 268 130 268 96 252Z" />
		</g>
		<ellipse cx="150" cy="110" rx="58" ry="54" fill="url(#pw)" opacity="0.45" />
	</svg>
);

/**
 * One person, three quarter profile, built from the same parts everywhere so
 * the family group and the blessing read as the same village.
 */
const Person: React.FC<{
	x: number;
	y: number;
	s: number;
	veil?: boolean;
	hands?: 'fold' | 'hanging';
	arms?: 'up' | 'down';
}> = ({x, y, s, veil = false, hands = 'fold', arms = 'down'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<ellipse cx="100" cy="66" rx="24" ry="28" />
		{/* hair knot */}
		<ellipse cx="84" cy="52" rx="10" ry="12" />
		<path d="M92 92L114 92L118 116L88 116Z" />
		<path d="M100 108C132 108 152 122 158 146C164 172 166 204 164 236L36 236C34 204 36 172 42 146C48 122 68 108 100 108Z" />
		{veil ? (
			<>
				<path d="M100 26C138 26 154 56 148 90C146 104 140 112 132 118C126 106 122 92 122 78C122 54 112 38 100 32Z" />
				<path d="M56 132C42 172 36 220 34 268C46 274 56 266 58 254C60 212 68 170 78 144Z" />
			</>
		) : null}
		{/* the pallu of the sari hanging down one side */}
		<path d="M46 150C38 184 34 226 36 268C46 274 56 268 58 256C56 220 60 184 66 158Z" />
		{arms === 'up' ? (
			<>
				<path d="M46 140C30 118 26 96 34 78L58 86C52 100 54 118 64 132Z" />
				<path d="M154 140C170 118 174 96 166 78L142 86C148 100 146 118 136 132Z" />
			</>
		) : null}
		{/* sari skirt with an irregular hem, never a perfect tube */}
		<path d="M40 228C32 286 28 358 26 430L178 430C174 358 168 286 160 228C132 244 68 244 40 228Z" />
		<path d="M62 250C56 300 54 366 54 430L74 430C72 366 72 302 78 254Z" opacity="0.55" />
		{hands === 'fold' ? (
			<path d="M140 158C160 166 170 182 172 196C174 210 164 220 150 218C136 216 128 204 126 190C124 174 130 164 140 158Z" />
		) : (
			<path d="M36 156C26 190 24 224 26 252L48 256C50 226 52 194 58 166Z" />
		)}
	</g>
);

/**
 * The soop: a bamboo offering tray lifted overhead, loaded with thekua,
 * coconuts, bananas and a diya, seen from below against the sky.
 */
export const SoopTray: React.FC<Props> = ({style, fill = '#04060a', backlight = '#ffb347'}) => (
	<svg viewBox="0 0 760 470" style={style} preserveAspectRatio="xMidYMax meet">
		<defs>{backlightGradient('st', backlight)}</defs>
		<g fill={fill}>
			{/* the offering, breaking the back rim of the tray */}
			<ellipse cx="272" cy="238" rx="46" ry="44" />
			<ellipse cx="492" cy="236" rx="46" ry="44" />
			<path d="M330 244C356 214 414 212 448 230C416 250 364 254 334 252Z" />
			<circle cx="360" cy="240" r="19" />
			<circle cx="416" cy="236" r="17" />
			<circle cx="218" cy="256" r="17" />
			<circle cx="548" cy="254" r="16" />
			{/* the tray, seen from underneath */}
			<g transform="rotate(-3 380 300)">
				<ellipse cx="380" cy="306" rx="250" ry="56" />
				<ellipse cx="380" cy="288" rx="250" ry="56" />
			</g>
			{/* forearms coming up from the bottom of frame */}
			<path d="M150 470C164 404 180 348 208 312C224 292 250 292 262 310C244 330 228 362 220 404C212 434 210 452 210 470Z" />
			<path d="M610 470C596 404 580 348 552 312C536 292 510 292 498 310C516 330 532 362 540 404C548 434 550 452 550 470Z" />
			{/* hands hooked over the rim at each side */}
			<path d="M196 288C212 274 236 276 246 292C254 306 246 322 228 324C208 326 194 314 192 300Z" />
			<path d="M564 288C548 274 524 276 514 292C506 306 514 322 532 324C552 326 566 314 568 300Z" />
		</g>
		<ellipse cx="380" cy="282" rx="230" ry="88" fill="url(#st)" opacity="0.26" />
	</svg>
);

/**
 * Everyone behind the vrati at the moment the sun clears the river.
 */
export const FamilyGroup: React.FC<Props> = ({style, fill = '#000', backlight = '#ffcf6b'}) => (
	<svg viewBox="0 0 1000 470" style={style} preserveAspectRatio="xMidYMax meet">
		<defs>{backlightGradient('fam', backlight)}</defs>
		<g fill={fill}>
			{/* the village, further back and smaller */}
			<Person x={10} y={128} s={0.62} veil hands="fold" />
			<Person x={860} y={110} s={0.7} veil hands="fold" />

			{/* a man with a shawl, hands together */}
			<Person x={176} y={64} s={0.86} hands="fold" />

			{/* the vrati in the centre, holding the soop up to the sun */}
			<g transform="translate(320 -30)">
				{/* the tray, clear of her head */}
				<ellipse cx="180" cy="104" rx="142" ry="32" />
				<ellipse cx="180" cy="88" rx="142" ry="32" />
				<ellipse cx="120" cy="62" rx="26" ry="24" />
				<ellipse cx="240" cy="60" rx="26" ry="24" />
				<circle cx="176" cy="56" r="11" />
				<circle cx="206" cy="54" r="10" />
				<path d="M146 70C160 54 194 52 210 62C194 72 164 76 148 74Z" />
				{/* raised arms, elbows out */}
				<path d="M120 236C94 198 86 156 100 128L130 138C118 162 122 196 140 222Z" />
				<path d="M240 236C266 198 274 156 260 128L230 138C242 162 238 196 220 222Z" />
				{/* hands under the tray */}
				<ellipse cx="118" cy="140" rx="17" ry="12" transform="rotate(-22 118 140)" />
				<ellipse cx="242" cy="140" rx="17" ry="12" transform="rotate(22 242 140)" />
				{/* her head, veil and body */}
				<ellipse cx="180" cy="198" rx="24" ry="28" />
				<ellipse cx="164" cy="190" rx="10" ry="12" />
				<path d="M180 158C214 158 232 182 228 220C226 236 220 246 212 252C206 240 202 228 202 216C202 194 194 178 180 170Z" />
				<path d="M172 224L192 224L196 252L168 252Z" />
				<path d="M180 242C214 242 236 258 242 284C248 314 250 352 248 400L112 400C110 352 112 314 118 284C124 258 146 242 180 242Z" />
				<path d="M124 268C116 306 112 356 114 400L134 400C130 356 132 306 138 274Z" opacity="0.55" />
				<path d="M112 392C104 428 100 452 98 470L262 470C258 452 254 428 246 392C214 404 144 404 112 392Z" />
			</g>

			{/* their child, slightly in front */}
			<Person x={600} y={236} s={0.52} hands="fold" />

			{/* a neighbouring woman, hands folded */}
			<Person x={716} y={82} s={0.8} veil hands="fold" />
		</g>
		<ellipse cx="500" cy="250" rx="380" ry="210" fill="url(#fam)" opacity="0.25" />
	</svg>
);

/**
 * The blessing: the vrati bends to hand thekua down, the child is already at
 * her feet with both hands on them.
 */
export const MotherAndChild: React.FC<Props> = ({style, fill = '#04060a', backlight = '#ffd070'}) => (
	<svg viewBox="0 0 760 500" style={style} preserveAspectRatio="xMidYMax meet">
		<defs>{backlightGradient('mc', backlight)}</defs>
		<g fill={fill}>
			{/* the mother, leaning forward over the child */}
			<g transform="translate(296 14)">
				<ellipse cx="196" cy="60" rx="26" ry="30" />
				{/* veil */}
				<path d="M196 14C232 14 248 44 242 80C240 94 234 102 226 108C220 96 216 82 216 68C216 44 206 30 196 20Z" />
				<path d="M152 118C138 158 132 206 130 254C142 260 152 252 154 240C156 198 164 156 174 130Z" />
				{/* neck and shoulders, tipped forward */}
				<path d="M186 84L208 84L212 112L182 112Z" />
				<path d="M196 104C230 104 252 118 258 142C264 166 266 196 264 226L128 226C126 196 128 166 134 142C140 118 162 104 196 104Z" />
				{/* the arm reaching down with the prasad */}
				<path d="M148 132C118 156 98 186 86 218C80 234 92 246 106 240C126 230 148 204 164 174C174 152 172 138 162 130Z" />
				<ellipse cx="84" cy="236" rx="18" ry="10" transform="rotate(24 84 236)" />
				{/* sari skirt */}
				<path d="M130 216C118 272 112 340 110 400L282 400C278 340 272 272 262 216C226 232 164 232 130 216Z" />
				{/* the drape falling off her shoulder */}
				<path d="M132 148C122 186 118 230 120 268C130 274 140 268 142 256C140 220 144 184 152 156Z" />
			</g>
			{/* the child at her feet */}
			<g transform="translate(178 206)">
				<ellipse cx="128" cy="58" rx="23" ry="25" />
				<ellipse cx="110" cy="48" rx="10" ry="12" />
				<path d="M116 78L138 78L142 100L112 100Z" />
				<path d="M128 92C158 92 176 106 180 130C184 152 184 176 182 196L88 196C86 176 86 152 90 130C94 106 100 92 128 92Z" />
				{/* both arms up to her feet */}
				<path d="M160 116C186 132 206 152 218 176C224 190 214 202 200 196C180 186 160 166 148 144Z" />
				<ellipse cx="214" cy="182" rx="17" ry="10" transform="rotate(-14 214 182)" />
				{/* folded legs */}
				<path d="M92 190C70 210 60 232 62 254L74 268L196 268C202 250 198 222 182 198C156 212 118 208 92 190Z" />
			</g>
		</g>
		<ellipse cx="420" cy="150" rx="200" ry="160" fill="url(#mc)" opacity="0.4" />
	</svg>
);
