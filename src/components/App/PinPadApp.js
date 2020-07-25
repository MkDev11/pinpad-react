import React, { useState, useEffect, useRef } from 'react'

// Styles
import styles from './PinPadApp.module.sass'

// Components
import HoneyCombIcon from '../Icons/HoneycombIcon'
import PinPadButton from '../Button/PinPadButton'

const PinPadApp = () => {
  const correctPin = '4747' /* Hardcoded pin. To be fetched from an API */
  const pinNumbers = [...Array(10).keys()].reverse() /* Generate pin pad numbers */
  const placeholder = 'Enter pin' /* Pin pad display placeholder text */
  const maxAttempts = 2 /* Max number of incorrect attempts */
  const resetTime = 1200 /* Reset time when pin pad status is ok or error */
  const lockedTime = 30000 /* Reset time when pin pad status is locked */

  const [pin, setPin] = useState('')
  const [status, setStatus] = useState()
  const [disabled, setDisabled] = useState(false)
  const attempts = useRef(0)

  const handlePin = (number) => {
    if (pin.length < correctPin.length) {
      setPin(pin + number)
    }
  }

  const handleSetAttempts = (attempt) => {
    attempts.current = attempt
  }

  const handleReset = async (time) => {
    await setTimeout(() => {
      setPin('')
      setStatus()
      setDisabled(false)
    }, time)
  }

  // Set screen text as pin if entered. Otherwise display the placeholder
  const displayText = pin.length > 0
    ? pin.split('').map((number, index, array) => (index + 1) === pin.length ? number : '*').join('')
    : placeholder

  useEffect(() => {
    // Update status once all pin numbers have been entered
    if (pin.length === correctPin.length) {
      const { current: currentAttempts } = attempts
      let currentStatus, attemptsToUpdate,
        timeOut = resetTime

      if (pin === correctPin) {
        currentStatus = 'ok'
        attemptsToUpdate = 0

      } else if (maxAttempts === currentAttempts) {
        currentStatus = 'locked'
        attemptsToUpdate = 0
        timeOut = lockedTime

      } else {
        currentStatus = 'error'
        attemptsToUpdate = currentAttempts + 1
      }

      handleSetAttempts(attemptsToUpdate)
      setStatus(currentStatus)
      setDisabled(true)
      handleReset(timeOut)
    }

  }, [pin])

  return (
    <div className={styles.pinPadApp__wrapper}>
      <HoneyCombIcon className={status} />
      <div className={styles.pinPadApp}>
        <div className={styles.pinPadApp__display}>
          <span data-testid="displayText" className={styles.pinPadApp__display__text}>
            {status || displayText}
          </span>
        </div>
        <div className={styles.pinPadApp__btnGroup}>
          {pinNumbers.map(pinNumber => (
            <PinPadButton
              key={pinNumber}
              value={pinNumber.toString()}
              disabled={disabled}
              action={() => handlePin(pinNumber)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PinPadApp