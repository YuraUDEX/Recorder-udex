import React from 'react'
import { Typography } from '../Typography'
import styles from './headerStyles.module.sass'

export const Header = () => {
  return (
    <>
      <header className={styles.header__block}>
        <div className="container">
          <div className={styles.container__inner}>
            <Typography variant="h1" component="h1">
              Recording
            </Typography>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
