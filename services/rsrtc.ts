// // services/rsrtc.ts (Dynamic API Call - CORRECTED)

// // @ts-nocheck
// import type { Bus, Location } from "../types";
// import { locations } from "../constants"; 

// /**
//  * Maps short stop codes from the API (e.g., JPR, KTH) to their full English city names.
//  * This is crucial for linking the API response to your app's Location objects.
//  */
// const STOP_CODE_MAP: { [key: string]: string } = {
//   // Add more codes as needed based on the API response
//   'JPR': 'Jaipur',
//   'JDH': 'Jodhpur',
//   'KTH': 'Kota',
//   'MAB': 'Mount Abu',
//   'DLH': 'Delhi', // Example for non-Rajasthan destination
//   'CHGH': 'Chandigarh',
//   'BRLI': 'Bareilly',
//   'KTP': 'Kotputli',
//   "KKR": "KEKRI",
//   "NGR": "NAGOUR",
//   "SNG": "SANGANER",
//   "BHL": "BHILWARA",
//   "AJM": "AJMER",
//   "ALD": "ALWAR",
//   "BKN": "BIKANER",
//   "JSM": "JASMAND",
//   "JLN": "JALORE",
//   "JSG": "JHUNJHUNU", 
//   "KSR": "KISHANGARH",
//   "LKR": "LAKHERI",
//   "MLD": "MALDA", 
//   "PBL": "PALI",
//   "RNT": "RANTHAMBORE",
//   "SML": "SAMBALPUR", 
//   "TNR": "TONK",
//   "TPT": "TAPUKARA",
//   "UDR": "UDAIPUR",
//   "VNS": "VANAS",
//   "BGR": "BAGRU",
//   "BHR": "BHARATPUR",
//   "DHR": "DHAR",
//   "GGR": "GURUGRAM",
//   "HVR": "HAVERI",
//   "KLR": "KALWAR",
//   "KLRD": "KALWAR ROAD",
//   "LUN": "LUNAWADA",  
//   "MGR": "MANGROL", 
//   "MGRD": "MANGROL ROAD",
//   "MGRN": "MANGROL NAGAR",
//   "MGRP": "MANGROL PUL",  
//   "MGRV": "MANGROL VILLAGE",
//   "MGRW": "MANGROL WARD",
//   "MGRZ": "MANGROL ZONE",
//   "MGRS": "MANGROL STATION",  
//   "MGRB": "MANGROL BAZAR",  
//   "MGRM": "MANGROL MARKET",  
//   "MGRH": "MANGROL HOSPITAL",
//   "HRD": "HARIDWAR",
//   "LKO": "LUCKNOW",
//   "MUS": "MUSSOORIE",
//   "RGR": "RAGHOGARH",
//   "RGRD": "RAGHOGARH ROAD",  
//   // Note: This is a partial list. Extend it based on actual API data.
//   // Note: The API response does not include fare or platform number for these services, 
//   // so we will provide dummy/default values for those fields below.
// };


// /**
//  * Helper function to extract text content of a tag from an XML element.
//  */
// const getXmlValue = (element: Element, tagName: string): string => {
//   const node = element.querySelector(tagName);
//   return node ? node.textContent || '' : '';
// };


// /**
//  * Converts a full English location name into the structured Location object.
//  */
// const mapLocationToLocationObject = (
//   locationName: string
// ): Location | undefined => {
//   const normalizedName = locationName.toLowerCase().trim();

//   const foundKey = Object.keys(locations).find(
//     (key) => typeof locations[key] === 'object' && locations[key].en.toLowerCase() === normalizedName
//   );

//   return foundKey ? locations[foundKey] : undefined;
// };

// /**
//  * Maps a single XML service element (<service> Node) to the 'Bus' type.
//  */
// const mapXmlServiceToBus = (serviceXml: Element): Bus => {
//     // 1. Extract raw data using correct XML tags
//     const serviceId = getXmlValue(serviceXml, 'serviceId');
//     // We use routeName for the display name as the API doesn't provide a short name
//     const routeName = getXmlValue(serviceXml, 'routeName') || "RSRTC Bus";
//     const busType = getXmlValue(serviceXml, 'busType') || "Express";
    
//     // Get stop codes
//     const fromStopCD = getXmlValue(serviceXml, 'fromStopCD');
//     const toStopCD = getXmlValue(serviceXml, 'toStopCD');

//     const departureTime = getXmlValue(serviceXml, 'departureTime'); 
//     const arrivalTime = getXmlValue(serviceXml, 'arrivalTime'); 
//     // Duration is not provided directly; we leave it as N/A
//     const duration = 'N/A'; 
    
//     // 2. Convert codes to full English names
//     const originName = STOP_CODE_MAP[fromStopCD] || fromStopCD;
//     const destinationName = STOP_CODE_MAP[toStopCD] || toStopCD;
    
//     // 3. Map to structured objects
//     const fromLocation = mapLocationToLocationObject(originName) || { en: originName, hi: originName };
//     const toLocation = mapLocationToLocationObject(destinationName) || { en: destinationName, hi: destinationName };

//     return {
//         id: serviceId,
//         name: routeName, // Use routeName as the bus's descriptive name
//         type: busType,
//         from: fromLocation,
//         to: toLocation,
//         departureTime: departureTime.substring(0, 5), // Format to HH:MM
//         arrivalTime: arrivalTime.substring(0, 5), 
//         duration: duration,
//         // The current API response is missing fare/platform; using a fixed/mock value.
//         fare: 0, 
//         platform: 1, 
//         route: [], 
//     };
// };

// /**
//  * Fetches available RSRTC services for a given date and depot.
//  */
// export const getAvailableServices = async (
//   fromCity: string, 
//   toCity: string, 
// ) : Promise<Bus[]> => {
//     // ... (SOAP_ENVELOPE logic remains the same)
//     const currentDate = new Date();
//     const dateOfJourney = `${String(currentDate.getDate()).padStart(
//         2,
//         "0"
//     )}/${String(currentDate.getMonth() + 1).padStart(
//         2,
//         "0"
//     )}/${currentDate.getFullYear()}`;

//     // Simple depot code placeholder
//     const depotCd = fromCity.toLowerCase().includes("jaipur") ? "JPR" : "JDR"; 

//     const SOAP_ENVELOPE = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rsrtc.trimax.com/">
//         <soapenv:Header/>
//         <soapenv:Body>
//         <ser:getAvailableServices>
//             <AvailableServiceRequest>
//             <authentication>
//                 <userName>tmt</userName>
//                 <password>Time@321#</password>
//                 <userType>1</userType>
//             </authentication>
//             <dateOfJourney>${dateOfJourney}</dateOfJourney>
//             <depotCd>${depotCd}</depotCd>
//             </AvailableServiceRequest>
//         </ser:getAvailableServices>
//         </soapenv:Body>
//     </soapenv:Envelope>`;
//     // ... (SOAP_ENVELOPE logic remains the same)


//     try {
//         const response = await fetch(
//           "/api/rsrtc/TimetableServices/VtsService",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "text/xml;charset=UTF-8",
//               SOAPAction: '"getAvailableServices"',
//             },
//             body: SOAP_ENVELOPE,
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const xmlText = await response.text();
        
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlText, "text/xml");

//         // ⬇️ CORRECTED: Target the <service> tag, which is the actual bus element ⬇️
//         const serviceNodes = xmlDoc.querySelectorAll('service');

//         if (serviceNodes.length === 0) {
//             console.warn("No 'service' nodes found in XML response. Check your filtering or API status.", xmlText);
//             return [];
//         }

//         const normalizedToCity = toCity.toLowerCase().trim();

//         const foundBuses = Array.from(serviceNodes)
//           .map(mapXmlServiceToBus)
//           .filter(bus => {
//               // Client-side filtering: Check if the destination city matches the user's request.
//               const busDestination = bus.to.en.toLowerCase().trim();
//               return busDestination === normalizedToCity;
//           })
//           .sort((a, b) => {
//             // Sort by departure time
//             const departureA = new Date(`2000/01/01 ${a.departureTime}`);
//             const departureB = new Date(`2000/01/01 ${b.departureTime}`);
//             return departureA.getTime() - departureB.getTime();
//           });

//         return foundBuses;

//     } catch (error) {
//         console.error("Failed to fetch RSRTC services:", error);
//         return [];
//     }
// };


// services/rsrtc.ts (Updated for Production)

// @ts-nocheck
import type { Bus, Location } from "../types";
import { locations } from "../constants"; 

// Determine if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

/**
 * Maps short stop codes from the API (e.g., JPR, KTH) to their full English city names.
 * This is crucial for linking the API response to your app's Location objects.
 */
const STOP_CODE_MAP: { [key: string]: string } = {
  // Add more codes as needed based on the API response
  'JPR': 'Jaipur',
  'JDH': 'Jodhpur',
  'KTH': 'Kota',
  'MAB': 'Mount Abu',
  'DLH': 'Delhi', // Example for non-Rajasthan destination
  'CHGH': 'Chandigarh',
  'BRLI': 'Bareilly',
  'KTP': 'Kotputli',
  "KKR": "KEKRI",
  "NGR": "NAGOUR",
  "SNG": "SANGANER",
  "BHL": "BHILWARA",
  "AJM": "AJMER",
  "ALD": "ALWAR",
  "BKN": "BIKANER",
  "JSM": "JASMAND",
  "JLN": "JALORE",
  "JSG": "JHUNJHUNU", 
  "KSR": "KISHANGARH",
  "LKR": "LAKHERI",
  "MLD": "MALDA", 
  "PBL": "PALI",
  "RNT": "RANTHAMBORE",
  "SML": "SAMBALPUR", 
  "TNR": "TONK",
  "TPT": "TAPUKARA",
  "UDR": "UDAIPUR",
  "VNS": "VANAS",
  "BGR": "BAGRU",
  "BHR": "BHARATPUR",
  "DHR": "DHAR",
  "GGR": "GURUGRAM",
  "HVR": "HAVERI",
  "KLR": "KALWAR",
  "KLRD": "KALWAR ROAD",
  "LUN": "LUNAWADA",  
  "MGR": "MANGROL", 
  "MGRD": "MANGROL ROAD",
  "MGRN": "MANGROL NAGAR",
  "MGRP": "MANGROL PUL",  
  "MGRV": "MANGROL VILLAGE",
  "MGRW": "MANGROL WARD",
  "MGRZ": "MANGROL ZONE",
  "MGRS": "MANGROL STATION",  
  "MGRB": "MANGROL BAZAR",  
  "MGRM": "MANGROL MARKET",  
  "MGRH": "MANGROL HOSPITAL",
  "HRD": "HARIDWAR",
  "LKO": "LUCKNOW",
  "MUS": "MUSSOORIE",
  "RGR": "RAGHOGARH",
  "RGRD": "RAGHOGARH ROAD",  
  // Note: This is a partial list. Extend it based on actual API data.
  // Note: The API response does not include fare or platform number for these services, 
  // so we will provide dummy/default values for those fields below.
};

/**
 * Helper function to extract text content of a tag from an XML element.
 */
const getXmlValue = (element: Element, tagName: string): string => {
  const node = element.querySelector(tagName);
  return node ? node.textContent || '' : '';
};

/**
 * Converts a full English location name into the structured Location object.
 */
const mapLocationToLocationObject = (
  locationName: string
): Location | undefined => {
  const normalizedName = locationName.toLowerCase().trim();

  const foundKey = Object.keys(locations).find(
    (key) => typeof locations[key] === 'object' && locations[key].en.toLowerCase() === normalizedName
  );

  return foundKey ? locations[foundKey] : undefined;
};

/**
 * Maps a single XML service element (<service> Node) to the 'Bus' type.
 */
const mapXmlServiceToBus = (serviceXml: Element): Bus => {
    // 1. Extract raw data using correct XML tags
    const serviceId = getXmlValue(serviceXml, 'serviceId');
    // We use routeName for the display name as the API doesn't provide a short name
    const routeName = getXmlValue(serviceXml, 'routeName') || "RSRTC Bus";
    const busType = getXmlValue(serviceXml, 'busType') || "Express";
    
    // Get stop codes
    const fromStopCD = getXmlValue(serviceXml, 'fromStopCD');
    const toStopCD = getXmlValue(serviceXml, 'toStopCD');

    const departureTime = getXmlValue(serviceXml, 'departureTime'); 
    const arrivalTime = getXmlValue(serviceXml, 'arrivalTime'); 
    // Duration is not provided directly; we leave it as N/A
    const duration = 'N/A'; 
    
    // 2. Convert codes to full English names
    const originName = STOP_CODE_MAP[fromStopCD] || fromStopCD;
    const destinationName = STOP_CODE_MAP[toStopCD] || toStopCD;
    
    // 3. Map to structured objects
    const fromLocation = mapLocationToLocationObject(originName) || { en: originName, hi: originName };
    const toLocation = mapLocationToLocationObject(destinationName) || { en: destinationName, hi: destinationName };

    return {
        id: serviceId,
        name: routeName, // Use routeName as the bus's descriptive name
        type: busType,
        from: fromLocation,
        to: toLocation,
        departureTime: departureTime.substring(0, 5), // Format to HH:MM
        arrivalTime: arrivalTime.substring(0, 5), 
        duration: duration,
        // The current API response is missing fare/platform; using a fixed/mock value.
        fare: 0, 
        platform: 1, 
        route: [], 
    };
};

/**
 * Helper function to make API request
 */
const makeApiRequest = async (SOAP_ENVELOPE: string) => {
    const response = await fetch(
      isDevelopment 
        ? "/api/rsrtc/TimetableServices/VtsService"  // Development: use Vite proxy
        : "/api/rsrtc/TimetableServices/VtsService",  // Production: use Vercel API route
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: '"getAvailableServices"',
        },
        body: SOAP_ENVELOPE,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
};

/**
 * Check if the response contains connection error
 */
const isConnectionError = (xmlText: string): boolean => {
    return xmlText.includes('Connection Link Error !') || 
           xmlText.includes('errorReason');
};

/**
 * Fetches available RSRTC services for a given date and depot.
 * Automatically retries if connection error occurs.
 */
export const getAvailableServices = async (
  fromCity: string, 
  toCity: string, 
) : Promise<Bus[]> => {
    const currentDate = new Date();
    const dateOfJourney = `${String(currentDate.getDate()).padStart(
        2,
        "0"
    )}/${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
    )}/${currentDate.getFullYear()}`;

    // Simple depot code placeholder
    const depotCd = fromCity.toLowerCase().includes("jaipur") ? "JPR" : "JDR"; 

    const SOAP_ENVELOPE = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rsrtc.trimax.com/">
        <soapenv:Header/>
        <soapenv:Body>
        <ser:getAvailableServices>
            <AvailableServiceRequest>
            <authentication>
                <userName>tmt</userName>
                <password>Time@321#</password>
                <userType>1</userType>
            </authentication>
            <dateOfJourney>${dateOfJourney}</dateOfJourney>
            <depotCd>${depotCd}</depotCd>
            </AvailableServiceRequest>
        </ser:getAvailableServices>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        // First API call
        console.log("Making first API call to establish connection...");
        let xmlText = await makeApiRequest(SOAP_ENVELOPE);
        
        // Check if we got connection error and retry
        if (isConnectionError(xmlText)) {
            console.log("Connection error detected, retrying...");
            // Wait a bit before retry (optional)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Second API call to get actual data
            xmlText = await makeApiRequest(SOAP_ENVELOPE);
            
            // If still connection error, try one more time
            if (isConnectionError(xmlText)) {
                console.log("Still connection error, trying one more time...");
                await new Promise(resolve => setTimeout(resolve, 1000));
                xmlText = await makeApiRequest(SOAP_ENVELOPE);
            }
        }
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Check for error in final response
        const errorReason = xmlDoc.querySelector('errorReason');
        if (errorReason && errorReason.textContent) {
            console.warn("API returned error:", errorReason.textContent);
            return [];
        }

        // ⬇️ CORRECTED: Target the <service> tag, which is the actual bus element ⬇️
        const serviceNodes = xmlDoc.querySelectorAll('service');

        if (serviceNodes.length === 0) {
            console.warn("No 'service' nodes found in XML response. Check your filtering or API status.", xmlText);
            return [];
        }

        const normalizedToCity = toCity.toLowerCase().trim();

        const foundBuses = Array.from(serviceNodes)
          .map(mapXmlServiceToBus)
          .filter(bus => {
              // Client-side filtering: Check if the destination city matches the user's request.
              const busDestination = bus.to.en.toLowerCase().trim();
              return busDestination === normalizedToCity;
          })
          .sort((a, b) => {
            // Sort by departure time
            const departureA = new Date(`2000/01/01 ${a.departureTime}`);
            const departureB = new Date(`2000/01/01 ${b.departureTime}`);
            return departureA.getTime() - departureB.getTime();
          });

        return foundBuses;

    } catch (error) {
        console.error("Failed to fetch RSRTC services:", error);
        return [];
    }
};