import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ThemeAccentPickerBtn,
  ThemeBackgroundPickerBtn,
} from './ThemePickerComponents';
import {
  selectThemeAccent,
  selectThemeBackground,
  setAccentTheme,
  setBackgroundTheme,
} from './themeSlice';

const ThemePickerPage = () => {
  const dispatch = useAppDispatch();
  const themeAccent = useAppSelector(selectThemeAccent);
  const themeBackground = useAppSelector(selectThemeBackground);

  return (
    <div className="flex flex-col">
      <div className="w-[90%] mx-auto my-6 text-center">
        <h2 className="text-lg font-bold">Theme Picker</h2>
        <p className="break-words whitespace-pre-wrap text-sm text-muted mt-2">
          Manage the colour and background of Scratcher on this device.
        </p>
      </div>
      <div className="w-[90%] mx-auto mb-6">
        <h2 className="text-lg font-bold">Colour</h2>
        <div className="mt-3 mb-1 grid grid-cols-3 sm:grid-cols-6 justify-between justify-items-center gap-y-4">
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-blue'}
            bgColor="bg-[rgb(29,155,240)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-blue'));
            }}
          />
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-yellow'}
            bgColor="bg-[rgb(255,212,0)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-yellow'));
            }}
          />
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-rose'}
            bgColor="bg-[rgb(249,24,128)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-rose'));
            }}
          />
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-purple'}
            bgColor="bg-[rgb(120,86,255)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-purple'));
            }}
          />
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-orange'}
            bgColor="bg-[rgb(255,122,0)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-orange'));
            }}
          />
          <ThemeAccentPickerBtn
            condition={themeAccent === 'theme-accent-green'}
            bgColor="bg-[rgb(0,186,124)]"
            handleClick={() => {
              dispatch(setAccentTheme('theme-accent-green'));
            }}
          />
        </div>
      </div>
      <div className="w-[90%] mx-auto mb-6">
        <h2 className="text-lg font-bold">Background</h2>
        <div className="mt-3 mb-1 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <ThemeBackgroundPickerBtn
            text="Light"
            condition={themeBackground === 'theme-background-light'}
            bgColor="bg-[rgb(255,255,255)]"
            bgHoverColor="bg-[rgb(239,243,244)]"
            textColor="text-[rgb(15,20,25)]"
            handleClick={() => {
              dispatch(setBackgroundTheme('theme-background-light'));
            }}
          />
          <ThemeBackgroundPickerBtn
            text="Dark"
            condition={themeBackground === 'theme-background-dark'}
            bgColor="bg-[rgb(21,32,43)]"
            bgHoverColor="bg-[rgb(25,39,52)]"
            textColor="text-[rgb(255,255,255)]"
            handleClick={() => {
              dispatch(setBackgroundTheme('theme-background-dark'));
            }}
          />
          <ThemeBackgroundPickerBtn
            text="Lights out"
            condition={themeBackground === 'theme-background-lights-out'}
            bgColor="bg-[rgb(0,0,0)]"
            bgHoverColor="bg-[rgb(22,24,28)]"
            textColor="text-[rgb(255,255,255)]"
            handleClick={() => {
              dispatch(setBackgroundTheme('theme-background-lights-out'));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemePickerPage;
