import defaultData from "../../data.json";

export interface Experience {
  period: string;
  role: string;
  desc: string;
}

export interface Project {
  id: string;
  title: string;
  meta: string;
  desc: string;
  detailedDesc?: string;
  technologies?: string[];
  repo: string;
  link: string;
}

export interface StackItem {
  name: string;
  color: string;
}

export interface Social {
  name: string;
  url: string;
}

export interface PortfolioData {
  experience: Experience[];
  projects: Project[];
  stack: StackItem[];
  socials: Social[];
}

export async function getPortfolioData(): Promise<PortfolioData> {
  // 1. Try loading from localStorage first (contains local overrides)
  const localDataStr = localStorage.getItem("portfolio_data");
  if (localDataStr) {
    try {
      return JSON.parse(localDataStr);
    } catch (e) {
      console.error("Failed to parse portfolio_data from localStorage", e);
    }
  }

  // 2. Try fetching from the API backend
  try {
    const response = await fetch("/api/data");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn("Failed to fetch from API, falling back to static data:", error);
  }

  // 3. Absolute fallback: use the pre-packaged data.json
  return defaultData as PortfolioData;
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  // Always update local cache instantly so UI reflects changes immediately
  localStorage.setItem("portfolio_data", JSON.stringify(data));

  // Try to write to the backend if the server API exists and is writable
  try {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Server responded with error status");
    }
  } catch (error) {
    console.warn("Could not save to remote server, saved locally instead:", error);
  }
}
