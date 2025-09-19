//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { BusCard } from "./components/BusCard";
import { MicrophoneIcon, SearchIcon, ArrowRightIcon } from "./components/Icons";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { DUMMY_BUSES, translations } from "./constants";
import { Language } from "./types";
import type { Bus } from "./types";
import { getDepartureDate, formatTime } from "./utils/timeHelper";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.HINDI);
  const [fromCity, setFromCity] = useState("Jaipur");
  const [toCity, setToCity] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [status, setStatus] = useState<
    "idle" | "listening" | "processing" | "error" | "success" | "no_buses"
  >("idle");
  const [error, setError] = useState("");
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const [triggeredByVoice, setTriggeredByVoice] = useState(false);

  const t = translations[lang];

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error: recognitionError,
    hasRecognitionSupport,
  } = useVoiceRecognition(lang);
  const { speak } = useSpeechSynthesis();

  const parseQueryWithAI = useCallback(
    async (text: string) => {
      setStatus("processing");
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are a helpful assistant for a bus booking app. The user is in Jaipur and wants to find a bus to another city. Analyze the following user query: "${text}". Your task is to extract only the destination city. Also, identify the language of the query. The language must be one of 'en-IN' or 'hi-IN'. Ignore all other words and noise. Focus on identifying a valid city name that is not Jaipur.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                to: { type: Type.STRING, description: "The destination city." },
                language: {
                  type: Type.STRING,
                  description:
                    "The detected language of the query, either 'en-IN' or 'hi-IN'.",
                  enum: [Language.ENGLISH, Language.HINDI],
                },
              },
              required: ["to", "language"],
            },
          },
        });

        const result = JSON.parse(response.text);

        if (result.to && result.language) {
          if (result.to.toLowerCase().trim() === "jaipur") {
            setStatus("error");
            setError(t.jaipurAsDestinationError);
            speak(t.jaipurAsDestinationError, result.language || lang);
            return;
          }

          if (
            result.language === Language.ENGLISH ||
            result.language === Language.HINDI
          ) {
            setLang(result.language);
          }
          setToCity(result.to);
          setTriggeredByVoice(true);
          searchBuses();
        } else {
          throw new Error(
            "Could not parse destination city and language from response."
          );
        }
      } catch (e) {
        console.error("Error processing query:", e);
        setStatus("error");
        setError(t.error);
        speak(t.error, lang);
      }
    },
    [lang, speak, t.error, t.jaipurAsDestinationError]
  );

  useEffect(() => {
    if (transcript) {
      setDisplayedTranscript(transcript);
      parseQueryWithAI(transcript);
    }
  }, [transcript, parseQueryWithAI]);

  useEffect(() => {
    if (isListening) {
      setStatus("listening");
    } else if (status === "listening") {
      if (!transcript) {
        setStatus("idle");
      }
    }
  }, [isListening, status, transcript]);

  useEffect(() => {
    if (recognitionError) {
      setStatus("error");
      setError(t.error);
    }
  }, [recognitionError, t.error]);

  // const searchBuses = useCallback(() => {
  //   if (fromCity && toCity) {
  //       setStatus('processing');
  //       setTimeout(() => {
  //           const from = fromCity.toLowerCase().trim();
  //           const to = toCity.toLowerCase().trim();
  //           const foundBuses = DUMMY_BUSES.filter(bus =>
  //               bus.from.toLowerCase() === from &&
  //               bus.to.toLowerCase() === to
  //           ).sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  //           setBuses(foundBuses);

  //           console.log("Found buses:", foundBuses);

  //           if (foundBuses.length > 0) {
  //               setStatus('success');

  //               const now = new Date();
  //               const upcomingBuses = foundBuses.filter(bus => getDepartureDate(bus.departureTime) > now);
  //               const firstBus = upcomingBuses.length > 0 ? upcomingBuses[0] : foundBuses[0];

  //               let generalAnnouncement;
  //               if (foundBuses.length === 1) {
  //                   generalAnnouncement = t.foundBusSingular
  //                       .replace('{from}', fromCity)
  //                       .replace('{to}', toCity);
  //               } else {
  //                   generalAnnouncement = t.foundBuses
  //                       .replace('{count}', foundBuses.length.toString())
  //                       .replace('{from}', fromCity)
  //                       .replace('{to}', toCity);
  //               }

  //               const detailedAnnouncement = t.firstBusDetails
  //                   .replace('{name}', firstBus.name)
  //                   .replace('{type}', firstBus.type)
  //                   .replace('{platform}', firstBus.platform.toString())
  //                   .replace('{departureTime}', formatTime(firstBus.departureTime))
  //                   .replace('{fare}', firstBus.fare.toString());

  //               speak(generalAnnouncement + detailedAnnouncement, lang);

  //           } else {
  //               setStatus('no_buses');
  //               speak(t.noBuses, lang);
  //           }
  //       }, 300);
  //   }
  // }, [fromCity, toCity, lang, speak, t.noBuses, t.foundBuses, t.foundBusSingular, t.firstBusDetails]);

  // const searchBuses = useCallback(() => {
  //     if (toCity) {
  //         setStatus('processing');
  //         setTimeout(() => {
  //             const to = toCity.toLowerCase().trim();
  //             console.log("Searching buses to:", to);
  //             console.log("DUMMY_BUSES:", DUMMY_BUSES);

  //             const foundBuses = DUMMY_BUSES.filter(bus => {

  //                 if (!bus.to) return false;  // Skip if bus.to is null or undefined

  //                 const toCityValue = typeof bus.to === 'object'
  //                     ? bus?.to[lang === 'en' ? 'hi' : 'en']
  //                     : bus.to;

  //                 return toCityValue && toCityValue.toLowerCase() === to;
  //             }).sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  //             setBuses(foundBuses);

  //             console.log("Found buses:", foundBuses);

  //             if (foundBuses.length > 0) {
  //                 setStatus('success');

  //                 const now = new Date();
  //                 const upcomingBuses = foundBuses.filter(bus => getDepartureDate(bus.departureTime) > now);
  //                 const firstBus = upcomingBuses.length > 0 ? upcomingBuses[0] : foundBuses[0];

  //                  const busWord =
  //             foundBuses.length === 1
  //               ? lang === Language.ENGLISH
  //                 ? "bus"
  //                 : "बस"
  //               : lang === Language.ENGLISH
  //               ? "buses"
  //               : "बसें";

  //                 let generalAnnouncement;
  //                 if (foundBuses.length === 1) {
  //                     generalAnnouncement = t.foundBusSingular
  //                         .replace('{to}', toCity);
  //                 } else {
  //                     generalAnnouncement = t.foundBuses
  //                         .replace('{count}', foundBuses.length.toString())
  //                         .replace('{to}', toCity);
  //                 }

  //                 const detailedAnnouncement = t.firstBusDetails
  //                     .replace('{name}', firstBus.name)
  //                     .replace('{type}', firstBus.type)
  //                     .replace('{platform}', firstBus.platform.toString())
  //                     .replace('{departureTime}', formatTime(firstBus.departureTime))
  //                     .replace('{fare}', firstBus.fare.toString());

  //                 speak(generalAnnouncement + detailedAnnouncement, lang);

  //             } else {
  //                 setStatus('no_buses');
  //                 speak(t.noBuses, lang);
  //             }
  //         }, 300);
  //     }
  // }, [toCity, lang, speak, t.noBuses, t.foundBuses, t.foundBusSingular, t.firstBusDetails]);

  const searchBuses = useCallback(() => {
    if (fromCity && toCity) {
      setStatus("processing");
      setTimeout(() => {
        const from = fromCity.toLowerCase().trim();
        const to = toCity.toLowerCase().trim();

        const foundBuses = DUMMY_BUSES.filter((bus) => {
          const fromCityValue =
            typeof bus.from === "object"
              ? bus.from.en.toLowerCase() === from || bus.from.hi === from
              : typeof bus.from === "string" && bus.from.toLowerCase() === from;

          const toCityValue =
            typeof bus.to === "object"
              ? bus.to.en.toLowerCase() === to || bus.to.hi === to
              : typeof bus.to === "string" && bus.to.toLowerCase() === to;

          return fromCityValue && toCityValue;
        }).sort((a, b) => {
          const departureA = getDepartureDate(a.departureTime);
          const departureB = getDepartureDate(b.departureTime);
          return departureA.getTime() - departureB.getTime();
        });

        setBuses(foundBuses);

        if (foundBuses.length > 0) {
          setStatus("success");

          const firstBus = foundBuses[0];
          const currentLangKey = lang === Language.ENGLISH ? "en" : "hi";

          const fromLocationName =
            typeof firstBus.from === "object"
              ? firstBus.from[currentLangKey]
              : firstBus.from;
          const toLocationName =
            typeof firstBus.to === "object"
              ? firstBus.to[currentLangKey]
              : firstBus.to;

          const busWord =
            foundBuses.length === 1
              ? lang === Language.ENGLISH
                ? "bus"
                : "बस"
              : lang === Language.ENGLISH
              ? "buses"
              : "बसें";

          const generalAnnouncement = t.foundBuses
            .replace("{count}", foundBuses.length.toString())
            .replace("{busWord}", busWord)
            .replace("{from}", fromLocationName)
            .replace("{to}", toLocationName);

          const detailedAnnouncement = t.firstBusDetails
            .replace("{name}", firstBus.name)
            .replace("{type}", firstBus.type)
            .replace("{platform}", firstBus.platform.toString())
            .replace("{departureTime}", formatTime(firstBus.departureTime))
            .replace("{fare}", firstBus.fare.toString());

          speak(generalAnnouncement + detailedAnnouncement, lang);
        } else {
          setStatus("no_buses");
          speak(t.noBuses, lang);
        }
      }, 300);
    }
  }, [
    fromCity,
    toCity,
    lang,
    speak,
    t.noBuses,
    t.foundBuses,
    t.firstBusDetails,
  ]);

  useEffect(() => {
    if (fromCity && toCity && !triggeredByVoice) {
      const handler = setTimeout(() => {
        searchBuses();
      }, 2000);
      return () => clearTimeout(handler);
    }

    if (triggeredByVoice) {
      setTriggeredByVoice(false);
    }
  }, [fromCity, toCity, searchBuses, triggeredByVoice]);

  useEffect(() => {
    if (buses.length > 0) {
      const timer = setTimeout(() => {
        setToCity("");
        setBuses([]);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [buses]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setBuses([]);
      setToCity("");
      setStatus("idle");
      setError("");
      setDisplayedTranscript("");
      startListening();
    }
  };

  const handleSearchClick = () => {
    setBuses([]);
    if (fromCity && toCity) {
      searchBuses();
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "listening":
        return t.listening;
      case "processing":
        return t.processing;
      case "error":
        return error || t.error;
      case "no_buses":
        return t.noBuses;
      case "idle":
      case "success":
      default:
        return t.placeholder;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="https://pbs.twimg.com/profile_images/1329774584384503810/U0Ors9EU_400x400.png"
            alt="RSRTC Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
            {t.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <button
            className={`p-1 rounded ${
              lang === Language.ENGLISH
                ? "font-bold text-indigo-600"
                : "hover:text-indigo-600"
            }`}
            onClick={() => setLang(Language.ENGLISH)}
          >
            EN
          </button>
          <span className="text-slate-300">|</span>
          <button
            className={`p-1 rounded ${
              lang === Language.HINDI
                ? "font-bold text-indigo-600"
                : "hover:text-indigo-600"
            }`}
            onClick={() => setLang(Language.HINDI)}
          >
            HI
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold text-lg">
            <img
              src="./assets/rsrtc-banner.jpg"
              alt="banner"
              className="w-full h-full object-initial rounded-xl"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={fromCity}
                disabled
                placeholder={t.from}
                className="w-full p-4 pl-12 rounded-lg border-2 border-slate-200 bg-slate-100 cursor-not-allowed focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="p-2 text-slate-400 transform rotate-90 sm:rotate-0">
              <ArrowRightIcon className="w-6 h-6" />
            </div>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder={t.to}
                className="w-full p-4 pl-12 rounded-lg border-2 border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={handleSearchClick}
              disabled={!toCity || status === "processing" || isListening}
              className="w-full sm:w-48 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <SearchIcon className="w-5 h-5" />
              <span>{t.search}</span>
            </button>
            {hasRecognitionSupport && (
              <button
                onClick={handleMicClick}
                disabled={status === "processing"}
                className={`relative rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } disabled:bg-slate-400 disabled:cursor-not-allowed`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                <MicrophoneIcon className="w-8 h-8 text-white" />
              </button>
            )}
          </div>
          <p className="text-center mt-4 text-slate-500 min-h-[24px]">
            {getStatusMessage()}
          </p>
          {displayedTranscript && (
            <p className="text-center mt-2 text-slate-600 italic">
              {t.youSaid}"{displayedTranscript}"
            </p>
          )}
        </div>

        {(status === "no_buses" || (status === "error" && !isListening)) && (
          <div className="text-center py-10">
            <p className="text-lg text-slate-500">{getStatusMessage()}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} lang={lang} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
