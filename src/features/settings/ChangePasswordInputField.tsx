import { ChangeEvent } from 'react';
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
  return (
    <div className="relative">
      <input
        className={`peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
          passwordError ? 'outline-red' : 'focus:outline-blue'
        }`}
        type="password"
        name={name}
        id={name}
        pattern={passwordPattern}
        title={passwordPatternTitle}
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
        required
      />
      <label
        className={`absolute left-0 top-0 px-2 pt-1 text-sm text-secondary transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
          passwordError ? 'text-red' : 'peer-focus:text-blue'
        }`}
        htmlFor={name}
      >
        {placeholder}
      </label>
      {!!passwordError && (
        <span className="text-red text-sm">{passwordError}</span>
      )}
    </div>
  );
};

export default ChangePasswordInputField;
