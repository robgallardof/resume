import { LanguageSkill } from "../types/resume"

export const about = `I’m a Full Stack Developer focused on building well-structured software using .NET on the backend and Vue, React or Next.js on the frontend. I care about code that’s clear, maintainable, and makes sense.

I’m self-taught and I improve by doing — learning what I need when I need it, and always questioning how to make things better. I don’t just write code that works — I want it to be solid, consistent, and easy to work with.

I like clean architecture, logical structure, and building systems that actually solve problems.`

export const contact = {
  email: 'contact@lrobertogallardo.mx',
  website: 'https://robertogallardo.mx',
  linkedin: 'https://linkedin.com/in/robgallardof',
  github: 'https://github.com/robgallardof',
}

export const experience = [
  {
    company: 'Geodis',
    role: 'Full Stack .NET Developer',
    period: 'Jan 2023 – Present',
    details: [
      'Migrated backend systems from .NET 5/6 to .NET 8',
      'Built and deployed containerized services with Docker + Kubernetes',
      'Designed CI/CD pipelines in Azure DevOps, managing secrets and environments',
      'Developed internal tools and dashboards using Vue 3',
      'Integrated MongoDB with SQL Server in hybrid queries',
      'Applied Clean Architecture and unit/integration testing with xUnit + Moq',
    ],
  },
  {
    company: 'Bansí',
    role: '.NET Developer',
    period: 'Feb 2022 – Dec 2022',
    details: [
      'Migrated modules from .NET Framework 4.8 to .NET 5',
      'Developed biometric modules with Watson Mini and Digital Persona',
      'Migrated push system from GCM to FCM, including Android app (Kotlin)',
      'Modified WCF services and ASP.NET web apps (C#, JS, CSS)',
      'Optimized SQL Server and Informix procedures, views, jobs',
    ],
  },
  {
    company: 'Megacable',
    role: 'Developer (VB.NET / C# / Java)',
    period: 'Nov 2019 – Jan 2022',
    details: [
      'Built and optimized SQL Server procedures, views, and jobs',
      'Developed report converter for SSRS (VS2019 to VS2012)',
      'Maintained legacy VBG systems and DLLs for installer tablets',
      'Modified backend flows and APIs in Mulesoft (Java, SOA, SaaS)',
    ],
  },
]

export const skills = [
  { name: 'ASP.NET Core', level: 90 },
  { name: 'MongoDB', level: 85 },
  { name: 'SQL Server', level: 80 },
  { name: 'Vue 3', level: 90 },
  { name: 'React / Next.js', level: 85 },
  { name: 'Azure DevOps', level: 75 },
  { name: 'Docker / K8s', level: 70 },
]

export const certifications = [
  {
    name: 'ASP.NET Core + React',
    issuer: 'Udemy',
    year: '2022',
    url: 'https://www.udemy.com/certificate/UC-d8044950-59cf-4f7c-bddf-aefc501b',
  },
  {
    name: 'Mobile App Development',
    issuer: 'Google',
    year: '2019',
    url: 'https://developers.google.com/learn/certification',
  },
]

export const education = [
  {
    degree: 'Master’s Degree in Software Architecture (In Progress)',
    institution: 'AICAD Business School',
    period: '2024 – 2025',
  },
  {
    degree: 'Bachelor in Administrative Computer Systems',
    institution: 'Universidad Veracruzana',
    period: '2015 – 2019',
  },
]

export const languages: LanguageSkill[] = [
  { name: 'Spanish', level: 'Native', percentage: 100 },
  { name: 'English', level: 'Professional', percentage: 80 },
]