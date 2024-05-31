import { hightlightsSlides } from "../constants/index.js";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { pauseImg, playImg, replayImg } from "../utils/index.js";
import { useGSAP } from "@gsap/react";

export default function VideoCarousel() {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDevRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;
  const [loadedData, setLoadedData] = useState([]);

  useGSAP(() => {
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prevState) => ({
          ...prevState,
          isPlaying: true,
          startPlay: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) currentProgress = progress;
          gsap.to(videoDevRef.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw"
                : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
          });
          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDevRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "afafaf",
            });
          }
        },
      });
    }
  }, [videoId, startPlay]);

  function handleLoadedMetadata(i, e) {
    setLoadedData((prevState) => [...prevState, e]);
  }

  function handleProcess(type, i) {
    switch (type) {
      case "video-end":
        setVideo((prevState) => ({
          ...prevState,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "last-video":
        setVideo((prevState) => ({ ...prevState, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((prevState) => ({
          ...prevState,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prevState) => ({
          ...prevState,
          isPlaying: !prevState.isPlaying,
        }));
        break;
      default:
        return video;
    }
  }

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((item, i) => (
          <div key={item.id} id="slider" className="pr-10 sm:pr-20">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted={true}
                  ref={(el) => {
                    videoRef.current[i] = el;
                  }}
                  onPlay={() => {
                    setVideo((prevState) => ({
                      ...prevState,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(event) => handleLoadedMetadata(i, event)}
                >
                  <source src={item.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {item.textLists.map((text) => (
                  <p key={text} className="text-xl font-medium md:text-2xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDevRef.current[i] = el)}
              className="mx-2 size-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute size-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button
          className="control-btn"
          onClick={
            isLastVideo
              ? () => handleProcess("video-reset")
              : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
          }
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          />
        </button>
      </div>
    </>
  );
}
