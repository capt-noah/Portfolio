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
  const response = await fetch("/api/data");
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data");
  }
  return response.json();
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to save portfolio data");
  }
}
