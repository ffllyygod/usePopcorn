import { ToggleButton } from "./ToggleButton";
export const Box = ({isOpen, setIsOpen, children}) => {
  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
};
