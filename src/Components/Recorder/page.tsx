'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import Lottie from 'lottie-react'
import LottieJson from '../../../public/visual/animVisual.json'
import styles from './recorderStyles.module.sass'
import clsx from 'clsx'
import ScriptsMenu from '../ScriptsMenu/page'

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export const Recorder = () => {
  const [openScriptsMenu, setOpenScriptsMenu] = useState(false)
  const [choosedScript, setChoosedScript] = useState(1)
  const [recording, setRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [isTranscriptionVisible, setTranscriptionVisibility] = useState(false)
  const [isSpeechRecognitionActive, setSpeechRecognitionActive] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

  const handleOpenScriptsMenu = () => {
    setOpenScriptsMenu(true)
    document.body.style.overflow = 'hidden'
  }

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

      // ініціалізація розпізнавання мови
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.onresult = handleSpeechRecognitionResult

      recognitionRef.current.start() // Початок розпізнавання мови

      setRecording(true)
      setTranscription('')
      setTranscriptionVisibility(true)
      setSpeechRecognitionActive(true)
      startTimer()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  useEffect(() => {
    if (isSpeechRecognitionActive) {
      // Встановлення обробника подій для розпізнавання мови тут
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        setTranscription(transcript)
      }
    }
  }, [isSpeechRecognitionActive])

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
    <>
      {/* меню скриптів */}
      <ScriptsMenu
        openScriptsMenu={openScriptsMenu}
        setOpenScriptsMenu={setOpenScriptsMenu}
        choosedScript={choosedScript}
        setChoosedScript={setChoosedScript}
      />
      <div className={styles.recorder__block}>
        <div className={styles.recorder__inner}>
          <p style={{ paddingTop: '30px', textAlign: 'center' }}>Selected Script {choosedScript}</p>

          {/* Транскрипція */}
          <div className={styles.inner__transcription__block}>
            {!isTranscriptionVisible ? <h3 style={{ textAlign: 'center' }}>Click on "Start recorder"</h3> : ''}
            {isTranscriptionVisible && (
              <div className={styles.transcription__inner}>
                {transcription ? <p>{transcription}</p> : <p style={{ color: '#777' }}>Say something...</p>}

                {isSpeechRecognitionActive && <Lottie className={styles.lottie__anim} animationData={LottieJson} />}
              </div>
            )}
          </div>

          {/* Кнопки рекордера */}
          <div className={styles.inner__buttons__actions}>
            <button
              className={clsx(styles.btn, recording ? styles.btn__pause : '')}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? 'Stop Recorder' : 'Start Recorder'}
              <span>{recording ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</span>
            </button>
            <button onClick={handleOpenScriptsMenu} className={styles.btn}>
              Select Script
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Recorder
