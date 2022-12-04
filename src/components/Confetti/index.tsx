import { useWindowSize } from 'hooks/useWindowsSize';
import ReactConfetti from 'react-confetti'

// eslint-disable-next-line react/prop-types
export default function Confetti({ start, variant }: { start: boolean; variant?: string }) {
    const { width, height } = useWindowSize()

    const _variant = variant ? variant : height && width && height > 1.5 * width ? 'bottom' : variant

    return start && width && height ? (
        <ReactConfetti
            style={{ zIndex: 1401 }}
            numberOfPieces={400}
            recycle={false}
            run={true}
            width={width}
            height={height}
            confettiSource={{
                h: height,
                w: width,
                x: 0,
                y: _variant === 'top' ? height * 0.25 : _variant === 'bottom' ? height * 0.75 : height * 0.5,
            }}
            initialVelocityX={7}
            initialVelocityY={25}
            gravity={0.25}
            tweenDuration={1000}
            wind={0.05}
        />
    ) : null
}