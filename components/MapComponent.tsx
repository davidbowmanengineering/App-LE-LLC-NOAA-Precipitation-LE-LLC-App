import React, { useEffect, useRef } from 'react';
import type { RainfallData } from '../types';

// Declare Leaflet global object provided by the script in index.html
declare const L: any;

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onMapInteraction: (lat: number, lng: number) => void;
  rainfallData: RainfallData | null;
}

export const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, onMapInteraction, rainfallData }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: 13,
          scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Handle map click
      map.on('click', (e: any) => {
        onMapInteraction(e.latlng.lat, e.latlng.lng);
      });

      // Handle marker drag
      marker.on('dragend', (event: any) => {
          const position = event.target.getLatLng();
          onMapInteraction(position.lat, position.lng);
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapInteraction]); // Re-create event listeners if callback changes

  // Update map view and marker when props change from form input
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      
      // Check if the marker is already at the target location to avoid redundant updates
      if (!markerRef.current.getLatLng().equals(newLatLng)) {
        markerRef.current.setLatLng(newLatLng);
      }
      
      // Check if the map center is different before panning
      if (!mapRef.current.getCenter().equals(newLatLng)) {
          mapRef.current.panTo(newLatLng);
      }
    }
  }, [latitude, longitude]);

  // Update affected area circle when rainfallData changes
  useEffect(() => {
    if (mapRef.current) {
      // Remove existing circle if it's on the map
      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
        circleRef.current = null;
      }

      if (rainfallData && rainfallData.intensityData && rainfallData.intensityData.length > 0) {
        // Find the maximum 100-year rainfall intensity to determine radius
        const max100yrIntensity = Math.max(...rainfallData.intensityData.map(d => d['100-yr']));
        
        // Calculate radius in meters. Using a scale factor for visualization.
        // e.g., 10 in/hr intensity * 500 = 5000m radius.
        const radius = max100yrIntensity * 500;

        const circle = L.circle([latitude, longitude], {
          color: '#0ea5e9', // sky-500
          fillColor: '#0ea5e9',
          fillOpacity: 0.2,
          radius: radius,
        }).addTo(mapRef.current);

        circleRef.current = circle;

        // Adjust map zoom to fit the circle
        if (radius > 0) {
          mapRef.current.fitBounds(circle.getBounds());
        }
      }
    }
  }, [rainfallData, latitude, longitude]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg z-0" aria-label="Interactive map for coordinate selection" />;
};
