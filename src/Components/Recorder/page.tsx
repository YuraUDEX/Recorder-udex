'use client'
import { useState, useRef } from 'react'

const Recorder = () => {
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start(60000)

      mediaRecorder.addEventListener('dataavailable', (event) => {
        const audioData = event.data

        // Зберегти аудіо в Local Storage
        const audioBlob = new Blob([audioData], { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)

        // Зберегти URL в Local Storage
        const storedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]')
        storedRecordings.push(audioUrl)
        localStorage.setItem('recordings', JSON.stringify(storedRecordings))
      })

      mediaRecorder.addEventListener('stop', () => {
        setRecording(false)
        setPaused(false)
        stopAudioStream()
      })

      setRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopAudioStream = () => {
    const audioStream = audioStreamRef.current
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop())
    }
  }

  const pauseRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setPaused(true)
    }
  }

  const resumeRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setPaused(false)
    }
  }

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop()
    }
  }

  return (
    <div>
      <p>Audio Recorder</p>
      <button onClick={recording ? (paused ? resumeRecording : pauseRecording) : startRecording}>
        {recording ? (paused ? 'Resume Recording' : 'Pause Recording') : 'Start Recording'}
      </button>
      {recording && <button onClick={stopRecording}>Stop Recording</button>}
    </div>
  )
}

export default Recorder
