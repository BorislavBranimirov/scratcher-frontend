import { ChangeEvent, useId } from 'react';
import { passwordPattern, passwordPatternTitle } from '../../common/regexUtils';

const ChangePasswordInputField = ({
  name,
  placeholder,
  password,
  passwordError,
  handleChange,
}: {
  name: string;
  placeholder: string;
  password: string;
  passwordError: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const id = useId();

  return (
    <div className="relative">
      <input
        className={`peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
          passwordError ? 'outline-error' : 'focus:outline-accent'
        }`}
        type="password"
        name={name}
        id={id}
        pattern={passwordPattern}
        title={passwordPatternTitle}
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
        required
      />
      <label
        className={`absolute left-0 top-0 px-2 pt-1 text-sm text-muted transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
          passwordError ? 'text-error' : 'peer-focus:text-accent'
        }`}
        htmlFor={id}
      >
        {placeholder}
      </label>
      {!!passwordError && (
        <span className="text-sm text-error">{passwordError}</span>
      )}
    </div>
  );
};

export default ChangePasswordInputField;
