import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/Untitled-1.png';
import img0234 from '../assets/IMG_0234.JPG';
import superdad from '../assets/superdad.jpg';
import fathersImage from '../assets/Fathers Image.png';

const LandingPage = () => {
  console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [popupStage, setPopupStage] = useState('email'); // 'email', 'letter', or 'link'
  const [letterLink, setLetterLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [letterCount, setLetterCount] = useState(0);

  const [letterTitle, setLetterTitle] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [letterSender, setLetterSender] = useState('');
  const [bodyWordCount, setBodyWordCount] = useState(0);
  const [sharePublicly, setSharePublicly] = useState(''); // new state for radio button

  // New state for slug
  const [letterSlug, setLetterSlug] = useState('');

  // New handlers for letter inputs
  const handleLetterTitleChange = (e) => {
    setLetterTitle(e.target.value);
  };

  const handleLetterBodyChange = (e) => {
    const text = e.target.value;
    setLetterBody(text);
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    setBodyWordCount(wordCount);
  };

  const handleLetterSenderChange = (e) => {
    setLetterSender(e.target.value);
  };

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    }

    // Fetch letter count from backend
    const fetchLetterCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/count`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch letter count');
        }
        const data = await response.json();
        setLetterCount(data.count);
      } catch (error) {
        console.error('Error fetching letter count:', error);
      }
    };

    fetchLetterCount();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const openEmailPopup = () => {
    setPopupStage('email');
    setShowEmailPopup(true);
  };

  const closeEmailPopup = () => {
    setShowEmailPopup(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: handle email submission logic
    toast.success(`Email submitted: ${email}`);
    setPopupStage('letter');
  };

  // Mobile view (< 768px)
  if (windowWidth < 768) {
    return (
      <div className="w-full relative min-h-screen overflow-hidden text-white">
        <div className="video-background relative w-full aspect-[9/16] overflow-hidden">
          <iframe width="full" height="full" src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1" title="Super Dad Animation: How To Calm A Crying Baby (2025)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
        </div>

        {/* Content container */}
        <div className="relative z-10 px-4">
          {/* Navigation */}
          <nav className="w-full flex items-center justify-center py-4 bg-transparent">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-16 w-auto" />
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex justify-center items-center min-h-screen">
            <section className="py-12 px-6 sm:px-8">
              <div className="relative z-10 flex flex-col justify-center items-center text-white py-6 mb-55">
                <h2 className="text-[40px] w-80  mb-4 font-poppins font-bold drop-shadow-lg leading-tight">
                  This Father's Day, speak the love he rarely hears.
                </h2>
                <div className="mb-4 text-white font-poppins text-base sm:text-lg">
                  <p> We are writing <b> a million letters </b> to our Dads</p>
                </div>
                <button
                  className="px-5 py-3 bg-[#e63e21] text-[#ffffff] rounded-lg text-base sm:text-lg font-poppins font-semibold shadow-lg"
                  onClick={openEmailPopup}
                >
                  Write him a letter
                </button>
              </div>
            </section>
          </div>

          {showEmailPopup && (
            <div
              className="fixed inset-0 bg-[#000000]/60 flex items-center justify-center z-60"
              onClick={closeEmailPopup}
            >
              <div
                className="bg-[#000000]/80 rounded-lg max-w-full w-full mx-4 flex flex-col sm:flex-row overflow-auto max-h-[90vh] sm:max-h-[600px] p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {popupStage === 'email' ? (
                  <>
                    {/* Email Stage */}
                    <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
                      <h2 className="text-white text-left font-bold mb-6 text-lg sm:text-[20px]">
                        Create your Letter
                      </h2>
                      <h3 className="text-sm sm:text-[15px] text-left font-regular mb-4 text-white">
                        Enter your email
                      </h3>
                      <form onSubmit={handleEmailSubmit} className="w-full">
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          required
                          placeholder="Your email"
                          className="w-full p-3 border text-black bg-[#f2f2f2] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                          type="submit"
                          className="w-full mt-4 px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200"
                        >
                          Submit
                        </button>
                      </form>
                      <button
                        onClick={closeEmailPopup}
                        className="mt-4 text-white underline"
                      >
                        Cancel
                      </button>
                    </div>
                    <div
                      className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto rounded-md mt-4 sm:mt-0"
                      style={{ backgroundImage: `url(${img0234})` }}
                    ></div>
                  </>
                ) : popupStage === 'letter' ? (
                  <>
                    {/* Letter Stage */}
                    <div className="flex flex-col items-center w-full p-4 sm:p-6 max-h-[80vh] overflow-auto">
                      <div
                        className="w-full h-48 sm:h-auto bg-cover bg-center mb-4 rounded-md"
                        style={{ backgroundImage: `url(${superdad})` }}
                      ></div>
                      <form
                        className="w-full max-w-md"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setIsLoading(true);
                          setErrorMessage('');
                          try {
                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                email,
                                letterTitle,
                                letterBody,
                                letterSender,
                                sharePublicly,
                              }),
                            });
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to save letter');
                            }
                            const data = await response.json();
                            // Use slug from response to generate link
                            const generatedLink = `${import.meta.env.VITE_FRONTEND_URL}/letterview/${data.slug}`;
                            setLetterSlug(data.slug);
                            setLetterLink(generatedLink);
                            setPopupStage('link');
                          } catch (error) {
                            setErrorMessage(error.message);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        <div className="flex flex-col space-y-4 mb-4">
                          <div>
                            <label
                              className="block mb-2 font-regular text-[12px] text-white text-left"
                              htmlFor="title"
                            >
                              Title of the letter
                            </label>
                            <input
                              id="title"
                              type="text"
                              value={letterTitle}
                              onChange={(e) => setLetterTitle(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Enter the title"
                              required
                            />
                          </div>
                          <div>
                            <label
                              className="block mb-2 font-regular text-[12px] text-white text-left"
                              htmlFor="sender"
                            >
                              Name of sender
                            </label>
                            <input
                              id="sender"
                              type="text"
                              value={letterSender}
                              onChange={(e) => setLetterSender(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          <div>
                            <label
                              className="block mb-2 ffont-regular text-[12px] text-white text-left"
                              htmlFor="body"
                            >
                              Body of the letter
                            </label>
                            <textarea
                              id="body"
                              value={letterBody}
                              onChange={(e) => {
                                const text = e.target.value;
                                const words = text.trim().split(/\s+/).filter(Boolean);
                                if (words.length <= 130) {
                                  setLetterBody(text);
                                  setBodyWordCount(words.length);
                                } else {
                                  const limitedText = words.slice(0, 130).join(' ');
                                  setLetterBody(limitedText);
                                  setBodyWordCount(130);
                                }
                              }}
                              className="w-full p-3 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Write your letter here (max 130 words)"
                              rows={15}
                              maxLength={3000}
                              required
                            />
                            <div className="text-sm text-gray-600 mb-2 text-center">
                              Words remaining: {130 - bodyWordCount}
                            </div>
                          </div>
                          <div className="text-sm text-white flex items-center justify-center space-x-4">
                            <span>Can we share your letter on our social media?</span>
                            <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="sharePublicly"
                                value="yes"
                                checked={sharePublicly === 'yes'}
                                onChange={(e) => setSharePublicly(e.target.value)}
                                required
                                className="accent-[#e63e21]"
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="sharePublicly"
                                value="no"
                                checked={sharePublicly === 'no'}
                                onChange={(e) => setSharePublicly(e.target.value)}
                                required
                                className="accent-[#e63e21]"
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  ></path>
                                </svg>
                                Creating
                              </>
                            ) : (
                              'Create Letter'
                            )}
                          </button>
                          <button
                            type="button"
                            className="px-6 py-2 underline"
                            onClick={() => setPopupStage('email')}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : popupStage === 'link' ? (
                  <>
                    {/* Link Stage - Improved UI */}
                    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
                      {/* Removed Your Letter Link Section */}
                      {/* New Share with Dad Section */}
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 mt-10">
                        <h2 className="text-black font-bold mb-4 text-[20px] text-center">
                          Share letter with your dad
                        </h2>
                        <div className="flex flex-col items-center space-y-3">
                          <button
                            className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/80 transition-colors duration-200"
                            onClick={async () => {
                              const shareText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;

                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: 'Super Dad Letter',
                                    text: shareText,
                                  });
                                  console.log('Share successful');
                                } catch (error) {
                                  console.error('Error sharing:', error);
                                  // Fallback to clipboard if share fails
                                  try {
                                    await navigator.clipboard.writeText(shareText);
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (clipboardError) {
                                    toast.error('Unable to share. Please copy this link manually: ' + letterLink);
                                  }
                                }
                              } else {
                                // Browser doesn't support Web Share API, copy to clipboard
                                try {
                                  await navigator.clipboard.writeText(shareText);
                                  toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                } catch (clipboardError) {
                                  // Final fallback for very old browsers
                                  const textArea = document.createElement('textarea');
                                  textArea.value = shareText;
                                  textArea.style.position = 'fixed';
                                  textArea.style.opacity = '0';
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();

                                  try {
                                    document.execCommand('copy');
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (execError) {
                                    toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                  } finally {
                                    document.body.removeChild(textArea);
                                  }
                                }
                              }
                            }}
                          >
                            Share
                          </button>

                          <button
                            className="px-6 py-2 text-gray-500  "
                            onClick={async () => {
                              const copyText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;
                              try {
                                await navigator.clipboard.writeText(copyText);
                                toast.success('Link copied to clipboard!');
                              } catch (clipboardError) {
                                // Fallback for browsers that don't support clipboard API
                                const textArea = document.createElement('textarea');
                                textArea.value = letterLink;
                                textArea.style.position = 'fixed';
                                textArea.style.opacity = '0';
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();

                                try {
                                  document.execCommand('copy');
                                  toast.success('Link copied to clipboard!');
                                } catch (execError) {
                                  toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                } finally {
                                  document.body.removeChild(textArea);
                                }
                              }
                            }}
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
          <div className="fixed top-120 right-6 bg-[#ffffff] rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-lg z-50">
            <span className="text-[#e63e21] font-bold text-xl leading-none">{letterCount}</span>
            <span className="text-[#e63e21] text-[8px] leading-none">letters sent</span>
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }

  // Tablet view (768px - 1024px)
  if (windowWidth >= 768 && windowWidth < 1024) {
    return (
      <div className="w-full relative min-h-screen overflow-hidden text-white">
        <div className="video-background relative w-full h-screen overflow-hidden">
          <iframe width="806" height="453" src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1" title="Super Dad Animation: How To Calm A Crying Baby (2025)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>

        {/* Content container */}
        <div className="relative z-10 px-6">
          {/* Navigation */}
          <nav className="w-full flex items-center justify-center py-4 bg-transparent">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-20 w-auto" />
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex justify-center items-center min-h-screen">
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto mb-20 text-center">
                <h2 className="text-4xl md:text-5xl mb-6 font-poppins font-bold drop-shadow-lg leading-tight">
                  This Father's Day, speak the love he rarely hears.
                </h2>
                <div className="mb-10 text-white font-poppins text-lg">
                  <p> We are writing a million letters to our Dads</p>
                </div>
                <button
                  className="px-8 py-3 bg-[#e63e21] text-[#ffffff] rounded-lg text-base font-poppins font-semibold shadow-lg"
                  onClick={openEmailPopup}
                >
                  Write him a letter
                </button>
              </div>

            </section>
          </div>

          {showEmailPopup && (
            <div
              className="fixed inset-0 bg-[#000000]/60 flex items-center justify-center z-60"
              onClick={closeEmailPopup}
            >
              <div
                className="bg-[#000000]/80 rounded-lg max-w-3xl w-full mx-4 flex overflow-hidden min-h-[600px]"
                onClick={(e) => e.stopPropagation()}
              >
                {popupStage === 'email' ? (
                  <>
                    {/* Email Stage */}
                    <div className="flex w-full">
                      <div className="w-1/2 p-6 flex flex-col justify-center ">
                        <h2 className='text-white text-left font-bold mb-10 text-[20px]'>Create your Letter</h2>
                        <h3 className="text-[15px] text-left font-regular mb-4 text-white">Enter your email</h3>
                        <form onSubmit={handleEmailSubmit} className="w-full">
                          <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder="Your email"
                            className="w-full p-3 border text-black bg-[#f2f2f2] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="submit"
                            className="w-full mt-4 px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200"
                          >
                            Submit
                          </button>
                        </form>
                        <button
                          onClick={closeEmailPopup}
                          className="mt-4 text-white underline"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/IMG_0234.JPG')" }}></div>
                    </div>
                  </>
                ) : popupStage === 'letter' ? (
                  <>
                    {/* Letter Stage */}
                    <div className="flex flex-col items-center w-full p-6 max-h-[900px]">
                      <div
                        className="w-full h-full bg-cover bg-center mb-6"
                        style={{ backgroundImage: "url('/src/assets/superdad.jpg')" }}
                      ></div>
                      <form
                        className="w-full max-w-md"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setIsLoading(true);
                          setErrorMessage('');
                          try {
                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                email,
                                letterTitle,
                                letterBody,
                                letterSender,
                                sharePublicly,
                              }),
                            });
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to save letter');
                            }
                            const data = await response.json();
                            // Use slug from response to generate link
                            const generatedLink = `${import.meta.env.VITE_FRONTEND_URL}/letterview/${data.slug}`;
                            setLetterSlug(data.slug);
                            setLetterLink(generatedLink);
                            setPopupStage('link');
                          } catch (error) {
                            setErrorMessage(error.message);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        <div className="flex space-x-4 mb-4">
                          <div className="flex-1">
                            <label className="block mb-2 font-regular text-[12px] text-white text-left" htmlFor="title">
                              Title of the letter
                            </label>
                            <input
                              id="title"
                              type="text"
                              value={letterTitle}
                              onChange={(e) => setLetterTitle(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Enter the title"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block mb-2 font-regular text-[12px] text-white text-left" htmlFor="sender">
                              Name of sender
                            </label>
                            <input
                              id="sender"
                              type="text"
                              value={letterSender}
                              onChange={(e) => setLetterSender(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                        </div>
                        <label className="block mb-2 ffont-regular text-[12px] text-white text-left" htmlFor="body">
                          Body of the letter
                        </label>
                        <textarea
                          id="body"
                          value={letterBody}
                          onChange={(e) => {
                            const text = e.target.value;
                            const words = text.trim().split(/\s+/).filter(Boolean);
                            if (words.length <= 130) {
                              setLetterBody(text);
                              setBodyWordCount(words.length);
                            } else {
                              const limitedText = words.slice(0, 130).join(' ');
                              setLetterBody(limitedText);
                              setBodyWordCount(130);
                            }
                          }}
                          className="w-full p-3 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Write your letter here (max 130 words)"
                          rows={15}
                          maxLength={3000}
                          required
                        />
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-2 text-center">
                            Words remaining: {130 - bodyWordCount}
                          </div>
                          <div className="text-sm text-white flex items-center justify-center space-x-4">
                            <span>Can we share your letter on our social media?</span>
                            <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="sharePublicly"
                                value="yes"
                                checked={sharePublicly === 'yes'}
                                onChange={(e) => setSharePublicly(e.target.value)}
                                required
                                className="accent-[#e63e21]"
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="sharePublicly"
                                value="no"
                                checked={sharePublicly === 'no'}
                                onChange={(e) => setSharePublicly(e.target.value)}
                                required
                                className="accent-[#e63e21]"
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Creating
                              </>
                            ) : (
                              'Create Letter'
                            )}
                          </button>
                          <button
                            type="button"
                            className="px-6 py-2 underline"
                            onClick={() => setPopupStage('email')}
                          >
                            Back
                          </button>
                        </div>
                        {errorMessage && (
                          <div className="text-red-500 text-center mt-2">
                            {errorMessage}
                          </div>
                        )}
                      </form>
                    </div>
                  </>
                ) : popupStage === 'link' ? (
                  <>
                    {/* Link Stage - Improved UI */}
                    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
                      {/* Removed Your Letter Link Section */}

                      {/* New Share with Dad Section */}
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 mt-10">
                        <h2 className="text-black font-bold mb-4 text-[20px] text-center">
                          Share letter with your dad
                        </h2>
                        <div className="flex flex-col items-center space-y-3">
                          <button
                            className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/80 transition-colors duration-200"
                            onClick={async () => {
                              const shareText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;

                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: 'Super Dad Letter',
                                    text: shareText,
                                  });
                                  console.log('Share successful');
                                } catch (error) {
                                  console.error('Error sharing:', error);
                                  // Fallback to clipboard if share fails
                                  try {
                                    await navigator.clipboard.writeText(shareText);
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (clipboardError) {
                                    toast.error('Unable to share. Please copy this link manually: ' + letterLink);
                                  }
                                }
                              } else {
                                // Browser doesn't support Web Share API, copy to clipboard
                                try {
                                  await navigator.clipboard.writeText(shareText);
                                  toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                } catch (clipboardError) {
                                  // Final fallback for very old browsers
                                  const textArea = document.createElement('textarea');
                                  textArea.value = shareText;
                                  textArea.style.position = 'fixed';
                                  textArea.style.opacity = '0';
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();

                                  try {
                                    document.execCommand('copy');
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (execError) {
                                    toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                  } finally {
                                    document.body.removeChild(textArea);
                                  }
                                }
                              }
                            }}
                          >
                            Share
                          </button>

                          <button
                            className="px-6 py-2 text-gray-500"
                            onClick={async () => {
                              const copyText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;
                              try {
                                await navigator.clipboard.writeText(copyText);
                                toast.success('Link copied to clipboard!');
                              } catch (clipboardError) {
                                // Fallback for browsers that don't support clipboard API
                                const textArea = document.createElement('textarea');
                                textArea.value = letterLink;
                                textArea.style.position = 'fixed';
                                textArea.style.opacity = '0';
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();

                                try {
                                  document.execCommand('copy');
                                  toast.success('Link copied to clipboard!');
                                } catch (execError) {
                                  toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                } finally {
                                  document.body.removeChild(textArea);
                                }
                              }
                            }}
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
          <div className="fixed top-120 right-6 bg-[#ffffff] rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-lg z-50">
            <span className="text-[#e63e21] font-bold text-xl leading-none">{letterCount}</span>
            <span className="text-[#e63e21] text-[8px] leading-none">letters sent</span>
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }

  // Desktop view (≥ 1024px)
  return (
    <div className="w-full relative min-h-screen overflow-hidden text-white">
      <div className="video-background relative w-full h-screen overflow-hidden">
        <iframe width="791" height="445" src="https://www.youtube.com/embed/nOOyE9X3AAU?autoplay=1&mute=1" title="Super Dad Animation: How To Calm A Crying Baby (2025)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      {/* Content container */}
      <div className="relative z-10 px-6">
        {/* Navigation */}
        <nav className="w-full flex items-center justify-center py-4 bg-transparent">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex justify-center items-center min-h-screen">
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto mb-20 text-center">
              <h2 className="text-5xl lg:text-6xl mb-6 font-poppins font-bold drop-shadow-lg leading-tight">
                This Father's Day, speak the <br /> love he rarely hears.
              </h2>
              <div className="mb-10 text-white font-poppins text-xl">
                <p> We are writing <b> a million letters </b> to our Dads</p>
              </div>
              <button
                className="px-8 py-3 bg-[#e63e21] text-[#ffffff] rounded-lg text-lg font-poppins font-semibold shadow-lg"
                onClick={openEmailPopup}
              >
                Write him a letter
              </button>
            </div>
          </section>
        </div>
      </div>

      {showEmailPopup && (
        <div
          className="fixed inset-0 bg-[#000000]/60 flex items-center justify-center z-60"
          onClick={closeEmailPopup}
        >
          <div
            className="bg-[#000000]/80 rounded-lg max-w-3xl w-full mx-4 flex overflow-hidden min-h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            {popupStage === 'email' ? (
              <>
                {/* Email Stage */}
                <div className="flex w-full">
                  <div className="w-1/2 p-6 flex flex-col justify-center ">
                    <h2 className='text-white text-left font-bold mb-10 text-[20px]'>Create your Letter</h2>
                    <h3 className="text-[15px] text-left font-regular mb-4 text-white">Enter your email</h3>
                    <form onSubmit={handleEmailSubmit} className="w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        placeholder="Your email"
                        className="w-full p-3 border text-black bg-[#f2f2f2] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="submit"
                        className="w-full mt-4 px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200"
                      >
                        Submit
                      </button>
                    </form>
                    <button
                      onClick={closeEmailPopup}
                      className="mt-4 text-white underline"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/IMG_0234.JPG')" }}></div>
                </div>
              </>
            ) : popupStage === 'letter' ? (
              <>
                {/* Letter Stage */}
                <div className="flex flex-col items-center w-full p-6 max-h-[900px]">
                  <div
                    className="w-full h-full bg-cover bg-center mb-6"
                    style={{ backgroundImage: "url('/src/assets/superdad.jpg')" }}
                  ></div>
                  <form
                    className="w-full  max-w-md"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      setErrorMessage('');
                      try {
                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            email,
                            letterTitle,
                            letterBody,
                            letterSender,
                            sharePublicly,
                          }),
                        });
                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to save letter');
                        }
                        const data = await response.json();
                        // Use slug from response to generate link
                        const generatedLink = `${import.meta.env.VITE_FRONTEND_URL}/letterview/${data.slug}`;
                        setLetterSlug(data.slug);
                        setLetterLink(generatedLink);
                        setPopupStage('link');
                      } catch (error) {
                        setErrorMessage(error.message);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label className="block mb-2 font-regular text-[12px] text-white text-left" htmlFor="title">
                          Title of the letter
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={letterTitle}
                          onChange={(e) => setLetterTitle(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Enter the title"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-2 font-regular text-[12px] text-white text-left" htmlFor="sender">
                          Name of sender
                        </label>
                        <input
                          id="sender"
                          type="text"
                          value={letterSender}
                          onChange={(e) => setLetterSender(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                    <label className="block mb-2 ffont-regular text-[12px] text-white text-left" htmlFor="body">
                      Body of the letter
                    </label>
                    <textarea
                      id="body"
                      value={letterBody}
                      onChange={(e) => {
                        const text = e.target.value;
                        const words = text.trim().split(/\s+/).filter(Boolean);
                        if (words.length <= 130) {
                          setLetterBody(text);
                          setBodyWordCount(words.length);
                        } else {
                          const limitedText = words.slice(0, 130).join(' ');
                          setLetterBody(limitedText);
                          setBodyWordCount(130);
                        }
                      }}
                      className="w-full p-3 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Write your letter here (max 130 words)"
                      rows={15}
                      maxLength={3000}
                      required
                    />
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2 text-center">
                        Words remaining: {130 - bodyWordCount}
                      </div>
                      <div className="text-sm text-white flex items-center justify-center space-x-4">
                        <span>Can we share your letter on our social media?</span>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="sharePublicly"
                            value="yes"
                            checked={sharePublicly === 'yes'}
                            onChange={(e) => setSharePublicly(e.target.value)}
                            required
                            className="accent-[#e63e21]"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="sharePublicly"
                            value="no"
                            checked={sharePublicly === 'no'}
                            onChange={(e) => setSharePublicly(e.target.value)}
                            required
                            className="accent-[#e63e21]"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/50 transition-colors duration-200 flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Creating
                          </>
                        ) : (
                          'Create Letter'
                        )}
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 underline"
                        onClick={() => setPopupStage('email')}
                      >
                        Back
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : popupStage === 'link' ? (
              <>
                {/* Link Stage - Improved UI */}
                <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
                  {/* Removed Your Letter Link Section */}

                  {/* New Share with Dad Section */}
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 mt-10">
                        <h2 className="text-black font-bold mb-4 text-[20px] text-center">
                          Share letter with your dad
                        </h2>
                        <div className="flex flex-col items-center space-y-3">
                          <button
                            className="px-6 py-2 bg-[#e63e21] text-white rounded-md hover:bg-[#e63e21]/80 transition-colors duration-200"
                            onClick={async () => {
                              const shareText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;

                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: 'Super Dad Letter',
                                    text: shareText,
                                  });
                                  console.log('Share successful');
                                } catch (error) {
                                  console.error('Error sharing:', error);
                                  // Fallback to clipboard if share fails
                                  try {
                                    await navigator.clipboard.writeText(shareText);
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (clipboardError) {
                                    toast.error('Unable to share. Please copy this link manually: ' + letterLink);
                                  }
                                }
                              } else {
                                // Browser doesn't support Web Share API, copy to clipboard
                                try {
                                  await navigator.clipboard.writeText(shareText);
                                  toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                } catch (clipboardError) {
                                  // Final fallback for very old browsers
                                  const textArea = document.createElement('textarea');
                                  textArea.value = shareText;
                                  textArea.style.position = 'fixed';
                                  textArea.style.opacity = '0';
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();

                                  try {
                                    document.execCommand('copy');
                                    toast.success('Link copied to clipboard! You can now paste it to share with your dad.');
                                  } catch (execError) {
                                    toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                  } finally {
                                    document.body.removeChild(textArea);
                                  }
                                }
                              }
                            }}
                          >
                            Share
                          </button>

                          <button
                            className="px-6 py-2 text-gray-500"
                            onClick={async () => {
                              const copyText = `Hi dad I just sent you a letter, kindly click on this link ${letterLink} to read the letter`;
                              try {
                                await navigator.clipboard.writeText(copyText);
                                toast.success('Link copied to clipboard!');
                              } catch (clipboardError) {
                                // Fallback for browsers that don't support clipboard API
                                const textArea = document.createElement('textarea');
                                textArea.value = letterLink;
                                textArea.style.position = 'fixed';
                                textArea.style.opacity = '0';
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();

                                try {
                                  document.execCommand('copy');
                                  toast.success('Link copied to clipboard!');
                                } catch (execError) {
                                  toast.error('Unable to copy. Please manually copy this link: ' + letterLink);
                                } finally {
                                  document.body.removeChild(textArea);
                                }
                              }
                            }}
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
      <div className="fixed top-120 right-6 bg-[#ffffff] rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-lg z-50">
        <span className="text-[#e63e21] font-bold text-xl leading-none">{letterCount}</span>
        <span className="text-[#e63e21] text-[8px] leading-none">letters sent</span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LandingPage;
