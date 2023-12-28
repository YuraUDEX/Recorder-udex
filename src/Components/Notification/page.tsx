import React from 'react'
import styles from './notificationStyles.module.sass'

export const Notification = () => {
  return (
    <>
      <div className={styles.notification__block}>
        <button className={styles.notification__btn}>Notification</button>
      </div>
    </>
  )
}

export default Notification
