export default function msToTime(duration: number) {
	const seconds = Math.floor((duration / 1000) % 60);
	const minutes = Math.floor((duration / (1000 * 60)) % 60);
	const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	const paddedMinutes = minutes === 0 ? '00' : minutes;
	const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

	return `${hours > 0 ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
}
