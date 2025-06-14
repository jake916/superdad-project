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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDownload = async () => {
    if (!downloadRef.current) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(downloadRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 595,
        height: 842
      });

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
        if (!response.ok) throw new Error('Letter not found');
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading letter...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  // Mobile view (<768px)
  if (windowWidth < 768) {
    return (
      <div className="w-full relative min-h-screen text-white px-4">
        <nav className="w-full flex items-center justify-center py-4 bg-transparent">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
        </nav>
        
        <div className="video-background relative w-full aspect-[9/16] overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1"
            title="YouTube video background"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full absolute top-0 left-0"
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white py-6">
          <p className="text-[35px] font-bold mb-4 text-center">
            Hey, Super Dad! You've got
            a letter from {letter.letterSender || 'someone special'}.
          </p>
          <button
            className="bg-[#e63e21] text-white font-semibold py-2 px-6 rounded"
            onClick={() => setShowPopup(true)}
          >
            Read the Letter
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-[#000000]/80 flex justify-center items-center z-50 p-4">
            <button
              className="absolute top-6 right-6 text-white bg-[#e63e21] rounded-full w-28 h-12 flex justify-center items-center font-bold hover:bg-[#e63e21]/80 transition-colors duration-200 shadow-lg z-60"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Downloading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Download size={20} />
                  <span>Download</span>
                </div>
              )}
            </button>

            <div
              ref={downloadRef}
              className="absolute -left-[9999px] bg-cover bg-center text-black"
              style={{
                backgroundImage: `url(${letterTemplate})`,
                minHeight: '600px',
                aspectRatio: '210/297'
              }}
            >
              <div className="absolute left-0 right-0 flex justify-center items-center px-8" style={{ top: '12%' }}>
                <h3 className="text-xl font-bold text-center leading-tight">
                  {letter.letterTitle}
                </h3>
              </div>
              <div className="absolute left-0 right-0 px-8" style={{ top: '20%', bottom: '25%' }}>
                <p className="text-base leading-relaxed whitespace-pre-wrap text-justify overflow-hidden">
                  {letter.letterBody}
                </p>
              </div>
              <div className="absolute left-0 right-0 flex justify-center items-center px-8" style={{ bottom: '30%' }}>
                <p className="text-lg font-semibold text-center">
                  From: {letter.letterSender}
                </p>
              </div>
            </div>

            <div
              className="relative bg-cover bg-center w-full max-w-md rounded-lg shadow-lg text-black"
              style={{
                backgroundImage: `url(${letterTemplate})`,
                minHeight: '600px',
                aspectRatio: '210/297'
              }}
            >
              <button
                className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex justify-center items-center font-bold hover:bg-red-700 z-10"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>

              <div className="absolute left-0 right-0 flex justify-center items-center px-8" style={{ top: '12%' }}>
                <h3 className="text-lg font-bold text-center leading-tight">
                  {letter.letterTitle}
                </h3>
              </div>

              <div
                className="absolute left-0 right-0 px-8 overflow-hidden"
                style={{ top: '20%', bottom: '25%' }}
              >
                <div className="h-full overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-justify">
                    {letter.letterBody}
                  </p>
                </div>
              </div>

              <div
                className="absolute left-0 right-0 flex justify-center items-center px-8"
                style={{ bottom: '30%' }}
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

  // Tablet view (768px - 1024px)
  if (windowWidth >= 768 && windowWidth < 1024) {
    return (
      <div className="w-full relative min-h-screen text-white px-6">
        <nav className="w-full flex items-center justify-center py-4 bg-transparent">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          </div>
        </nav>
        
        <div className="video-background relative w-full h-screen overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1"
            title="YouTube video background"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full absolute top-0 left-0"
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white py-10">
          <h2 className="text-[20px] font-bold mb-6 text-center">
            Hey, Super Dad! You've got <br />
            a letter from {letter.letterSender || 'someone special'}.
          </h2>
          <button
            className="bg-[#e63e21] text-white font-semibold py-3 px-8 rounded"
            onClick={() => setShowPopup(true)}
          >
            Read the Letter
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-[#000000]/80 flex justify-center items-center z-50 p-6">
            <button
              className="absolute top-6 right-6 text-white bg-[#e63e21] rounded-full w-28 h-12 flex justify-center items-center font-bold hover:bg-[#e63e21]/80 transition-colors duration-200 shadow-lg z-60"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Downloading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Download size={20} />
                  <span>Download</span>
                </div>
              )}
            </button>

            <div
              ref={downloadRef}
              className="absolute -left-[9999px] bg-cover bg-center text-black"
              style={{
                backgroundImage: `url(${letterTemplate})`,
                width: '595px',
                height: '842px',
                aspectRatio: '210/297'
              }}
            >
              <div className="absolute left-0 right-0 flex justify-center items-center px-12" style={{ top: '12%' }}>
                <h3 className="text-xl font-bold text-center leading-tight">
                  {letter.letterTitle}
                </h3>
              </div>
              <div className="absolute left-0 right-0 px-12" style={{ top: '20%', bottom: '25%' }}>
                <p className="text-base leading-relaxed whitespace-pre-wrap text-justify overflow-hidden">
                  {letter.letterBody}
                </p>
              </div>
              <div className="absolute left-0 right-0 flex justify-center items-center px-12" style={{ bottom: '30%' }}>
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
                aspectRatio: '210/297'
              }}
            >
              <button
                className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex justify-center items-center font-bold hover:bg-red-700 z-10"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>

              <div className="absolute left-0 right-0 flex justify-center items-center px-12" style={{ top: '12%' }}>
                <h3 className="text-xl font-bold text-center leading-tight">
                  {letter.letterTitle}
                </h3>
              </div>

              <div
                className="absolute left-0 right-0 px-12 overflow-hidden"
                style={{ top: '20%', bottom: '35%' }}
              >
                <div className="h-full overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-justify">
                    {letter.letterBody}
                  </p>
                </div>
              </div>

              <div
                className="absolute left-0 right-0 flex justify-center items-center px-12"
                style={{ bottom: '29%' }}
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

  // Desktop view (≥1024px)
  return (
    <div className="w-full relative min-h-screen text-white px-6">
      <nav className="w-full flex items-center justify-center py-4 bg-transparent">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-24 w-auto" />
        </div>
      </nav>
      
      <div className="video-background relative w-full h-screen overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1"
          title="YouTube video background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full absolute top-0 left-0"
        />
      </div>
      
      <div className="relative z-10 flex flex-col justify-center items-center text-white py-10">
        <h2 className="text-5xl font-bold mt-25 mb-4 text-center">
          Hey, Super Dad! You've got <br />
          a letter from {letter.letterSender || 'someone special'}.
        </h2>
        <button
          className="bg-[#e63e21] text-white font-semibold py-3 px-8 rounded"
          onClick={() => setShowPopup(true)}
        >
          Read the Letter
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-[#000000]/80 flex justify-center items-center z-50 p-6">
          <button
            className="absolute top-6 right-6 text-white bg-[#e63e21] rounded-full w-35 h-12 flex justify-center items-center font-bold hover:bg-[#e63e21]/80 transition-colors duration-200 shadow-lg z-60"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Download size={20} />
                <span>Download</span>
              </div>
            )}
          </button>

          <div
            ref={downloadRef}
            className="absolute -left-[9999px] bg-cover bg-center text-black"
            style={{
              backgroundImage: `url(${letterTemplate})`,
              width: '595px',
              height: '842px',
              aspectRatio: '210/297'
            }}
          >
            <div className="absolute left-0 right-0 flex justify-center items-center px-16" style={{ top: '12%' }}>
              <h3 className="text-2xl font-bold text-center leading-tight">
                {letter.letterTitle}
              </h3>
            </div>
            <div className="absolute left-0 right-0 px-16" style={{ top: '20%', bottom: '25%' }}>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-justify overflow-hidden">
                {letter.letterBody}
              </p>
            </div>
            <div className="absolute left-0 right-0 flex justify-center items-center px-16" style={{ bottom: '30%' }}>
              <p className="text-lg font-semibold text-center">
                From: {letter.letterSender}
              </p>
            </div>
          </div>

          <div
            className="relative bg-cover bg-center w-full max-w-xl rounded-lg shadow-lg text-black"
            style={{
              backgroundImage: `url(${letterTemplate})`,
              minHeight: '800px',
              aspectRatio: '210/297'
            }}
          >
            <button
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex justify-center items-center font-bold hover:bg-red-700 z-10"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>

            <div className="absolute left-0 right-0 flex justify-center items-center px-16" style={{ top: '12%' }}>
              <h3 className="text-2xl font-bold text-center leading-tight">
                {letter.letterTitle}
              </h3>
            </div>

            <div
              className="absolute left-0 right-0 px-16 overflow-hidden"
              style={{ top: '20%', bottom: '35%' }}
            >
              <div className="h-full overflow-y-auto">
                <p className="text-base leading-relaxed whitespace-pre-wrap text-justify">
                  {letter.letterBody}
                </p>
              </div>
            </div>

            <div
              className="absolute left-0 right-0 flex justify-center items-center px-16"
              style={{ bottom: '29%' }}
            >
              <p className="text-lg font-semibold text-center">
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