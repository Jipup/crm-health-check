// CRM Health Check — read-only HubSpot audit.
// Built from the Jipup audit engine (https://jipup.com). Single file, no npm
// dependencies. Talks ONLY to api.hubapi.com, performs ONLY read requests.
// Requires Node.js >= 18. Run with --help for usage.


// src/cli.ts
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// src/report-html.ts
var T = {
  canvas: "#ffffff",
  canvasSoft: "#fafafa",
  ink: "#171717",
  inkMute: "#707070",
  hairline: "#dfdfdf",
  primary: "#3ecf8e",
  primaryDeep: "#24b47e",
  success: "#157f5b",
  warning: "#8a6a00",
  warningFg: "#4a3900",
  destructive: "#d1383d"
};
function severityForScore(score) {
  if (score === null) return "ok";
  if (score <= 65) return "critical";
  if (score <= 85) return "warning";
  return "ok";
}
var SEV_COLOR = {
  ok: T.success,
  warning: T.warning,
  critical: T.destructive
};
var FR = {
  title: "Audit de votre CRM",
  description: "Un diagnostic chiffr\xE9 de la sant\xE9 de vos donn\xE9es HubSpot, en lecture seule.",
  badges: {
    readOnly: "Lecture seule \u2014 rien n'est modifi\xE9 dans HubSpot",
    free: "Gratuit \u2014 ex\xE9cut\xE9 en local, la donn\xE9e reste chez vous"
  },
  lastRun: (d) => `Rapport g\xE9n\xE9r\xE9 le ${d}`,
  score: {
    label: "Score de sant\xE9",
    verdict: {
      excellent: "Base saine. Quelques points d'am\xE9lioration seulement.",
      good: "Base correcte, avec des chantiers clairement identifi\xE9s.",
      fair: "Base d\xE9grad\xE9e : plusieurs points freinent d\xE9j\xE0 votre prospection.",
      poor: "Base critique : une part importante de vos donn\xE9es est inexploitable."
    }
  },
  scanned: { contacts: "Contacts analys\xE9s", companies: "Entreprises", deals: "Transactions" },
  highlights: {
    outdated: {
      title: "Contacts en train de p\xE9rimer",
      unit: "contacts dont le poste a probablement chang\xE9",
      stale: "Sans mise \xE0 jour depuis 2 ans ou plus",
      bounced: "Emails qui ont rebondi d\xE9finitivement",
      dormant: "Sans activit\xE9 depuis plus d'un an"
    },
    missing: {
      title: "Donn\xE9es de contact manquantes",
      unit: "donn\xE9es \xE0 enrichir",
      email: "Sans email",
      phone: "Sans t\xE9l\xE9phone",
      linkedin: "Sans LinkedIn"
    },
    quality: {
      title: "Doublons et impasses",
      unit: "fiches en doublon",
      duplicateContacts: "Contacts en doublon",
      duplicateCompanies: "Entreprises en doublon",
      unreachable: "Contacts injoignables"
    }
  },
  remedyWith: (a) => `Corriger avec ${a}`,
  agents: {
    job_change_tracker: "Suivi des changements de poste",
    crm_enrichment: "Agent d'enrichissement CRM",
    duplicate_detector: "D\xE9tecteur de doublons"
  },
  impact: {
    title: "Impact sur votre chiffre d'affaires",
    description: "Vos chiffres appliqu\xE9s \xE0 ce que le scan a mesur\xE9. Modifiez-en un et tout se recalcule.",
    measured: "Mesur\xE9 dans votre CRM",
    assumption: "Hypoth\xE8se \u2014 modifiable",
    inputs: {
      averageDeal: "Panier moyen (\u20AC)",
      winRate: "Taux de closing (%)",
      customers: "Clients dans votre CRM",
      headcount: "Personnes qui vendent",
      contactsPerDay: "Contacts trait\xE9s / personne / jour",
      minutesPerRecord: "Minutes perdues par fiche inutilisable",
      monthlyCost: "Co\xFBt r\xE9el d'un commercial par mois (\u20AC)"
    },
    minutesHint: "Rep\xE9rer, nettoyer ou enrichir \u2014 hypoth\xE8se modifiable",
    costHint: "Salaire + charges \u2014 hypoth\xE8se modifiable",
    unitHours: "{n} h",
    unitMinutes: "{n} min",
    results: {
      timeLost: "Temps perdu",
      timeLostUnit: "par mois, au total pour {headcount} personne(s)",
      timeLostCost: "{amount} par an \u2014 {perPerson} par personne",
      pipelineLost: "Pipeline dormant",
      pipelineLostUnit: "par an",
      ifFixed: "Si corrig\xE9 aujourd'hui",
      ifFixedUnit: "par an"
    },
    storage: "S'y ajoutent environ {amount} par an pay\xE9s pour stocker {unusable} contacts inutilisables.",
    howTitle: "Comment nous calculons",
    howTimeLost: "{unusable} de vos {total} contacts sont inutilisables ({ratio}). Chaque personne traite {perDay} contacts par jour, soit {perMonth} sur 21 jours ouvr\xE9s, dont {deadEnds} inutilisables en moyenne. \xC0 {minutes} min pour rep\xE9rer, nettoyer ou enrichir une fiche, cela fait {perPerson} par personne et par mois \u2014 soit {hours} pour {headcount} personne(s). Rapport\xE9 \xE0 un mois de 151,67 heures pay\xE9 {monthlyCost} par personne, cela repr\xE9sente {amount} par an.",
    howPipelineLost: "{departed} de vos {customers} clients ont tr\xE8s probablement chang\xE9 d'employeur ({rate} de la base). Les recontacter dans leur nouvelle entreprise, \xE0 {winRate} de taux de closing sur un panier moyen de {deal}, repr\xE9sente {amount} de pipeline que personne ne travaille aujourd'hui.",
    howIfFixed: "Le co\xFBt annuel du temps perdu, plus le pipeline dormant. Rien d'autre n'est ajout\xE9 : ni multiplicateur de productivit\xE9, ni croissance suppos\xE9e."
  },
  completenessChart: {
    title: "Champs manquants",
    description: "Part des fiches o\xF9 le champ est vide. Plus la barre est longue, plus il y a de travail.",
    contacts: "Contacts",
    companies: "Entreprises"
  },
  ageChart: {
    title: "Derni\xE8re mise \xE0 jour de vos contacts",
    description: "Une base concentr\xE9e sur les tranches r\xE9centes peut aussi signaler un import massif \u2014 le chiffre ci-dessous est la lecture honn\xEAte.",
    buckets: { lt3: "< 3 mois", m3to6: "3\u20136 mois", m6to12: "6\u201312 mois", m12to18: "12\u201318 mois", m18to24: "18\u201324 mois", gt24: "> 24 mois" },
    averageAge: "Anciennet\xE9 moyenne : {months} mois",
    neverUpdated: "Jamais modifi\xE9s depuis l'import : {count}"
  },
  ownership: {
    title: "Propri\xE9t\xE9 et activit\xE9",
    withOwner: "Contacts avec un propri\xE9taire",
    unassigned: "Contacts sans propri\xE9taire",
    withActivity: "Contacts avec activit\xE9"
  },
  lifecycleChart: {
    title: "\xC9tapes du cycle de vie",
    description: "R\xE9partition de vos contacts dans l'entonnoir.",
    stages: {
      subscriber: "Abonn\xE9",
      lead: "Lead",
      marketingqualifiedlead: "Qualifi\xE9 marketing",
      salesqualifiedlead: "Qualifi\xE9 commercial",
      opportunity: "Opportunit\xE9",
      customer: "Client",
      evangelist: "Ambassadeur",
      other: "Autre",
      unknown: "Non renseign\xE9"
    }
  },
  cappedNotice: "Votre base d\xE9passe la limite d'analyse. Les chiffres portent sur les fiches parcourues : les totaux r\xE9els sont donc au moins aussi \xE9lev\xE9s.",
  detail: { title: "Le d\xE9tail, pilier par pilier", evidence: "Exemples :" },
  notAnalysed: "Non analys\xE9",
  skipped: {
    missing_scope: "Autorisation manquante",
    missing_property: "Champ absent du portail",
    no_data: "Aucune donn\xE9e"
  },
  pillars: {
    duplicates: { name: "Doublons", description: "Fiches en double parmi vos contacts et vos entreprises." },
    completeness: { name: "Compl\xE9tude", description: "Champs essentiels laiss\xE9s vides sur vos fiches." },
    staleness: { name: "Obsolescence", description: "Contacts dont le poste ou l'entreprise n'est probablement plus \xE0 jour." },
    quality: { name: "Qualit\xE9 et format", description: "Donn\xE9es pr\xE9sentes, mais inutilisables ou incoh\xE9rentes." },
    structure: { name: "Structure", description: "Fiches rattach\xE9es \xE0 rien, ou sans propri\xE9taire actif." },
    freshness: { name: "Fra\xEEcheur", description: "Fiches jamais travaill\xE9es ou dormantes depuis longtemps." },
    deliverability: { name: "D\xE9livrabilit\xE9", description: "Adresses qui ont d\xE9j\xE0 \xE9chou\xE9 ou qui se sont d\xE9sinscrites." },
    pipeline: { name: "Pipeline", description: "Transactions ouvertes qui faussent votre pr\xE9visionnel." },
    schemaDebt: { name: "Dette de champs", description: "Champs personnalis\xE9s jamais remplis ou redondants." }
  },
  checkLabels: {
    "duplicates.contacts": "Contacts en doublon",
    "duplicates.companies": "Entreprises en doublon",
    "completeness.contact.email": "Contacts sans email",
    "completeness.contact.name": "Contacts sans pr\xE9nom",
    "completeness.contact.lastname": "Contacts sans nom",
    "completeness.contact.phone": "Contacts sans t\xE9l\xE9phone",
    "completeness.contact.linkedin": "Contacts sans URL LinkedIn",
    "completeness.contact.jobtitle": "Contacts sans intitul\xE9 de poste",
    "completeness.contact.company": "Contacts sans entreprise renseign\xE9e",
    "completeness.company.domain": "Entreprises sans nom de domaine",
    "completeness.company.name": "Entreprises sans nom",
    "completeness.company.industry": "Entreprises sans secteur",
    "completeness.company.size": "Entreprises sans effectif",
    "completeness.company.location": "Entreprises sans localisation",
    "completeness.company.linkedin": "Entreprises sans page LinkedIn",
    "quality.email.invalid": "Emails structurellement invalides",
    "quality.email.typo": "Emails avec une faute dans le domaine",
    "quality.email.role": "Adresses g\xE9n\xE9riques (contact@, info@\u2026)",
    "quality.email.free": "Adresses personnelles au lieu d'une adresse pro",
    "quality.phone.format": "T\xE9l\xE9phones mal format\xE9s",
    "quality.name.casing": "Noms \xE0 la casse cass\xE9e",
    "quality.company.domain": "Domaines de soci\xE9t\xE9 invalides",
    "quality.company.placeholderName": "Noms d'entreprise g\xE9n\xE9riques",
    "structure.contact.noOwner": "Contacts sans propri\xE9taire",
    "structure.company.noOwner": "Entreprises sans propri\xE9taire",
    "structure.contact.noCompany": "Contacts non rattach\xE9s \xE0 une entreprise",
    "structure.company.noContact": "Entreprises sans aucun contact",
    "structure.owner.inactive": "Fiches d\xE9tenues par des utilisateurs d\xE9sactiv\xE9s",
    "freshness.contact.neverContacted": "Contacts jamais contact\xE9s",
    "freshness.contact.dormant": "Contacts dormants (12+ mois sans activit\xE9)",
    "freshness.contact.neverEdited": "Contacts jamais \xE9dit\xE9s depuis leur cr\xE9ation",
    "freshness.contact.customerWithoutDeal": "Clients sans transaction associ\xE9e",
    "staleness.contact.atRisk": "Contacts \xE0 risque d'obsolescence",
    "staleness.contact.likelyObsolete": "Contacts probablement obsol\xE8tes (changement de poste)",
    "deliverability.hardBounce": "Adresses en bounce d\xE9finitif",
    "deliverability.optout": "Contacts d\xE9sinscrits",
    "deliverability.unreachable": "Contacts injoignables",
    "deliverability.ghost": "Contacts qui n'ouvrent jamais vos emails marketing",
    "deliverability.marketingWaste": "Contacts marketing factur\xE9s mais injoignables",
    "pipeline.deal.overdue": "Transactions \xE0 date de cl\xF4ture d\xE9pass\xE9e",
    "pipeline.deal.stalled": "Transactions au point mort (60+ jours)",
    "pipeline.deal.noAmount": "Transactions sans montant",
    "pipeline.deal.noContact": "Transactions sans contact associ\xE9",
    "schemaDebt.ghostProperties": "Champs personnalis\xE9s fant\xF4mes (jamais remplis)",
    "schemaDebt.redundantProperties": "Champs personnalis\xE9s redondants"
  },
  remediation: {
    title: "Plan de remise \xE0 niveau",
    intro: "Travail compt\xE9 par fiche et par action facturable \u2014 ce que nettoyer cette base implique r\xE9ellement.",
    labels: {
      duplicateContacts: "Contacts en doublon \xE0 v\xE9rifier et fusionner",
      duplicateCompanies: "Entreprises en doublon \xE0 v\xE9rifier et fusionner",
      contactsMissingEmail: "Contacts \xE0 enrichir d'un email",
      contactsMissingPhone: "Contacts \xE0 enrichir d'un t\xE9l\xE9phone",
      contactsNeedingProfile: "Contacts au profil incomplet (LinkedIn, poste\u2026)",
      companiesNeedingEnrichment: "Entreprises \xE0 enrichir (secteur, taille, localisation\u2026)",
      contactsTrackable: "Contacts tra\xE7ables (changement de poste)",
      championContacts: "Contacts \xAB champions \xBB \xE0 surveiller mensuellement",
      monthlyNewContacts: "Nouveaux contacts par mois",
      monthlyNewCompanies: "Nouvelles entreprises par mois"
    },
    notMeasurable: "non mesurable sur ce portail"
  },
  footer: (d) => `Rapport g\xE9n\xE9r\xE9 le ${d}. Aucune donn\xE9e n'a \xE9t\xE9 modifi\xE9e dans HubSpot.`,
  privacy: "Cet audit s'est ex\xE9cut\xE9 en local, en lecture seule, exclusivement contre api.hubapi.com. Aucune donn\xE9e CRM n'a quitt\xE9 votre machine.",
  cleanup: "Vous pouvez maintenant supprimer l'application priv\xE9e dans HubSpot (Param\xE8tres \u2192 Int\xE9grations \u2192 Applications priv\xE9es) \u2014 le token meurt avec elle.",
  cta: "Jipup automatise ces corrections \u2014 d\xE9doublonnage & fusion, enrichissement, suivi des changements de poste \u2014 et peut importer ce rapport \xE0 l'inscription.",
  ctaLink: "Corriger automatiquement avec Jipup",
  builtBy: "R\xE9alis\xE9 par"
};
var EN = {
  title: "Your CRM audit",
  description: "A numbers-first, read-only diagnosis of your HubSpot data health.",
  badges: {
    readOnly: "Read-only \u2014 nothing is modified in HubSpot",
    free: "Free \u2014 runs locally, your data stays with you"
  },
  lastRun: (d) => `Report generated on ${d}`,
  score: {
    label: "Health score",
    verdict: {
      excellent: "Healthy base. Only a few things to improve.",
      good: "Decent base, with clearly identified work to do.",
      fair: "Degraded base: several issues are already slowing your outreach.",
      poor: "Critical base: a large share of your data is unusable."
    }
  },
  scanned: { contacts: "Contacts scanned", companies: "Companies", deals: "Deals" },
  highlights: {
    outdated: {
      title: "Contacts going out of date",
      unit: "contacts whose role has likely changed",
      stale: "Untouched for 2 years or more",
      bounced: "Emails that hard bounced",
      dormant: "No activity for over a year"
    },
    missing: {
      title: "Missing contact data",
      unit: "data points to enrich",
      email: "No email",
      phone: "No phone",
      linkedin: "No LinkedIn"
    },
    quality: {
      title: "Duplicates and dead ends",
      unit: "duplicate records",
      duplicateContacts: "Duplicate contacts",
      duplicateCompanies: "Duplicate companies",
      unreachable: "Contacts with no way to reach them"
    }
  },
  remedyWith: (a) => `Fix with ${a}`,
  agents: {
    job_change_tracker: "Job Change Tracker",
    crm_enrichment: "CRM Enrichment Agent",
    duplicate_detector: "Duplicate Detector"
  },
  impact: {
    title: "Revenue impact",
    description: "Your own figures applied to what the scan measured. Change any of them and everything below recalculates.",
    measured: "Measured in your CRM",
    assumption: "Assumption \u2014 change it",
    inputs: {
      averageDeal: "Average deal (\u20AC)",
      winRate: "Close rate (%)",
      customers: "Customers in your CRM",
      headcount: "People selling",
      contactsPerDay: "Contacts touched / person / day",
      minutesPerRecord: "Minutes lost per unusable record",
      monthlyCost: "True monthly cost of one salesperson (\u20AC)"
    },
    minutesHint: "Spot, clean or enrich \u2014 editable assumption",
    costHint: "Salary + employer charges \u2014 editable assumption",
    unitHours: "{n} h",
    unitMinutes: "{n} min",
    results: {
      timeLost: "Time lost",
      timeLostUnit: "per month, total across {headcount} people",
      timeLostCost: "{amount} per year \u2014 {perPerson} per person",
      pipelineLost: "Dormant pipeline",
      pipelineLostUnit: "per year",
      ifFixed: "If fixed today",
      ifFixedUnit: "per year"
    },
    storage: "On top of that, you pay about {amount} a year to store {unusable} unusable contacts.",
    howTitle: "How we calculate",
    howTimeLost: "{unusable} of your {total} contacts are unusable ({ratio}). Each person touches {perDay} contacts a day \u2014 {perMonth} over 21 working days \u2014 of which {deadEnds} are unusable on average. At {minutes} min to spot, clean or enrich one, that is {perPerson} per person per month \u2014 {hours} across {headcount} people. On a 151.67-hour month paid {monthlyCost} per person, that comes to {amount} a year.",
    howPipelineLost: "{departed} of your {customers} customers have most likely changed employer ({rate} of the base). Re-contacting them at their new company, at a {winRate} close rate on a {deal} average deal, is {amount} of pipeline nobody is working today.",
    howIfFixed: "The yearly cost of the wasted time plus the dormant pipeline. Nothing else is added \u2014 no productivity multiplier, no assumed growth."
  },
  completenessChart: {
    title: "Missing fields",
    description: "Share of records where the field is empty. The longer the bar, the more work.",
    contacts: "Contacts",
    companies: "Companies"
  },
  ageChart: {
    title: "When your contacts were last updated",
    description: "A base concentrated in the recent buckets can also mean one bulk import \u2014 the count below is the honest reading.",
    buckets: { lt3: "< 3 months", m3to6: "3\u20136 months", m6to12: "6\u201312 months", m12to18: "12\u201318 months", m18to24: "18\u201324 months", gt24: "> 24 months" },
    averageAge: "Average age: {months} months",
    neverUpdated: "Never edited since import: {count}"
  },
  ownership: {
    title: "Ownership and activity",
    withOwner: "Contacts with an owner",
    unassigned: "Contacts without an owner",
    withActivity: "Contacts with activity"
  },
  lifecycleChart: {
    title: "Lifecycle stages",
    description: "How your contacts are spread across the funnel.",
    stages: {
      subscriber: "Subscriber",
      lead: "Lead",
      marketingqualifiedlead: "Marketing qualified",
      salesqualifiedlead: "Sales qualified",
      opportunity: "Opportunity",
      customer: "Customer",
      evangelist: "Evangelist",
      other: "Other",
      unknown: "Not set"
    }
  },
  cappedNotice: "Your base exceeds the scan limit. The figures cover the records scanned: the real totals are at least this high.",
  detail: { title: "The detail, pillar by pillar", evidence: "Examples:" },
  notAnalysed: "Not analysed",
  skipped: {
    missing_scope: "Missing permission",
    missing_property: "Field absent from this portal",
    no_data: "No data"
  },
  pillars: {
    duplicates: { name: "Duplicates", description: "Records appearing more than once among your contacts and companies." },
    completeness: { name: "Completeness", description: "Essential fields left empty on your records." },
    staleness: { name: "Staleness", description: "Contacts whose role or company is probably no longer current." },
    quality: { name: "Quality & format", description: "Data that is present but unusable or inconsistent." },
    structure: { name: "Structure", description: "Records attached to nothing, or without an active owner." },
    freshness: { name: "Freshness", description: "Records never worked, or dormant for a long time." },
    deliverability: { name: "Deliverability", description: "Addresses that already failed or opted out." },
    pipeline: { name: "Pipeline", description: "Open deals distorting your forecast." },
    schemaDebt: { name: "Field debt", description: "Custom fields never filled or redundant." }
  },
  checkLabels: {
    "duplicates.contacts": "Duplicate contacts",
    "duplicates.companies": "Duplicate companies",
    "completeness.contact.email": "Contacts without an email",
    "completeness.contact.name": "Contacts without a first name",
    "completeness.contact.lastname": "Contacts without a last name",
    "completeness.contact.phone": "Contacts without a phone",
    "completeness.contact.linkedin": "Contacts without a LinkedIn URL",
    "completeness.contact.jobtitle": "Contacts without a job title",
    "completeness.contact.company": "Contacts without a company",
    "completeness.company.domain": "Companies without a domain",
    "completeness.company.name": "Companies without a name",
    "completeness.company.industry": "Companies without an industry",
    "completeness.company.size": "Companies without a headcount",
    "completeness.company.location": "Companies without a location",
    "completeness.company.linkedin": "Companies without a LinkedIn page",
    "quality.email.invalid": "Structurally invalid emails",
    "quality.email.typo": "Emails with a typo in the domain",
    "quality.email.role": "Role addresses (contact@, info@\u2026)",
    "quality.email.free": "Personal addresses instead of a work one",
    "quality.phone.format": "Badly formatted phone numbers",
    "quality.name.casing": "Names with broken casing",
    "quality.company.domain": "Invalid company domains",
    "quality.company.placeholderName": "Placeholder company names",
    "structure.contact.noOwner": "Contacts without an owner",
    "structure.company.noOwner": "Companies without an owner",
    "structure.contact.noCompany": "Contacts not linked to a company",
    "structure.company.noContact": "Companies without any contact",
    "structure.owner.inactive": "Records owned by deactivated users",
    "freshness.contact.neverContacted": "Contacts never contacted",
    "freshness.contact.dormant": "Dormant contacts (12+ months inactive)",
    "freshness.contact.neverEdited": "Contacts never edited since creation",
    "freshness.contact.customerWithoutDeal": "Customers with no associated deal",
    "staleness.contact.atRisk": "Contacts at risk of being obsolete",
    "staleness.contact.likelyObsolete": "Contacts likely obsolete (job changes)",
    "deliverability.hardBounce": "Hard-bounced addresses",
    "deliverability.optout": "Opted-out contacts",
    "deliverability.unreachable": "Unreachable contacts",
    "deliverability.ghost": "Contacts who never open your marketing emails",
    "deliverability.marketingWaste": "Marketing contacts you pay for but cannot reach",
    "pipeline.deal.overdue": "Deals past their close date",
    "pipeline.deal.stalled": "Stalled deals (60+ days idle)",
    "pipeline.deal.noAmount": "Deals without an amount",
    "pipeline.deal.noContact": "Deals without an associated contact",
    "schemaDebt.ghostProperties": "Ghost custom fields (never filled)",
    "schemaDebt.redundantProperties": "Redundant custom fields"
  },
  remediation: {
    title: "Remediation plan",
    intro: "Work counted per record and per billable action \u2014 what cleaning this base actually involves.",
    labels: {
      duplicateContacts: "Duplicate contacts to review & merge",
      duplicateCompanies: "Duplicate companies to review & merge",
      contactsMissingEmail: "Contacts to enrich with an email",
      contactsMissingPhone: "Contacts to enrich with a phone",
      contactsNeedingProfile: "Contacts with an incomplete profile (LinkedIn, title\u2026)",
      companiesNeedingEnrichment: "Companies to enrich (industry, size, location\u2026)",
      contactsTrackable: "Contacts trackable for job changes",
      championContacts: "Champion contacts worth a monthly watch",
      monthlyNewContacts: "New contacts arriving per month",
      monthlyNewCompanies: "New companies arriving per month"
    },
    notMeasurable: "not measurable on this portal"
  },
  footer: (d) => `Report generated on ${d}. No data was modified in HubSpot.`,
  privacy: "This audit ran locally, read-only, exclusively against api.hubapi.com. No CRM data left your machine.",
  cleanup: "You can now delete the private app in HubSpot (Settings \u2192 Integrations \u2192 Private Apps) \u2014 the token dies with it.",
  cta: "Jipup automates these fixes \u2014 dedup & merge, enrichment, job-change tracking \u2014 and can import this report at signup.",
  ctaLink: "Fix this automatically with Jipup",
  builtBy: "Built by"
};
var CTA_URL = "https://jipup.com?utm_source=crm-health-check&utm_medium=html-report&utm_campaign=lead-magnet";
var ICON = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="8" y1="18" x2="8.01" y2="18"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
};
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
function findCheck(report, id) {
  for (const p of report.pillars) {
    const hit = p.checks.find((c) => c.id === id);
    if (hit) return hit;
  }
  return null;
}
function affected(report, id) {
  const c = findCheck(report, id);
  if (!c || c.skipped || c.score === null) return null;
  return c.affected;
}
function rowsOf(report, spec) {
  const rows = [];
  for (const [key, id] of spec) {
    const c = findCheck(report, id);
    if (!c || c.skipped || c.score === null) continue;
    rows.push({ key, value: c.affected, ratio: c.total > 0 ? c.ratio : null });
  }
  return rows;
}
function renderReportHtml(report, evidence, lang) {
  const t = lang === "fr" ? FR : EN;
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const nf = (n) => n.toLocaleString(locale);
  const eur = (n) => n.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const pctf = (r) => `${Math.round(r * 100)}\xA0%`;
  const date = new Date(report.generatedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const severity = severityForScore(report.score);
  const verdictKey = report.score >= 85 ? "excellent" : report.score >= 70 ? "good" : report.score >= 50 ? "fair" : "poor";
  const capped = report.scanned.contactsCapped || report.scanned.companiesCapped || report.scanned.dealsCapped;
  const evidenceByCheck = /* @__PURE__ */ new Map();
  for (const e of evidence) {
    const b = evidenceByCheck.get(e.checkId) ?? [];
    b.push(e);
    evidenceByCheck.set(e.checkId, b);
  }
  const checkLabel = (id) => t.checkLabels[id] ?? id;
  const highlights = [];
  const likelyObsolete = affected(report, "staleness.contact.likelyObsolete");
  if (likelyObsolete !== null) {
    highlights.push({
      id: "outdated",
      headline: likelyObsolete,
      rows: rowsOf(report, [
        ["stale", "staleness.contact.atRisk"],
        ["bounced", "deliverability.hardBounce"],
        ["dormant", "freshness.contact.dormant"]
      ])
    });
  }
  const missing = rowsOf(report, [
    ["email", "completeness.contact.email"],
    ["phone", "completeness.contact.phone"],
    ["linkedin", "completeness.contact.linkedin"]
  ]);
  if (missing.length > 0) {
    highlights.push({
      id: "missing",
      headline: missing.reduce((s, r) => s + r.value, 0),
      rows: missing
    });
  }
  const dupContacts = affected(report, "duplicates.contacts");
  const dupCompanies = affected(report, "duplicates.companies");
  if (dupContacts !== null || dupCompanies !== null) {
    highlights.push({
      id: "quality",
      headline: (dupContacts ?? 0) + (dupCompanies ?? 0),
      rows: rowsOf(report, [
        ["duplicateContacts", "duplicates.contacts"],
        ["duplicateCompanies", "duplicates.companies"],
        ["unreachable", "deliverability.unreachable"]
      ])
    });
  }
  const HL_THEME = {
    outdated: { icon: ICON.clock, tint: "rgba(209,56,61,0.04)", border: "rgba(209,56,61,0.25)", chipBg: "rgba(209,56,61,0.10)", chipFg: T.destructive, value: T.destructive, agent: "job_change_tracker" },
    missing: { icon: ICON.contact, tint: "rgba(62,207,142,0.05)", border: "rgba(62,207,142,0.35)", chipBg: "rgba(62,207,142,0.15)", chipFg: T.ink, value: T.ink, agent: "crm_enrichment" },
    quality: { icon: ICON.copy, tint: "rgba(138,106,0,0.05)", border: "rgba(138,106,0,0.35)", chipBg: "rgba(138,106,0,0.12)", chipFg: T.warningFg, value: T.warningFg, agent: "duplicate_detector" }
  };
  const highlightCards = highlights.map((h) => {
    const th = HL_THEME[h.id];
    const s = t.highlights[h.id];
    const rows = h.rows.map(
      (r) => `<div class="hl-row"><dt>${s[r.key]}</dt>
            <dd><b>${nf(r.value)}</b>${r.ratio !== null ? ` <span class="mute">(${pctf(r.ratio)})</span>` : ""}</dd></div>`
    ).join("");
    return `<div class="card hl" style="background:${th.tint};border-color:${th.border}">
        <span class="chip-icon" style="background:${th.chipBg};color:${th.chipFg}">${th.icon}</span>
        <div class="hl-num" style="color:${th.value}">${nf(h.headline)}</div>
        <div class="hl-title">${s.title}</div>
        <div class="hl-unit">${s.unit}</div>
        <dl class="hl-rows">${rows}</dl>
        <a class="hl-remedy" href="${CTA_URL}">${t.remedyWith(t.agents[th.agent])} <span class="arrow">${ICON.arrow}</span></a>
      </div>`;
  }).join("");
  const o = report.opportunity;
  const impactConfig = {
    locale,
    unusable: report.waste?.unusableContacts ?? 0,
    totalContacts: report.scanned.contacts,
    departureRate: o?.departureRate ?? 0,
    defaults: {
      averageDeal: o?.averageDealEuros ?? 1e4,
      winRate: Math.round((o?.assumedWinRate ?? 0.5) * 100),
      customers: o?.customers ?? 0,
      headcount: 3,
      contactsPerDay: 25,
      minutesPerRecord: 4,
      monthlyCost: 5e3
    },
    strings: {
      unitHours: t.impact.unitHours,
      unitMinutes: t.impact.unitMinutes,
      timeLostUnit: t.impact.results.timeLostUnit,
      timeLostCost: t.impact.results.timeLostCost,
      howTimeLost: t.impact.howTimeLost,
      howPipelineLost: t.impact.howPipelineLost
    }
  };
  const stepper = (id, label, hint, min, max, step) => `<div class="stepper">
    <label for="in-${id}">${label}</label>
    <div class="stepper-ctl">
      <button type="button" data-step="-${step}" data-for="${id}" aria-label="\u2212">\u2212</button>
      <input id="in-${id}" data-input="${id}" type="text" inputmode="numeric" data-min="${min}" data-max="${max}">
      <button type="button" data-step="${step}" data-for="${id}" aria-label="+">+</button>
    </div>
    <p class="hint">${hint}</p>
  </div>`;
  const measuredHint = (isMeasured) => isMeasured ? t.impact.measured : t.impact.assumption;
  const impactSection = `<div class="card pad">
    <div class="section-head">
      <span class="chip-icon" style="background:rgba(62,207,142,0.15);color:${T.ink}">${ICON.calculator}</span>
      <div><h2>${t.impact.title}</h2><p class="mute">${t.impact.description}</p></div>
    </div>
    <div class="stepper-grid">
      ${stepper("averageDeal", t.impact.inputs.averageDeal, measuredHint(o?.averageDealSource === "crm"), 100, 1e7, 1e3)}
      ${stepper("winRate", t.impact.inputs.winRate, t.impact.assumption, 0, 100, 5)}
      ${stepper("customers", t.impact.inputs.customers, measuredHint(o?.customersSource === "crm"), 0, 1e6, 10)}
      ${stepper("headcount", t.impact.inputs.headcount, t.impact.assumption, 1, 500, 1)}
      ${stepper("contactsPerDay", t.impact.inputs.contactsPerDay, t.impact.assumption, 1, 500, 5)}
      ${stepper("minutesPerRecord", t.impact.inputs.minutesPerRecord, t.impact.minutesHint, 1, 120, 1)}
      ${stepper("monthlyCost", t.impact.inputs.monthlyCost, t.impact.costHint, 500, 1e5, 500)}
    </div>
    <div class="results">
      <div class="result"><p class="mute small">${t.impact.results.timeLost}</p>
        <p class="result-value">\u2212 <span id="r-time"></span></p>
        <p class="mute small" id="r-time-unit"></p><p class="mute small" id="r-time-cost"></p></div>
      <div class="result"><p class="mute small">${t.impact.results.pipelineLost}</p>
        <p class="result-value">\u2212 <span id="r-pipeline"></span></p>
        <p class="mute small">${t.impact.results.pipelineLostUnit}</p></div>
      <div class="result"><p class="mute small">${t.impact.results.ifFixed}</p>
        <p class="result-value" style="color:${T.success}">+ <span id="r-fixed"></span></p>
        <p class="mute small">${t.impact.results.ifFixedUnit}</p></div>
    </div>
    ${report.waste ? `<p class="mute small">${fill(t.impact.storage, { amount: eur(report.waste.eurosPerYear), unusable: nf(report.waste.unusableContacts) })}</p>` : ""}
    <details class="how">
      <summary>${t.impact.howTitle}</summary>
      <p id="how-time"></p>
      <p id="how-pipeline"></p>
      <p>${t.impact.howIfFixed}</p>
    </details>
  </div>`;
  const completenessGroup = (object, label) => {
    const pillar = report.pillars.find((p) => p.id === "completeness");
    if (!pillar) return "";
    const prefix = `completeness.${object}.`;
    const rows = pillar.checks.filter((c) => c.id.startsWith(prefix) && !c.skipped && c.score !== null && c.total > 0).map((c) => ({ id: c.id, missing: c.ratio })).sort((a, b) => b.missing - a.missing);
    if (rows.length === 0) return "";
    const bars = rows.map((r) => {
      const sev = severityForScore(Math.round((1 - r.missing) * 100));
      const width = r.missing > 0 ? Math.max(r.missing * 100, 0.5) : 0;
      return `<div class="bar-row">
          <div class="bar-head"><span>${checkLabel(r.id)}</span>
            <span class="bar-pct" style="color:${SEV_COLOR[sev]}">${pctf(r.missing)}</span></div>
          <div class="track"><div class="bar" style="width:${width.toFixed(1)}%;background:${SEV_COLOR[sev]}"></div></div>
        </div>`;
    }).join("");
    return `<div><p class="group-label">${label}</p>${bars}</div>`;
  };
  const contactsGroup = completenessGroup("contact", t.completenessChart.contacts);
  const companiesGroup = completenessGroup("company", t.completenessChart.companies);
  const completenessSection = contactsGroup || companiesGroup ? `<div class="card pad">
          <h2>${t.completenessChart.title}</h2><p class="mute">${t.completenessChart.description}</p>
          <div class="grid-2 gap-lg">${contactsGroup}${companiesGroup}</div>
        </div>` : "";
  const age = report.distributions?.contactAge;
  let ageSection = "";
  if (age && age.dated > 0) {
    const max = Math.max(...age.buckets.map((b) => b.contacts), 1);
    const OPACITY = [0.25, 0.4, 0.55, 0.7, 0.85, 1];
    const cols = age.buckets.map((b, i) => {
      const h = Math.max(b.contacts / max * 100, b.contacts > 0 ? 2 : 0);
      return `<div class="age-col"><span class="age-count">${nf(b.contacts)}</span>
          <div class="age-slot"><div class="age-bar" style="height:${h.toFixed(1)}%;background:${T.primary};opacity:${OPACITY[i] ?? 1}"></div></div>
        </div>`;
    }).join("");
    const labels = age.buckets.map((b) => `<span class="age-label">${t.ageChart.buckets[b.id] ?? b.id}</span>`).join("");
    ageSection = `<div class="card pad">
      <h2>${t.ageChart.title}</h2><p class="mute">${t.ageChart.description}</p>
      <div class="age-chart">${cols}</div>
      <div class="age-labels">${labels}</div>
      <p class="mute small">${fill(t.ageChart.averageAge, { months: nf(Math.round(age.averageMonths)) })}${age.neverUpdated !== null ? " \xB7 " + fill(t.ageChart.neverUpdated, { count: nf(age.neverUpdated) }) : ""}</p>
    </div>`;
  }
  const meter = (label, ratio, caption) => {
    const sev = severityForScore(Math.round(ratio * 100));
    return `<div class="bar-row">
      <div class="bar-head"><span>${label}</span>
        <span class="bar-pct" style="color:${SEV_COLOR[sev]}">${pctf(ratio)}</span></div>
      <div class="track"><div class="bar" style="width:${Math.max(ratio * 100, 1).toFixed(1)}%;background:${SEV_COLOR[sev]}"></div></div>
      <p class="mute small">${caption}</p>
    </div>`;
  };
  const noOwner = findCheck(report, "structure.contact.noOwner");
  const never = findCheck(report, "freshness.contact.neverContacted");
  const ownerOk = noOwner && !noOwner.skipped && noOwner.score !== null;
  const neverOk = never && !never.skipped && never.score !== null;
  let ownershipCard = "";
  if (ownerOk || neverOk) {
    ownershipCard = `<div class="card pad">
      <h2>${t.ownership.title}</h2>
      ${ownerOk ? meter(t.ownership.withOwner, noOwner.total > 0 ? 1 - noOwner.ratio : 0, `${nf(noOwner.total - noOwner.affected)} / ${nf(noOwner.total)}`) : ""}
      ${neverOk ? meter(t.ownership.withActivity, 1 - never.ratio, `${nf(never.total - never.affected)} / ${nf(never.total)}`) : ""}
      ${ownerOk ? `<div class="unassigned"><p class="mute small">${t.ownership.unassigned}</p>
             <p class="unassigned-num">${nf(noOwner.affected)}</p></div>` : ""}
    </div>`;
  }
  const lifecycle2 = report.distributions?.lifecycle;
  let lifecycleCard = "";
  if (lifecycle2 && lifecycle2.length > 0) {
    const maxStage = Math.max(...lifecycle2.map((s) => s.contacts), 1);
    const rows = lifecycle2.map((s) => {
      const label = t.lifecycleChart.stages[s.stage] ?? esc(s.stage.charAt(0).toUpperCase() + s.stage.slice(1));
      return `<div class="bar-row">
          <div class="bar-head"><span>${label}</span><span class="bar-pct" style="color:${T.ink}">${nf(s.contacts)}</span></div>
          <div class="track"><div class="bar" style="width:${Math.max(s.contacts / maxStage * 100, 1).toFixed(1)}%;background:${T.primary}"></div></div>
        </div>`;
    }).join("");
    lifecycleCard = `<div class="card pad">
      <h2>${t.lifecycleChart.title}</h2><p class="mute">${t.lifecycleChart.description}</p>${rows}
    </div>`;
  }
  const funnelSection = ownershipCard || lifecycleCard ? `<div class="grid-2 gap">${ownershipCard}${lifecycleCard}</div>` : "";
  const pillarBlock = (p) => {
    const info = t.pillars[p.id];
    const head = p.score === null ? `<span class="pill-na">${t.notAnalysed}${p.skipped ? ` \u2014 ${t.skipped[p.skipped] ?? p.skipped}` : ""}</span>` : `<span class="pill-score" style="color:${SEV_COLOR[p.severity]}">${p.score}<span class="mute">/100</span></span>`;
    const rows = p.checks.filter((c) => c.score !== null && c.affected > 0).sort((a, b) => (a.score ?? 0) - (b.score ?? 0)).map((c) => {
      const samples = (evidenceByCheck.get(c.id) ?? []).slice(0, 3);
      const links = samples.map((e) => {
        const name = esc(e.objectName ?? e.objectId);
        return e.hubspotUrl ? `<a href="${esc(e.hubspotUrl)}" target="_blank" rel="noopener">${name}</a>` : name;
      }).join(" \xB7 ");
      return `<div class="check-row">
          <span class="check-label">${checkLabel(c.id)}</span>
          <span class="check-count"><b>${nf(c.affected)}</b> <span class="mute">/ ${nf(c.total)} (${pctf(c.ratio)})</span></span>
          ${links ? `<span class="check-samples">${t.detail.evidence} ${links}</span>` : ""}
        </div>`;
    }).join("");
    return `<div class="pillar-block">
      <div class="pillar-head"><div><span class="pillar-name">${info.name}</span>
        <span class="mute small"> \u2014 ${info.description}</span></div>${head}</div>
      ${rows}
    </div>`;
  };
  const detailSection = `<div class="card pad">
    <h2>${t.detail.title}</h2>
    ${report.pillars.map(pillarBlock).join("")}
  </div>`;
  const rem = report.remediation;
  let remSection = "";
  if (rem) {
    const rows = [
      ["duplicateContacts", rem.duplicateContacts],
      ["duplicateCompanies", rem.duplicateCompanies],
      ["contactsMissingEmail", rem.contactsMissingEmail],
      ["contactsMissingPhone", rem.contactsMissingPhone],
      ["contactsNeedingProfile", rem.contactsNeedingProfile],
      ["companiesNeedingEnrichment", rem.companiesNeedingEnrichment],
      ["contactsTrackable", rem.contactsTrackable],
      ["championContacts", rem.championContacts],
      ["monthlyNewContacts", rem.monthlyNewContacts],
      ["monthlyNewCompanies", rem.monthlyNewCompanies]
    ];
    const trs = rows.filter(([, v]) => v !== void 0).map(
      ([k, v]) => `<tr><td>${t.remediation.labels[k] ?? k}</td>
           <td class="num">${v == null ? `<span class="mute">${t.remediation.notMeasurable}</span>` : nf(v)}</td></tr>`
    ).join("");
    remSection = `<div class="card pad">
      <h2>${t.remediation.title}</h2><p class="mute">${t.remediation.intro}</p>
      <table><tbody>${trs}</tbody></table>
    </div>`;
  }
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.title}${report.portalId ? ` \u2014 ${report.portalId}` : ""}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; }
  body {
    background: ${T.canvas}; color: ${T.ink};
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.5; padding: 40px 24px 64px; font-size: 14px;
  }
  .wrap { max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  h1 { font-size: 28px; font-weight: 550; letter-spacing: -0.02em; }
  h2 { font-size: 15px; font-weight: 550; }
  a { color: inherit; }
  .mute { color: ${T.inkMute}; }
  .small { font-size: 12px; }
  .badges { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-size: 13px; color: ${T.inkMute}; }
  .badge { display: inline-flex; align-items: center; gap: 6px; }
  .badge svg { width: 15px; height: 15px; }
  .lastrun { margin-top: 10px; font-size: 12.5px; color: ${T.inkMute}; }
  .card { background: ${T.canvas}; border: 1px solid ${T.hairline}; border-radius: 12px; }
  .pad { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
  .gap { gap: 16px; } .gap-lg { gap: 24px 40px; }
  /* Score */
  .score-card { padding: 24px; }
  .score-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 24px; }
  .score-num { font-size: 48px; font-weight: 550; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .score-denom { font-size: 18px; color: ${T.inkMute}; }
  .score-verdict { margin-top: 4px; }
  .scanned { display: grid; grid-template-columns: auto auto; gap: 4px 32px; align-content: start; text-align: right; }
  .scanned dt { color: ${T.inkMute}; text-align: left; }
  .scanned dd { font-variant-numeric: tabular-nums; }
  .progress { margin-top: 24px; height: 6px; border-radius: 3px; background: ${T.canvasSoft}; border: 1px solid ${T.hairline}; overflow: hidden; }
  .progress > div { height: 100%; border-radius: 3px; }
  /* Highlights */
  .hl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .hl { padding: 20px; display: flex; flex-direction: column; gap: 4px; }
  .chip-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; flex: none; }
  .chip-icon svg { width: 16px; height: 16px; }
  .hl-num { font-size: 34px; font-weight: 550; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin-top: 10px; }
  .hl-title { font-weight: 550; }
  .hl-unit { font-size: 12px; color: ${T.inkMute}; }
  .hl-rows { margin-top: 12px; border-top: 1px solid ${T.hairline}; padding-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .hl-row { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; }
  .hl-row dt { color: ${T.inkMute}; }
  .hl-row dd { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .hl-remedy { margin-top: 14px; font-size: 12.5px; font-weight: 550; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .hl-remedy:hover { text-decoration: underline; }
  .arrow svg { width: 13px; height: 13px; vertical-align: -2px; }
  /* Impact */
  .section-head { display: flex; gap: 12px; align-items: flex-start; }
  .stepper-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
  .stepper label { font-size: 12.5px; font-weight: 550; display: block; margin-bottom: 6px; }
  .stepper-ctl { display: flex; border: 1px solid ${T.hairline}; border-radius: 8px; overflow: hidden; }
  .stepper-ctl button { width: 36px; border: none; background: ${T.canvasSoft}; font-size: 16px; cursor: pointer; color: ${T.ink}; }
  .stepper-ctl button:hover { background: #f0f0f0; }
  .stepper-ctl input { flex: 1; min-width: 0; border: none; text-align: center; font: inherit; font-variant-numeric: tabular-nums; padding: 8px 4px; outline: none; }
  .hint { font-size: 11px; color: ${T.inkMute}; margin-top: 4px; }
  .results { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .result { border: 1px solid ${T.hairline}; border-radius: 10px; padding: 14px 16px; }
  .result-value { font-size: 24px; font-weight: 550; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; margin: 2px 0; }
  .how summary { cursor: pointer; font-size: 13px; color: ${T.inkMute}; }
  .how summary:hover { color: ${T.ink}; }
  .how p { margin-top: 10px; font-size: 12px; line-height: 1.6; color: ${T.inkMute}; }
  /* Bars & meters */
  .group-label { font-size: 11px; font-weight: 550; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.inkMute}; margin-bottom: 10px; }
  .bar-row { margin-bottom: 12px; }
  .bar-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
  .bar-pct { font-size: 12px; font-weight: 550; font-variant-numeric: tabular-nums; }
  .track { height: 6px; border-radius: 3px; background: ${T.canvasSoft}; border: 1px solid ${T.hairline}; overflow: hidden; }
  .bar { height: 100%; border-radius: 3px; }
  .unassigned { border-top: 1px solid ${T.hairline}; padding-top: 12px; }
  .unassigned-num { font-size: 24px; font-weight: 550; font-variant-numeric: tabular-nums; color: ${T.warningFg}; }
  /* Age chart */
  .age-chart { display: flex; align-items: flex-end; gap: 8px; height: 9rem; }
  .age-col { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
  .age-count { font-size: 12px; font-weight: 550; font-variant-numeric: tabular-nums; }
  .age-slot { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .age-bar { width: 100%; border-radius: 4px 4px 0 0; }
  .age-labels { display: flex; gap: 8px; border-top: 1px solid ${T.hairline}; padding-top: 8px; }
  .age-label { flex: 1; min-width: 0; text-align: center; font-size: 11.5px; color: ${T.inkMute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Capped notice */
  .capped { display: flex; gap: 10px; align-items: flex-start; border: 1px solid ${T.hairline}; background: ${T.canvasSoft}; border-radius: 10px; padding: 16px; color: ${T.inkMute}; }
  .capped svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
  /* Detail */
  .pillar-block { border-top: 1px solid ${T.hairline}; padding-top: 14px; }
  .pillar-block:first-of-type { border-top: none; padding-top: 0; }
  .pillar-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; margin-bottom: 8px; }
  .pillar-name { font-weight: 550; }
  .pill-score { font-weight: 550; font-size: 15px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .pill-na { font-size: 12px; color: ${T.inkMute}; white-space: nowrap; }
  .check-row { display: flex; flex-wrap: wrap; gap: 4px 12px; justify-content: space-between; font-size: 13px; padding: 4px 0; }
  .check-label { min-width: 200px; }
  .check-count { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .check-samples { flex-basis: 100%; font-size: 12px; color: ${T.inkMute}; }
  .check-samples a { color: ${T.primaryDeep}; text-decoration: none; }
  .check-samples a:hover { text-decoration: underline; }
  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  td { padding: 8px 4px; border-top: 1px solid ${T.hairline}; }
  tr:first-child td { border-top: none; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 550; white-space: nowrap; }
  /* Footer */
  footer { font-size: 12.5px; color: ${T.inkMute}; display: flex; flex-direction: column; gap: 8px; }
  .cta-btn { align-self: flex-start; padding: 10px 18px; border-radius: 8px; background: ${T.primary}; color: ${T.ink}; font-weight: 550; font-size: 13.5px; text-decoration: none; }
  .cta-btn:hover { background: ${T.primaryDeep}; }
  @media print { body { padding: 0; } .cta-btn, .stepper-ctl button { display: none; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>${t.title}</h1>
    <p class="mute" style="margin-top:4px">${t.description}</p>
    <div class="badges">
      <span class="badge">${ICON.shield} ${t.badges.readOnly}</span>
      <span class="badge">${ICON.scan} ${t.badges.free}</span>
    </div>
    <p class="lastrun">${t.lastRun(date)}${report.portalId ? ` \xB7 Portal ${report.portalId}` : ""}</p>
  </header>

  <div class="card score-card">
    <div class="score-top">
      <div>
        <p class="mute">${t.score.label}</p>
        <p><span class="score-num" style="color:${SEV_COLOR[severity]}">${report.score}</span><span class="score-denom"> /100</span></p>
        <p class="score-verdict">${t.score.verdict[verdictKey]}</p>
      </div>
      <dl class="scanned">
        <dt>${t.scanned.contacts}</dt><dd>${nf(report.scanned.contacts)}</dd>
        <dt>${t.scanned.companies}</dt><dd>${nf(report.scanned.companies)}</dd>
        ${report.capabilities.includes("deals") ? `<dt>${t.scanned.deals}</dt><dd>${nf(report.scanned.deals)}</dd>` : ""}
      </dl>
    </div>
    <div class="progress"><div style="width:${report.score}%;background:${SEV_COLOR[severity]}"></div></div>
  </div>

  <div class="hl-grid">${highlightCards}</div>

  ${impactSection}
  ${completenessSection}
  ${ageSection}
  ${funnelSection}
  ${capped ? `<div class="capped">${ICON.alert}<p>${t.cappedNotice}</p></div>` : ""}
  ${detailSection}
  ${remSection}

  <footer>
    <p>${t.footer(date)}</p>
    <p>${t.privacy}</p>
    <p>${t.cleanup}</p>
    <p>${t.cta}</p>
    <a class="cta-btn" href="${CTA_URL}">${t.ctaLink}</a>
    <p>${t.builtBy} <a href="${CTA_URL}">Jipup</a> \xB7 CRM Health Check v${report.version}</p>
  </footer>
</div>

<script>
(function () {
  var cfg = ${JSON.stringify(impactConfig)};
  var v = Object.assign({}, cfg.defaults);
  var nf = function (n) { return n.toLocaleString(cfg.locale); };
  var eur = function (n) {
    return n.toLocaleString(cfg.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  };
  var pct = function (r) { return Math.round(r * 100) + "\\u00A0%"; };
  var fill = function (tpl, vars) {
    return tpl.replace(/\\{(\\w+)\\}/g, function (_, k) { return String(vars[k] != null ? vars[k] : ""); });
  };
  var duration = function (hours) {
    var minutes = Math.round(hours * 60);
    if (minutes < 60) return fill(cfg.strings.unitMinutes, { n: nf(minutes) });
    var n = hours >= 10 ? Math.round(hours) : Math.round(hours * 10) / 10;
    return fill(cfg.strings.unitHours, { n: nf(n) });
  };
  var $ = function (id) { return document.getElementById(id); };

  function recalc() {
    var unusableRatio = cfg.totalContacts > 0 ? cfg.unusable / cfg.totalContacts : 0;
    var contactsPerMonth = v.contactsPerDay * 21;
    var deadEnds = contactsPerMonth * unusableRatio;
    var hoursPerPerson = (deadEnds * v.minutesPerRecord) / 60;
    var hoursTotal = hoursPerPerson * v.headcount;
    var costPerYear = (hoursTotal / 151.67) * v.monthlyCost * 12;
    var departed = Math.round(v.customers * cfg.departureRate);
    var pipelineLost = departed * (v.winRate / 100) * v.averageDeal;

    $("r-time").textContent = duration(hoursTotal);
    $("r-time-unit").textContent = fill(cfg.strings.timeLostUnit, { headcount: nf(v.headcount) });
    $("r-time-cost").textContent = fill(cfg.strings.timeLostCost, {
      amount: eur(costPerYear), perPerson: duration(hoursPerPerson) });
    $("r-pipeline").textContent = eur(pipelineLost);
    $("r-fixed").textContent = eur(costPerYear + pipelineLost);
    $("how-time").textContent = fill(cfg.strings.howTimeLost, {
      unusable: nf(cfg.unusable), total: nf(cfg.totalContacts), ratio: pct(unusableRatio),
      perDay: nf(v.contactsPerDay), perMonth: nf(Math.round(contactsPerMonth)),
      deadEnds: nf(Math.round(deadEnds * 10) / 10), minutes: nf(v.minutesPerRecord),
      perPerson: duration(hoursPerPerson), headcount: nf(v.headcount),
      hours: duration(hoursTotal), monthlyCost: eur(v.monthlyCost), amount: eur(costPerYear) });
    $("how-pipeline").textContent = fill(cfg.strings.howPipelineLost, {
      departed: nf(departed), customers: nf(v.customers), rate: pct(cfg.departureRate),
      winRate: pct(v.winRate / 100), deal: eur(v.averageDeal), amount: eur(pipelineLost) });
    document.querySelectorAll("[data-input]").forEach(function (input) {
      if (document.activeElement !== input) input.value = nf(v[input.dataset.input]);
    });
  }

  document.querySelectorAll("[data-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.dataset.for;
      var input = document.querySelector('[data-input="' + key + '"]');
      var min = Number(input.dataset.min), max = Number(input.dataset.max);
      v[key] = Math.min(max, Math.max(min, v[key] + Number(btn.dataset.step)));
      recalc();
    });
  });
  document.querySelectorAll("[data-input]").forEach(function (input) {
    input.addEventListener("change", function () {
      var raw = Number(String(input.value).replace(/[^0-9.,-]/g, "").replace(",", "."));
      var min = Number(input.dataset.min), max = Number(input.dataset.max);
      if (isFinite(raw)) v[input.dataset.input] = Math.min(max, Math.max(min, Math.round(raw)));
      recalc();
    });
  });
  recalc();
})();
</script>
</body>
</html>`;
}

// ../shared/common/src/lib/hubspot-oauth.ts
var HUBSPOT_OAUTH_BASE = "https://api.hubapi.com/oauth/2026-03";
var HubspotOAuthError = class extends Error {
  status;
  /** RFC 6749 error code (`invalid_grant`, `invalid_client`, …) when given. */
  error;
  constructor(status, body) {
    const fields = body && typeof body === "object" ? body : {};
    const error = typeof fields.error === "string" ? fields.error : null;
    const description = typeof fields.error_description === "string" ? fields.error_description : typeof fields.message === "string" ? fields.message : null;
    super(
      `HubSpot OAuth ${status}${error ? ` ${error}` : ""}${description ? `: ${description}` : ""}`
    );
    this.name = "HubspotOAuthError";
    this.status = status;
    this.error = error;
  }
};
async function postForm(path, fields) {
  const res = await fetch(`${HUBSPOT_OAUTH_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields)
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new HubspotOAuthError(res.status, body);
  return body;
}
async function introspectHubspotToken(token, credentials, tokenTypeHint = "access_token") {
  return postForm("/token/introspect", {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    token_type_hint: tokenTypeHint,
    token
  });
}

// engine/hubspot-credentials.ts
function crmHubspotCredentials() {
  const clientId = process.env.CRM_HUBSPOT_CLIENT_ID ?? process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID ?? process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.CRM_HUBSPOT_CLIENT_SECRET ?? process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

// engine/hubspot-fetch.ts
var MAX_RETRIES = 5;
var MAX_BACKOFF_MS = 16e3;
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function backoffMs(attempt, retryAfter) {
  const ra = retryAfter ? Number(retryAfter) : NaN;
  if (Number.isFinite(ra) && ra > 0) return Math.min(ra * 1e3, MAX_BACKOFF_MS);
  const base = Math.min(1e3 * 2 ** attempt, MAX_BACKOFF_MS);
  return base + Math.floor(Math.random() * 250);
}
async function hubspotFetch(url, init, token) {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...init.headers ?? {},
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 429 && res.status < 500) return res;
    if (attempt >= MAX_RETRIES) {
      console.log(`[hubspot] \u274C Failed after ${MAX_RETRIES + 1} attempts: ${res.status} on ${url.replace(/\?.*/, "")}`);
      return res;
    }
    const delay = backoffMs(attempt, res.headers.get("retry-after"));
    console.log(`[hubspot] \u26A0\uFE0F ${res.status} on ${url.replace(/\?.*/, "")}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
    await sleep(delay);
    attempt++;
  }
}

// engine/audit/constants.ts
var AUDIT_REPORT_VERSION = 5;
var HUBSPOT_BASE = "https://api.hubapi.com";
var PAGE_SIZE = 100;
var MAX_RECORDS_SCANNED = 2e5;
var SCHEMA_SAMPLE_SIZE = 2e3;
var SCHEMA_PROPS_PER_REQUEST = 80;
var GHOST_PROPERTY_FILL_RATIO = 0.03;
var PILLAR_WEIGHTS = {
  duplicates: 20,
  completeness: 20,
  quality: 15,
  structure: 10,
  freshness: 10,
  staleness: 10,
  deliverability: 5,
  pipeline: 5,
  schemaDebt: 5
};
var SEVERITY_WARNING_RATIO = 0.15;
var SEVERITY_CRITICAL_RATIO = 0.35;
var ANNUAL_JOB_TURNOVER = 0.3;
var MONTHLY_JOB_TURNOVER = 1 - Math.pow(1 - ANNUAL_JOB_TURNOVER, 1 / 12);
var MAX_STALE_PROBABILITY = 0.85;
var GHOST_MIN_DELIVERIES = 10;
var STALE_MONTHS = 24;
var DORMANT_MONTHS = 12;
var ZOMBIE_DEAL_DAYS = 60;
var DEFAULT_EUROS_PER_CONTACT_PER_MONTH = 0.02;
var CHAMPION_WIN_RATE = 0.5;
var DEFAULT_AVERAGE_DEAL_EUROS = 1e4;
var CHAMPION_LIFECYCLE_STAGES = /* @__PURE__ */ new Set(["customer", "opportunity"]);
var INTAKE_WINDOW_MONTHS = 12;
var MIN_INTAKE_MONTHS = 3;
var MIN_WON_DEALS_FOR_AVERAGE = 5;
var CRITICAL_RATIO = {
  "quality.email.invalid": 0.1,
  "quality.email.typo": 0.05,
  "deliverability.hardBounce": 0.1,
  "deliverability.optout": 0.25,
  "deliverability.marketingWaste": 0.3,
  "duplicates.contacts": 0.3,
  "duplicates.companies": 0.3,
  "structure.owner.inactive": 0.2
};
var CONTACT_PROPERTIES = [
  "email",
  "firstname",
  "lastname",
  "phone",
  "mobilephone",
  "company",
  "associatedcompanyid",
  "website",
  "jobtitle",
  "country",
  "createdate",
  "lastmodifieddate",
  "lifecyclestage",
  "hs_lead_status",
  "num_associated_deals",
  "num_notes",
  "num_contacted_notes",
  "notes_last_updated",
  "notes_last_contacted",
  "hubspot_owner_id",
  "hs_linkedin_url",
  // Secondary addresses: the duplicate HubSpot cannot see on its own.
  "hs_additional_emails",
  "hs_email_optout",
  "hs_email_bounce",
  // The real hard-bounce property; the plain one is kept for older portals.
  "hs_email_hard_bounce_reason_enum",
  "hs_email_hard_bounce_reason",
  "hs_email_last_send_date",
  // Marketing email engagement, for ghost contacts.
  "hs_email_delivered",
  "hs_email_open",
  "hs_email_click",
  // Whether HubSpot bills this contact as a marketing contact. Read-only
  // through the API: the audit can count, never flip it.
  "hs_marketable_status"
];
var COMPANY_PROPERTIES = [
  "name",
  "domain",
  "website",
  // Secondary sites filed under the company (regional domains, old brands).
  "hs_additional_domains",
  "city",
  "country",
  "state",
  "zip",
  "industry",
  "numberofemployees",
  "annualrevenue",
  "founded_year",
  "linkedin_company_page",
  "hs_linkedin_handle",
  "createdate",
  "hs_lastmodifieddate",
  "num_associated_contacts",
  "num_associated_deals",
  "hubspot_owner_id",
  "phone"
];
var DEAL_PROPERTIES = [
  "dealname",
  "dealstage",
  "pipeline",
  "amount",
  "closedate",
  "createdate",
  "hs_lastmodifieddate",
  "hs_is_closed",
  "hs_is_closed_won",
  "num_associated_contacts",
  "hubspot_owner_id",
  "notes_last_updated"
];
var ROLE_EMAIL_LOCALS = /* @__PURE__ */ new Set([
  "contact",
  "contacts",
  "info",
  "infos",
  "hello",
  "bonjour",
  "sales",
  "commercial",
  "support",
  "admin",
  "office",
  "team",
  "marketing",
  "accounting",
  "compta",
  "comptabilite",
  "facturation",
  "billing",
  "invoice",
  "rh",
  "hr",
  "recrutement",
  "jobs",
  "career",
  "careers",
  "press",
  "presse",
  "legal",
  "noreply",
  "no-reply",
  "donotreply",
  "postmaster",
  "webmaster",
  "abuse",
  "service",
  "help",
  "welcome",
  "newsletter",
  "direction"
]);
var FREE_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  "example.com",
  "test.com",
  "localhost",
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.fr",
  "yahoo.co.uk",
  "ymail.com",
  "hotmail.com",
  "hotmail.fr",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.fr",
  "live.com",
  "live.fr",
  "msn.com",
  "msn.fr",
  "aol.com",
  "aol.fr",
  "icloud.com",
  "icloud.fr",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.fr",
  "gmx.de",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "free.fr",
  "orange.fr",
  "wanadoo.fr",
  "laposte.net",
  "sfr.fr",
  "neuf.fr",
  "bbox.fr",
  "numericable.fr",
  "club-internet.fr",
  "aliceadsl.fr",
  "yopmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "getnada.com",
  "maildrop.cc"
]);
var TYPO_DOMAINS = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.fr": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yahou.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "orange.com": "orange.fr",
  "wanadou.fr": "wanadoo.fr",
  "lapost.net": "laposte.net",
  "iclould.com": "icloud.com",
  "icloud.con": "icloud.com"
};
var MAX_FINDINGS_PER_CHECK = 12;

// engine/audit/types.ts
var CAPABILITY_SCOPES = {
  deals: "crm.objects.deals.read",
  owners: "crm.objects.owners.read",
  schemas: "crm.schemas.contacts.read"
};

// engine/audit/collect.ts
var OBJECTS = {
  contact: { path: "contacts", properties: CONTACT_PROPERTIES },
  company: { path: "companies", properties: COMPANY_PROPERTIES },
  deal: { path: "deals", properties: DEAL_PROPERTIES }
};
async function fetchTokenInfo(token) {
  if (!token.startsWith("pat-")) {
    const credentials = crmHubspotCredentials();
    if (!credentials) {
      console.warn("[audit] token introspection needs the OAuth client credentials; assuming optional scopes absent");
      return { portalId: null, scopes: [] };
    }
    try {
      const info = await introspectHubspotToken(token, credentials);
      return {
        portalId: info.hub_id != null ? String(info.hub_id) : null,
        scopes: Array.isArray(info.scopes) ? info.scopes : []
      };
    } catch (e) {
      const reason = e instanceof HubspotOAuthError ? e.status : e.message;
      console.warn(`[audit] token introspection \u2192 ${reason}; assuming optional scopes absent`);
      return { portalId: null, scopes: [] };
    }
  }
  const res = await hubspotFetch(
    `${HUBSPOT_BASE}/oauth/v2/private-apps/get/access-token-info`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenKey: token })
    },
    token
  );
  if (!res.ok) {
    console.warn(`[audit] token introspection \u2192 ${res.status}; assuming optional scopes absent`);
    return { portalId: null, scopes: [] };
  }
  const data = await res.json();
  const hubId = data.hub_id ?? data.hubId;
  return {
    portalId: hubId != null ? String(hubId) : null,
    scopes: Array.isArray(data.scopes) ? data.scopes : []
  };
}
function capabilitiesFromScopes(scopes) {
  const granted = new Set(scopes);
  const caps = /* @__PURE__ */ new Set();
  for (const [capability, scope] of Object.entries(CAPABILITY_SCOPES)) {
    if (granted.has(scope)) caps.add(capability);
  }
  return caps;
}
async function fetchAllRecords(token, object, onPage) {
  const spec = OBJECTS[object];
  const records = [];
  let after = null;
  while (true) {
    const url = `${HUBSPOT_BASE}/crm/v3/objects/${spec.path}?limit=${PAGE_SIZE}&archived=false&properties=${spec.properties.join(",")}` + (after ? `&after=${encodeURIComponent(after)}` : "");
    const res = await hubspotFetch(url, { method: "GET" }, token);
    if (!res.ok) {
      throw new Error(`HubSpot list ${spec.path} \u2192 ${res.status}`);
    }
    const data = await res.json();
    for (const r of data.results ?? []) records.push(r);
    await onPage?.(records.length);
    if (records.length >= MAX_RECORDS_SCANNED) {
      console.warn(
        `[audit] cap of ${MAX_RECORDS_SCANNED} ${spec.path} reached \u2014 the portal holds more.`
      );
      return { records, capped: true };
    }
    after = data.paging?.next?.after ?? null;
    if (!after) break;
  }
  return { records, capped: false };
}
function fallbackCatalog(object) {
  return { names: new Set(OBJECTS[object].properties), custom: [] };
}
async function fetchPropertyCatalog(token, object) {
  const res = await hubspotFetch(
    `${HUBSPOT_BASE}/crm/v3/properties/${OBJECTS[object].path}`,
    { method: "GET" },
    token
  );
  if (!res.ok) {
    console.warn(
      `[audit] ${object} properties \u2192 ${res.status}; falling back to standard HubSpot fields`
    );
    return fallbackCatalog(object);
  }
  const data = await res.json();
  const names = /* @__PURE__ */ new Set();
  const custom = [];
  for (const p of data.results ?? []) {
    if (!p?.name || p.hidden) continue;
    names.add(p.name);
    if (p.hubspotDefined === false && !p.calculated) custom.push(p.name);
  }
  if (names.size === 0) {
    console.warn(`[audit] empty ${object} catalog; falling back to standard HubSpot fields`);
    return fallbackCatalog(object);
  }
  custom.sort();
  return { names, custom };
}
async function fetchActiveOwnerIds(token) {
  const ids = /* @__PURE__ */ new Set();
  let after = null;
  while (true) {
    const url = `${HUBSPOT_BASE}/crm/v3/owners?limit=100&archived=false` + (after ? `&after=${encodeURIComponent(after)}` : "");
    const res = await hubspotFetch(url, { method: "GET" }, token);
    if (!res.ok) {
      console.warn(`[audit] owners \u2192 ${res.status}`);
      return null;
    }
    const data = await res.json();
    for (const o of data.results ?? []) if (o?.id) ids.add(String(o.id));
    after = data.paging?.next?.after ?? null;
    if (!after) break;
  }
  return ids;
}
async function fetchSchemaSample(token, customContactProps) {
  if (customContactProps.length === 0) return [];
  const merged = /* @__PURE__ */ new Map();
  for (let i = 0; i < customContactProps.length; i += SCHEMA_PROPS_PER_REQUEST) {
    const chunk = customContactProps.slice(i, i + SCHEMA_PROPS_PER_REQUEST);
    let after = null;
    let loaded = 0;
    while (loaded < SCHEMA_SAMPLE_SIZE) {
      const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts?limit=${PAGE_SIZE}&archived=false&properties=${chunk.join(",")}` + (after ? `&after=${encodeURIComponent(after)}` : "");
      const res = await hubspotFetch(url, { method: "GET" }, token);
      if (!res.ok) {
        console.warn(`[audit] schema sample \u2192 ${res.status}`);
        break;
      }
      const data = await res.json();
      for (const rec of data.results ?? []) {
        const existing = merged.get(rec.id);
        if (existing) {
          existing.properties = { ...existing.properties, ...rec.properties };
        } else {
          merged.set(rec.id, { id: rec.id, properties: { ...rec.properties } });
        }
        loaded++;
      }
      after = data.paging?.next?.after ?? null;
      if (!after) break;
    }
  }
  return [...merged.values()];
}
async function collectAuditContext(token, now, onProgress) {
  await onProgress(2, "connection");
  const { portalId, scopes } = await fetchTokenInfo(token);
  const capabilities = capabilitiesFromScopes(scopes);
  await onProgress(5, "properties");
  const [contactCatalog, companyCatalog, dealCatalog] = await Promise.all([
    fetchPropertyCatalog(token, "contact"),
    fetchPropertyCatalog(token, "company"),
    capabilities.has("deals") ? fetchPropertyCatalog(token, "deal") : Promise.resolve({ names: /* @__PURE__ */ new Set(), custom: [] })
  ]);
  await onProgress(8, "contacts");
  const contacts = await fetchAllRecords(token, "contact", async (loaded) => {
    await onProgress(Math.min(44, 8 + Math.floor(loaded / 1e3)), "contacts");
  });
  await onProgress(45, "companies");
  const companies = await fetchAllRecords(token, "company", async (loaded) => {
    await onProgress(Math.min(63, 45 + Math.floor(loaded / 1e3)), "companies");
  });
  let deals = { records: [], capped: false };
  if (capabilities.has("deals")) {
    await onProgress(65, "deals");
    deals = await fetchAllRecords(token, "deal", async (loaded) => {
      await onProgress(Math.min(73, 65 + Math.floor(loaded / 1e3)), "deals");
    });
  }
  let activeOwnerIds = null;
  if (capabilities.has("owners")) {
    await onProgress(75, "owners");
    activeOwnerIds = await fetchActiveOwnerIds(token);
  }
  let schemaSample = [];
  if (capabilities.has("schemas")) {
    await onProgress(78, "schema");
    schemaSample = await fetchSchemaSample(token, contactCatalog.custom);
  }
  await onProgress(88, "analysis");
  const context = {
    now,
    portalId,
    contacts: contacts.records,
    companies: companies.records,
    deals: deals.records,
    activeOwnerIds,
    contactProps: contactCatalog.names,
    companyProps: companyCatalog.names,
    dealProps: dealCatalog.names,
    customContactProps: contactCatalog.custom,
    customCompanyProps: companyCatalog.custom,
    schemaSample,
    capabilities,
    scan: {
      contacts: contacts.records.length,
      companies: companies.records.length,
      deals: deals.records.length,
      contactsCapped: contacts.capped,
      companiesCapped: companies.capped,
      dealsCapped: deals.capped
    }
  };
  return { context, scopes };
}

// engine/audit/field.ts
function str(v) {
  return v == null ? "" : String(v).trim();
}
function prop(rec, name) {
  return str(rec.properties?.[name]);
}
function filled(rec, name) {
  return prop(rec, name).length > 0;
}
function firstFilled(rec, ...names) {
  for (const n of names) {
    const v = prop(rec, n);
    if (v) return v;
  }
  return "";
}
function num(rec, name) {
  const v = Number(prop(rec, name));
  return Number.isFinite(v) ? v : 0;
}
function bool(rec, name) {
  const v = prop(rec, name).toLowerCase();
  return v === "true" || v === "yes" || v === "1";
}
function parseDate(v) {
  const s = str(v);
  if (!s) return null;
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : t;
}
function dateProp(rec, name) {
  return parseDate(rec.properties?.[name]);
}
var MS_PER_DAY = 864e5;
var MS_PER_MONTH = MS_PER_DAY * 30.44;
function daysSince(ts, now) {
  return (now - ts) / MS_PER_DAY;
}
function monthsSince(ts, now) {
  return (now - ts) / MS_PER_MONTH;
}
function emailLocal(email) {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at).toLowerCase() : "";
}
function emailDomain(email) {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(at + 1).toLowerCase() : "";
}
function isStructurallyInvalidEmail(email) {
  if (!email) return false;
  if (/\s/.test(email)) return true;
  const parts = email.split("@");
  if (parts.length !== 2) return true;
  const [local, domain] = parts;
  if (!local || !domain) return true;
  if (!domain.includes(".")) return true;
  if (/^[.-]|[.-]$/.test(domain)) return true;
  if (domain.includes("..")) return true;
  if (!/^[a-z0-9.-]+$/i.test(domain)) return true;
  if (!/\.[a-z]{2,}$/i.test(domain)) return true;
  return false;
}
function isPlausiblePhone(raw) {
  if (!raw) return false;
  if (/[a-z]/i.test(raw)) return false;
  const digits = raw.replace(/\D+/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
function hasBadCasing(name) {
  const letters = name.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return false;
  return letters === letters.toUpperCase() || letters === letters.toLowerCase();
}
function contactName(rec) {
  const n = `${prop(rec, "firstname")} ${prop(rec, "lastname")}`.trim();
  return n || prop(rec, "email") || null;
}
function companyName(rec) {
  return prop(rec, "name") || prop(rec, "domain") || null;
}
function dealName(rec) {
  return prop(rec, "dealname") || null;
}
function nameOf(rec, object) {
  if (object === "contact") return contactName(rec);
  if (object === "company") return companyName(rec);
  return dealName(rec);
}
var RECORD_PATH = {
  contact: "contact",
  company: "record/0-2",
  deal: "record/0-3"
};
function hubspotUrl(portalId, object, id) {
  if (!portalId) return null;
  return `https://app.hubspot.com/contacts/${portalId}/${RECORD_PATH[object]}/${id}`;
}
function scoreFromRatio(ratio, criticalRatio) {
  if (criticalRatio <= 0) return ratio > 0 ? 0 : 100;
  const normalized = Math.min(1, ratio / criticalRatio);
  return Math.round(100 * (1 - normalized));
}
function severityFromNormalized(normalized) {
  if (normalized >= SEVERITY_CRITICAL_RATIO) return "critical";
  if (normalized >= SEVERITY_WARNING_RATIO) return "warning";
  return "ok";
}
function buildCheck(params) {
  const { id, affected: affected2, total } = params;
  const weight = params.weight ?? 1;
  if (total <= 0) {
    return {
      id,
      affected: 0,
      total: 0,
      ratio: 0,
      score: null,
      weight,
      severity: "ok",
      skipped: "no_data",
      ...params.meta ? { meta: params.meta } : {}
    };
  }
  const ratio = affected2 / total;
  const criticalRatio = CRITICAL_RATIO[id] ?? 1;
  const normalized = Math.min(1, ratio / criticalRatio);
  return {
    id,
    affected: affected2,
    total,
    ratio,
    score: scoreFromRatio(ratio, criticalRatio),
    weight,
    severity: severityFromNormalized(normalized),
    ...params.sampled ? { sampled: true, sampleSize: params.sampleSize } : {},
    ...params.meta ? { meta: params.meta } : {}
  };
}
function skippedCheck(id, reason, weight = 1) {
  return {
    id,
    affected: 0,
    total: 0,
    ratio: 0,
    score: null,
    weight,
    severity: "ok",
    skipped: reason
  };
}
var EvidenceCollector = class {
  counts = /* @__PURE__ */ new Map();
  findings = [];
  add(checkId, object, rec, detail) {
    const seen = this.counts.get(checkId) ?? 0;
    if (seen >= MAX_FINDINGS_PER_CHECK) return;
    this.counts.set(checkId, seen + 1);
    this.findings.push({
      checkId,
      objectType: object,
      objectId: rec.id,
      objectName: nameOf(rec, object),
      ...detail ? { detail } : {}
    });
  }
  /** Evidence for a synthetic row that is not a single CRM record. */
  addRaw(finding) {
    const seen = this.counts.get(finding.checkId) ?? 0;
    if (seen >= MAX_FINDINGS_PER_CHECK) return;
    this.counts.set(finding.checkId, seen + 1);
    this.findings.push(finding);
  }
};

// engine/audit/distributions.ts
var AGE_BUCKETS = [
  { id: "lt3", maxMonths: 3 },
  { id: "m3to6", maxMonths: 6 },
  { id: "m6to12", maxMonths: 12 },
  { id: "m12to18", maxMonths: 18 },
  { id: "m18to24", maxMonths: 24 },
  { id: "gt24", maxMonths: Infinity }
];
function bucketFor(months) {
  for (const b of AGE_BUCKETS) {
    if (months < b.maxMonths) return b.id;
  }
  return "gt24";
}
function contactAge(ctx) {
  if (!ctx.contactProps.has("lastmodifieddate")) return null;
  const counts = new Map(
    AGE_BUCKETS.map((b) => [b.id, 0])
  );
  let dated = 0;
  let monthsTotal = 0;
  for (const rec of ctx.contacts) {
    const modified = dateProp(rec, "lastmodifieddate");
    if (modified === null) continue;
    dated++;
    const months = Math.max(0, monthsSince(modified, ctx.now));
    monthsTotal += months;
    const id = bucketFor(months);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  if (dated === 0) return null;
  return {
    buckets: AGE_BUCKETS.map((b) => ({
      id: b.id,
      contacts: counts.get(b.id) ?? 0
    })),
    dated,
    averageMonths: Math.round(monthsTotal / dated * 10) / 10,
    neverUpdated: countNeverUpdated(ctx)
  };
}
function countNeverUpdated(ctx) {
  if (!ctx.contactProps.has("createdate")) return null;
  let never = 0;
  for (const rec of ctx.contacts) {
    const created = dateProp(rec, "createdate");
    const modified = dateProp(rec, "lastmodifieddate");
    if (created === null || modified === null) continue;
    if ((modified - created) / 864e5 <= 1) never++;
  }
  return never;
}
function lifecycle(ctx) {
  if (!ctx.contactProps.has("lifecyclestage")) return null;
  const counts = /* @__PURE__ */ new Map();
  for (const rec of ctx.contacts) {
    const raw = (rec.properties?.lifecyclestage ?? "").toString().trim().toLowerCase();
    const key = raw || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (counts.size === 1 && counts.has("unknown")) return null;
  return [...counts.entries()].map(([stage, contacts]) => ({ stage, contacts })).sort((a, b) => b.contacts - a.contacts);
}
function buildDistributions(ctx) {
  return {
    contactAge: contactAge(ctx),
    lifecycle: lifecycle(ctx)
  };
}

// engine/audit/checks/completeness.ts
var CONTACT_FIELDS = [
  { key: "email", properties: ["email"], weight: 3 },
  { key: "name", properties: ["firstname"], weight: 2 },
  { key: "lastname", properties: ["lastname"], weight: 2 },
  { key: "phone", properties: ["phone", "mobilephone"], weight: 2 },
  { key: "linkedin", properties: ["hs_linkedin_url"], weight: 2 },
  { key: "jobtitle", properties: ["jobtitle"], weight: 2 },
  { key: "company", properties: ["company", "associatedcompanyid"], weight: 1 }
];
var COMPANY_FIELDS = [
  // Without a domain a company cannot be deduplicated, enriched or matched to
  // an account — it is the single most structural gap on the company object.
  { key: "domain", properties: ["domain", "website"], weight: 3 },
  { key: "name", properties: ["name"], weight: 2 },
  { key: "industry", properties: ["industry"], weight: 2 },
  { key: "size", properties: ["numberofemployees"], weight: 2 },
  { key: "location", properties: ["city", "country"], weight: 1 },
  { key: "linkedin", properties: ["linkedin_company_page", "hs_linkedin_handle"], weight: 1 }
];
function runFields(object, fields, records, available, ev) {
  return fields.map((field) => {
    const id = `completeness.${object}.${field.key}`;
    const usable = field.properties.filter((p) => available.has(p));
    if (usable.length === 0) return skippedCheck(id, "missing_property", field.weight);
    let affected2 = 0;
    for (const rec of records) {
      if (usable.some((p) => filled(rec, p))) continue;
      affected2++;
      ev.add(id, object, rec, { missing: field.properties });
    }
    return buildCheck({ id, affected: affected2, total: records.length, weight: field.weight });
  });
}
function runCompleteness(ctx, ev) {
  return {
    checks: [
      ...runFields("contact", CONTACT_FIELDS, ctx.contacts, ctx.contactProps, ev),
      ...runFields("company", COMPANY_FIELDS, ctx.companies, ctx.companyProps, ev)
    ],
    findings: []
  };
}

// engine/audit/checks/deliverability.ts
var HARD_BOUNCE_REASON_PROPS = [
  "hs_email_hard_bounce_reason_enum",
  "hs_email_hard_bounce_reason"
];
function runDeliverability(ctx, ev) {
  const checks = [];
  const hasEmail = ctx.contactProps.has("email");
  const reasonProps = HARD_BOUNCE_REASON_PROPS.filter((p) => ctx.contactProps.has(p));
  const useBounceCounter = reasonProps.length === 0 && ctx.contactProps.has("hs_email_bounce");
  const hardBouncedIds = /* @__PURE__ */ new Set();
  const optedOutIds = /* @__PURE__ */ new Set();
  const ghostIds = /* @__PURE__ */ new Set();
  if (!hasEmail || reasonProps.length === 0 && !useBounceCounter) {
    checks.push(skippedCheck("deliverability.hardBounce", "missing_property", 3));
  } else {
    let mailable = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email")) continue;
      mailable++;
      const reason = firstFilled(rec, ...reasonProps);
      const bounces = num(rec, "hs_email_bounce");
      if (useBounceCounter ? bounces <= 0 : !reason) continue;
      hardBouncedIds.add(rec.id);
      ev.add("deliverability.hardBounce", "contact", rec, {
        email: prop(rec, "email"),
        reason: reason || null,
        bounces
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.hardBounce",
        affected: hardBouncedIds.size,
        total: mailable,
        weight: 3
      })
    );
  }
  if (!hasEmail || !ctx.contactProps.has("hs_email_optout")) {
    checks.push(skippedCheck("deliverability.optout", "missing_property", 2));
  } else {
    let mailable = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email")) continue;
      mailable++;
      if (!bool(rec, "hs_email_optout")) continue;
      optedOutIds.add(rec.id);
      ev.add("deliverability.optout", "contact", rec, { email: prop(rec, "email") });
    }
    checks.push(
      buildCheck({
        id: "deliverability.optout",
        affected: optedOutIds.size,
        total: mailable,
        weight: 2
      })
    );
  }
  const phoneProps = ["phone", "mobilephone"].filter((p) => ctx.contactProps.has(p));
  if (!hasEmail && phoneProps.length === 0) {
    checks.push(skippedCheck("deliverability.unreachable", "missing_property", 2));
  } else {
    let unreachable = 0;
    for (const rec of ctx.contacts) {
      const hasUsableEmail = hasEmail && filled(rec, "email") && !hardBouncedIds.has(rec.id);
      const hasPhone = phoneProps.some((p) => filled(rec, p));
      if (hasUsableEmail || hasPhone) continue;
      unreachable++;
      ev.add("deliverability.unreachable", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "deliverability.unreachable",
        affected: unreachable,
        total: ctx.contacts.length,
        weight: 2
      })
    );
  }
  const hasEngagement = ctx.contactProps.has("hs_email_delivered") && ctx.contactProps.has("hs_email_open");
  if (!hasEmail || !hasEngagement) {
    checks.push(skippedCheck("deliverability.ghost", "missing_property", 2));
  } else {
    let delivered = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email") || hardBouncedIds.has(rec.id)) continue;
      const sent = num(rec, "hs_email_delivered");
      if (sent <= 0) continue;
      delivered++;
      if (sent < GHOST_MIN_DELIVERIES) continue;
      if (num(rec, "hs_email_open") > 0 || num(rec, "hs_email_click") > 0) continue;
      ghostIds.add(rec.id);
      ev.add("deliverability.ghost", "contact", rec, {
        email: prop(rec, "email"),
        delivered: sent
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.ghost",
        affected: ghostIds.size,
        total: delivered,
        weight: 2,
        meta: { minDeliveries: GHOST_MIN_DELIVERIES }
      })
    );
  }
  if (!ctx.contactProps.has("hs_marketable_status")) {
    checks.push(skippedCheck("deliverability.marketingWaste", "missing_property", 2));
  } else {
    let marketing = 0;
    const wasted = { hardBounced: 0, optedOut: 0, ghost: 0 };
    for (const rec of ctx.contacts) {
      if (!bool(rec, "hs_marketable_status")) continue;
      marketing++;
      const cause = hardBouncedIds.has(rec.id) ? "hardBounced" : optedOutIds.has(rec.id) ? "optedOut" : ghostIds.has(rec.id) ? "ghost" : null;
      if (!cause) continue;
      wasted[cause]++;
      ev.add("deliverability.marketingWaste", "contact", rec, {
        email: prop(rec, "email"),
        cause
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.marketingWaste",
        affected: wasted.hardBounced + wasted.optedOut + wasted.ghost,
        total: marketing,
        weight: 2,
        meta: { ...wasted, minDeliveries: GHOST_MIN_DELIVERIES }
      })
    );
  }
  return { checks, findings: [], totals: { hardBouncedIds } };
}

// engine/duplicate-explanation.ts
var REASON_EN = {
  same_linkedin: "same LinkedIn URL",
  same_email: "same email",
  same_email_secondary: "same email (secondary address on one side)",
  same_mobile: "same mobile phone",
  same_name_phone: "same full name + same phone",
  same_phone_name_missing: "same phone (name missing on one side)",
  same_name_company: "same full name + same company",
  same_name_email_domain: "same full name + same email domain root",
  same_name_only: "same full name (no corroboration)",
  exact_fuzzy_name: "exact + fuzzy name",
  fuzzy_full_name: "fuzzy full name",
  swapped_name: "same name (first/last swapped)",
  same_email_local: "same email local part, different domain",
  near_email_local: "near-identical email local part + same domain root",
  same_siren: "same SIREN (legal identifier)",
  same_domain: "same exact domain",
  same_linkedin_corroborated: "same LinkedIn + name/domain corroboration",
  same_linkedin_alone: "same LinkedIn (uncorroborated -> manual review)",
  same_name_domain_root: "same name + same domain root",
  same_domain_root_other_tld: "same domain root, different TLD",
  same_name_city: "same name + same city",
  fuzzy_name_same_domain: "fuzzy name + same exact domain",
  ghost_domain_root: "ghost record (missing name) + same domain root",
  same_name_no_domain_one_side: "same name + one side has no domain",
  fuzzy_name_no_domain_one_side: "fuzzy name + one side has no domain",
  same_name_different_roots: "same name + different domain roots",
  fuzzy_name_fuzzy_root: "fuzzy name + fuzzy domain root"
};
var CORROBORATION_EN = {
  same_company: "same company",
  similar_company: "similar company",
  same_associated_company: "same associated company",
  same_email_domain_root: "same email domain root",
  same_phone: "same phone",
  none: "no corroboration"
};
function EVIDENCE_REASON_EN(code, corroboration) {
  const base = REASON_EN[code];
  return code === "exact_fuzzy_name" || code === "fuzzy_full_name" ? `${base} (${CORROBORATION_EN[corroboration ?? "none"]})` : base;
}
var REASON_TO_CODE = /* @__PURE__ */ new Map();
for (const code of Object.keys(REASON_EN)) {
  if (code === "exact_fuzzy_name" || code === "fuzzy_full_name") {
    for (const w of Object.keys(CORROBORATION_EN)) {
      REASON_TO_CODE.set(EVIDENCE_REASON_EN(code, w), { code, with: w });
    }
  } else REASON_TO_CODE.set(REASON_EN[code], { code });
}

// engine/duplicate-normalizers.ts
function stripAccents(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function str2(v) {
  return v == null ? "" : String(v).trim();
}
function levenshtein(a, b, maxDist) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    prev = cur;
  }
  return prev[b.length];
}
function oneSlipApart(a, b) {
  if (levenshtein(a, b, 1) <= 1) return true;
  if (a.length !== b.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (i >= a.length - 1) return false;
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
}
function words(v) {
  return stripAccents(str2(v)).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}
var COUNTRY_NAMES = {
  FR: ["france", "frankreich", "francia", "republique francaise", "french republic", "fra"],
  DE: ["germany", "allemagne", "deutschland", "alemania", "germania", "deu", "ger"],
  GB: ["united kingdom", "uk", "great britain", "britain", "royaume uni", "angleterre", "england", "scotland", "wales", "northern ireland", "gbr"],
  US: ["united states", "united states of america", "usa", "u s a", "u s", "etats unis", "etats unis d amerique", "america", "estados unidos", "vereinigte staaten"],
  ES: ["spain", "espagne", "espana", "spanien", "esp"],
  IT: ["italy", "italie", "italia", "italien", "ita"],
  BE: ["belgium", "belgique", "belgie", "belgien", "bel"],
  CH: ["switzerland", "suisse", "schweiz", "svizzera", "che"],
  NL: ["netherlands", "the netherlands", "pays bas", "nederland", "holland", "hollande", "niederlande", "nld"],
  LU: ["luxembourg", "luxemburg", "lux"],
  PT: ["portugal", "prt"],
  AT: ["austria", "autriche", "osterreich", "aut"],
  IE: ["ireland", "irlande", "eire", "irl"],
  CA: ["canada", "kanada", "can"],
  AU: ["australia", "australie", "australien", "aus"],
  NZ: ["new zealand", "nouvelle zelande", "nzl"],
  SE: ["sweden", "suede", "sverige", "schweden", "swe"],
  NO: ["norway", "norvege", "norge", "norwegen", "nor"],
  DK: ["denmark", "danemark", "danmark", "danemark", "dnk"],
  FI: ["finland", "finlande", "suomi", "fin"],
  PL: ["poland", "pologne", "polska", "polen", "pol"],
  CZ: ["czech republic", "czechia", "republique tcheque", "tchequie", "cesko", "cze"],
  HU: ["hungary", "hongrie", "magyarorszag", "hun"],
  RO: ["romania", "roumanie", "rou"],
  GR: ["greece", "grece", "grc"],
  TR: ["turkey", "turkiye", "turquie", "tur"],
  MA: ["morocco", "maroc", "mar"],
  TN: ["tunisia", "tunisie", "tun"],
  DZ: ["algeria", "algerie", "dza"],
  SN: ["senegal", "sen"],
  CI: ["ivory coast", "cote d ivoire", "civ"],
  CM: ["cameroon", "cameroun", "cmr"],
  EG: ["egypt", "egypte", "egy"],
  ZA: ["south africa", "afrique du sud", "zaf"],
  BR: ["brazil", "bresil", "brasil", "bra"],
  MX: ["mexico", "mexique", "mex"],
  AR: ["argentina", "argentine", "arg"],
  CL: ["chile", "chili", "chl"],
  CO: ["colombia", "colombie", "col"],
  JP: ["japan", "japon", "nippon", "jpn"],
  CN: ["china", "chine", "people s republic of china", "chn"],
  HK: ["hong kong", "hkg"],
  KR: ["south korea", "korea", "coree du sud", "coree", "kor"],
  IN: ["india", "inde", "ind"],
  SG: ["singapore", "singapour", "sgp"],
  AE: ["united arab emirates", "uae", "emirats arabes unis", "dubai", "are"],
  SA: ["saudi arabia", "arabie saoudite", "sau"],
  IL: ["israel", "isr"],
  QA: ["qatar", "qat"],
  TH: ["thailand", "thailande", "tha"],
  VN: ["vietnam", "viet nam", "vnm"],
  ID: ["indonesia", "indonesie", "idn"],
  MY: ["malaysia", "malaisie", "mys"],
  PH: ["philippines", "phl"],
  TW: ["taiwan", "twn"],
  RU: ["russia", "russie", "russian federation", "rus"],
  UA: ["ukraine", "ukr"],
  LT: ["lithuania", "lituanie", "ltu"],
  LV: ["latvia", "lettonie", "lva"],
  EE: ["estonia", "estonie", "est"],
  SK: ["slovakia", "slovaquie", "svk"],
  SI: ["slovenia", "slovenie", "svn"],
  HR: ["croatia", "croatie", "hrv"],
  BG: ["bulgaria", "bulgarie", "bgr"],
  RS: ["serbia", "serbie", "srb"],
  CY: ["cyprus", "chypre", "cyp"],
  MT: ["malta", "malte", "mlt"],
  IS: ["iceland", "islande", "isl"],
  MC: ["monaco", "mco"],
  AD: ["andorra", "andorre", "and"],
  LI: ["liechtenstein", "lie"]
};
var COUNTRY_BY_NAME = /* @__PURE__ */ new Map();
for (const [code, names] of Object.entries(COUNTRY_NAMES)) {
  COUNTRY_BY_NAME.set(code.toLowerCase(), code);
  for (const n of names) COUNTRY_BY_NAME.set(n, code);
}
function normCountry(v) {
  const w = words(v);
  if (!w) return "";
  return COUNTRY_BY_NAME.get(w) ?? "";
}
var TITLE_EXPANSIONS = {
  dir: "directeur",
  resp: "responsable",
  dirg: "directeur general",
  dg: "directeur general",
  dga: "directeur general adjoint",
  pdg: "president directeur general",
  daf: "directeur administratif financier",
  drh: "directeur ressources humaines",
  dsi: "directeur systemes information",
  rh: "ressources humaines",
  hr: "human resources",
  ceo: "chief executive officer",
  cto: "chief technology officer",
  cfo: "chief financial officer",
  coo: "chief operating officer",
  cmo: "chief marketing officer",
  cro: "chief revenue officer",
  cpo: "chief product officer",
  cio: "chief information officer",
  chro: "chief human resources officer",
  cso: "chief sales officer",
  vp: "vice president",
  svp: "senior vice president",
  evp: "executive vice president",
  avp: "assistant vice president",
  mgr: "manager",
  sr: "senior",
  jr: "junior",
  asst: "assistant",
  eng: "engineer",
  dev: "developer",
  bizdev: "business development",
  sdr: "sales development representative",
  bdr: "business development representative",
  ops: "operations",
  mktg: "marketing",
  acct: "account",
  exec: "executive",
  pres: "president",
  gm: "general manager",
  md: "managing director",
  pm: "product manager",
  csm: "customer success manager",
  ux: "user experience",
  ui: "user interface",
  it: "information technology",
  si: "systemes information",
  rd: "research development",
  qa: "quality assurance",
  ca: "chiffre affaires",
  adv: "administration des ventes",
  compta: "comptabilite",
  com: "communication",
  tech: "technique",
  ingenieur: "ingenieur",
  ing: "ingenieur",
  dept: "departement",
  cie: "compagnie",
  intl: "international",
  mgmt: "management"
};
var TITLE_STOPWORDS = /* @__PURE__ */ new Set([
  "de",
  "du",
  "des",
  "la",
  "le",
  "les",
  "l",
  "d",
  "et",
  "en",
  "au",
  "aux",
  "a",
  "chez",
  "pour",
  "sur",
  "of",
  "the",
  "and",
  "at",
  "in",
  "for",
  "to",
  "with",
  "on"
]);
var GENERIC_TITLES = /* @__PURE__ */ new Set([
  "contact",
  "accueil",
  "standard",
  "direction",
  "secretariat",
  "administration",
  "information",
  "info",
  "salarie",
  "salariee",
  "employe",
  "employee",
  "employes",
  "staff",
  "collaborateur",
  "collaboratrice",
  "membre",
  "member",
  "team member",
  "personnel",
  "worker",
  "travailleur",
  "professionnel",
  "professional",
  "cadre",
  "stagiaire",
  "intern",
  "alternant",
  "alternante",
  "apprenti",
  "freelance",
  "independant",
  "consultant",
  "retraite",
  "retired",
  "etudiant",
  "student",
  "sans emploi",
  "unemployed",
  "autre",
  "other"
]);
function normJobTitle(v) {
  const w = words(v);
  if (!w || GENERIC_TITLES.has(w)) return "";
  const tokens = w.split(" ").flatMap((t) => (TITLE_EXPANSIONS[t] ?? t).split(" ")).filter((t) => t && !TITLE_STOPWORDS.has(t));
  const out = [...new Set(tokens)].join(" ");
  return GENERIC_TITLES.has(out) ? "" : out;
}
function tokenSet(s) {
  return new Set(s.split(" ").filter(Boolean));
}
function compareJobTitles(a, b) {
  if (!a || !b) return "unknown";
  if (a === b) return "same";
  const ta = tokenSet(a);
  const tb = tokenSet(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  if (inter === 0) return "different";
  const union = ta.size + tb.size - inter;
  const jaccard2 = inter / union;
  if (jaccard2 >= 0.75) return "same";
  if (inter === ta.size || inter === tb.size) return "close";
  return jaccard2 >= 0.5 ? "close" : "unknown";
}
var DIMINUTIVES = {
  bob: ["robert"],
  rob: ["robert"],
  bobby: ["robert"],
  bert: ["robert", "albert", "herbert"],
  alex: ["alexandre", "alexander", "alexandra", "alexis", "alexia"],
  tom: ["thomas"],
  tommy: ["thomas"],
  kate: ["katherine", "katharine", "catherine", "kathleen"],
  katie: ["katherine", "katharine", "catherine"],
  kathy: ["katherine", "kathleen", "catherine"],
  cathy: ["catherine"],
  kat: ["katherine", "catherine"],
  bill: ["william"],
  will: ["william"],
  billy: ["william"],
  liam: ["william"],
  liz: ["elizabeth", "elisabeth"],
  beth: ["elizabeth", "elisabeth"],
  betty: ["elizabeth"],
  lisa: ["elizabeth", "elisabeth"],
  jim: ["james"],
  jimmy: ["james"],
  jamie: ["james"],
  mike: ["michael"],
  mick: ["michael"],
  mikey: ["michael"],
  dave: ["david"],
  davy: ["david"],
  dan: ["daniel"],
  danny: ["daniel"],
  chris: ["christopher", "christophe", "christian", "christine", "christina", "christiane"],
  steph: ["stephanie", "stephane", "stephen", "steven"],
  steve: ["stephen", "steven"],
  fred: ["frederic", "frederick", "frederik", "alfred"],
  freddy: ["frederic", "frederick"],
  ben: ["benjamin", "benoit", "benedict"],
  benj: ["benjamin"],
  sam: ["samuel", "samantha"],
  sammy: ["samuel", "samantha"],
  matt: ["matthew", "matthieu", "mathieu"],
  nick: ["nicolas", "nicholas"],
  nico: ["nicolas", "nicholas"],
  tony: ["anthony", "antoine", "antonio"],
  pat: ["patrick", "patricia"],
  paddy: ["patrick"],
  tricia: ["patricia"],
  trish: ["patricia"],
  max: ["maxime", "maximilien", "maximilian", "maxence"],
  seb: ["sebastien", "sebastian"],
  greg: ["gregory", "gregoire"],
  phil: ["philippe", "philip", "phillip"],
  joe: ["joseph"],
  joey: ["joseph"],
  jo: ["joseph", "josephine", "joanne"],
  jon: ["jonathan"],
  jonny: ["jonathan"],
  johnny: ["john", "jonathan"],
  jack: ["john"],
  ed: ["edward", "edouard", "edmond", "edgar"],
  eddie: ["edward", "edouard"],
  ted: ["edward", "theodore"],
  andy: ["andrew", "andre"],
  drew: ["andrew"],
  harry: ["henry", "harold"],
  hank: ["henry"],
  rick: ["richard"],
  dick: ["richard"],
  rich: ["richard"],
  ricky: ["richard"],
  ron: ["ronald"],
  ronnie: ["ronald"],
  don: ["donald"],
  donny: ["donald"],
  ken: ["kenneth"],
  kenny: ["kenneth"],
  charlie: ["charles"],
  chuck: ["charles"],
  charly: ["charles"],
  larry: ["lawrence", "laurence", "laurent"],
  jerry: ["gerald", "jerome", "gerard"],
  gerry: ["gerald", "gerard"],
  terry: ["terence"],
  pete: ["peter"],
  gabe: ["gabriel"],
  nat: ["nathalie", "natalie", "nathan", "nathaniel"],
  nate: ["nathan", "nathaniel"],
  vic: ["victor", "victoria"],
  vicky: ["victoria"],
  val: ["valerie", "valentin", "valentine"],
  manu: ["emmanuel", "emmanuelle", "manuel"],
  flo: ["florence", "florent", "florian"],
  caro: ["caroline", "carole"],
  isa: ["isabelle", "isabel", "isabella"],
  elo: ["elodie"],
  mat: ["mathieu", "matthieu", "mathilde"],
  gab: ["gabriel", "gabrielle"],
  dom: ["dominique", "dominic"],
  jc: ["jean claude", "jean christophe"],
  jp: ["jean pierre", "jean philippe", "jean paul"],
  jf: ["jean francois"],
  jm: ["jean marc", "jean michel", "jean marie"],
  pa: ["pierre alexandre", "pierre antoine"],
  pe: ["pierre emmanuel"],
  mc: ["marie christine", "marie claire", "marie claude"],
  mp: ["marie pierre"],
  al: ["albert", "alan", "alfred", "allan"],
  ali: ["alison", "alice"],
  sue: ["susan", "suzanne"],
  susie: ["susan", "suzanne"],
  peggy: ["margaret"],
  meg: ["margaret", "megan"],
  maggie: ["margaret"],
  nancy: ["ann", "anne"],
  sally: ["sarah"],
  molly: ["mary"],
  polly: ["mary"],
  becky: ["rebecca"],
  becca: ["rebecca"],
  jen: ["jennifer"],
  jenny: ["jennifer"],
  jess: ["jessica"],
  jessie: ["jessica"],
  abby: ["abigail"],
  gus: ["augustin", "auguste", "augustus"],
  oli: ["olivier", "oliver", "olivia"],
  ollie: ["oliver"]
};
var FEMININE_ENDINGS = ["e", "ne", "le", "ine", "ette", "tte", "elle", "te", "que", "a"];
function feminineOf(short, long) {
  if (long.length <= short.length) return false;
  if (!long.startsWith(short)) return false;
  return FEMININE_ENDINGS.includes(long.slice(short.length));
}
function finalVowelSwap(a, b) {
  if (a.length !== b.length || a.length < 4) return false;
  if (a.slice(0, -1) !== b.slice(0, -1)) return false;
  const ends = /* @__PURE__ */ new Set([a[a.length - 1], b[b.length - 1]]);
  return ends.has("a") && ends.has("e");
}
function firstNameTokens(v) {
  return words(v).split(" ").filter(Boolean);
}
function initialOf(token, other) {
  return token.length === 1 && other.length > 1 && other[0] === token;
}
function tokensCompatible(a, b) {
  if (a === b) return true;
  if (initialOf(a, b) || initialOf(b, a)) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (feminineOf(short, long) || finalVowelSwap(a, b)) return false;
  if (DIMINUTIVES[a]?.includes(b) || DIMINUTIVES[b]?.includes(a)) return true;
  return a.length >= 4 && b.length >= 4 && levenshtein(a, b, 1) <= 1;
}
function firstNamesCompatible(a, b) {
  const ta = firstNameTokens(a);
  const tb = firstNameTokens(b);
  if (ta.length === 0 || tb.length === 0) return true;
  const [fewer, more] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if (fewer.length === 1 && /^[a-z]{2,3}$/.test(fewer[0]) && more.length === fewer[0].length) {
    if (more.every((t, i) => t[0] === fewer[0][i])) return true;
  }
  if (fewer.length === 1 && more.length > 1) {
    const joined = more.join(" ");
    if (DIMINUTIVES[fewer[0]]?.includes(joined)) return true;
  }
  return fewer.every((t) => more.some((u) => tokensCompatible(t, u)));
}
var GENERIC_LOCALS = /* @__PURE__ */ new Set([
  "info",
  "infos",
  "contact",
  "hello",
  "bonjour",
  "hi",
  "sales",
  "vente",
  "ventes",
  "commercial",
  "commerce",
  "admin",
  "administration",
  "office",
  "bureau",
  "support",
  "help",
  "aide",
  "service",
  "services",
  "serviceclient",
  "service-client",
  "customer",
  "customers",
  "clients",
  "client",
  "direction",
  "management",
  "rh",
  "hr",
  "jobs",
  "job",
  "careers",
  "career",
  "recrutement",
  "recruitment",
  "recruiting",
  "candidature",
  "candidatures",
  "marketing",
  "com",
  "communication",
  "presse",
  "press",
  "media",
  "compta",
  "comptabilite",
  "accounting",
  "accounts",
  "finance",
  "billing",
  "facturation",
  "invoice",
  "invoices",
  "noreply",
  "no-reply",
  "no_reply",
  "donotreply",
  "newsletter",
  "news",
  "team",
  "equipe",
  "accueil",
  "welcome",
  "reception",
  "partenariats",
  "partners",
  "partnership",
  "partnerships",
  "webmaster",
  "postmaster",
  "hostmaster",
  "abuse",
  "security",
  "it",
  "informatique",
  "dev",
  "tech",
  "technique",
  "secretariat",
  "assistant",
  "assistante",
  "general",
  "mail",
  "email",
  "courrier",
  "legal",
  "juridique",
  "dpo",
  "privacy",
  "rgpd",
  "gdpr",
  "order",
  "orders",
  "commande",
  "commandes",
  "achat",
  "achats",
  "purchasing",
  "export",
  "import",
  "logistique",
  "logistics",
  "qualite",
  "quality",
  "formation",
  "training",
  "events",
  "evenements",
  "store",
  "shop",
  "boutique",
  "agence",
  "agency"
]);
var alnum = (s) => s.replace(/[^a-z0-9]/g, "");
function isGenericEmailLocal(local) {
  const l = stripAccents(local.toLowerCase());
  return GENERIC_LOCALS.has(l) || GENERIC_LOCALS.has(alnum(l));
}
function localsDerivedFrom(first, last) {
  const out = /* @__PURE__ */ new Set();
  const f = alnum(words(first).replace(/ /g, ""));
  const l = alnum(words(last).replace(/ /g, ""));
  const ft = words(first).split(" ").filter(Boolean);
  const firsts = new Set([f, ...ft.map(alnum), ft.map((t) => alnum(t)[0] ?? "").join("")].filter(Boolean));
  for (const fi of firsts) {
    if (l) {
      out.add(fi + l);
      out.add(l + fi);
      out.add(fi[0] + l);
      out.add(l + fi[0]);
      out.add(fi + l[0]);
    }
    out.add(fi);
  }
  if (l) out.add(l);
  return out;
}
function emailLocalsCompatible(localA, localB, names) {
  const a = alnum(stripAccents(localA.toLowerCase()));
  const b = alnum(stripAccents(localB.toLowerCase()));
  if (!a || !b || a === b) return true;
  if (isGenericEmailLocal(localA) || isGenericEmailLocal(localB)) return true;
  if (a.includes(b) || b.includes(a)) return true;
  for (const n of names) {
    if (!n.first && !n.last) continue;
    const derived = localsDerivedFrom(n.first, n.last);
    if (derived.has(a) && derived.has(b)) return true;
  }
  return false;
}
function normZip(v) {
  const s = str2(v).toUpperCase().replace(/[\s.]/g, "");
  if (!/^[A-Z0-9-]{3,10}$/.test(s)) return "";
  if (/^(\d)\1+$/.test(s) || s === "12345") return "";
  return s;
}
var ADDRESS_WORDS = {
  av: "avenue",
  ave: "avenue",
  bd: "boulevard",
  bld: "boulevard",
  blvd: "boulevard",
  pl: "place",
  rte: "route",
  ch: "chemin",
  imp: "impasse",
  all: "allee",
  sq: "square",
  crs: "cours",
  qu: "quai",
  fg: "faubourg",
  fbg: "faubourg",
  res: "residence",
  bat: "batiment",
  st: "saint",
  ste: "sainte",
  str: "strasse",
  rd: "road",
  dr: "drive",
  ln: "lane",
  ct: "court"
};
function normAddress(v) {
  const w = words(v);
  if (!w) return "";
  return w.split(" ").map((t) => ADDRESS_WORDS[t] ?? t).join(" ");
}
function normEmployees(v) {
  const s = str2(v).replace(/[\s,]/g, "");
  if (!s) return null;
  const m = s.match(/^(\d+)(?:-(\d+)|\+)?$/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function normYear(v) {
  const m = str2(v).match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  if (!m) return null;
  const y = Number(m[1]);
  return y <= (/* @__PURE__ */ new Date()).getFullYear() + 1 ? y : null;
}

// engine/duplicate-weights.ts
var BONUS_CAP = 15;
var MAX_SCORE = 100;
var CONTACT_BONUS = {
  same_email_domain: 5,
  same_company: 5,
  same_job_title: 5,
  second_identifier: 5,
  same_location: 3,
  email_matches_website: 3
};
var CONTACT_MALUS = {
  different_mobile: 10,
  different_country: 10,
  different_email_person: 10,
  different_job_title: 3
};
var COMPANY_BONUS = {
  same_phone: 5,
  same_zip: 5,
  same_address: 5,
  same_industry: 3,
  same_country: 3,
  same_founded_year: 3
};
var COMPANY_MALUS = {
  different_country: 15,
  different_founded_year: 10,
  incompatible_employees: 5,
  different_zip: 5,
  different_phone: 3
};
var FOUNDED_YEAR_TOLERANCE = 2;
var EMPLOYEES_RATIO = 10;
var EMPLOYEES_MIN = 10;

// engine/agents/duplicate-scoring.ts
var MIN_SCORE_TO_CONSIDER = {
  contact: 65,
  company: 70
};
var EMPTY_SCORE = () => ({
  score: 0,
  baseScore: 0,
  reasons: [],
  evidence: [],
  bonus: [],
  malus: [],
  vetos: []
});
function scoreSheet() {
  const out = EMPTY_SCORE();
  const hit = (score, code, values, corroboration) => {
    out.reasons.push(EVIDENCE_REASON_EN(code, corroboration));
    const shared = values?.filter(Boolean) ?? [];
    out.evidence.push({
      code,
      score,
      ...shared.length > 0 ? { values: shared } : {},
      ...corroboration ? { with: corroboration } : {}
    });
    if (score > out.baseScore) out.baseScore = score;
  };
  const adjust = (list, code, points, values) => {
    const shown = values?.filter(Boolean) ?? [];
    list.push({ code, points, ...shown.length > 0 ? { values: shown } : {} });
  };
  const bonus = (code, points, values) => adjust(out.bonus, code, points, values);
  const malus = (code, points, values) => adjust(out.malus, code, -points, values);
  const veto = (code, a, b) => out.vetos.push({ code, values: [a, b] });
  const settle = () => {
    const plus = Math.min(out.bonus.reduce((n, x) => n + x.points, 0), BONUS_CAP);
    const minus = out.malus.reduce((n, x) => n + x.points, 0);
    out.score = Math.max(0, Math.min(MAX_SCORE, out.baseScore + plus + minus));
    return out;
  };
  const consumed = () => {
    const set = /* @__PURE__ */ new Set();
    for (const e of out.evidence) {
      if (e.score !== out.baseScore) continue;
      for (const s of RULE_SIGNALS[e.code] ?? []) set.add(s);
      if (e.with) for (const s of CORROBORATION_SIGNALS[e.with] ?? []) set.add(s);
    }
    return set;
  };
  return { out, hit, bonus, malus, veto, settle, consumed };
}
var RULE_SIGNALS = {
  same_linkedin: ["linkedin"],
  same_email: ["email", "email_domain"],
  same_email_secondary: ["email", "email_domain"],
  same_mobile: ["mobile", "phone"],
  same_name_phone: ["name", "phone", "mobile"],
  same_phone_name_missing: ["phone", "mobile"],
  same_name_company: ["name", "company"],
  same_name_email_domain: ["name", "email_domain"],
  same_name_only: ["name"],
  exact_fuzzy_name: ["name"],
  fuzzy_full_name: ["name"],
  swapped_name: ["name"],
  same_email_local: ["email"],
  near_email_local: ["email", "email_domain"]
};
var CORROBORATION_SIGNALS = {
  same_company: ["company"],
  similar_company: ["company"],
  same_associated_company: ["company"],
  same_email_domain_root: ["email_domain"],
  same_phone: ["phone", "mobile"]
};
var PLACEHOLDER_VALUES = /* @__PURE__ */ new Set([
  "n/a",
  "na",
  "none",
  "null",
  "nil",
  "undefined",
  "unknown",
  "inconnu",
  "aucun",
  "aucune",
  "tbd",
  "todo",
  "test",
  "x",
  "xx",
  "xxx",
  "xxxx",
  "a completer",
  "a definir",
  "a remplir",
  "0",
  "1",
  "-",
  "."
]);
function junkToEmpty(s) {
  if (!s) return "";
  if (!/[\p{L}\p{N}]/u.test(s)) return "";
  return PLACEHOLDER_VALUES.has(s) ? "" : s;
}
var LEGAL_SUFFIXES = /\b(sa|sas|sarl|sasu|eurl|inc|llc|ltd|gmbh|corp|corporation|company|co|sl|srl|bv|ag|plc|limited)\b/g;
var GROUP_WORDS = /\b(group|groupe|holding|holdings)\b/g;
function normName(v) {
  const s = stripAccents(str2(v)).toLowerCase().replace(/\s+/g, " ").trim();
  if (!junkToEmpty(s)) return "";
  return s.replace(/['’`]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}
function normCompanyNameWith(v, stripGroupWords) {
  let s = str2(v);
  const m = s.match(/^\s*(.+?)\s*,\s*(.+?)\s*$/);
  if (m && m[1].toLowerCase() === m[2].toLowerCase()) s = m[1];
  s = stripAccents(s).toLowerCase();
  if (!junkToEmpty(s.trim())) return "";
  if (stripGroupWords) s = s.replace(GROUP_WORDS, " ");
  return s.replace(LEGAL_SUFFIXES, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function normCompanyIdentity(v) {
  return normCompanyNameWith(v, false);
}
var PUBLIC_EMAIL_ROOTS = /* @__PURE__ */ new Set([
  "gmail",
  "googlemail",
  "hotmail",
  "outlook",
  "live",
  "msn",
  "yahoo",
  "ymail",
  "rocketmail",
  "aol",
  "icloud",
  "me",
  "mac",
  "protonmail",
  "proton",
  "pm",
  "gmx",
  "yandex",
  "qq",
  "163",
  "126",
  "mail",
  "web",
  "t-online",
  "zoho",
  "fastmail",
  "tutanota",
  "tuta",
  "hey",
  "posteo",
  "mailbox",
  "hushmail",
  "rediffmail",
  "libero",
  "virgilio",
  "tiscali",
  "btinternet",
  "ntlworld",
  "bigpond",
  "optusnet",
  "xtra",
  "sympatico",
  "videotron",
  "comcast",
  "sbcglobal",
  "bellsouth",
  "verizon",
  "att",
  "cox",
  "charter",
  "rogers",
  "shaw",
  "telenet",
  "skynet",
  "bluewin",
  "sunrise",
  "naver",
  "daum",
  "hanmail"
]);
var PUBLIC_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "bbox.fr",
  "neuf.fr",
  "numericable.fr",
  "aliceadsl.fr",
  "club-internet.fr",
  "voila.fr",
  "cegetel.net",
  "nordnet.fr",
  "dbmail.com",
  "sky.com",
  "virginmedia.com",
  "telefonica.net",
  "terra.com",
  "uol.com.br",
  "bol.com.br",
  "ig.com.br",
  "wp.pl",
  "onet.pl",
  "o2.pl",
  "seznam.cz",
  "centrum.cz",
  "abv.bg",
  "freenet.de",
  "arcor.de",
  "online.de",
  "ziggo.nl",
  "kpnmail.nl",
  "home.nl",
  "planet.nl",
  "hetnet.nl",
  "telia.com",
  "telenor.no",
  "online.no"
]);
function isPublicEmailDomain(domain) {
  if (!domain) return false;
  return PUBLIC_EMAIL_DOMAINS.has(domain) || PUBLIC_EMAIL_ROOTS.has(domainCoreOf(domain));
}
function normEmail(v) {
  const s = stripAccents(str2(v).toLowerCase());
  return /^[^@\s]+@[^@\s]+\.[^@\s.]+$/.test(s) ? s : "";
}
function normPhoneDigits(v) {
  return str2(v).replace(/\D+/g, "").replace(/^0+/, "");
}
function phoneTailOf(...values) {
  for (const v of values) {
    const digits = normPhoneDigits(v);
    if (digits.length < 9) continue;
    const tail = digits.slice(-9);
    if (/^(\d)\1{8}$/.test(tail)) continue;
    return tail;
  }
  return "";
}
function splitMulti(primary, extra, norm) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (v) => {
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  };
  push(primary);
  for (const part of str2(extra).split(/[;,\s]+/)) push(norm(part));
  return out;
}
function sharedValue(a, b) {
  if (a.length === 0 || b.length === 0) return "";
  const setB = new Set(b);
  for (const v of a) if (setB.has(v)) return v;
  return "";
}
function cleanLinkedin(v) {
  let s = str2(v).toLowerCase();
  if (!s) return "";
  if (s.includes(",")) s = s.split(",")[0].trim();
  s = s.split(/[?#]/)[0];
  s = s.replace(/^https?:\/\/(www\.)?/, "");
  s = s.replace(/\/+$/, "");
  try {
    s = decodeURIComponent(s);
  } catch {
  }
  return stripAccents(s);
}
function normLinkedin(v) {
  const s = cleanLinkedin(v);
  return /^(?:[a-z0-9-]+\.)*linkedin\.com\/[^/]+\/./.test(s) ? s : "";
}
function normLinkedinCompanySlug(v) {
  const s = cleanLinkedin(v);
  if (!s) return "";
  const m = s.match(/company\/([^/?#]+)/);
  const slug = m ? m[1] : /linkedin\.com/.test(s) ? "" : s;
  return slug.length >= 2 && /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(slug) ? slug : "";
}
function normDomain(v) {
  let s = str2(v).toLowerCase();
  if (!s) return "";
  const at = s.lastIndexOf("@");
  if (at >= 0) s = s.slice(at + 1);
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split(/[/?#:]/)[0].replace(/\.+$/, "");
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(s) ? s : "";
}
var TWO_LEVEL_TLDS = /* @__PURE__ */ new Set([
  "co.uk",
  "com.br",
  "com.au",
  "co.jp",
  "co.nz",
  "co.za",
  "com.mx",
  "co.in"
]);
function domainCoreOf(domain) {
  if (!domain) return "";
  const parts = domain.split(".").filter(Boolean);
  if (parts.length < 2) return domain;
  const lastTwo = parts.slice(-2).join(".");
  const depth = TWO_LEVEL_TLDS.has(lastTwo) ? 3 : 2;
  return parts.length < depth ? parts[0] : parts[parts.length - depth];
}
function jaccard(a, b) {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  return inter / (setA.size + setB.size - inter);
}
function fuzzyFullName(a, b) {
  return Boolean(a && b && a !== b && a.length >= 6 && b.length >= 6 && levenshtein(a, b, 1) <= 1);
}
function fuzzyNamePart(a, b) {
  return Boolean(a && b && a !== b && a.length >= 4 && b.length >= 4 && levenshtein(a, b, 1) <= 1);
}
function fuzzyCompanyName(a, b) {
  return Boolean(a && b && a !== b && a.length >= 5 && b.length >= 5 && levenshtein(a, b, 1) <= 1);
}
function normalizeContact(id, p) {
  const email = normEmail(p.email);
  const at = email.indexOf("@");
  const emailLocal2 = at > 0 ? email.slice(0, at) : "";
  const emailDomain2 = at > 0 ? email.slice(at + 1) : "";
  const first = normName(p.firstname);
  const last = normName(p.lastname);
  const company = normCompanyIdentity(p.company);
  const mobileTail = phoneTailOf(p.mobilephone);
  const landlineTail = phoneTailOf(p.phone);
  return {
    id: String(id),
    email,
    emails: splitMulti(email, p.hs_additional_emails, normEmail),
    emailLocal: emailLocal2,
    emailLocalCore: emailLocal2.replace(/[^a-z0-9]/g, ""),
    emailDomain: emailDomain2,
    emailDomainCore: domainCoreOf(emailDomain2),
    emailDomainPublic: isPublicEmailDomain(emailDomain2),
    mobileTail,
    landlineTail,
    phoneTails: [...new Set([mobileTail, landlineTail].filter(Boolean))],
    first,
    last,
    fullname: `${first} ${last}`.trim(),
    company,
    companyTokens: company.split(" ").filter(Boolean),
    associatedCompanyId: str2(p.associatedcompanyid),
    linkedin: normLinkedin(p.hs_linkedin_url),
    createdate: str2(p.createdate),
    jobTitle: normJobTitle(p.jobtitle),
    country: normCountry(p.country),
    city: normName(p.city),
    zip: normZip(p.zip),
    websiteCore: domainCoreOf(normDomain(p.website))
  };
}
function linkedinKind(url) {
  return /\/in\/acwaa/.test(url) ? "member_id" : "slug";
}
function both(a, b) {
  return a && a === b ? a : "";
}
function differ(a, b) {
  return Boolean(a && b && a !== b);
}
function contactAdjustments(a, b, sheet) {
  const used = sheet.consumed();
  const { bonus, malus, veto } = sheet;
  if (differ(a.linkedin, b.linkedin) && linkedinKind(a.linkedin) === linkedinKind(b.linkedin)) {
    veto("different_linkedin", a.linkedin, b.linkedin);
  }
  const swapped = Boolean(a.first && a.last && a.first === b.last && a.last === b.first);
  if (!swapped && !firstNamesCompatible(a.first, b.first)) veto("incompatible_first_names", a.first, b.first);
  const domainRoot = sharedCompanyDomainRoot(a, b);
  const twoPeople = Boolean(domainRoot) && differ(a.emailLocal, b.emailLocal) && !oneSlipApart(a.emailLocalCore, b.emailLocalCore) && !emailLocalsCompatible(a.emailLocal, b.emailLocal, [
    { first: a.first, last: a.last },
    { first: b.first, last: b.last }
  ]);
  if (domainRoot && !twoPeople && !used.has("email_domain")) {
    bonus("same_email_domain", CONTACT_BONUS.same_email_domain, [domainRoot]);
  }
  const companyMatch = both(a.company, b.company) || both(a.associatedCompanyId, b.associatedCompanyId) || jaccard(a.companyTokens, b.companyTokens) >= 0.7;
  if (companyMatch && !used.has("company")) bonus("same_company", CONTACT_BONUS.same_company, [both(a.company, b.company)]);
  const roleRecord = (c) => Boolean(c.jobTitle) && c.jobTitle === normJobTitle(c.fullname);
  const titles = roleRecord(a) || roleRecord(b) ? "unknown" : compareJobTitles(a.jobTitle, b.jobTitle);
  if (titles === "same") bonus("same_job_title", CONTACT_BONUS.same_job_title, [a.jobTitle]);
  const secondId = !used.has("linkedin") && both(a.linkedin, b.linkedin) || !used.has("email") && sharedValue(a.emails, b.emails) || !used.has("mobile") && both(a.mobileTail, b.mobileTail);
  if (secondId) bonus("second_identifier", CONTACT_BONUS.second_identifier, [secondId]);
  const place = both(a.city, b.city) || both(a.country, b.country);
  if (place) bonus("same_location", CONTACT_BONUS.same_location, [place]);
  if (a.websiteCore && b.websiteCore && !a.emailDomainPublic && !b.emailDomainPublic && a.emailDomainCore === a.websiteCore && b.emailDomainCore === b.websiteCore) {
    bonus("email_matches_website", CONTACT_BONUS.email_matches_website);
  }
  if (differ(a.mobileTail, b.mobileTail)) malus("different_mobile", CONTACT_MALUS.different_mobile, [a.mobileTail, b.mobileTail]);
  if (differ(a.country, b.country)) malus("different_country", CONTACT_MALUS.different_country, [a.country, b.country]);
  if (twoPeople) malus("different_email_person", CONTACT_MALUS.different_email_person, [a.emailLocal, b.emailLocal]);
  if (titles === "different") malus("different_job_title", CONTACT_MALUS.different_job_title, [a.jobTitle, b.jobTitle]);
}
function sharedCompanyDomainRoot(a, b) {
  if (a.emailDomainPublic || b.emailDomainPublic) return "";
  return a.emailDomainCore && a.emailDomainCore === b.emailDomainCore ? a.emailDomainCore : "";
}
function contactCorroboration(a, b) {
  if (a.company && a.company === b.company) return "same_company";
  if (jaccard(a.companyTokens, b.companyTokens) >= 0.7) return "similar_company";
  if (a.associatedCompanyId && a.associatedCompanyId === b.associatedCompanyId)
    return "same_associated_company";
  if (sharedCompanyDomainRoot(a, b)) return "same_email_domain_root";
  if (sharedValue(a.phoneTails, b.phoneTails)) return "same_phone";
  return null;
}
function scoreContactPair(a, b) {
  const sheet = scoreSheet();
  const { hit } = sheet;
  if (a.linkedin && a.linkedin === b.linkedin) hit(100, "same_linkedin", [a.linkedin]);
  const sharedEmail = sharedValue(a.emails, b.emails);
  if (sharedEmail) {
    hit(
      95,
      sharedEmail === a.email && sharedEmail === b.email ? "same_email" : "same_email_secondary",
      [sharedEmail]
    );
  }
  const sameFullName = Boolean(a.fullname && a.fullname === b.fullname);
  const sharedPhone = sharedValue(a.phoneTails, b.phoneTails);
  if (a.mobileTail && a.mobileTail === b.mobileTail) hit(85, "same_mobile", [a.mobileTail]);
  if (sharedPhone) {
    if (sameFullName) hit(85, "same_name_phone", [a.fullname, sharedPhone]);
    else if (!a.fullname || !b.fullname) hit(70, "same_phone_name_missing", [sharedPhone]);
  }
  const companyMatch = a.company && a.company === b.company || a.associatedCompanyId && a.associatedCompanyId === b.associatedCompanyId || jaccard(a.companyTokens, b.companyTokens) >= 0.7;
  if (sameFullName) {
    const domainRoot = sharedCompanyDomainRoot(a, b);
    if (companyMatch)
      hit(80, "same_name_company", [a.fullname, a.company === b.company ? a.company : ""]);
    else if (domainRoot) hit(75, "same_name_email_domain", [a.fullname, domainRoot]);
    else hit(70, "same_name_only", [a.fullname]);
  }
  const corrob = contactCorroboration(a, b);
  const exactPlusFuzzy = a.first && a.first === b.first && fuzzyNamePart(a.last, b.last) || a.last && a.last === b.last && fuzzyNamePart(a.first, b.first);
  if (exactPlusFuzzy) hit(corrob ? 75 : 65, "exact_fuzzy_name", void 0, corrob ?? "none");
  if (fuzzyFullName(a.fullname, b.fullname)) hit(corrob ? 70 : 65, "fuzzy_full_name", void 0, corrob ?? "none");
  if (a.first && a.last && a.first === b.last && a.last === b.first) {
    hit(70, "swapped_name");
  }
  if (a.emailLocal && b.emailLocal && a.emailLocal === b.emailLocal && a.emailDomain !== b.emailDomain) {
    hit(65, "same_email_local", [a.emailLocal]);
  }
  if (a.emailLocalCore.length >= 5 && b.emailLocalCore.length >= 5 && a.emailLocal !== b.emailLocal && a.emailDomainCore && a.emailDomainCore === b.emailDomainCore && levenshtein(a.emailLocalCore, b.emailLocalCore, 1) <= 1) {
    hit(75, "near_email_local", [a.emailDomainCore]);
  }
  if (sheet.out.baseScore === 0) return sheet.settle();
  contactAdjustments(a, b, sheet);
  return sheet.settle();
}
function contactBlockingKeys(c) {
  const keys = [];
  if (c.linkedin) keys.push(`ln:${c.linkedin}`);
  for (const e of c.emails) keys.push(`em:${e}`);
  for (const t of c.phoneTails) keys.push(`ph:${t}`);
  if (c.fullname && c.fullname.length >= 3) keys.push(`fn:${c.fullname}`);
  if (c.company) keys.push(`co:${c.company}`);
  if (c.associatedCompanyId) keys.push(`ac:${c.associatedCompanyId}`);
  if (c.emailDomainCore && !c.emailDomainPublic) keys.push(`dc:${c.emailDomainCore}`);
  return keys;
}
var ACCOUNT_KEY = /^(co|ac|dc):/;
function contactRefineKeys(key, c) {
  const account = ACCOUNT_KEY.test(key);
  const out = contactBlockingKeys(c).filter((k) => k !== key && !(account && ACCOUNT_KEY.test(k)));
  if (account) {
    for (const t of new Set(`${c.first} ${c.last}`.split(" "))) {
      if (t.length >= 2) out.push(`nt:${t}`);
    }
  }
  return out;
}
function normSiren(v) {
  const digits = str2(v).replace(/[\s.\-]/g, "");
  const siren = /^\d{9}$/.test(digits) ? digits : /^\d{14}$/.test(digits) ? digits.slice(0, 9) : "";
  return /^(\d)\1{8}$/.test(siren) ? "" : siren;
}
function normalizeCompany(id, p) {
  const domain = normDomain(p.domain || p.website);
  const domains = splitMulti(domain, p.hs_additional_domains, normDomain);
  return {
    id: String(id),
    name: normCompanyIdentity(p.name),
    domain,
    domainCore: domainCoreOf(domain),
    domains,
    domainCores: [...new Set(domains.map(domainCoreOf).filter(Boolean))],
    linkedin: normLinkedinCompanySlug(p.linkedin_company_page || p.hs_linkedin_handle),
    city: normName(p.city),
    siren: normSiren(p.jipup_siren) || normSiren(p.siren),
    createdate: str2(p.createdate),
    country: normCountry(p.country),
    zip: normZip(p.zip),
    address: normAddress(p.address),
    phoneTail: phoneTailOf(p.phone),
    industry: normName(p.industry),
    foundedYear: normYear(p.founded_year),
    employees: normEmployees(p.numberofemployees),
    parentId: str2(p.hs_parent_company_id)
  };
}
function parentSubsidiary(a, b) {
  return Boolean(a.parentId) && a.parentId === b.id || Boolean(b.parentId) && b.parentId === a.id;
}
function companyAdjustments(a, b, sheet) {
  const { bonus, malus, veto } = sheet;
  if (differ(a.siren, b.siren)) veto("different_siren", a.siren, b.siren);
  if (differ(a.linkedin, b.linkedin) && /^\d+$/.test(a.linkedin) === /^\d+$/.test(b.linkedin)) {
    veto("different_company_linkedin", a.linkedin, b.linkedin);
  }
  if (both(a.phoneTail, b.phoneTail)) bonus("same_phone", COMPANY_BONUS.same_phone, [a.phoneTail]);
  if (both(a.zip, b.zip)) bonus("same_zip", COMPANY_BONUS.same_zip, [a.zip]);
  if (both(a.address, b.address)) bonus("same_address", COMPANY_BONUS.same_address, [a.address]);
  if (both(a.industry, b.industry)) bonus("same_industry", COMPANY_BONUS.same_industry, [a.industry]);
  if (both(a.country, b.country)) bonus("same_country", COMPANY_BONUS.same_country, [a.country]);
  if (a.foundedYear !== null && a.foundedYear === b.foundedYear) {
    bonus("same_founded_year", COMPANY_BONUS.same_founded_year, [String(a.foundedYear)]);
  }
  const sameCountry = both(a.country, b.country);
  if (differ(a.country, b.country) && !sharedValue(a.domains, b.domains)) {
    malus("different_country", COMPANY_MALUS.different_country, [a.country, b.country]);
  }
  if (a.foundedYear !== null && b.foundedYear !== null && Math.abs(a.foundedYear - b.foundedYear) > FOUNDED_YEAR_TOLERANCE) {
    malus("different_founded_year", COMPANY_MALUS.different_founded_year, [String(a.foundedYear), String(b.foundedYear)]);
  }
  if (a.employees !== null && b.employees !== null && a.employees > EMPLOYEES_MIN && b.employees > EMPLOYEES_MIN && Math.max(a.employees, b.employees) / Math.min(a.employees, b.employees) > EMPLOYEES_RATIO) {
    malus("incompatible_employees", COMPANY_MALUS.incompatible_employees, [String(a.employees), String(b.employees)]);
  }
  if (differ(a.zip, b.zip) && (sameCountry || !a.country && !b.country)) {
    malus("different_zip", COMPANY_MALUS.different_zip, [a.zip, b.zip]);
  }
  if (differ(a.phoneTail, b.phoneTail)) malus("different_phone", COMPANY_MALUS.different_phone, [a.phoneTail, b.phoneTail]);
}
function scoreCompanyPair(a, b) {
  if (!a.name && a.domains.length === 0 || !b.name && b.domains.length === 0) return EMPTY_SCORE();
  if (parentSubsidiary(a, b)) return { ...EMPTY_SCORE(), excluded: "parent_subsidiary" };
  const sheet = scoreSheet();
  const { hit } = sheet;
  const nameEq = Boolean(a.name && a.name === b.name);
  const nameFuzzy = fuzzyCompanyName(a.name, b.name);
  const sharedDomain = sharedValue(a.domains, b.domains);
  const sharedCore = sharedValue(a.domainCores, b.domainCores);
  const domEq = Boolean(sharedDomain);
  const coreEq = Boolean(sharedCore);
  const hasDomainA = a.domains.length > 0;
  const hasDomainB = b.domains.length > 0;
  if (a.siren && a.siren === b.siren) hit(95, "same_siren", [a.siren]);
  if (domEq) hit(90, "same_domain", [sharedDomain]);
  if (a.linkedin && a.linkedin === b.linkedin) {
    if (nameEq || nameFuzzy || domEq || coreEq) hit(90, "same_linkedin_corroborated", [a.linkedin]);
    else hit(75, "same_linkedin_alone", [a.linkedin]);
  }
  if (nameEq && coreEq) hit(80, "same_name_domain_root", [a.name, sharedCore]);
  if (coreEq && !domEq) hit(80, "same_domain_root_other_tld", [sharedCore]);
  if (nameEq && a.city && a.city === b.city) hit(75, "same_name_city", [a.name, a.city]);
  if (nameFuzzy && domEq) hit(80, "fuzzy_name_same_domain", [sharedDomain]);
  if ((!a.name || !b.name) && coreEq) hit(80, "ghost_domain_root", [sharedCore]);
  if ((nameEq || nameFuzzy) && hasDomainA !== hasDomainB)
    hit(80, nameEq ? "same_name_no_domain_one_side" : "fuzzy_name_no_domain_one_side", [nameEq ? a.name : ""]);
  if (nameEq && a.domainCore && b.domainCore && !coreEq)
    hit(80, "same_name_different_roots", [a.name]);
  if (nameFuzzy && !coreEq && a.domainCore && b.domainCore && a.domainCore.length >= 4 && b.domainCore.length >= 4 && levenshtein(a.domainCore, b.domainCore, 1) <= 1) {
    hit(80, "fuzzy_name_fuzzy_root");
  }
  if (sheet.out.baseScore === 0) return sheet.settle();
  companyAdjustments(a, b, sheet);
  return sheet.settle();
}
function companyBlockingKeys(c) {
  const keys = [];
  for (const d of c.domains) keys.push(`de:${d}`);
  for (const d of c.domainCores) keys.push(`dc:${d}`);
  if (c.name) keys.push(`nm:${c.name}`);
  if (c.linkedin) keys.push(`li:${c.linkedin}`);
  if (c.siren) keys.push(`sr:${c.siren}`);
  if (c.name.length >= 5) keys.push(`np:${c.name.slice(0, 4)}`);
  return keys;
}
function deletionVariants(name) {
  const out = /* @__PURE__ */ new Set([name]);
  if (name.length > 40) return [...out];
  for (let i = 0; i < name.length; i++) out.add(name.slice(0, i) + name.slice(i + 1));
  return [...out];
}
var DOMAIN_KEY = /^(de|dc):/;
function companyRefineKeys(key, c) {
  const domain = DOMAIN_KEY.test(key);
  const out = companyBlockingKeys(c).filter((k) => k !== key && !(domain && DOMAIN_KEY.test(k)));
  if (key.startsWith("np:")) for (const v of deletionVariants(c.name)) out.push(`nd:${v}`);
  if (key.startsWith("nm:") && c.city) out.push(`ci:${c.city}`);
  return out;
}
var DEFAULT_MAX_BLOCK = 250;
function hashKey(str3) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let i = 0; i < str3.length; i++) {
    const ch = str3.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
function firstShared(x, y) {
  let p = 0;
  let q = 0;
  while (p < x.length && q < y.length) {
    if (x[p] === y[q]) return x[p];
    if (x[p] < y[q]) p++;
    else q++;
  }
  return -1;
}
var NO_REASONS = [];
function detectPairs(opts) {
  const maxBlock = opts.maxBlock ?? DEFAULT_MAX_BLOCK;
  const recs = opts.records;
  const bigNames = /* @__PURE__ */ new Map();
  const push = (map, key, i) => {
    const h = hashKey(key);
    const cur = map.get(h);
    if (cur === void 0) map.set(h, i);
    else if (typeof cur === "number") {
      if (cur !== i) map.set(h, [cur, i]);
    } else if (cur[cur.length - 1] !== i) {
      cur.push(i);
      if (cur.length === maxBlock + 1) bigNames.set(h, key);
    }
  };
  const sizeOf = (v) => v === void 0 ? 0 : typeof v === "number" ? 1 : v.length;
  const byKey = /* @__PURE__ */ new Map();
  recs.forEach((rec, i) => {
    for (const key of opts.keysOf(rec)) push(byKey, key, i);
  });
  const blocks = [];
  const bigBlocks = [];
  for (const [h, list] of byKey) {
    if (typeof list === "number") continue;
    if (list.length <= maxBlock) blocks.push(list);
    else bigBlocks.push({ key: bigNames.get(h), list });
  }
  for (const { key, list } of bigBlocks) {
    if (!opts.refineKeys) {
      opts.onBlockSkipped?.(key, list.length);
      continue;
    }
    opts.onBlockRefined?.(key, list.length);
    const refined = /* @__PURE__ */ new Map();
    for (const i of list) {
      for (const sub of opts.refineKeys(key, recs[i])) {
        const top = sizeOf(byKey.get(hashKey(sub)));
        if (top > 0 && (top <= maxBlock || sub < key)) continue;
        push(refined, `${key}|${sub}`, i);
      }
    }
    for (const [h, sub] of refined) {
      if (typeof sub === "number") continue;
      if (sub.length <= maxBlock) blocks.push(sub);
      else opts.onBlockSkipped?.(bigNames.get(h), sub.length);
    }
  }
  byKey.clear();
  const memberOf = recs.map(() => []);
  blocks.forEach((list, b) => {
    for (const i of list) {
      const m = memberOf[i];
      if (m[m.length - 1] !== b) m.push(b);
    }
  });
  const keepReasons = opts.keepReasons !== false;
  const pairs = [];
  for (let b = 0; b < blocks.length; b++) {
    const list = blocks[b];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const ia = list[i];
        const ib = list[j];
        if (ia === ib) continue;
        const a = recs[ia];
        const c = recs[ib];
        if (a.id === c.id) continue;
        if (firstShared(memberOf[ia], memberOf[ib]) !== b) continue;
        const { score, baseScore, reasons, excluded } = opts.score(a, c);
        if (excluded) {
          opts.onPairExcluded?.(a, c, excluded);
          continue;
        }
        if ((baseScore ?? score) >= opts.minScore) {
          pairs.push({ aId: a.id, bId: c.id, score, reasons: keepReasons ? reasons : NO_REASONS });
        }
      }
    }
  }
  return pairs;
}
var FREQ_GUARD_MIN_HOLDERS = 6;
var FREQ_GUARD_MIN_LABELS = 3;
var CONTACT_SIGNALS = [
  { prefix: "ln", get: (c) => [c.linkedin] },
  { prefix: "em", get: (c) => c.emails },
  { prefix: "ph", get: (c) => c.phoneTails }
];
var COMPANY_SIGNALS = [
  { prefix: "de", get: (c) => c.domains },
  { prefix: "dc", get: (c) => c.domainCores },
  { prefix: "li", get: (c) => [c.linkedin] },
  // A group's SIREN pasted on its subsidiaries, a placeholder typed everywhere.
  { prefix: "sr", get: (c) => [c.siren] }
];
function findDisqualified(records, fields, labelOf, minHolders, minLabels) {
  const out = [];
  for (const f of fields) {
    const holders = /* @__PURE__ */ new Map();
    for (const r of records) {
      for (const v of f.get(r)) {
        if (!v) continue;
        const list = holders.get(v);
        if (list) list.push(r);
        else holders.set(v, [r]);
      }
    }
    for (const [v, recs] of holders) {
      if (recs.length < minHolders) continue;
      const labels = new Set(recs.map(labelOf).filter(Boolean));
      if (labels.size >= minLabels) {
        out.push({ key: `${f.prefix}:${v}`, holders: recs.length, labels: labels.size });
      }
    }
  }
  return out;
}
function scrubContactSignals(c, keys) {
  if (keys.size === 0) return c;
  if (c.linkedin && keys.has(`ln:${c.linkedin}`)) c.linkedin = "";
  if (c.email && keys.has(`em:${c.email}`)) {
    c.email = "";
    c.emailLocal = "";
    c.emailLocalCore = "";
    c.emailDomain = "";
    c.emailDomainCore = "";
    c.emailDomainPublic = false;
  }
  c.emails = c.emails.filter((e) => !keys.has(`em:${e}`));
  if (c.mobileTail && keys.has(`ph:${c.mobileTail}`)) c.mobileTail = "";
  if (c.landlineTail && keys.has(`ph:${c.landlineTail}`)) c.landlineTail = "";
  c.phoneTails = c.phoneTails.filter((t) => !keys.has(`ph:${t}`));
  return c;
}
function scrubCompanySignals(c, keys) {
  if (keys.size === 0) return c;
  if (c.domain && keys.has(`de:${c.domain}`)) {
    c.domain = "";
    c.domainCore = "";
  }
  if (c.domainCore && keys.has(`dc:${c.domainCore}`)) c.domainCore = "";
  c.domains = c.domains.filter((d) => !keys.has(`de:${d}`));
  c.domainCores = c.domainCores.filter((d) => !keys.has(`dc:${d}`));
  if (c.linkedin && keys.has(`li:${c.linkedin}`)) c.linkedin = "";
  if (c.siren && keys.has(`sr:${c.siren}`)) c.siren = "";
  return c;
}
function normalizeRecord(object, rec) {
  return object === "contact" ? normalizeContact(rec.id, rec.properties ?? {}) : normalizeCompany(rec.id, rec.properties ?? {});
}
function detectNormalized(object, normed, opts) {
  const minHolders = opts?.minHolders ?? FREQ_GUARD_MIN_HOLDERS;
  const minLabels = opts?.minLabels ?? FREQ_GUARD_MIN_LABELS;
  const refinedBlocks = [];
  const skippedBlocks = [];
  let excludedPairs = 0;
  const blockOpts = {
    maxBlock: opts?.maxBlock,
    keepReasons: opts?.keepReasons,
    onBlockRefined: (key, size) => refinedBlocks.push({ key, size }),
    onBlockSkipped: (key, size) => {
      skippedBlocks.push({ key, size });
      opts?.onBlockSkipped?.(key, size);
    },
    onPairExcluded: () => {
      excludedPairs++;
    }
  };
  if (object === "contact") {
    const contacts = normed;
    const disqualified2 = findDisqualified(
      contacts,
      CONTACT_SIGNALS,
      (c) => c.fullname,
      minHolders,
      minLabels
    );
    const keys2 = new Set(disqualified2.map((d) => d.key));
    for (const c of contacts) scrubContactSignals(c, keys2);
    const pairs2 = detectPairs({
      records: contacts,
      keysOf: contactBlockingKeys,
      refineKeys: contactRefineKeys,
      score: scoreContactPair,
      minScore: MIN_SCORE_TO_CONSIDER.contact,
      ...blockOpts
    });
    return { pairs: pairs2, disqualified: disqualified2, refinedBlocks, skippedBlocks, excludedPairs };
  }
  const companies = normed;
  const disqualified = findDisqualified(
    companies,
    COMPANY_SIGNALS,
    (c) => c.name,
    minHolders,
    minLabels
  );
  const keys = new Set(disqualified.map((d) => d.key));
  for (const c of companies) scrubCompanySignals(c, keys);
  const pairs = detectPairs({
    records: companies,
    keysOf: companyBlockingKeys,
    refineKeys: companyRefineKeys,
    score: scoreCompanyPair,
    minScore: MIN_SCORE_TO_CONSIDER.company,
    ...blockOpts
  });
  return { pairs, disqualified, refinedBlocks, skippedBlocks, excludedPairs };
}
function detectDuplicates(object, records, opts) {
  return detectNormalized(object, records.map((r) => normalizeRecord(object, r)), opts);
}

// engine/audit/checks/duplicates.ts
function affectedIds(pairs) {
  const ids = /* @__PURE__ */ new Set();
  for (const p of pairs) {
    ids.add(p.aId);
    ids.add(p.bId);
  }
  return ids;
}
function collectEvidence(ev, checkId, object, pairs, byId) {
  const sorted = [...pairs].sort((a, b) => b.score - a.score);
  for (const pair of sorted) {
    const a = byId.get(pair.aId);
    const b = byId.get(pair.bId);
    if (!a || !b) continue;
    ev.add(checkId, object, a, {
      duplicateOfId: b.id,
      duplicateOfName: nameOf(b, object),
      score: pair.score,
      reasons: pair.reasons
    });
  }
}
function runFor(object, records, ev, onBlockSkipped) {
  const checkId = object === "contact" ? "duplicates.contacts" : "duplicates.companies";
  const { pairs, disqualified } = detectDuplicates(object, records, { onBlockSkipped });
  for (const d of disqualified) {
    console.warn(
      `[audit] signal disqualified (${object}): ${d.key} \u2014 ${d.holders} records, ${d.labels} distinct names.`
    );
  }
  const byId = new Map(records.map((r) => [r.id, r]));
  collectEvidence(ev, checkId, object, pairs, byId);
  return {
    pairs,
    check: buildCheck({
      id: checkId,
      affected: affectedIds(pairs).size,
      total: records.length,
      meta: disqualified.length > 0 ? { pairs: pairs.length, disqualifiedSignals: disqualified.length } : { pairs: pairs.length }
    })
  };
}
function runDuplicates(ctx, ev) {
  const skippedBlocks = [];
  const onBlockSkipped = (key, size) => {
    skippedBlocks.push(`${key} (${size})`);
    console.warn(`[audit] duplicate block skipped \u2014 key too generic: ${key} (${size} records)`);
  };
  const contacts = runFor("contact", ctx.contacts, ev, onBlockSkipped);
  const companies = runFor("company", ctx.companies, ev, onBlockSkipped);
  const checks = [contacts.check, companies.check];
  if (skippedBlocks.length > 0) {
    checks[0].meta = {
      ...checks[0].meta ?? {},
      skippedBlocks: skippedBlocks.length
    };
  }
  return {
    checks,
    findings: [],
    totals: {
      contactPairs: contacts.pairs.length,
      companyPairs: companies.pairs.length,
      affectedContactIds: affectedIds(contacts.pairs),
      affectedCompanies: affectedIds(companies.pairs).size
    }
  };
}

// engine/audit/checks/freshness.ts
function lastActivityAt(rec, ctx) {
  const candidates = ["notes_last_contacted", "notes_last_updated", "hs_email_last_send_date"].filter((p) => ctx.contactProps.has(p)).map((p) => dateProp(rec, p)).filter((t) => t !== null);
  return candidates.length > 0 ? Math.max(...candidates) : null;
}
function runFreshness(ctx, ev) {
  const checks = [];
  const canSeeActivity = ctx.contactProps.has("notes_last_contacted") || ctx.contactProps.has("notes_last_updated");
  if (!canSeeActivity) {
    checks.push(
      skippedCheck("freshness.contact.neverContacted", "missing_property", 3),
      skippedCheck("freshness.contact.dormant", "missing_property", 2)
    );
  } else {
    let neverContacted = 0;
    let dormant = 0;
    let contactable = 0;
    for (const rec of ctx.contacts) {
      const last = lastActivityAt(rec, ctx);
      if (last === null) {
        neverContacted++;
        ev.add("freshness.contact.neverContacted", "contact", rec);
        continue;
      }
      contactable++;
      const months = monthsSince(last, ctx.now);
      if (months >= DORMANT_MONTHS) {
        dormant++;
        ev.add("freshness.contact.dormant", "contact", rec, {
          lastActivity: new Date(last).toISOString(),
          monthsSince: Math.round(months)
        });
      }
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.neverContacted",
        affected: neverContacted,
        total: ctx.contacts.length,
        weight: 3
      }),
      buildCheck({
        id: "freshness.contact.dormant",
        affected: dormant,
        total: contactable,
        weight: 2,
        meta: { months: DORMANT_MONTHS }
      })
    );
  }
  if (ctx.contactProps.has("createdate") && ctx.contactProps.has("lastmodifieddate")) {
    let untouched = 0;
    let dated = 0;
    for (const rec of ctx.contacts) {
      const created = dateProp(rec, "createdate");
      const modified = dateProp(rec, "lastmodifieddate");
      if (created === null || modified === null) continue;
      dated++;
      const ageMonths = monthsSince(created, ctx.now);
      const editedWindowDays = (modified - created) / 864e5;
      if (ageMonths >= DORMANT_MONTHS && editedWindowDays <= 1) {
        untouched++;
        ev.add("freshness.contact.neverEdited", "contact", rec, {
          created: new Date(created).toISOString(),
          ageMonths: Math.round(ageMonths)
        });
      }
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.neverEdited",
        affected: untouched,
        total: dated,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("freshness.contact.neverEdited", "missing_property", 2));
  }
  if (ctx.contactProps.has("lifecyclestage") && ctx.contactProps.has("num_associated_deals")) {
    let inconsistent = 0;
    let customers = 0;
    for (const rec of ctx.contacts) {
      const stage = (rec.properties?.lifecyclestage ?? "").toString().toLowerCase();
      if (stage !== "customer") continue;
      customers++;
      if (Number(rec.properties?.num_associated_deals ?? 0) > 0) continue;
      inconsistent++;
      ev.add("freshness.contact.customerWithoutDeal", "contact", rec, { stage });
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.customerWithoutDeal",
        affected: inconsistent,
        total: customers,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("freshness.contact.customerWithoutDeal", "missing_property", 1));
  }
  return { checks, findings: [] };
}

// engine/audit/checks/pipeline.ts
var CHECK_IDS = [
  "pipeline.deal.overdue",
  "pipeline.deal.stalled",
  "pipeline.deal.noAmount",
  "pipeline.deal.noContact"
];
function isOpen(rec, ctx) {
  if (ctx.dealProps.has("hs_is_closed")) return !bool(rec, "hs_is_closed");
  const stage = prop(rec, "dealstage").toLowerCase();
  return !stage.includes("closed") && !stage.includes("won") && !stage.includes("lost");
}
function runPipeline(ctx, ev) {
  if (!ctx.capabilities.has("deals")) {
    return {
      checks: CHECK_IDS.map((id) => skippedCheck(id, "missing_scope")),
      findings: [],
      skipped: "missing_scope",
      requiredScope: CAPABILITY_SCOPES.deals
    };
  }
  const open = ctx.deals.filter((d) => isOpen(d, ctx));
  const checks = [];
  if (!ctx.dealProps.has("closedate")) {
    checks.push(skippedCheck("pipeline.deal.overdue", "missing_property", 3));
  } else {
    let overdue = 0;
    let dated = 0;
    for (const rec of open) {
      const close = dateProp(rec, "closedate");
      if (close === null) continue;
      dated++;
      if (close >= ctx.now) continue;
      overdue++;
      ev.add("pipeline.deal.overdue", "deal", rec, {
        closeDate: new Date(close).toISOString(),
        daysOverdue: Math.round(daysSince(close, ctx.now)),
        amount: prop(rec, "amount") || null
      });
    }
    checks.push(
      buildCheck({ id: "pipeline.deal.overdue", affected: overdue, total: dated, weight: 3 })
    );
  }
  const activityProps = ["hs_lastmodifieddate", "notes_last_updated"].filter(
    (p) => ctx.dealProps.has(p)
  );
  if (activityProps.length === 0) {
    checks.push(skippedCheck("pipeline.deal.stalled", "missing_property", 3));
  } else {
    let stalled = 0;
    let dated = 0;
    for (const rec of open) {
      const timestamps = activityProps.map((p) => dateProp(rec, p)).filter((t) => t !== null);
      if (timestamps.length === 0) continue;
      dated++;
      const days = daysSince(Math.max(...timestamps), ctx.now);
      if (days < ZOMBIE_DEAL_DAYS) continue;
      stalled++;
      ev.add("pipeline.deal.stalled", "deal", rec, {
        idleDays: Math.round(days),
        amount: prop(rec, "amount") || null
      });
    }
    checks.push(
      buildCheck({
        id: "pipeline.deal.stalled",
        affected: stalled,
        total: dated,
        weight: 3,
        meta: { days: ZOMBIE_DEAL_DAYS }
      })
    );
  }
  if (!ctx.dealProps.has("amount")) {
    checks.push(skippedCheck("pipeline.deal.noAmount", "missing_property", 2));
  } else {
    let noAmount = 0;
    for (const rec of open) {
      if (filled(rec, "amount") && num(rec, "amount") > 0) continue;
      noAmount++;
      ev.add("pipeline.deal.noAmount", "deal", rec);
    }
    checks.push(
      buildCheck({ id: "pipeline.deal.noAmount", affected: noAmount, total: open.length, weight: 2 })
    );
  }
  if (!ctx.dealProps.has("num_associated_contacts")) {
    checks.push(skippedCheck("pipeline.deal.noContact", "missing_property", 2));
  } else {
    let noContact = 0;
    for (const rec of open) {
      if (num(rec, "num_associated_contacts") > 0) continue;
      noContact++;
      ev.add("pipeline.deal.noContact", "deal", rec);
    }
    checks.push(
      buildCheck({
        id: "pipeline.deal.noContact",
        affected: noContact,
        total: open.length,
        weight: 2
      })
    );
  }
  return { checks, findings: [] };
}

// engine/audit/checks/quality.ts
var ISO2_TO_NAME = {
  fr: "france",
  be: "belgique",
  ch: "suisse",
  lu: "luxembourg",
  de: "allemagne",
  es: "espagne",
  it: "italie",
  pt: "portugal",
  nl: "pays bas",
  gb: "royaume uni",
  uk: "royaume uni",
  ie: "irlande",
  us: "etats unis",
  ca: "canada",
  ma: "maroc",
  tn: "tunisie",
  dz: "algerie",
  sn: "senegal",
  ci: "cote d ivoire",
  pl: "pologne",
  se: "suede",
  dk: "danemark",
  no: "norvege",
  fi: "finlande",
  at: "autriche",
  au: "australie",
  br: "bresil",
  in: "inde",
  cn: "chine",
  jp: "japon"
};
var COUNTRY_ALIASES = {
  usa: "etats unis",
  "u s a": "etats unis",
  "united states": "etats unis",
  "united states of america": "etats unis",
  "etats unis d amerique": "etats unis",
  "united kingdom": "royaume uni",
  "great britain": "royaume uni",
  england: "royaume uni",
  angleterre: "royaume uni",
  germany: "allemagne",
  deutschland: "allemagne",
  spain: "espagne",
  espana: "espagne",
  italy: "italie",
  italia: "italie",
  netherlands: "pays bas",
  holland: "pays bas",
  belgium: "belgique",
  switzerland: "suisse",
  schweiz: "suisse",
  portugal: "portugal",
  ireland: "irlande",
  morocco: "maroc",
  tunisia: "tunisie",
  algeria: "algerie"
};
function countryKey(raw) {
  const normalized = normName(raw);
  if (!normalized) return "";
  if (normalized.length === 2 && ISO2_TO_NAME[normalized]) {
    return ISO2_TO_NAME[normalized];
  }
  return COUNTRY_ALIASES[normalized] ?? normalized;
}
var DOMAIN_SHAPE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
function countryConsistency(ctx, ev) {
  const id = "quality.country.inconsistent";
  if (!ctx.companyProps.has("country")) {
    return skippedCheck(id, "missing_property");
  }
  const groups = /* @__PURE__ */ new Map();
  for (const rec of ctx.companies) {
    const raw = prop(rec, "country");
    if (!raw) continue;
    const key = countryKey(raw);
    if (!key) continue;
    const spellings = groups.get(key) ?? /* @__PURE__ */ new Map();
    spellings.set(raw, (spellings.get(raw) ?? 0) + 1);
    groups.set(key, spellings);
  }
  const canonical = /* @__PURE__ */ new Map();
  let variantSpellings = 0;
  for (const [key, spellings] of groups) {
    const best = [...spellings.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )[0][0];
    canonical.set(key, best);
    variantSpellings += spellings.size - 1;
  }
  let affected2 = 0;
  let total = 0;
  for (const rec of ctx.companies) {
    const raw = prop(rec, "country");
    if (!raw) continue;
    total++;
    const key = countryKey(raw);
    const best = canonical.get(key);
    if (best && best !== raw) {
      affected2++;
      ev.add(id, "company", rec, { value: raw, canonical: best });
    }
  }
  return buildCheck({
    id,
    affected: affected2,
    total,
    meta: { distinctCountries: groups.size, variantSpellings }
  });
}
function runQuality(ctx, ev) {
  const checks = [];
  if (ctx.contactProps.has("email")) {
    let invalid = 0;
    let typo = 0;
    let role = 0;
    let free = 0;
    let withEmail = 0;
    for (const rec of ctx.contacts) {
      const email = prop(rec, "email").toLowerCase();
      if (!email) continue;
      withEmail++;
      if (isStructurallyInvalidEmail(email)) {
        invalid++;
        ev.add("quality.email.invalid", "contact", rec, { email });
        continue;
      }
      const domain = emailDomain(email);
      const local = emailLocal(email);
      const intended = TYPO_DOMAINS[domain];
      if (intended) {
        typo++;
        ev.add("quality.email.typo", "contact", rec, { email, suggestion: intended });
      }
      if (ROLE_EMAIL_LOCALS.has(local)) {
        role++;
        ev.add("quality.email.role", "contact", rec, { email });
      }
      if (FREE_EMAIL_DOMAINS.has(domain)) {
        free++;
        ev.add("quality.email.free", "contact", rec, { email, domain });
      }
    }
    checks.push(
      buildCheck({ id: "quality.email.invalid", affected: invalid, total: withEmail, weight: 3 }),
      buildCheck({ id: "quality.email.typo", affected: typo, total: withEmail, weight: 3 }),
      buildCheck({ id: "quality.email.role", affected: role, total: withEmail, weight: 2 }),
      buildCheck({ id: "quality.email.free", affected: free, total: withEmail, weight: 1 })
    );
  } else {
    checks.push(
      skippedCheck("quality.email.invalid", "missing_property", 3),
      skippedCheck("quality.email.typo", "missing_property", 3),
      skippedCheck("quality.email.role", "missing_property", 2),
      skippedCheck("quality.email.free", "missing_property", 1)
    );
  }
  const phoneProps = ["phone", "mobilephone"].filter((p) => ctx.contactProps.has(p));
  if (phoneProps.length > 0) {
    let badPhone = 0;
    let withPhone = 0;
    for (const rec of ctx.contacts) {
      const raw = firstFilled(rec, ...phoneProps);
      if (!raw) continue;
      withPhone++;
      if (!isPlausiblePhone(raw)) {
        badPhone++;
        ev.add("quality.phone.format", "contact", rec, { phone: raw });
      }
    }
    checks.push(
      buildCheck({ id: "quality.phone.format", affected: badPhone, total: withPhone, weight: 2 })
    );
  } else {
    checks.push(skippedCheck("quality.phone.format", "missing_property", 2));
  }
  if (ctx.contactProps.has("firstname") || ctx.contactProps.has("lastname")) {
    let badCasing = 0;
    let named = 0;
    for (const rec of ctx.contacts) {
      const full = `${prop(rec, "firstname")} ${prop(rec, "lastname")}`.trim();
      if (!full) continue;
      named++;
      if (hasBadCasing(full)) {
        badCasing++;
        ev.add("quality.name.casing", "contact", rec, { name: full });
      }
    }
    checks.push(
      buildCheck({ id: "quality.name.casing", affected: badCasing, total: named, weight: 1 })
    );
  } else {
    checks.push(skippedCheck("quality.name.casing", "missing_property", 1));
  }
  if (ctx.companyProps.has("domain") || ctx.companyProps.has("website")) {
    let badDomain = 0;
    let withDomain = 0;
    for (const rec of ctx.companies) {
      const raw = firstFilled(rec, "domain", "website");
      if (!raw) continue;
      withDomain++;
      const normalized = normDomain(raw);
      if (!normalized || !DOMAIN_SHAPE.test(normalized)) {
        badDomain++;
        ev.add("quality.company.domain", "company", rec, { value: raw });
      }
    }
    checks.push(
      buildCheck({ id: "quality.company.domain", affected: badDomain, total: withDomain, weight: 2 })
    );
  } else {
    checks.push(skippedCheck("quality.company.domain", "missing_property", 2));
  }
  if (ctx.companyProps.has("name")) {
    let placeholder = 0;
    let named = 0;
    for (const rec of ctx.companies) {
      if (!filled(rec, "name")) continue;
      named++;
      const name = prop(rec, "name");
      if (/^https?:\/\//i.test(name) || /^[a-z0-9-]+\.[a-z]{2,}$/i.test(name)) {
        placeholder++;
        ev.add("quality.company.placeholderName", "company", rec, { name });
      }
    }
    checks.push(
      buildCheck({
        id: "quality.company.placeholderName",
        affected: placeholder,
        total: named,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("quality.company.placeholderName", "missing_property", 1));
  }
  checks.push(countryConsistency(ctx, ev));
  return { checks, findings: [] };
}

// engine/audit/checks/schema-debt.ts
function propertySignature(name) {
  const cleaned = name.toLowerCase().replace(/^(hs_|n\d+_|custom_|c_)/, "").replace(/\d+/g, " ").replace(/[^a-z]+/g, " ").trim();
  const tokens = cleaned.split(/\s+/).filter((t) => t.length > 2);
  return tokens.sort().join("_");
}
function runSchemaDebt(ctx, ev) {
  if (!ctx.capabilities.has("schemas")) {
    return {
      checks: [
        skippedCheck("schemaDebt.ghostProperties", "missing_scope", 3),
        skippedCheck("schemaDebt.redundantProperties", "missing_scope", 2)
      ],
      findings: [],
      skipped: "missing_scope",
      requiredScope: CAPABILITY_SCOPES.schemas
    };
  }
  const checks = [];
  const sample = ctx.schemaSample;
  if (ctx.customContactProps.length === 0 || sample.length === 0) {
    checks.push(skippedCheck("schemaDebt.ghostProperties", "no_data", 3));
  } else {
    let ghosts = 0;
    for (const name of ctx.customContactProps) {
      let hits = 0;
      for (const rec of sample) if (filled(rec, name)) hits++;
      const fillRatio = hits / sample.length;
      if (fillRatio >= GHOST_PROPERTY_FILL_RATIO) continue;
      ghosts++;
      ev.addRaw({
        checkId: "schemaDebt.ghostProperties",
        objectType: "contact",
        objectId: name,
        objectName: name,
        detail: {
          fillRatio: Number(fillRatio.toFixed(4)),
          filledInSample: hits,
          sampleSize: sample.length
        }
      });
    }
    checks.push(
      buildCheck({
        id: "schemaDebt.ghostProperties",
        affected: ghosts,
        total: ctx.customContactProps.length,
        weight: 3,
        sampled: true,
        sampleSize: sample.length,
        meta: { thresholdPct: GHOST_PROPERTY_FILL_RATIO * 100 }
      })
    );
  }
  const allCustom = [
    ...ctx.customContactProps.map((name) => ({ name, object: "contact" })),
    ...ctx.customCompanyProps.map((name) => ({ name, object: "company" }))
  ];
  if (allCustom.length === 0) {
    checks.push(skippedCheck("schemaDebt.redundantProperties", "no_data", 2));
  } else {
    const groups = /* @__PURE__ */ new Map();
    for (const entry of allCustom) {
      const sig = propertySignature(entry.name);
      if (!sig) continue;
      const key = `${entry.object}:${sig}`;
      const list = groups.get(key) ?? [];
      list.push(entry);
      groups.set(key, list);
    }
    let redundant = 0;
    for (const key of [...groups.keys()].sort()) {
      const list = groups.get(key);
      if (list.length < 2) continue;
      redundant += list.length;
      ev.addRaw({
        checkId: "schemaDebt.redundantProperties",
        objectType: list[0].object,
        objectId: key,
        objectName: list.map((p) => p.name).join(" / "),
        detail: { properties: list.map((p) => p.name) }
      });
    }
    checks.push(
      buildCheck({
        id: "schemaDebt.redundantProperties",
        affected: redundant,
        total: allCustom.length,
        weight: 2
      })
    );
  }
  return { checks, findings: [] };
}

// engine/audit/checks/staleness.ts
function obsolescenceProbability(months) {
  if (months <= 0) return 0;
  const p = 1 - Math.pow(1 - MONTHLY_JOB_TURNOVER, months);
  return Math.min(MAX_STALE_PROBABILITY, p);
}
function runStaleness(ctx, ev) {
  const hasEmployment = ctx.contactProps.has("jobtitle") || ctx.contactProps.has("company") || ctx.contactProps.has("associatedcompanyid");
  const hasDates = ctx.contactProps.has("lastmodifieddate") || ctx.contactProps.has("createdate");
  if (!hasEmployment || !hasDates) {
    return {
      checks: [
        skippedCheck("staleness.contact.likelyObsolete", "missing_property", 3),
        skippedCheck("staleness.contact.atRisk", "missing_property", 2)
      ],
      findings: [],
      totals: { likelyObsolete: 0 }
    };
  }
  let tracked = 0;
  let atRisk = 0;
  let expectedObsolete = 0;
  for (const rec of ctx.contacts) {
    const hasJobData = filled(rec, "jobtitle") || filled(rec, "company") || filled(rec, "associatedcompanyid");
    if (!hasJobData) continue;
    const reference = dateProp(rec, "lastmodifieddate") ?? dateProp(rec, "createdate");
    if (reference === null) continue;
    tracked++;
    const months = monthsSince(reference, ctx.now);
    expectedObsolete += obsolescenceProbability(months);
    if (months >= STALE_MONTHS) {
      atRisk++;
      ev.add("staleness.contact.atRisk", "contact", rec, {
        lastTouched: new Date(reference).toISOString(),
        monthsSince: Math.round(months)
      });
    }
  }
  const likelyObsolete = Math.round(expectedObsolete);
  const checks = [
    buildCheck({
      id: "staleness.contact.likelyObsolete",
      affected: likelyObsolete,
      total: tracked,
      weight: 3,
      meta: {
        // Printed verbatim in the report so the number is never a black box.
        estimate: true,
        assumptionAnnualTurnoverPct: Math.round(ANNUAL_JOB_TURNOVER * 100),
        maxProbabilityPerContact: MAX_STALE_PROBABILITY
      }
    }),
    buildCheck({
      id: "staleness.contact.atRisk",
      affected: atRisk,
      total: tracked,
      weight: 2,
      meta: { months: STALE_MONTHS }
    })
  ];
  return { checks, findings: [], totals: { likelyObsolete } };
}

// engine/audit/checks/structure.ts
function runStructure(ctx, ev) {
  const checks = [];
  if (ctx.contactProps.has("associatedcompanyid")) {
    let orphans = 0;
    for (const rec of ctx.contacts) {
      if (filled(rec, "associatedcompanyid")) continue;
      orphans++;
      ev.add("structure.contact.noCompany", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.contact.noCompany",
        affected: orphans,
        total: ctx.contacts.length,
        weight: 3
      })
    );
  } else {
    checks.push(skippedCheck("structure.contact.noCompany", "missing_property", 3));
  }
  if (ctx.companyProps.has("num_associated_contacts")) {
    let empty = 0;
    for (const rec of ctx.companies) {
      if (Number(prop(rec, "num_associated_contacts")) > 0) continue;
      empty++;
      ev.add("structure.company.noContact", "company", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.company.noContact",
        affected: empty,
        total: ctx.companies.length,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("structure.company.noContact", "missing_property", 2));
  }
  const contactsHaveOwner = ctx.contactProps.has("hubspot_owner_id");
  const companiesHaveOwner = ctx.companyProps.has("hubspot_owner_id");
  if (contactsHaveOwner) {
    let unowned = 0;
    for (const rec of ctx.contacts) {
      if (filled(rec, "hubspot_owner_id")) continue;
      unowned++;
      ev.add("structure.contact.noOwner", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.contact.noOwner",
        affected: unowned,
        total: ctx.contacts.length,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("structure.contact.noOwner", "missing_property", 2));
  }
  if (companiesHaveOwner) {
    let unowned = 0;
    for (const rec of ctx.companies) {
      if (filled(rec, "hubspot_owner_id")) continue;
      unowned++;
      ev.add("structure.company.noOwner", "company", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.company.noOwner",
        affected: unowned,
        total: ctx.companies.length,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("structure.company.noOwner", "missing_property", 1));
  }
  const active = ctx.activeOwnerIds;
  if (!active) {
    checks.push(skippedCheck("structure.owner.inactive", "missing_scope", 3));
  } else if (!contactsHaveOwner && !companiesHaveOwner) {
    checks.push(skippedCheck("structure.owner.inactive", "missing_property", 3));
  } else {
    let orphaned = 0;
    let owned = 0;
    const scan = (records, object) => {
      for (const rec of records) {
        const ownerId = prop(rec, "hubspot_owner_id");
        if (!ownerId) continue;
        owned++;
        if (active.has(ownerId)) continue;
        orphaned++;
        ev.add("structure.owner.inactive", object, rec, { ownerId });
      }
    };
    if (contactsHaveOwner) scan(ctx.contacts, "contact");
    if (companiesHaveOwner) scan(ctx.companies, "company");
    checks.push(
      buildCheck({
        id: "structure.owner.inactive",
        affected: orphaned,
        total: owned,
        weight: 3,
        meta: { activeOwners: active.size }
      })
    );
  }
  const skippedForScope = checks.every((c) => c.skipped === "missing_scope");
  return {
    checks,
    findings: [],
    ...skippedForScope ? { skipped: "missing_scope", requiredScope: CAPABILITY_SCOPES.owners } : {}
  };
}

// engine/audit/opportunity.ts
function isWon(rec, ctx) {
  if (ctx.dealProps.has("hs_is_closed_won")) return bool(rec, "hs_is_closed_won");
  const stage = prop(rec, "dealstage").toLowerCase();
  return stage.includes("won");
}
function typicalWonDeal(ctx) {
  if (!ctx.capabilities.has("deals") || !ctx.dealProps.has("amount")) return null;
  const amounts = [];
  for (const deal of ctx.deals) {
    if (!isWon(deal, ctx)) continue;
    const amount = num(deal, "amount");
    if (amount <= 0) continue;
    amounts.push(amount);
  }
  if (amounts.length < MIN_WON_DEALS_FOR_AVERAGE) return null;
  amounts.sort((a, b) => a - b);
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 === 0 ? (amounts[mid - 1] + amounts[mid]) / 2 : amounts[mid];
  return { value: median, count: amounts.length };
}
function estimateOpportunity(ctx, opts = {}) {
  const hasDates = ctx.contactProps.has("lastmodifieddate") || ctx.contactProps.has("createdate");
  if (!hasDates || ctx.contacts.length === 0) return null;
  const canDetectCustomers = ctx.contactProps.has("lifecyclestage");
  let customers = 0;
  let atRiskCustomers = 0;
  let customerDeparted = 0;
  let baseTracked = 0;
  let baseDeparted = 0;
  for (const rec of ctx.contacts) {
    const reference = dateProp(rec, "lastmodifieddate") ?? dateProp(rec, "createdate");
    if (reference === null) continue;
    const months = monthsSince(reference, ctx.now);
    const probability = obsolescenceProbability(months);
    baseTracked++;
    baseDeparted += probability;
    if (canDetectCustomers && prop(rec, "lifecyclestage").toLowerCase() === "customer") {
      customers++;
      customerDeparted += probability;
      if (months >= STALE_MONTHS) atRiskCustomers++;
    }
  }
  if (baseTracked === 0) return null;
  const departureRate = customers > 0 ? customerDeparted / customers : baseDeparted / baseTracked;
  const measured = typicalWonDeal(ctx);
  const averageDealEuros = opts.averageDealEuros ?? measured?.value ?? DEFAULT_AVERAGE_DEAL_EUROS;
  const winRate = opts.winRate ?? CHAMPION_WIN_RATE;
  const departedCustomers = Math.round(customers * departureRate);
  return {
    customers,
    customersSource: customers > 0 ? "crm" : "manual",
    atRiskCustomers,
    departedCustomers,
    departureRate: Number(departureRate.toFixed(4)),
    averageDealEuros: Number(averageDealEuros.toFixed(2)),
    averageDealSource: opts.averageDealEuros == null && measured ? "crm" : "default",
    wonDealsSampled: opts.averageDealEuros == null ? measured?.count ?? 0 : 0,
    assumedWinRate: winRate,
    opportunityEuros: Number((departedCustomers * winRate * averageDealEuros).toFixed(2))
  };
}

// engine/audit/remediation.ts
var CONTACT_PROFILE_PROPS = ["hs_linkedin_url", "jobtitle"];
var CONTACT_EMAIL_PROPS = ["email"];
var CONTACT_PHONE_PROPS = ["phone", "mobilephone"];
var COMPANY_PROPS = [
  "domain",
  "website",
  "industry",
  "numberofemployees",
  "city",
  "country",
  "linkedin_company_page",
  "hs_linkedin_handle"
];
function recordsMissingAny(records, props, available) {
  const usable = props.filter((p) => available.has(p));
  if (usable.length === 0) return null;
  return records.filter((rec) => usable.some((p) => !filled(rec, p))).length;
}
function recordsMissingAll(records, props, available) {
  const usable = props.filter((p) => available.has(p));
  if (usable.length === 0) return null;
  return records.filter((rec) => usable.every((p) => !filled(rec, p))).length;
}
var SCAN_IDENTITY_PROPS = ["hs_linkedin_url", "company", "associatedcompanyid"];
function monthlyIntake(records, available, now, capped) {
  if (capped || !available.has("createdate")) return null;
  const perMonth = /* @__PURE__ */ new Map();
  let oldest = 0;
  for (const rec of records) {
    const created = dateProp(rec, "createdate");
    if (created === null) continue;
    const age = Math.floor(monthsSince(created, now));
    if (age > oldest) oldest = age;
    if (age < 1 || age > INTAKE_WINDOW_MONTHS) continue;
    perMonth.set(age, (perMonth.get(age) ?? 0) + 1);
  }
  const observed = Math.min(oldest, INTAKE_WINDOW_MONTHS);
  if (observed < MIN_INTAKE_MONTHS) return null;
  const counts = [];
  for (let m = 1; m <= observed; m++) counts.push(perMonth.get(m) ?? 0);
  counts.sort((a, b) => a - b);
  const mid = Math.floor(counts.length / 2);
  const median = counts.length % 2 === 0 ? (counts[mid - 1] + counts[mid]) / 2 : counts[mid];
  return Math.round(median);
}
function countChampions(ctx) {
  if (!ctx.contactProps.has("lifecyclestage")) return null;
  return ctx.contacts.filter(
    (rec) => CHAMPION_LIFECYCLE_STAGES.has(prop(rec, "lifecyclestage").toLowerCase())
  ).length;
}
function countScannable(ctx) {
  const usable = SCAN_IDENTITY_PROPS.filter((p) => ctx.contactProps.has(p));
  if (usable.length === 0) return null;
  return ctx.contacts.filter((rec) => {
    const named = filled(rec, "lastname");
    return named && usable.some((p) => filled(rec, p));
  }).length;
}
function buildRemediation(ctx, duplicates) {
  const contactsMissingEmail = recordsMissingAll(
    ctx.contacts,
    CONTACT_EMAIL_PROPS,
    ctx.contactProps
  );
  const contactsMissingPhone = recordsMissingAll(
    ctx.contacts,
    CONTACT_PHONE_PROPS,
    ctx.contactProps
  );
  const contactsNeedingProfile = recordsMissingAny(
    ctx.contacts,
    CONTACT_PROFILE_PROPS,
    ctx.contactProps
  );
  const companiesNeedingEnrichment = recordsMissingAny(
    ctx.companies,
    COMPANY_PROPS,
    ctx.companyProps
  );
  const contactsWithEmail = ctx.contactProps.has("email") ? ctx.contacts.filter((rec) => filled(rec, "email")).length : null;
  return {
    duplicateContacts: duplicates.affectedContactIds.size,
    duplicateCompanies: duplicates.affectedCompanies,
    contactsMissingEmail,
    contactsMissingPhone,
    contactsNeedingProfile,
    companiesNeedingEnrichment,
    contactsWithEmail,
    // The whole base, kept as the outer bound of what could be watched. It is
    // no longer what the quote bills: nobody scans four hundred thousand
    // contacts every month, so the quote watches the champions monthly and
    // sweeps the rest by rotation, using the two counts below.
    contactsTrackable: ctx.contacts.length,
    contactsScanned: ctx.contacts.length,
    companiesScanned: ctx.companies.length,
    championContacts: countChampions(ctx),
    contactsScannable: countScannable(ctx),
    monthlyNewContacts: monthlyIntake(
      ctx.contacts,
      ctx.contactProps,
      ctx.now,
      ctx.scan.contactsCapped
    ),
    monthlyNewCompanies: monthlyIntake(
      ctx.companies,
      ctx.companyProps,
      ctx.now,
      ctx.scan.companiesCapped
    )
  };
}

// engine/audit/score.ts
function scoreChecks(checks) {
  let weighted = 0;
  let totalWeight = 0;
  for (const check of checks) {
    if (check.score === null) continue;
    weighted += check.score * check.weight;
    totalWeight += check.weight;
  }
  if (totalWeight === 0) return null;
  return Math.round(weighted / totalWeight);
}
function severityForScore2(score) {
  if (score === null) return "ok";
  if (score <= 100 - SEVERITY_CRITICAL_RATIO * 100) return "critical";
  if (score <= 100 - SEVERITY_WARNING_RATIO * 100) return "warning";
  return "ok";
}
function buildPillar(id, checks, opts) {
  const score = scoreChecks(checks);
  const inferredSkip = score === null ? checks.find((c) => c.skipped === "missing_scope")?.skipped ?? checks.find((c) => c.skipped)?.skipped ?? "no_data" : void 0;
  return {
    id,
    score,
    weight: PILLAR_WEIGHTS[id],
    severity: severityForScore2(score),
    checks,
    ...opts?.skipped ?? inferredSkip ? { skipped: opts?.skipped ?? inferredSkip } : {},
    ...opts?.requiredScope ? { requiredScope: opts.requiredScope } : {}
  };
}
function scorePillars(pillars) {
  let weighted = 0;
  let totalWeight = 0;
  for (const pillar of pillars) {
    if (pillar.score === null) continue;
    weighted += pillar.score * pillar.weight;
    totalWeight += pillar.weight;
  }
  if (totalWeight === 0) return 0;
  return Math.round(weighted / totalWeight);
}

// engine/audit/waste.ts
function estimateWaste(input) {
  const { totalContacts } = input;
  if (totalContacts <= 0) return null;
  const price = input.eurosPerContactPerMonth ?? DEFAULT_EUROS_PER_CONTACT_PER_MONTH;
  const exact = new Set(input.duplicateContactIds);
  for (const id of input.hardBouncedIds) exact.add(id);
  const uncountedShare = Math.max(0, 1 - exact.size / totalContacts);
  const staleNotAlreadyCounted = Math.round(
    Math.min(input.likelyStaleContacts, totalContacts) * uncountedShare
  );
  const unusableContacts = Math.min(totalContacts, exact.size + staleNotAlreadyCounted);
  const eurosPerYear = Number((unusableContacts * price * 12).toFixed(2));
  return {
    unusableContacts,
    duplicateContacts: input.duplicateContactIds.size,
    hardBouncedContacts: input.hardBouncedIds.size,
    likelyStaleContacts: staleNotAlreadyCounted,
    eurosPerContactPerMonth: price,
    eurosPerYear
  };
}

// engine/audit/run.ts
function analyse(ctx, opts = {}) {
  const ev = new EvidenceCollector();
  const duplicates = runDuplicates(ctx, ev);
  const completeness = runCompleteness(ctx, ev);
  const quality = runQuality(ctx, ev);
  const structure = runStructure(ctx, ev);
  const freshness = runFreshness(ctx, ev);
  const staleness = runStaleness(ctx, ev);
  const deliverability = runDeliverability(ctx, ev);
  const pipeline = runPipeline(ctx, ev);
  const schemaDebt = runSchemaDebt(ctx, ev);
  const pillars = [
    buildPillar("duplicates", duplicates.checks),
    buildPillar("completeness", completeness.checks),
    buildPillar("quality", quality.checks),
    buildPillar("structure", structure.checks, {
      skipped: structure.skipped,
      requiredScope: structure.requiredScope
    }),
    buildPillar("freshness", freshness.checks),
    buildPillar("staleness", staleness.checks),
    buildPillar("deliverability", deliverability.checks),
    buildPillar("pipeline", pipeline.checks, {
      skipped: pipeline.skipped,
      requiredScope: pipeline.requiredScope
    }),
    buildPillar("schemaDebt", schemaDebt.checks, {
      skipped: schemaDebt.skipped,
      requiredScope: schemaDebt.requiredScope
    })
  ];
  const waste = estimateWaste({
    totalContacts: ctx.contacts.length,
    duplicateContactIds: duplicates.totals.affectedContactIds,
    hardBouncedIds: deliverability.totals.hardBouncedIds,
    likelyStaleContacts: staleness.totals.likelyObsolete,
    eurosPerContactPerMonth: opts.eurosPerContactPerMonth
  });
  const report = {
    version: AUDIT_REPORT_VERSION,
    generatedAt: new Date(ctx.now).toISOString(),
    portalId: ctx.portalId,
    scanned: ctx.scan,
    pillars,
    score: scorePillars(pillars),
    // Descriptive, unscored: the shape of the base next to its defects.
    distributions: buildDistributions(ctx),
    // Counted per record and per billable action, so the signup can quote the
    // work without inflating it — see remediation.ts.
    remediation: buildRemediation(ctx, duplicates.totals),
    waste,
    // Stored with the defaults; the report UI lets the reader substitute their
    // own deal value and close rate and recomputes without rescanning.
    opportunity: estimateOpportunity(ctx),
    capabilities: [...ctx.capabilities].sort()
  };
  return {
    report,
    findings: [...ev.findings, ...duplicates.findings, ...completeness.findings]
  };
}

// src/cli.ts
var FINDINGS_PER_CHECK = 25;
var USAGE = `CRM Health Check \u2014 read-only audit of a HubSpot portal.

Usage:
  HUBSPOT_TOKEN=pat-xx-... node crm-audit.mjs [options]
  node crm-audit.mjs --token pat-xx-... [options]

Options:
  --token <token>   HubSpot private app access token (or set HUBSPOT_TOKEN).
                    Prefer the environment variable: it keeps the token out of
                    your shell history.
  --out <path>      Where to write the JSON report (default: crm-audit-report.json)
  --lang <en|fr>    Language of the HTML report (default: en)
  --price <euros>   Monthly price per marketing contact used in the waste
                    estimate (default: 0.02)
  --render <json>   Re-render the HTML report from an existing JSON report,
                    without rescanning (no token needed).
  --no-open         Do not open the HTML report in the browser when done.
  --help            Show this help.

Outputs both a JSON report (the data) and an HTML dashboard next to it
(same path, .html extension) \u2014 open it in any browser, it works offline.

The token needs read-only scopes. Required:
  crm.objects.contacts.read, crm.objects.companies.read
Recommended (each one unlocks extra pillars; absent ones are reported as
"not analysed", never as a perfect score):
  crm.objects.deals.read, crm.objects.owners.read,
  crm.schemas.contacts.read, crm.schemas.companies.read, crm.schemas.deals.read

This tool never writes to your CRM and never contacts any server other than
api.hubapi.com. You can delete the private app in HubSpot right after the
audit; the report file is yours.`;
function parseArgs(argv) {
  const args = {
    token: process.env.HUBSPOT_TOKEN ?? null,
    out: "crm-audit-report.json",
    price: void 0,
    lang: "en",
    render: null,
    open: true
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") return "help";
    else if (a === "--token") args.token = argv[++i] ?? null;
    else if (a === "--out") args.out = argv[++i] ?? args.out;
    else if (a === "--render") args.render = argv[++i] ?? null;
    else if (a === "--no-open") args.open = false;
    else if (a === "--lang") {
      const l = argv[++i];
      if (l !== "en" && l !== "fr") fail(`--lang must be "en" or "fr", got: ${l}`);
      args.lang = l;
    } else if (a === "--price") {
      const p = Number(argv[++i]);
      if (!Number.isFinite(p) || p <= 0) fail("--price must be a positive number (euros per contact per month).");
      args.price = p;
    } else fail(`Unknown option: ${a}

Run with --help for usage.`);
  }
  return args;
}
function fail(message) {
  console.error(`
\u274C ${message}`);
  process.exit(1);
}
async function preflight(token) {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts?limit=1&archived=false`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    fail(
      'HubSpot rejected the token (401). Check that you copied the full private app token (it starts with "pat-") and that the app was not deleted.'
    );
  }
  if (res.status === 403) {
    fail(
      "The token is valid but lacks the mandatory scope crm.objects.contacts.read (403). Edit the private app in HubSpot (Settings \u2192 Integrations \u2192 Private Apps \u2192 your app \u2192 Scopes), add it, and run again."
    );
  }
  if (!res.ok) {
    fail(`Unexpected HubSpot response during preflight: HTTP ${res.status}. Try again in a minute.`);
  }
}
var STEP_LABELS = {
  connection: "Checking token and granted scopes",
  properties: "Reading property catalogs",
  contacts: "Scanning contacts",
  companies: "Scanning companies",
  deals: "Scanning deals",
  owners: "Reading owners",
  schema: "Sampling custom properties",
  analysis: "Computing the report"
};
function htmlPathFor(jsonPath) {
  return jsonPath.replace(/\.json$/i, "").concat(".html");
}
function openInBrowser(path) {
  const [cmd, args] = process.platform === "darwin" ? ["open", [path]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", path]] : ["xdg-open", [path]];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).on("error", () => {
    }).unref();
  } catch {
  }
}
async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed === "help") {
    console.log(USAGE);
    return;
  }
  if (parsed.render) {
    const jsonPath = resolve(parsed.render);
    const data = JSON.parse(readFileSync(jsonPath, "utf8"));
    const htmlPath2 = htmlPathFor(jsonPath);
    writeFileSync(htmlPath2, renderReportHtml(data.report, data.evidence ?? [], parsed.lang));
    if (parsed.open) openInBrowser(htmlPath2);
    console.log(`\u{1F4CA} Report: ${pathToFileURL(htmlPath2).href}`);
    return;
  }
  if (!parsed.token) {
    fail(
      "No token provided. Set the HUBSPOT_TOKEN environment variable or pass --token.\n\nRun with --help for how to create a read-only private app token."
    );
  }
  console.error("\u{1F50D} CRM Health Check \u2014 read-only audit, nothing is written to your CRM.\n");
  await preflight(parsed.token);
  let lastLine = "";
  const onProgress = (pct, step) => {
    const line = `[${String(pct).padStart(3)}%] ${STEP_LABELS[step] ?? step}`;
    if (line === lastLine) return;
    lastLine = line;
    console.error(line);
  };
  const now = Date.now();
  const { context } = await collectAuditContext(parsed.token, now, onProgress);
  const { report, findings } = analyse(context, {
    eurosPerContactPerMonth: parsed.price
  });
  const byCheck = /* @__PURE__ */ new Map();
  for (const f of findings) {
    const bucket = byCheck.get(f.checkId) ?? [];
    if (bucket.length < FINDINGS_PER_CHECK) bucket.push(f);
    byCheck.set(f.checkId, bucket);
  }
  const evidence = [...byCheck.values()].flat().map((f) => ({
    ...f,
    hubspotUrl: hubspotUrl(report.portalId, f.objectType, f.objectId)
  }));
  const outPath = resolve(parsed.out);
  writeFileSync(
    outPath,
    JSON.stringify({ report, evidence, evidencePerCheckCap: FINDINGS_PER_CHECK }, null, 2)
  );
  const htmlPath = htmlPathFor(outPath);
  writeFileSync(htmlPath, renderReportHtml(report, evidence, parsed.lang));
  const capped = report.scanned.contactsCapped || report.scanned.companiesCapped || report.scanned.dealsCapped;
  const analysed = report.pillars.filter((p) => p.score !== null);
  const skipped = report.pillars.filter((p) => p.score === null);
  console.error(`[100%] Done.
`);
  console.log(`\u2705 Audit complete \u2014 health score: ${report.score}/100`);
  console.log(
    `   Scanned: ${report.scanned.contacts.toLocaleString("en-US")} contacts, ${report.scanned.companies.toLocaleString("en-US")} companies, ${report.scanned.deals.toLocaleString("en-US")} deals` + (capped ? " (scan cap reached \u2014 the portal holds more)" : "")
  );
  for (const p of analysed) {
    console.log(`   \u2022 ${p.id}: ${p.score}/100 (${p.severity})`);
  }
  for (const p of skipped) {
    const why = p.skipped === "missing_scope" ? `grant ${p.requiredScope ?? "the missing scope"} to unlock` : "no usable data on this portal";
    console.log(`   \u2022 ${p.id}: not analysed \u2014 ${why}`);
  }
  if (report.waste) {
    console.log(
      `   Estimated waste: \u20AC${Math.round(report.waste.eurosPerYear).toLocaleString("en-US")}/year (${report.waste.unusableContacts.toLocaleString("en-US")} unusable contacts at \u20AC${report.waste.eurosPerContactPerMonth}/contact/month)`
    );
  }
  if (report.opportunity && report.opportunity.opportunityEuros > 0) {
    console.log(
      `   Untapped opportunity: ~\u20AC${Math.round(report.opportunity.opportunityEuros).toLocaleString("en-US")} (customers who likely changed company)`
    );
  }
  if (parsed.open) openInBrowser(htmlPath);
  console.log(`
\u{1F4C4} Data:      ${outPath}`);
  console.log(`\u{1F4CA} Dashboard: ${pathToFileURL(htmlPath).href}`);
  console.log(
    parsed.open ? `   The dashboard was opened in the default browser. If it did not appear, open the URL above.` : `   Open the URL above in a browser to view the dashboard.`
  );
}
main().catch((e) => {
  const msg = e.message ?? String(e);
  if (msg.includes("\u2192 401")) {
    fail("HubSpot rejected the token mid-scan (401). The token may have been revoked; create a new one and run again.");
  }
  if (msg.includes("\u2192 403")) {
    fail(`A scope is missing for part of the scan (403): ${msg}. Add the read scopes listed in --help and run again.`);
  }
  fail(msg);
});
