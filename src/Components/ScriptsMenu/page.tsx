import clsx from 'clsx'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

import styles from './scriptsMenuStyles.module.sass'
import { OptionsScripts, OptionsScriptsProps } from '@/localdata/optionsScripts'

type ScriptsMenuProps = {
  openScriptsMenu: boolean
  setOpenScriptsMenu: (isOpenBurgerMenu: boolean) => void
  choosedScript: number
  setChoosedScript: (choosedScriptChoose: number) => void
}

export const ScriptsMenu = ({
  openScriptsMenu,
  setOpenScriptsMenu,
  choosedScript,
  setChoosedScript,
}: ScriptsMenuProps) => {
  const handleCloseScriptsMenu = () => {
    setOpenScriptsMenu(false)
    document.body.style.overflow = 'auto'
  }

  const handelChoosingScript = (numberOption: number) => {
    setChoosedScript(numberOption)
    console.log(numberOption)
  }

  return (
    <>
      {/* Задній план ===============*/}
      <div
        className={clsx(styles.scripts__holder, openScriptsMenu ? styles.show__scripts : '')}
        onClick={handleCloseScriptsMenu}
      ></div>
      {/* Задній план ===============*/}
      {/* Контентна частина ================== */}
      <div className={clsx(styles.scripts__window, openScriptsMenu ? styles.scripts__window__show : '')}>
        <div className={styles.scripts__menu__header}>
          {/* header */}
          <h3>Select a Script</h3>
        </div>

        <ul className={styles.scripts__menu__list}>
          {OptionsScripts.map(({ ...script }: OptionsScriptsProps) => (
            <li
              onClick={() => handelChoosingScript(script.numberOption)}
              key={script.id}
              className={clsx(
                styles.list__item,
                script.numberOption === choosedScript ? styles.list__item__active : '',
              )}
            >
              <span>
                <FontAwesomeIcon icon={faCircleArrowRight} />
              </span>
              <p>{script.script}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Контентна частина ================== */}
    </>
  )
}

export default ScriptsMenu
