import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Link as LinkScroll } from "react-scroll";
import ButtonOutline from "../misc/ButtonOutline";
import Image from "next/image";
// import LogoVPN from "../../public/assets/Logo.svg";

const Header = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "feature", label: "Feature" },
    // { id: "pricing", label: "Pricing" },
    // { id: "testimoni", label: "Testimonial" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-30 bg-gray-50 transition-all ${
          scrollActive ? "shadow-md pt-0" : "pt-4"
        }`}
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
          {/* Logo */}
          <div className="col-start-1 col-end-2 flex items-center">
            <Image
              src="/Parkaroo-logo.png"
              alt="Parkaroo"
              width={80}
              height={50}
            />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500 items-center">
            {navLinks.map((link) => (
              <LinkScroll
                key={link.id}
                activeClass="active"
                to={link.id}
                spy={true}
                smooth={true}
                duration={1000}
                onSetActive={() => setActiveLink(link.id)}
                className={`px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative ${
                  activeLink === link.id
                    ? "text-primary animation-active"
                    : "text-black-500 hover:text-primary"
                }`}
              >
                {link.label}
              </LinkScroll>
            ))}
          </ul>

          {/* Sign In/Sign Up */}
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link href="/auth">
              {/* <a className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 transition-all">
                Sign In
              </a> */}
              <ButtonOutline>Sign Up</ButtonOutline>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t">
        <div className="bg-white-500 sm:px-3">
          <ul className="flex w-full justify-between items-center text-black-500">
            {navLinks.map((link) => (
              <LinkScroll
                key={link.id}
                activeClass="active"
                to={link.id}
                spy={true}
                smooth={true}
                duration={1000}
                onSetActive={() => setActiveLink(link.id)}
                className={`mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all ${
                  activeLink === link.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {link.label}
              </LinkScroll>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
