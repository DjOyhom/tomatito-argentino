import { useEffect, useState } from 'react'
import { itinerary } from './data/itinerary.js'

const UNLOCK_AT = new Date('2026-08-01T06:00:00-03:00')
const PROGRESS_STORAGE_KEY = 'tomatito-argentino:current-step'
const SELECTED_PLACES_STORAGE_KEY = 'tomatito-argentino:selected-places'
const WELCOME_BYPASS_PARAM = 'preview'

function hasWelcomeBypass() {
  return new URLSearchParams(window.location.search).get(WELCOME_BYPASS_PARAM) === '1'
}

function readSavedStep() {
  try {
    const savedStep = Number.parseInt(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '0', 10)
    return Number.isInteger(savedStep) && savedStep >= 0 && savedStep <= itinerary.length ? savedStep : 0
  } catch {
    return 0
  }
}

function readSavedPlaces() {
  try {
    const savedPlaces = JSON.parse(localStorage.getItem(SELECTED_PLACES_STORAGE_KEY) ?? '{}')
    if (!savedPlaces || typeof savedPlaces !== 'object' || Array.isArray(savedPlaces)) return {}

    return Object.fromEntries(
      itinerary.flatMap((step) => {
        if (!step.suggestions || !Array.isArray(savedPlaces[step.id])) return []
        const validNames = new Set(step.suggestions.map((place) => place.name))
        const selectedNames = savedPlaces[step.id].filter((name) => validNames.has(name))
        return selectedNames.length > 0 ? [[step.id, [...new Set(selectedNames)]]] : []
      }),
    )
  } catch {
    return {}
  }
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14 0m-6-6 6 6-6 6" /></svg>
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 20h14" /></svg>
}

function PlaceSuggestions({ step, selectedPlaceNames, onTogglePlace }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedPlace = step.suggestions[selectedIndex]
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}`

  return (
    <section className="suggestions" aria-labelledby={`${step.id}-suggestions`}>
      <div className="suggestions-heading">
        <p id={`${step.id}-suggestions`}>{step.category ?? 'Opciones para elegir'}</p>
        <span>{step.suggestions.length} lugares</span>
      </div>
      <div className="suggestion-list" aria-label="Elegí un lugar para ver en el mapa">
        {step.suggestions.map((place, index) => (
          <button
            className={selectedPlaceNames.includes(place.name) ? 'is-selected' : ''}
            key={place.name}
            type="button"
            aria-pressed={selectedPlaceNames.includes(place.name)}
            onClick={() => {
              setSelectedIndex(index)
              onTogglePlace(step.id, place.name)
            }}
          >
            <span className="suggestion-copy">
              <span>{place.name}</span>
              {place.note && <small>{place.note}</small>}
            </span>
            <span className="suggestion-check" aria-hidden="true">✓</span>
          </button>
        ))}
      </div>
      <div className="place-map">
        <iframe
          src={selectedPlace.embedUrl}
          title={`Mapa de ${selectedPlace.name}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="place-map-footer">
          <div>
            <span>Ahora viendo</span>
            <strong>{selectedPlace.name}</strong>
          </div>
          <a href={mapUrl} target="_blank" rel="noreferrer" aria-label={`Abrir ${selectedPlace.name} en Google Maps (se abre en una pestaña nueva)`}>
            Abrir en Maps <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function StepDescription({ text }) {
  return (
    <p className="step-description">
      {text.split('\n').map((line, index) => (
        <span key={`${line}-${index}`}>{line}</span>
      ))}
    </p>
  )
}

function CompletionButton({ step, index, onComplete }) {
  return (
    <button className="step-button" type="button" onClick={() => onComplete(index)}>
      {step.action}<ArrowIcon />
    </button>
  )
}

function AttachmentDownload({ attachment }) {
  const fileUrl = `${import.meta.env.BASE_URL}${attachment.file}`

  return (
    <a className="attachment-button" href={fileUrl} download={attachment.file}>
      <DownloadIcon />
      {attachment.label}
    </a>
  )
}

function LockedMessage() {
  return (
    <span className="locked-label" aria-label="Paso bloqueado">
      ♡ Completá el paso anterior para descubrirlo
    </span>
  )
}

function CompletedMessage() {
  return <span className="complete-label">✓ Paso completado</span>
}

function StepCard({ step, index, currentStep, onComplete, selectedPlaceNames, onTogglePlace }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const status = index < currentStep ? 'is-complete' : index === currentStep ? 'is-active' : 'is-locked'
  const isActive = index === currentStep
  const isComplete = index < currentStep
  const showContent = isActive || (isComplete && isExpanded)

  return (
    <article className={`step-card ${status}`} data-step={index}>
      <div className="timeline-rail" aria-hidden="true">
        <span className="step-dot">{isComplete ? '✓' : String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="step-content">
        <div className="step-meta"><span>{step.eyebrow}</span><span>Paso {index + 1}</span></div>
        <div className="step-heading"><span className="step-icon" aria-hidden="true">{step.icon}</span><h3>{step.title}</h3></div>
        {showContent && <StepDescription text={step.description} />}
        {index > currentStep && <p className="step-description locked-copy">Todavía es sorpresa.</p>}
        {showContent && step.suggestions && (
          <PlaceSuggestions step={step} selectedPlaceNames={selectedPlaceNames} onTogglePlace={onTogglePlace} />
        )}
        {showContent && (
          <div className="step-actions">
            {step.attachment && <AttachmentDownload attachment={step.attachment} />}
            {isActive && <CompletionButton step={step} index={index} onComplete={onComplete} />}
          </div>
        )}
        {isComplete && (
          <button
            className="completed-toggle"
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <CompletedMessage />
            <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
            <span className="sr-only">{isExpanded ? 'Ocultar contenido del paso' : 'Mostrar contenido del paso'}</span>
          </button>
        )}
        {index > currentStep && <LockedMessage />}
      </div>
    </article>
  )
}

function WelcomeScreen() {
  return (
    <main className="welcome-shell">
      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome-mark" aria-hidden="true">♡</div>
        <p className="eyebrow"><span aria-hidden="true">✦</span> Una sorpresa para vos</p>
        <h1 id="welcome-title">Todavía no,<br /><em>croachan.</em></h1>
        <p className="welcome-copy">Guardate la intriga. Nos encontramos acá cuando llegue el momento.</p>
        <div className="unlock-date" aria-label="Se habilita el sábado 1 de agosto de 2026 a las 6 de la mañana">
          <span>Sábado 1.º de agosto</span>
          <strong>06:00</strong>
          <small>Hora de Uruguay</small>
        </div>
      </section>
    </main>
  )
}

function JourneyEnding({ onRestart }) {
  return (
    <section className="ending" aria-live="polite">
      <span aria-hidden="true">♥</span>
      <p className="section-label">Aventura completa</p>
      <h2>Qué lindo compartir<br /><em>el camino con vos.</em></h2>
      <p>Ahora sí: a descansar y a guardar esta aventura con croachan entre nuestros recuerdos.</p>
      <button type="button" onClick={onRestart}>Volver a empezar</button>
    </section>
  )
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => hasWelcomeBypass() || Date.now() >= UNLOCK_AT.getTime())
  const [currentStep, setCurrentStep] = useState(readSavedStep)
  const [selectedPlaces, setSelectedPlaces] = useState(readSavedPlaces)
  const [started, setStarted] = useState(() => currentStep > 0)
  const finished = currentStep === itinerary.length
  const visibleStep = Math.min(currentStep + 1, itinerary.length)

  useEffect(() => {
    if (isUnlocked) return undefined

    let timer
    const checkUnlock = () => {
      const remainingTime = UNLOCK_AT.getTime() - Date.now()
      if (remainingTime <= 0) {
        setIsUnlocked(true)
        return
      }

      timer = window.setTimeout(checkUnlock, Math.min(remainingTime, 30_000))
    }
    checkUnlock()

    return () => window.clearTimeout(timer)
  }, [isUnlocked])

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, String(currentStep))
    } catch {
      // La experiencia sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }, [currentStep])

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_PLACES_STORAGE_KEY, JSON.stringify(selectedPlaces))
    } catch {
      // Las selecciones siguen funcionando en memoria si el almacenamiento no está disponible.
    }
  }, [selectedPlaces])

  const togglePlace = (stepId, placeName) => {
    setSelectedPlaces((savedPlaces) => {
      const stepPlaces = savedPlaces[stepId] ?? []
      const nextStepPlaces = stepPlaces.includes(placeName)
        ? stepPlaces.filter((name) => name !== placeName)
        : [...stepPlaces, placeName]

      if (nextStepPlaces.length === 0) {
        const nextSavedPlaces = { ...savedPlaces }
        delete nextSavedPlaces[stepId]
        return nextSavedPlaces
      }

      return { ...savedPlaces, [stepId]: nextStepPlaces }
    })
  }

  const begin = () => {
    setStarted(true)
    requestAnimationFrame(() => document.querySelector('#recorrido')?.scrollIntoView({ behavior: 'smooth' }))
  }

  const completeStep = (index) => {
    if (index !== currentStep) return
    const nextStep = index + 1
    setCurrentStep(nextStep)
    requestAnimationFrame(() => {
      const nextCard = document.querySelector(`[data-step="${nextStep}"]`)
      nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const restart = () => {
    setCurrentStep(0)
    document.querySelector('#recorrido')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!isUnlocked) return <WelcomeScreen />

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow"><span aria-hidden="true">✦</span> Argentina nos espera</p>
        <div className="hero-mark" aria-hidden="true">TA</div>
        <p className="kicker">Una aventura con croachan</p>
        <h1 id="page-title"><span aria-hidden="true">⛴️</span> Hoy tenemos<br /><em>viajecito en barcoo <span aria-hidden="true">🇦🇷</span></em></h1>
        <p className="intro">De Colonia a Buenos Aires: comida rica, moda vegana y un día para descubrir juntos, paso a paso.</p>
        <button className="primary-button" type="button" onClick={begin}>
          {started ? 'Ver el recorrido' : 'Empezar la aventura'} <ArrowIcon />
        </button>
        <p className="hero-note">{itinerary.length} pasos · Un día juntos · Tráfico intenso</p>
      </section>

      <section className="journey" id="recorrido" aria-labelledby="journey-title">
        <header className="journey-header">
          <div>
            <p className="section-label">El plan de hoy</p>
            <h2 id="journey-title">Nuestro recorrido</h2>
          </div>
          <span className="progress-pill">{finished ? 'Completo' : `${visibleStep} de ${itinerary.length}`}</span>
        </header>

        <div className="progress-track" aria-label={`${currentStep} de ${itinerary.length} pasos completados`}>
          <span style={{ width: `${(currentStep / itinerary.length) * 100}%` }} />
        </div>

        <div className="timeline">
          {itinerary.map((step, index) => (
            <StepCard
              step={step}
              index={index}
              currentStep={currentStep}
              onComplete={completeStep}
              selectedPlaceNames={selectedPlaces[step.id] ?? []}
              onTogglePlace={togglePlace}
              key={step.id}
            />
          ))}
        </div>

        {finished && <JourneyEnding onRestart={restart} />}
      </section>
    </main>
  )
}
