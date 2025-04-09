// Définition du type générique pour la structure des programmes
export type ProgramStructure = {
  [semester: string]: {
    [ue: string]: {
      credits: number;
      courses: {
        [course: string]: {
          coefficient: number;
          weights: {
            written: number;
            continuous: number;
            project: number;
          };
        };
      };
    };
  };
};

// Structure des données du programme ADI1
export const ADI1_STRUCTURE: ProgramStructure = {
  "Semestre 1": {
    "Mathématiques 1": {
      credits: 5,
      courses: {
        "Mathématiques 1": { coefficient: 4, weights: { written: 33, continuous: 33, project: 34 } },
        "Mathématiques 2": { coefficient: 7, weights: { written: 45, continuous: 15, project: 40 } },
        "Mathématiques 3": { coefficient: 9, weights: { written: 45, continuous: 15, project: 40 } },
      },
    },
    "Informatique 1": {
      credits: 5,
      courses: {
        "C Microcontrôleur et algorithmie 1": { coefficient: 2, weights: { written: 67, continuous: 33, project: 0 } },
        Bureautique: { coefficient: 1, weights: { written: 0, continuous: 0, project: 100 } },
        "Web 1": { coefficient: 1, weights: { written: 67, continuous: 33, project: 0 } },
      },
    },
    "Sciences 1": {
      credits: 6,
      courses: {
        "Mécanique 1": { coefficient: 1, weights: { written: 75, continuous: 0, project: 25 } },
        "Electronique Numérique 1": { coefficient: 1, weights: { written: 25, continuous: 50, project: 25 } },
        "Machines-Outils": { coefficient: 0, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
    "Projets 1": {
      credits: 8,
      courses: {
        "Projets Alpha": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projets Beta": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projet Gamma": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
        "Gestion de projet": { coefficient: 2, weights: { written: 67, continuous: 33, project: 0 } },
      },
    },
    "Humanités 1": {
      credits: 6,
      courses: {
        "Introduction à la pensée critique": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Projet Professionnel et Personnel": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Communication interculturelle": { coefficient: 1, weights: { written: 0, continuous: 100, project: 0 } },
        Français: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        Anglais: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
  },
  "Semestre 2": {
    "Mathématiques 2": {
      credits: 5,
      courses: {
        "Mathématiques 4": { coefficient: 4, weights: { written: 33, continuous: 33, project: 34 } },
        "Mathématiques 5": { coefficient: 7, weights: { written: 45, continuous: 15, project: 40 } },
        "Mathématiques 6": { coefficient: 9, weights: { written: 45, continuous: 15, project: 40 } },
      },
    },
    "Informatique 2": {
      credits: 4,
      courses: {
        "Algorithmie 2": { coefficient: 2, weights: { written: 67, continuous: 33, project: 0 } },
        "Web 2": { coefficient: 1, weights: { written: 67, continuous: 33, project: 0 } },
      },
    },
    "Sciences 2": {
      credits: 7,
      courses: {
        "Electronique Numérique 2": { coefficient: 3, weights: { written: 45, continuous: 30, project: 25 } },
        Thermodynamique: { coefficient: 2, weights: { written: 100, continuous: 0, project: 0 } },
        "Mécanique 2": { coefficient: 3, weights: { written: 75, continuous: 0, project: 25 } },
        Matériaux: { coefficient: 1, weights: { written: 67, continuous: 0, project: 33 } },
      },
    },
    "Projets 2": {
      credits: 8,
      courses: {
        "Projets Alpha": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projets Beta": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projet Gamma": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
      },
    },
    "Humanités 2": {
      credits: 6,
      courses: {
        "Compétences Relationnelles": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Séminaire créativité": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
        "Communication interculturelle": { coefficient: 1, weights: { written: 0, continuous: 100, project: 0 } },
        Français: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        Anglais: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
  },
};

// Structure des données du programme ADI2
export const ADI2_STRUCTURE: ProgramStructure = {
  "Semestre 3": {
    "Mathématiques 3": {
      credits: 6,
      courses: {
        "Mathématiques 7": { coefficient: 5, weights: { written: 33, continuous: 33, project: 34 } },
        "Mathématiques 8": { coefficient: 8, weights: { written: 45, continuous: 15, project: 40 } },
        "Mathématiques 9": { coefficient: 7, weights: { written: 45, continuous: 15, project: 40 } },
      },
    },
    "Informatique 3": {
      credits: 5,
      courses: {
        Python: { coefficient: 1, weights: { written: 60, continuous: 40, project: 0 } },
        "Histoire des Technologies Informatiques": {
          coefficient: 1,
          weights: { written: 50, continuous: 50, project: 0 },
        },
        "Programmation et IA 1": { coefficient: 1, weights: { written: 50, continuous: 50, project: 0 } },
      },
    },
    "Sciences 3": {
      credits: 7,
      courses: {
        "Electronique Analogique": { coefficient: 1, weights: { written: 100, continuous: 0, project: 0 } },
        "Electronique Appliquée": { coefficient: 1, weights: { written: 50, continuous: 0, project: 50 } },
        Automatique: { coefficient: 1, weights: { written: 75, continuous: 25, project: 0 } },
        "Calcul numérique": { coefficient: 1, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
    "Projets 3": {
      credits: 6,
      courses: {
        "Projets Alpha": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projets Beta": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projet Gamma": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
      },
    },
    "Humanités 3": {
      credits: 6,
      courses: {
        "Compétences Relationnelles": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Projet Professionnel et Personnel": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Communication interculturelle": { coefficient: 1, weights: { written: 0, continuous: 100, project: 0 } },
        Français: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        Anglais: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
  },
  "Semestre 4": {
    "Mathématiques 4": {
      credits: 6,
      courses: {
        "Mathématiques 10": { coefficient: 8, weights: { written: 45, continuous: 15, project: 40 } },
        "Mathématiques 11": { coefficient: 7, weights: { written: 45, continuous: 15, project: 40 } },
        "Mathématiques 12": { coefficient: 5, weights: { written: 33, continuous: 33, project: 34 } },
      },
    },
    "Sciences 4": {
      credits: 5,
      courses: {
        Electromagnétisme: { coefficient: 1, weights: { written: 100, continuous: 0, project: 0 } },
        "Mécanique des Ondes": { coefficient: 1, weights: { written: 100, continuous: 0, project: 0 } },
        "Modélisation Assistée par Ordinateur": {
          coefficient: 1,
          weights: { written: 0, continuous: 100, project: 0 },
        },
      },
    },
    "Informatique 4": {
      credits: 5,
      courses: {
        IoT: { coefficient: 2, weights: { written: 67, continuous: 33, project: 0 } },
        "Programmation et IA 2": { coefficient: 1, weights: { written: 50, continuous: 50, project: 0 } },
      },
    },
    "Projets 4": {
      credits: 6,
      courses: {
        "Projets Alpha": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projets Beta": { coefficient: 3, weights: { written: 0, continuous: 0, project: 100 } },
        "Projet Gamma": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
      },
    },
    "Humanités 4": {
      credits: 6,
      courses: {
        "Introduction à la pensée critique": { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        "Séminaire Eloquence et Rhétorique": { coefficient: 2, weights: { written: 0, continuous: 0, project: 100 } },
        "Communication interculturelle": { coefficient: 1, weights: { written: 0, continuous: 100, project: 0 } },
        Français: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
        Anglais: { coefficient: 2, weights: { written: 0, continuous: 100, project: 0 } },
      },
    },
  },
  Stage: {
    Stage: {
      credits: 2,
      courses: {
        "Entre juin et septembre": { coefficient: 1, weights: { written: 0, continuous: 0, project: 100 } },
      },
    },
  },
};

// Vous pouvez également exporter ADI2_STRUCTURE séparément si nécessaire
