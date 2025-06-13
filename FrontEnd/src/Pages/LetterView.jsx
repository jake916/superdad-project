import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import logo from '../assets/Untitled-1.png';
import letterTemplate from '../assets/Super Dad letter template.png';

function LetterView() {
  const { slug } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadRef = useRef(null);

  // Download function
  const handleDownload = async () => {
    if (!downloadRef.current) return;

    setIsDownloading(true);
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(downloadRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: 595,
        height: 842
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `letter-${letter.letterTitle || 'untitled'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    async function fetchLetter() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/` + slug);
        if (!response.ok) {
          throw new Error('Letter not found');
        }
        const data = await response.json();
        setLetter(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLetter();
  }, [slug]);

  if (loading) {
    return <div>Loading letter...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full relative min-h-screen text-white">
      <nav className="w-full flex items-center justify-center px-6 py-4 bg-transparent">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-25 w-auto" />
          </div>
          {/* <button
            className="px-6 py-2 bg-[#d8dadb]/60 text-[#ffffff] hover:bg-blue-700 transition-colors duration-200"
            onClick={openEmailPopup}
          >
            Create your Letter
          </button> */}
        </nav>
      <div className="video-background">
        <iframe
          src="https://www.youtube.com/embed/G5_AChAu8X4?autoplay=1&mute=1&loop=1&playlist=G5_AChAu8X4&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3"
          title="YouTube video background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full absolute top-0 left-0"
        ></iframe>
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 p-4">
        <h2 className="text-[60px] font-bold mb-4">
          Hey, Super Dad! You've got <br></br>a letter from {letter.letterSender || 'someone special'}.
        </h2>
        {/* <p className="text-lg mb-6 max-w-xl text-center">
          {letter.letterSender || 'Someone'} who loves you has something special to say. <br />
          Click below to read their message.
        </p> */}
        <button
          className="bg-[#e63e21] text-white font-semibold py-2 px-6 rounded"
          onClick={() => {
            console.log('Read the Letter button clicked');
            setShowPopup(true);
          }}
        >
          Read the Letter
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-[#000000]/80 flex justify-center items-center z-50 p-4">
          {/* Download Button - On black background, top right */}
<button
  className="absolute top-6 right-6 text-white bg-[#e63e21] rounded-full w-35 h-12 flex justify-center items-center font-bold hover:bg-[#e63e21]/80 transition-colors duration-200 shadow-lg z-60"
  onClick={handleDownload}
  aria-label="Download letter"
  disabled={isDownloading}
>
{isDownloading ? (
  <div className="flex items-center space-x-2">
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <span>Downloading letter...</span>
  </div>
) : (
  <div className="flex items-center space-x-1">
    <Download size={20} />
    <span>Download</span>
  </div>
)}
          </button>

          {/* Hidden letter for download - captures full content without scroll */}
          <div
            ref={downloadRef}
            className="absolute -left-[9999px] bg-cover bg-center text-black"
            style={{ 
              backgroundImage: `url(${letterTemplate})`, 
              width: '595px', // A4 width in pixels at 72 DPI
              height: '842px', // A4 height in pixels at 72 DPI
              aspectRatio: '210/297'
            }}
          >
            {/* Title for download version */}
            <div 
              className="absolute left-0 right-0 flex justify-center items-center px-16"
              style={{ top: '12%' }}
            >
              <h3 className="text-2xl font-bold text-center leading-tight">
                {letter.letterTitle}
              </h3>
            </div>

            {/* Body for download version - NO SCROLL, auto-sizing */}
            <div 
              className="absolute left-0 right-0 px-16"
              style={{ 
                top: '20%',
                bottom: '25%'
              }}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap text-justify overflow-hidden">
                {letter.letterBody}
              </p>
            </div>

            {/* Sender for download version */}
            <div 
              className="absolute left-0 right-0 flex justify-center items-center px-16"
              style={{ bottom: '30%' }}
            >
              <p className="text-lg font-semibold text-center">
                From: {letter.letterSender}
              </p>
            </div>
          </div>

          <div
            className="relative bg-cover bg-center w-full max-w-lg rounded-lg shadow-lg text-black"
            style={{ 
              backgroundImage: `url(${letterTemplate})`, 
              minHeight: '700px',
              aspectRatio: '210/297' // A4 ratio
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex justify-center items-center font-bold hover:bg-red-700 z-10"
              onClick={() => setShowPopup(false)}
              aria-label="Close popup"
            >
              &times;
            </button>

            {/* FIXED TITLE POSITION - Above first horizontal line */}
            <div 
              className="absolute left-0 right-0 flex justify-center items-center px-16"
              style={{ top: '12%' }} // Fixed position from top
            >
              <h3 className="text-xl font-bold text-center leading-tight">
                {letter.letterTitle}
              </h3>
            </div>

            {/* FIXED BODY POSITION - Between horizontal lines */}
            <div 
              className="absolute left-0 right-0 px-16 overflow-hidden"
              style={{ 
                top: '20%', // Start position from top
                bottom: '35%' // End position from bottom
              }}
            >
              <div className="h-full overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-justify">
                  {letter.letterBody}
                </p>
              </div>
            </div>

            {/* FIXED SENDER POSITION - At bottom horizontal line */}
            <div 
              className="absolute left-0 right-0 flex justify-center items-center px-16"
              style={{ bottom: '29%' }} // Fixed position from bottom
            >
              <p className="font-semibold text-center">
                From: {letter.letterSender}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LetterView;
