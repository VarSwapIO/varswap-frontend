import React from "react";
import BlankLink from "@/components/Link/BlankLink";
import ImageBG from "@/components/Image/ImageBG";


const Footer = () => {
  return (
    <div className=" bg-white dark:bg-slate-900 relative w-full">
      <div className="w-full h-full sm:h-[45px] px-4 sm:pt-0 pt-2 pb-2 sm:pb-0 text-xs font-semibold flex sm:flex-row flex-col-reverse gap-2 justify-between items-center sm:gap-6 border-solid border-x-0 border-b-0 border-t-[1px] border-gray-200 dark:border-gray-700">
        © 2024 VarSwap. All rights reserved.
        <div className="flex gap-2 items-center" >
          <BlankLink>Terms of Service</BlankLink>
          <p>|</p>
          <BlankLink>Privacy Terms</BlankLink>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <BlankLink link="#">
              <ImageBG
                src="/images/icons/telegram.svg"
                alt="Vercel Logo"
                width={22}
                height={22}
                priority
              />
            </BlankLink>
            <BlankLink link="#">
              {" "}
              <ImageBG
                src="/images/icons/twitter.svg"
                alt="Vercel Logo"
                width={22}
                height={22}
                priority
              />
            </BlankLink>
            <BlankLink link="#">
              {" "}
              <ImageBG
                src="/images/icons/discord.svg"
                alt="Vercel Logo"
                width={22}
                height={22}
                priority
              />
            </BlankLink>
            <BlankLink link="#">
              {" "}
              <ImageBG
                src="/images/icons/facebook.svg"
                alt="Vercel Logo"
                width={22}
                height={22}
                priority
              />
            </BlankLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
