import React from "react";
import { FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";
import { TbMail } from "react-icons/tb";
import { AiFillGithub } from "react-icons/ai";

const Footer = React.forwardRef<HTMLElement>((props, ref) => {
  const year = new Date().getFullYear();
  return (
    <footer ref={ref} className="w-full bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 text-white py-3 px-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-base">
        <div className="text-center sm:text-left font-light">
          Engineering Tomorrow's Solutions, Today
        </div>
        <div className="text-center font-light">
          Copyright © {year} DevOpsDive
        </div>
        <div className="flex items-center justify-center gap-3 mt-2 sm:mt-0">
          <a href="mailto:askoshelenko@gmail.com" target="_blank" rel="noopener noreferrer" title="Email" className="hover:text-pink-400 transition-colors text-lg">
            {React.createElement(TbMail as React.ComponentType)}
          </a>
          <a href="https://t.me/askoshelenko" target="_blank" rel="noopener noreferrer" title="Telegram" className="hover:text-blue-400 transition-colors text-lg">
            {React.createElement(FaTelegramPlane as React.ComponentType)}
          </a>
          <a href="https://www.linkedin.com/in/askoshelenko/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:text-blue-300 transition-colors text-lg">
            {React.createElement(FaLinkedinIn as React.ComponentType)}
          </a>
          <a href="https://github.com/askoshelenko" target="_blank" rel="noopener noreferrer" title="GitHub" className="hover:text-gray-400 transition-colors text-lg">
            {React.createElement(AiFillGithub as React.ComponentType)}
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Footer; 