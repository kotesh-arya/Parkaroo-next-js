import React, { FC } from "react";

interface ButtonPrimaryProps {
  children: React.ReactNode;
  addClass?: string; // Optional string prop
}

const ButtonPrimary: FC<ButtonPrimaryProps> = ({ children, addClass = "" }) => {
  return (
    <button
      className={
        "py-3 lg:py-4 px-12 lg:px-16 text-white-500 font-semibold rounded-lg bg-primary text-white hover:shadow-red-500 transition-all outline-none " +
        addClass
      }
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
