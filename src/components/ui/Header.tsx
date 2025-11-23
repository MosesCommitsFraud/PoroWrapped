"use client";

import Link from "next/link";
import React from "react";

export function Header() {
      return (
            <header className="absolute left-0 right-0 top-0 z-40 h-16 bg-transparent transition-colors duration-200 px-safe pt-safe">
                  <div className="container relative z-10 flex h-full items-center mx-auto px-6" aria-label="Global">
                        <Link className="transition-colors duration-200 transition-all duration-200" href="/">
                              <span className="sr-only">Huly</span>
                              {/* Replaced Huly logo with Poro Wrapped text for now, or a placeholder SVG */}
                              <div className="text-white font-bold text-xl tracking-tighter">Poro Wrapped</div>
                        </Link>
                        <nav className="ml-[77px] hidden md:block">
                              <ul className="flex">
                                    <li className="">
                                          <Link
                                                className="transition-colors duration-200 inline-flex whitespace-pre p-3 text-14 text-white hover:text-blue"
                                                href="/pricing"
                                          >
                                                Pricing
                                          </Link>
                                    </li>
                                    <li className="group/navitem relative">
                                          <button
                                                className="inline-flex items-center gap-x-1.5 whitespace-pre p-3 text-14 text-white"
                                                type="button"
                                          >
                                                Resources
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 10 6"
                                                      className="w-2 h-3.5 opacity-60 stroke-white stroke-[1.4]"
                                                >
                                                      <path d="m1 1 4 4 4-4" />
                                                </svg>
                                          </button>
                                    </li>
                                    <li className="group/navitem relative">
                                          <button
                                                className="inline-flex items-center gap-x-1.5 whitespace-pre p-3 text-14 text-white"
                                                type="button"
                                          >
                                                Community
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 10 6"
                                                      className="w-2 h-3.5 opacity-60 stroke-white stroke-[1.4]"
                                                >
                                                      <path d="m1 1 4 4 4-4" />
                                                </svg>
                                          </button>
                                    </li>
                                    <li className="">
                                          <Link
                                                className="transition-colors duration-200 inline-flex whitespace-pre p-3 text-14 text-white hover:text-blue"
                                                href="/download"
                                          >
                                                Download
                                          </Link>
                                    </li>
                              </ul>
                        </nav>
                        <div className="ml-auto flex gap-x-3.5 md:mr-[52px] hidden sm:flex">
                              <a
                                    className="transition-colors duration-200 leading-none inline-flex items-center text-14 text-white px-1.5 hover:text-grey-80"
                                    href="https://github.com/hcengineering/platform"
                                    target="_blank"
                                    rel="noopener noreferrer"
                              >
                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 36 36"
                                          className="mr-1.5 aspect-square h-4 fill-white sm:mr-0 sm:h-6"
                                    >
                                          <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                                                clipRule="evenodd"
                                          ></path>
                                    </svg>
                                    Star Us
                              </a>
                              <Link
                                    className="transition-colors duration-200 transition-all duration-200 uppercase font-bold flex items-center justify-center h-8 px-4 text-11 border border-white/20 rounded-full relative text-white tracking-snug hover:bg-white/10"
                                    href="/login"
                              >
                                    Sign In
                              </Link>
                              <Link
                                    className="transition-colors duration-200 transition-all duration-200 uppercase font-bold flex items-center justify-center h-8 px-4 text-11 border border-white/20 rounded-full relative text-white tracking-snug hover:bg-white/10"
                                    href="/signup"
                              >
                                    Sign Up
                              </Link>
                        </div>
                  </div>
            </header>
      );
}
