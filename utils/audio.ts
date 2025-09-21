export const blobToBase64 = (blob: Blob, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result

        if (typeof result === "string") {
            const comma = result.indexOf(",");
            callback(comma >= 0 ? result.slice(comma + 1) : result);
        } else {
            throw new Error("Unexpected FileReader.result type (ArrayBuffer)")
        }
    };
    reader.readAsDataURL(blob);
};

const getPeakLevel = (analyzer: AnalyserNode) => {
    const array = new Uint8Array(analyzer.fftSize);

    analyzer.getByteTimeDomainData(array);

    return (
        array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMediaStream = (stream: MediaStream, isRecording: boolean, callback: any) => {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyzer = context.createAnalyser();

    source.connect(analyzer);

    const tick = () => {
        const peak = getPeakLevel(analyzer)

        if (isRecording) {
            callback(peak)

            requestAnimationFrame(tick)
        }
    }

    tick()
}