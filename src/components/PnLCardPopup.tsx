import React, {
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
  } from 'react';
  import html2canvas from 'html2canvas';
  
  export interface PnLCardProps {
    symbol: string;
    pnl: number;
    backgroundUrl: string;
  }
  
  export type PnLCardHandle = {
    openPopup: () => void;
  };
  
  const PnLCardPopup = forwardRef<PnLCardHandle, PnLCardProps>(
    ({ symbol, pnl, backgroundUrl }, ref) => {
        console.log(backgroundUrl)
      const cardRef = useRef<HTMLDivElement>(null);
      const [imageData, setImageData] = useState<string | null>(null);
      const [showPopup, setShowPopup] = useState(false);
  
      const isProfit = pnl >= 0;
  
     
  
      useImperativeHandle(ref, () => ({
        openPopup: generateImage,
      }));
  
      const downloadImage = () => {
        if (!imageData) return;
        const link = document.createElement('a');
        link.download = `${symbol}_PnL_Card.png`;
        link.href = imageData;
        link.click();
      };
  
      const handleClose = () => {
        setShowPopup(false);
        setImageData(null);
        setIsGenerating(false); // just in case
      };
      
      const [isGenerating, setIsGenerating] = useState(false);

      const generateImage = async () => {
        if (isGenerating || showPopup) return; // 🚫 Prevent duplicate opens
        setIsGenerating(true);
        if (!cardRef.current) return;
      
        const canvas = await html2canvas(cardRef.current);
        const img = canvas.toDataURL();
        setImageData(img);
        setShowPopup(true);
        setIsGenerating(false); // ✅ allow next open
      };
      
      return (
        <>
          {/* Hidden card to render image from */}
         

<div
            ref={cardRef}
            className="w-[577px] h-[433px] p-6 text-white relative overflow-hidden flex bg-black"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              left: '-9999px',
            }}
          >
            <div className='flex-1 w-1/2'></div>
            <div className='w-1/2 flex flex-col justify-center items-end mr-8 text-right'>
            <div>
                <h2 className={`${symbol.length>10?"text-xl":"text-3xl"} font-bold text-right`}>{symbol}/SOL</h2>
            <p className={`mt-0 font-semibold text-6xl ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{pnl.toFixed(2)}%
            </p>
            </div>
            </div>
          </div>
  
          {/* Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-4 shadow-xl text-center max-w-md w-full">
                {imageData && (
                  <img src={imageData} alt="PnL Card" className="w-full rounded-md mb-4" />
                )}                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={downloadImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleClose}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  );
  
  export default PnLCardPopup;
  