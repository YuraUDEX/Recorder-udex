'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import styles from './recorderStyles.module.sass'
import clsx from 'clsx'

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export const Recorder = () => {
  const [recording, setRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [isTranscriptionVisible, setTranscriptionVisibility] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      })

      mediaRecorder.addEventListener('stop', () => {
        setRecording(false)
        stopAudioStream()
        saveRecording()
      })

      // Додайте ініціалізацію розпізнавання мови
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.onresult = handleSpeechRecognitionResult

      recognitionRef.current.start() // Початок розпізнавання мови

      setRecording(true)
      setTranscriptionVisibility(true)
      startTimer()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleSpeechRecognitionResult = (event: any) => {
    const transcript = event.results[event.results.length - 1][0].transcript
    setTranscription(transcript)
  }

  const stopAudioStream = () => {
    const audioStream = audioStreamRef.current
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop())
    }
  }

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    const intervalId = intervalRef.current

    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop()

      if (intervalId) {
        clearInterval(intervalId)
      }

      intervalRef.current = null

      // Зупиніть розпізнавання мови
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      setTranscriptionVisibility(false)
      setTranscription('')
    }
  }

  const saveRecording = () => {
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const audioUrl = URL.createObjectURL(audioBlob)

    const storedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]')
    storedRecordings.push(audioUrl)
    localStorage.setItem('recordings', JSON.stringify(storedRecordings))

    // Очищення chunks
    chunksRef.current = []
  }

  const startTimer = () => {
    // Стартуємо таймер кожні 60 секунд для збереження аудіо
    intervalRef.current = setInterval(() => {
      saveRecording()
    }, 60000)
  }

  useEffect(() => {
    return () => {
      // Очищення таймеру при розмонтовуванні компонента
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.recorder__block}>
      <div className={styles.recorder__inner}>
        <div className={styles.inner__transcription__block}>
          {isTranscriptionVisible && transcription && (
            <div>
              <p>{transcription}</p>
            </div>
          )}
        </div>

        <div className={styles.inner__buttons__actions}>
          <button
            className={clsx(styles.btn, recording ? styles.btn__pause : '')}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? 'Stop Recorder' : 'Start Recorder'}
            <span>{recording ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</span>
          </button>
          <button className={styles.btn}>Select Script</button>
        </div>
      </div>
    </div>
  )
}

export default Recorder
