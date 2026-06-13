
import React from "react";
import { Button } from "./ui/button";

const navigationItems = [
  { label: "About" },
  { label: "Services" },
  { label: "Project" },
  { label: "Contact" },
];

export const Header = () => {
  return (
    <div className="relative w-full">
      <div className="relative w-full h-[804px] lg:h-[900px] xl:h-[1000px] 2xl:h-[1100px]">
        {/* Background Vector */}
        <img
          className="absolute top-[101px] lg:top-[120px] xl:top-[140px] left-[calc(50%-635px)] lg:left-[calc(50%-750px)] xl:left-[calc(50%-850px)] w-[1270px] lg:w-[1500px] xl:w-[1700px] h-[703px] lg:h-[800px] xl:h-[900px]"
          alt="Vector"
          src="https://c.animaapp.com/mj32vqleeMiOmR/img/vector-4.svg"
        />

        {/* Main Image */}
        <img
          className="absolute top-3 lg:top-4 xl:top-6 left-[calc(50%-64px)] lg:left-[calc(50%-80px)] xl:left-[calc(50%-96px)] w-[129px] lg:w-[160px] xl:w-[192px] h-[129px] lg:h-[160px] xl:h-[192px] object-cover opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:0ms]"
          alt="Image"
          src="https://c.animaapp.com/mj32vqleeMiOmR/img/image-9-1.png"
        />

        {/* Navigation */}
        <nav className="flex w-[1194px] lg:w-[1400px] xl:w-[1600px] 2xl:w-[1800px] items-center justify-between absolute top-28 lg:top-32 xl:top-36 left-36 lg:left-40 xl:left-48 2xl:left-56 opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
          {/* Navigation Items */}
          <div className="inline-flex items-center justify-center gap-[39.75px] lg:gap-[48px] xl:gap-[56px] px-[25.55px] lg:px-[32px] xl:px-[38px] py-[17px] lg:py-[20px] xl:py-[24px] rounded-[47.32px]">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                className="inline-flex items-center justify-center gap-[9.46px] transition-opacity hover:opacity-70"
              >
                <div className="relative w-fit mt-[-0.95px] [font-family:'DM_Sans',Helvetica] font-normal text-white text-[15.1px] lg:text-[18px] xl:text-[21px] 2xl:text-[24px] text-center tracking-[0] leading-[15.2px] lg:leading-[18px] xl:leading-[21px] 2xl:leading-[24px] whitespace-nowrap">
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          {/* Right Side: Logo / Button */}
          <div className="inline-flex items-center justify-center gap-[34px] lg:gap-[42px] xl:gap-[50px]">
            <img
              className="relative"
              alt="Frame"
              src="https://c.animaapp.com/mj32vqleeMiOmR/img/frame-20577.svg"
            />
            <Button className="w-[157px] lg:w-[190px] xl:w-[220px] 2xl:w-[250px] h-[43px] lg:h-[52px] xl:h-[60px] 2xl:h-[68px] bg-c-1 hover:bg-c-1/90 rounded-[13px] lg:rounded-[16px] xl:rounded-[18px] transition-colors">
              <span className="[font-family:'DM_Sans',Helvetica] font-bold text-white text-[18.9px] lg:text-[22px] xl:text-[26px] 2xl:text-[30px] text-center tracking-[0] leading-[19px] lg:leading-[22px] xl:leading-[26px] 2xl:leading-[30px]">
                Get a Quote
              </span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};
