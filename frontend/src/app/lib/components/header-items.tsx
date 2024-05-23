import {ReactNode} from 'react';

interface HeaderBtnInterface {
  icon: ReactNode,
  label: string,
  btnClasses:  string,
  clickHandler?: () => void
}

interface HeaderIconWithText {
  icon: ReactNode,
  label: string
}

export const HeaderButton:React.FC<HeaderBtnInterface> = ({ icon, label, btnClasses, clickHandler }) => {
  return (
    <span className="sm:ml-3">
      <button type="button" className={btnClasses} onClick={clickHandler}>
        {icon}
      {label}
      </button>
  </span>
)
}

export const HeaderIconWithText: React.FC<HeaderIconWithText> = ({ icon, label}) => {
  return (
    <div className="mt-2 flex items-center text-sm text-gray-500">
      { icon }
      { label }
    </div>
  )
}