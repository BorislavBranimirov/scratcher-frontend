import { Check, CheckCircle, Circle } from 'react-feather';

export const ThemeAccentPickerBtn = ({
  condition,
  bgColor,
  handleClick,
}: {
  condition: boolean;
  bgColor: string;
  handleClick: () => void;
}) => {
  return (
    <button
      className={`relative w-11 h-11 rounded-full ${bgColor}`}
      data-cy="theme-accent-btn"
      onClick={handleClick}
    >
      {condition && (
        <Check className="absolute inset-0 m-auto text-accent-inverted w-7 h-7" />
      )}
    </button>
  );
};

export const ThemeBackgroundPickerBtn = ({
  text,
  condition,
  bgColor,
  bgHoverColor,
  textColor,
  handleClick,
}: {
  text: string;
  condition: boolean;
  bgColor: string;
  bgHoverColor: string;
  textColor: string;
  handleClick: () => void;
}) => {
  return (
    <button
      className={`${bgColor} hover:${bgHoverColor} ${textColor} font-bold py-4 flex-1 rounded-md w-full border border-primary${
        condition ? ' outline outline-accent' : ''
      }`}
      data-cy="theme-background-btn"
      onClick={handleClick}
    >
      <div className="px-4 flex items-center">
        {condition ? (
          <CheckCircle className="text-accent w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
        <div className="mx-auto">{text}</div>
      </div>
    </button>
  );
};
