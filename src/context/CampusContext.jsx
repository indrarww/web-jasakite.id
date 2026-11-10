"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_CAMPUSES } from "@/config/campuses";

const CampusContext = createContext(null);

export function CampusProvider({ children }) {
  // 'all' | 'untan' | 'polnep'
  const [selectedCampus, setSelectedCampus] = useState("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jasakite_selected_campus");
      if (stored && (stored === "all" || SUPPORTED_CAMPUSES.some((c) => c.id === stored))) {
        setSelectedCampus(stored);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const changeCampus = (campusId) => {
    setSelectedCampus(campusId);
    try {
      localStorage.setItem("jasakite_selected_campus", campusId);
    } catch (e) {
      // ignore
    }
  };

  return (
    <CampusContext.Provider
      value={{
        selectedCampus,
        setSelectedCampus: changeCampus,
        campuses: SUPPORTED_CAMPUSES,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus harus digunakan di dalam CampusProvider");
  }
  return context;
}

