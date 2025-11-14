import { GoogleGenAI, Type } from "@google/genai";
import type { RainfallData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const rainfallRecordSchema = {
    type: Type.OBJECT,
    properties: {
        duration: {
        type: Type.STRING,
        description: "The time duration for the rainfall event (e.g., '5-min', '1-hr').",
        },
        '2-yr': { type: Type.NUMBER },
        '5-yr': { type: Type.NUMBER },
        '10-yr': { type: Type.NUMBER },
        '25-yr': { type: Type.NUMBER },
        '50-yr': { type: Type.NUMBER },
        '100-yr': { type: Type.NUMBER },
    },
    required: ['duration', '2-yr', '5-yr', '10-yr', '25-yr', '50-yr', '100-yr'],
};

const rainfallDataSchema = {
  type: Type.OBJECT,
  properties: {
    intensityData: {
      type: Type.ARRAY,
      description: "An array of rainfall intensity-duration-frequency data points in inches/hour.",
      items: {
        ...rainfallRecordSchema,
        properties: {
            ...rainfallRecordSchema.properties,
            '2-yr': { ...rainfallRecordSchema.properties['2-yr'], description: 'Rainfall intensity for a 2-year return period in inches/hour.' },
            '5-yr': { ...rainfallRecordSchema.properties['5-yr'], description: 'Rainfall intensity for a 5-year return period in inches/hour.' },
            '10-yr': { ...rainfallRecordSchema.properties['10-yr'], description: 'Rainfall intensity for a 10-year return period in inches/hour.' },
            '25-yr': { ...rainfallRecordSchema.properties['25-yr'], description: 'Rainfall intensity for a 25-year return period in inches/hour.' },
            '50-yr': { ...rainfallRecordSchema.properties['50-yr'], description: 'Rainfall intensity for a 50-year return period in inches/hour.' },
            '100-yr': { ...rainfallRecordSchema.properties['100-yr'], description: 'Rainfall intensity for a 100-year return period in inches/hour.' },
        }
      }
    },
    depthData: {
        type: Type.ARRAY,
        description: "An array of rainfall depth-duration-frequency data points in inches.",
        items: {
          ...rainfallRecordSchema,
          properties: {
              ...rainfallRecordSchema.properties,
              '2-yr': { ...rainfallRecordSchema.properties['2-yr'], description: 'Rainfall depth for a 2-year return period in inches.' },
              '5-yr': { ...rainfallRecordSchema.properties['5-yr'], description: 'Rainfall depth for a 5-year return period in inches.' },
              '10-yr': { ...rainfallRecordSchema.properties['10-yr'], description: 'Rainfall depth for a 10-year return period in inches.' },
              '25-yr': { ...rainfallRecordSchema.properties['25-yr'], description: 'Rainfall depth for a 25-year return period in inches.' },
              '50-yr': { ...rainfallRecordSchema.properties['50-yr'], description: 'Rainfall depth for a 50-year return period in inches.' },
              '100-yr': { ...rainfallRecordSchema.properties['100-yr'], description: 'Rainfall depth for a 100-year return period in inches.' },
          }
        }
    },
  },
  required: ['intensityData', 'depthData'],
};

const geocodeSchema = {
  type: Type.OBJECT,
  properties: {
    latitude: {
      type: Type.NUMBER,
      description: "The latitude coordinate."
    },
    longitude: {
      type: Type.NUMBER,
      description: "The longitude coordinate."
    },
  },
  required: ['latitude', 'longitude'],
};


export const fetchRainfallData = async (latitude: number, longitude: number): Promise<RainfallData> => {
  const prompt = `
    You are an expert hydrologist providing data from NOAA Atlas 14 for Pima County, Arizona. 
    For the coordinates Latitude: ${latitude}, Longitude: ${longitude}, generate two realistic precipitation frequency estimates tables.
    1. An intensity table where values are rainfall intensity in inches/hour.
    2. A depth table where values are rainfall depth in inches.
    For both tables, the durations should be '5-min', '15-min', '60-min', '2-hr', '3-hr', '6-hr', '12-hr', '24-hr'.
    The values should be scientifically plausible for the given coordinates.
    Ensure the output is a valid JSON object matching the provided schema, containing both 'intensityData' and 'depthData' arrays.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: rainfallDataSchema,
      },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("API returned an empty response.");
    }

    const parsedData: RainfallData = JSON.parse(text);
    return parsedData;

  } catch (error) {
    console.error("Error fetching or parsing data from Gemini API:", error);
    throw new Error("Failed to get valid data from the AI model.");
  }
};

export const geocodeAddress = async (address: string): Promise<{ latitude: number, longitude: number }> => {
  const prompt = `
    You are an expert geocoding service. Your task is to convert a given U.S. address into precise latitude and longitude coordinates.
    The address is: "${address}".
    Respond ONLY with a valid JSON object that matches the specified schema, containing 'latitude' and 'longitude' keys.
    Example response: { "latitude": 34.0522, "longitude": -118.2437 }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: geocodeSchema,
      },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("API returned an empty response for geocoding.");
    }
    
    const parsedData = JSON.parse(text);

    if (typeof parsedData.latitude !== 'number' || typeof parsedData.longitude !== 'number') {
        throw new Error("Geocoding response is missing latitude or longitude.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error during geocoding with Gemini API:", error);
    throw new Error("Failed geocoding address.");
  }
};
