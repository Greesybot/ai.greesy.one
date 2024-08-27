export default function DestkopNav(){
  return(
      <>
       <div className="flex bg-black grid grid-cols-5 mt-4 ml-6">
       <div className="LogoArea">
                  <p className="w-full font-normal bg-transparent text-[#e7e8ea] !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small peer pr-6 rtl:pr-0 rtl:pl-6 is-filled font-sans text-[25px] ml-8">
            Greesy
            <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text animate- text-transparent">
              AI
            </span>
          </p>
       </div>
        <div className="navlinkSec flex items-center justify-center ">
          <p className="text-gray-400 font-bold text-center w-full">Home</p>
           <p className="text-gray-400 ml-2 font-bold w-full">Home</p>
    .    </div>
       
       </div>
      </>
     )
}