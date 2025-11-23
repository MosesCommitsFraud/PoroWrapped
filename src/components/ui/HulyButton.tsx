import Link from "next/link";
import React from "react";

interface HulyButtonProps {
      href: string;
      text?: string;
}

export function HulyButton({ href, text = "See in Action" }: HulyButtonProps) {
      return (
            <div className="relative inline-flex items-center z-10 group">
                  {/* Left side outer glow */}
                  <div
                        className="border-button-light-blur absolute left-1/2 top-1/2 h-[calc(100%+9px)] w-[calc(100%+9px)] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform opacity-100 transition-opacity duration-300 group-hover:opacity-75"
                  >
                        <div className="border-button-light relative h-full w-full rounded-full bg-white/10 blur-md"></div>
                  </div>

                  {/* Right side outer glow (flipped) */}
                  <div
                        className="border-button-light-blur absolute left-1/2 top-1/2 h-[calc(100%+9px)] w-[calc(100%+9px)] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] transform rounded-full will-change-transform opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                        <div className="border-button-light relative h-full w-full rounded-full bg-white/10 blur-md"></div>
                  </div>

                  <Link
                        className="transition-colors duration-200 uppercase font-bold flex items-center justify-center h-10 px-16 text-12 text-black -tracking-[0.015em] relative z-10 overflow-hidden rounded-full border border-white/60 bg-[#d1d1d1] space-x-1 px-16 sm:pl-[59px] sm:pr-[52px] group-hover:bg-white"
                        href={href}
                  >
                        {/* Inner Glow Container */}
                        <div
                              className="absolute -z-10 flex w-[204px] items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-[-20px]"
                              style={{ transform: "translateX(113.983px) translateZ(0px)" }}
                        >
                              <div className="absolute top-1/2 h-[121px] w-[121px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFF5_3.5%,_#FFAA81_26.5%,#FFDA9F_37.5%,rgba(255,170,129,0.50)_49%,rgba(210,106,58,0.00)_92.5%)]"></div>
                              <div className="absolute top-1/2 h-[103px] w-[204px] -translate-y-1/2 bg-[radial-gradient(43.3%_44.23%_at_50%_49.51%,_#FFFFF7_29%,_#FFFACD_48.5%,_#F4D2BF_60.71%,rgba(214,211,210,0.00)_100%)] blur-[5px]"></div>
                        </div>

                        <span className="text-[#5A250A]">{text}</span>
                        <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 17 9"
                              className="h-[9px] w-[17px] text-[#5A250A]"
                        >
                              <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                                    clipRule="evenodd"
                              ></path>
                        </svg>
                  </Link>
            </div>
      );
}
