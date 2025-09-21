import { useCallback, useEffect, useRef, useState } from "react"
import { blobToBase64, createMediaStream } from "@/utils/audio"

type StopMode = "normal" | "cancel" | null

type UseRecordVoiceOptions = {
  onTranscript: (text: string) => void
}

export const useRecordVoice = ({onTranscript}: UseRecordVoiceOptions) => {
    const [transcripting, setTranscripting] = useState(false)
    const [recording, setRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<BlobPart[]>([])
    const stopModeRef = useRef<StopMode>(null)

    const teardownStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    };

    const getText = async (base64data: string) => {
        try {
            setTranscripting(true)
            const res = await fetch("/api/mistral/transcript", {
                method: "PATCH",
                body: JSON.stringify({
                    base64: base64data
                })
            })

            const data = await res.json()
            onTranscript(data)
        } catch (error) {
            console.log(error)
        }finally {
            setTranscripting(false)
        }
    }

    const startRecording = useCallback(async () => {
        if (!streamRef.current) {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        const stream = streamRef.current;

        const mimeType =
            MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
                MediaRecorder.isTypeSupported("audio/ogg;codecs=opus") ? "audio/ogg;codecs=opus" :
                    undefined;
        const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

        mr.onstart = () => {
            createMediaStream(stream, true, () => { });
            chunksRef.current = [];
            setRecording(true);
        }

        mr.ondataavailable = (ev) => {
            if (ev.data && ev.data.size > 0) {
                chunksRef.current.push(ev.data)
            }
        }

        mr.onstop = () => {
            setRecording(false)

            if (stopModeRef.current === "normal") {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" })
                blobToBase64(blob, getText)
            }
            chunksRef.current = []

            teardownStream()
            mediaRecorderRef.current = null
            stopModeRef.current = null
        }

        mediaRecorderRef.current = mr
        mr.start()
    }, [])

    const stopRecording = useCallback(() => {
        const mr = mediaRecorderRef.current
        if (!mr) {
            return
        }
        if (mr.state !== "inactive") {
            stopModeRef.current = "normal"
            mr.stop()
        }
    }, [])

    const cancelRecording = useCallback(() => {
        const mr = mediaRecorderRef.current
        stopModeRef.current = "cancel"
        if (mr && mr.state !== "inactive") {
            mr.stop()
        } else {
            teardownStream()
            setRecording(false)
            stopModeRef.current = null
        }
    }, [])

    useEffect(() => {
        return () => {
            try {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "recording") {
                    mediaRecorderRef.current.stop()
                }
            } catch {
                teardownStream()
            }
        }
    }, [])

    return { recording, startRecording, stopRecording, cancelRecording, transcripting }
}