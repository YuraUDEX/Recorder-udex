'use client'
import React from 'react'
import styles from './footerStyles.module.sass'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faList, faGear } from '@fortawesome/free-solid-svg-icons'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export const Footer = () => {
  const pathname = usePathname()

  return (
    <>
      <footer className={styles.footer__block}>
        <div className="container">
          <div className={styles.container__inner}>
            <ul className={styles.footer__links__list}>
              <Link className={clsx(styles.list__item, pathname === '/' ? styles.list__item__active : '')} href="/">
                <li>
                  <FontAwesomeIcon icon={faMicrophone} />
                </li>
              </Link>
              <Link className={styles.list__item} href="/">
                <li>
                  <FontAwesomeIcon icon={faList} />
                </li>
              </Link>
              <Link className={styles.list__item} href="/">
                <li>
                  <FontAwesomeIcon icon={faGear} />
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
