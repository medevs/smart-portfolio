"use client"


import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { Home, Briefcase, BookOpen, Github, FileText } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blog", href: "/blog", icon: BookOpen },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold">
              ⵣ
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-3 py-2 rounded-md text-sm font-medium   group flex items-center"
                >
                  <link.icon className="w-5 h-5 mr-2" />
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5  transform scale-x-0 group-hover:scale-x-100 "
                    layoutId="underline"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">

              <ThemeToggle />
            </div>
          </div>
          <div className="flex -mr-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          className="md:hidden backdrop-blur-md  bg-opacity-70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}