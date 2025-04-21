/**
 * Constants and types for event-related data
 */

export interface Building {
    id: string;
    name: string;
    coordinates: [number, number];
    address: string;
}

export const BUILDINGS: Building[] = [
    {
        id: 'gsu',
        name: 'George Sherman Union (GSU)',
        coordinates: [-71.10877, 42.35119],
        address: '775 Commonwealth Avenue'
    },
    {
        id: 'pho',
        name: 'Photonics Center (PHO)',
        coordinates: [-71.10600, 42.34922],
        address: '8 St Mary\'s St'
    },
    {
        id: 'qsb',
        name: 'Questrom School of Business (QSB)',
        coordinates: [-71.09957, 42.34969],
        address: '595 Commonwealth Avenue'
    },
    {
        id: 'kch',
        name: 'Kilachand Hall Study Lounge (KCH)',
        coordinates: [-71.09653, 42.35033],
        address: '91 Bay State Road'
    },
    {
        id: 'cas',
        name: 'College of Arts & Sciences (CAS)',
        coordinates: [-71.10480, 42.35023],
        address: '725 Commonwealth Avenue'
    },
    {
        id: 'yaw',
        name: 'Yawkey Center for Student Services (YAW)',
        coordinates: [-71.09787, 42.34979],
        address: '100 Bay State Road'
    },
    {
        id: 'ing',
        name: 'Ingalls Engineering Resource Center (ING)',
        coordinates: [-71.10288, 42.34862],
        address: '44 Cummington Mall'
    },
    {
        id: 'sv2',
        name: 'StuVi II Study Lounge (SV2)',
        coordinates: [-71.11781, 42.35339],
        address: '33 Harry Agganis Way'
    },
    {
        id: 'whl',
        name: 'Wheelock College (WHL)',
        coordinates: [-71.10088, 42.34973],
        address: '2 Silber Way'
    },
    {
        id: 'sel',
        name: 'Science & Engineering Library (SEL)',
        coordinates: [-71.10080, 42.34860],
        address: '38 Cummington Mall'
    },
    {
        id: 'htc',
        name: 'Howard Thurman Center (HTC)',
        coordinates: [-71.11140, 42.35000],
        address: '808 Commonwealth Avenue'
    },
    {
        id: 'hjo',
        name: 'HoJo (HJO)',
        coordinates: [-71.09853, 42.34955],
        address: '575 Commonwealth Avenue'
    },
    {
        id: 'cds',
        name: 'Duan Family Center for Computing & Data Science (CDS)',
        coordinates: [-71.10311, 42.34991],
        address: '665 Commonwealth Avenue'
    },
    {
        id: 'sto',
        name: 'Stone Science Library (STO)',
        coordinates: [-71.10362, 42.35013],
        address: '725 Commonwealth Avenue, Room 440'
    },
    {
        id: 'sth',
        name: 'School of Theology Library (STH)',
        coordinates: [-71.10706, 42.35051],
        address: '745 Commonwealth Avenue, 2nd Floor'
    },
    {
        id: 'cgs',
        name: 'College of General Studies (CGS)',
        coordinates: [-71.11464, 42.35150],
        address: '871 Commonwealth Avenue'
    },
    {
        id: 'bsm',
        name: 'Buick Street Market & Cafe (BSM)',
        coordinates: [-71.11559, 42.35211],
        address: '10 Buick Street'
    },
    {
        id: 'sar',
        name: 'Sargent College (SAR)',
        coordinates: [-71.10194, 42.34977],
        address: '635 Commonwealth Avenue'
    },
    {
        id: 'wcs',
        name: 'West Campus Study Spaces (WCS)',
        coordinates: [-71.1203468, 42.3531346],
        address: '275 Babcock Street'
    },
    {
        id: 'fcc',
        name: 'Fenway Campus Center (FCC)',
        coordinates: [-71.10517, 42.34299],
        address: '150 Riverway'
    }
];

export interface DietaryTag {
    id: string;
    name: string;
    category: DietaryCategory;
}

export type DietaryCategory = 
    | 'allergens'
    | 'preferences'
    | 'intolerances'
    | 'religious'
    | 'special'
    | 'general';

export const DIETARY_TAGS: DietaryTag[] = [
    // Allergens
    { id: 'nut_free', name: 'Nut-Free', category: 'allergens' },
    { id: 'contains_nuts', name: 'Contains Nuts', category: 'allergens' },
    { id: 'peanut_free', name: 'Peanut-Free', category: 'allergens' },
    { id: 'contains_peanuts', name: 'Contains Peanuts', category: 'allergens' },
    { id: 'tree_nut_free', name: 'Tree Nut-Free', category: 'allergens' },
    { id: 'contains_tree_nuts', name: 'Contains Tree Nuts', category: 'allergens' },
    { id: 'gluten_free', name: 'Gluten-Free', category: 'allergens' },
    { id: 'contains_gluten', name: 'Contains Gluten', category: 'allergens' },
    { id: 'dairy_free', name: 'Dairy-Free', category: 'allergens' },
    { id: 'contains_dairy', name: 'Contains Dairy', category: 'allergens' },
    { id: 'egg_free', name: 'Egg-Free', category: 'allergens' },
    { id: 'contains_eggs', name: 'Contains Eggs', category: 'allergens' },
    { id: 'soy_free', name: 'Soy-Free', category: 'allergens' },
    { id: 'contains_soy', name: 'Contains Soy', category: 'allergens' },
    { id: 'fish_free', name: 'Fish-Free', category: 'allergens' },
    { id: 'contains_fish', name: 'Contains Fish', category: 'allergens' },
    { id: 'shellfish_free', name: 'Shellfish-Free', category: 'allergens' },
    { id: 'contains_shellfish', name: 'Contains Shellfish', category: 'allergens' },
    { id: 'sesame_free', name: 'Sesame-Free', category: 'allergens' },
    { id: 'contains_sesame', name: 'Contains Sesame', category: 'allergens' },
    { id: 'wheat_free', name: 'Wheat-Free', category: 'allergens' },
    { id: 'contains_wheat', name: 'Contains Wheat', category: 'allergens' },
    { id: 'mustard_free', name: 'Mustard-Free', category: 'allergens' },
    { id: 'contains_mustard', name: 'Contains Mustard', category: 'allergens' },
    { id: 'sulfite_free', name: 'Sulfite-Free', category: 'allergens' },
    { id: 'contains_sulfites', name: 'Contains Sulfites', category: 'allergens' },
    { id: 'corn_free', name: 'Corn-Free', category: 'allergens' },
    { id: 'contains_corn', name: 'Contains Corn', category: 'allergens' },
    { id: 'coconut_free', name: 'Coconut-Free', category: 'allergens' },
    { id: 'contains_coconut', name: 'Contains Coconut', category: 'allergens' },

    // Dietary Preferences
    { id: 'vegetarian', name: 'Vegetarian', category: 'preferences' },
    { id: 'vegan', name: 'Vegan', category: 'preferences' },
    { id: 'pescatarian', name: 'Pescatarian', category: 'preferences' },
    { id: 'plant_based', name: 'Plant-Based', category: 'preferences' },
    { id: 'halal', name: 'Halal', category: 'preferences' },
    { id: 'non_halal', name: 'Non-Halal', category: 'preferences' },
    { id: 'kosher', name: 'Kosher', category: 'preferences' },
    { id: 'non_kosher', name: 'Non-Kosher', category: 'preferences' },
    { id: 'paleo', name: 'Paleo', category: 'preferences' },
    { id: 'keto', name: 'Keto', category: 'preferences' },
    { id: 'low_carb', name: 'Low-Carb', category: 'preferences' },
    { id: 'low_fat', name: 'Low-Fat', category: 'preferences' },
    { id: 'low_sodium', name: 'Low-Sodium', category: 'preferences' },
    { id: 'low_sugar', name: 'Low-Sugar', category: 'preferences' },
    { id: 'sugar_free', name: 'Sugar-Free', category: 'preferences' },
    { id: 'diabetic_friendly', name: 'Diabetic-Friendly', category: 'preferences' },
    { id: 'organic', name: 'Organic', category: 'preferences' },
    { id: 'non_gmo', name: 'Non-GMO', category: 'preferences' },
    { id: 'whole30', name: 'Whole30 Compliant', category: 'preferences' },
    { id: 'heart_healthy', name: 'Heart-Healthy', category: 'preferences' },
    { id: 'low_fodmap', name: 'Low FODMAP', category: 'preferences' },

    // Intolerances & Sensitivities
    { id: 'lactose_free', name: 'Lactose-Free', category: 'intolerances' },
    { id: 'contains_lactose', name: 'Contains Lactose', category: 'intolerances' },
    { id: 'fructose_free', name: 'Fructose-Free', category: 'intolerances' },
    { id: 'nightshade_free', name: 'Nightshade-Free', category: 'intolerances' },
    { id: 'histamine_free', name: 'Histamine-Free', category: 'intolerances' },
    { id: 'onion_free', name: 'Onion-Free', category: 'intolerances' },
    { id: 'garlic_free', name: 'Garlic-Free', category: 'intolerances' },
    { id: 'spicy', name: 'Spicy', category: 'intolerances' },
    { id: 'mild', name: 'Mild', category: 'intolerances' },

    // Religious/Cultural Dietary Restrictions
    { id: 'jain', name: 'Jain Diet (no root vegetables)', category: 'religious' },
    { id: 'hindu', name: 'Hindu Diet (no beef)', category: 'religious' },
    { id: 'buddhist', name: 'Buddhist Diet (often vegetarian)', category: 'religious' },

    // Special Diet Requirements
    { id: 'baby_friendly', name: 'Baby-Friendly', category: 'special' },
    { id: 'kid_friendly', name: 'Kid-Friendly', category: 'special' },
    { id: 'senior_friendly', name: 'Senior-Friendly', category: 'special' },

    // General Tags
    { id: 'contains_alcohol', name: 'Contains Alcohol', category: 'general' },
    { id: 'alcohol_free', name: 'Alcohol-Free', category: 'general' },
    { id: 'caffeine_free', name: 'Caffeine-Free', category: 'general' },
    { id: 'contains_caffeine', name: 'Contains Caffeine', category: 'general' }
]; 