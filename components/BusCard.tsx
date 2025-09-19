
import React, { useState } from 'react';
import type { Bus } from '../types';
import { Language } from '../types';
import { translations } from '../constants';
import { formatTime } from '../utils/timeHelper';
import { BusIcon, ArrowRightIcon } from './Icons';

interface BusCardProps {
  bus: Bus;
  lang: Language;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, lang }) => {
  const t = translations[lang];
  const [showRoute, setShowRoute] = useState(false);

  console.log("showRoute", showRoute);


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <BusIcon className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-bold text-slate-800">{bus.name}</h3>
            </div>
            <p className="text-sm text-indigo-500 font-semibold">{bus.type}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">₹{bus.fare}</p>
            <p className="text-xs text-slate-500">{t.fare}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 items-center text-center">
          <div>
            <p className="text-lg font-semibold text-slate-700">{formatTime(bus.departureTime)}</p>
            {typeof bus.from === 'string' ? bus.from : bus.from[lang]}
          </div>
          <div className="flex flex-col items-center">
            <ArrowRightIcon className="w-8 h-8 text-slate-400" />
            <p className="text-xs text-slate-500 mt-1">{bus.duration}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">{formatTime(bus.arrivalTime)}</p>
            <p className="text-sm text-slate-500">
              {typeof bus.to === 'string' ? bus.to : bus.to[lang]}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowRoute(!showRoute)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showRoute ? 'Hide' : t.route} {showRoute ? '▲' : '▼'}
          </button>
        </div>

        {showRoute && bus.route?.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
              {bus.route.map((stop, index) => {

                const langKey = lang?.slice(0, 2) || 'hi';

                const stopName = typeof stop === 'string' ? stop : stop[langKey];

                return (
                  <div
                    key={index}
                    className="relative flex items-center mb-2 last:mb-0"
                  >
                    <div className="absolute left-[-7px] w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div>
                    <p className="ml-6 text-sm text-slate-600">{stopName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}


      </div>
      <div className="bg-slate-50 px-6 py-4">
        <div className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
          <p className="text-center">Platform {bus.platform}</p>
        </div>
      </div>
    </div>
  );
};