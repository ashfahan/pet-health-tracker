import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"
import { addDays, addMonths, addWeeks, addYears, subMonths, subYears } from "date-fns"
import { nanoid } from "nanoid"

/**
 * Generate sample data for testing
 */
export function generateSampleData() {
  // Create sample pets - reduced to 3 with more detailed profiles
  const samplePets: Pet[] = [
    // Dog
    {
      id: nanoid(),
      name: "Max",
      type: "DOG",
      breed: "Golden Retriever",
      sex: "MALE",
      birthDate: subYears(new Date(), 5), // 5-year-old dog
      weight: 32.4,
      profilePicture: "/placeholder.svg?height=100&width=100",
      notes:
        "Friendly and energetic. Allergic to chicken and beef. Loves to play fetch in the park and swim in lakes. Has been trained for basic obedience commands and some agility. Microchipped ID: 985121033284566. Has slight hip dysplasia that requires monitoring. Prefers grain-free diet, feed twice daily.",
      createdAt: new Date(),
    },

    // Cat
    {
      id: nanoid(),
      name: "Luna",
      type: "CAT",
      breed: "Maine Coon",
      sex: "FEMALE",
      birthDate: subYears(new Date(), 3), // 3-year-old cat
      weight: 6.8,
      profilePicture: "/placeholder.svg?height=100&width=100",
      notes:
        "Playful but independent. Long-haired breed requiring brushing 3x weekly. Indoor-only cat with microchip ID: 985121033456782. Slight heart murmur detected at last checkup (Grade I/VI). Sleeps at the foot of the bed and enjoys chasing laser pointers. Has window perch in living room. Prefers wet food over dry kibble. Feed small amounts 3x daily to prevent weight gain.",
      createdAt: new Date(),
    },

    // Exotic - Bearded Dragon
    {
      id: nanoid(),
      name: "Spike",
      type: "REPTILE",
      breed: "Bearded Dragon",
      sex: "MALE",
      birthDate: subYears(new Date(), 4), // 4-year-old reptile
      weight: 0.48,
      profilePicture: "/placeholder.svg?height=100&width=100",
      notes:
        "Docile temperament. Housed in 120-gallon terrarium with UVB lighting and heat gradient (95-105°F basking spot, 75-85°F cool side). Diet consists of 80% vegetables/greens and 20% insects. Crickets and dubia roaches dusted with calcium supplement 3x weekly, multivitamin 1x weekly. Prefers collard greens and butternut squash. Daily misting for hydration, soaks 2x weekly. Substrate is reptile carpet to prevent impaction. Recent color brightening indicates excellent health.",
      createdAt: new Date(),
    },
  ]

  // Create sample vaccinations - expanded to ~10 per pet
  const sampleVaccinations: Vaccination[] = [
    // Max's vaccinations (Golden Retriever) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Rabies",
      dueDate: addYears(new Date(), 2),
      administeredDate: subYears(new Date(), 1),
      notes:
        "3-year vaccine administered by Dr. Johnson. Lot #RAB2023-456. Site: right rear hip. No reaction observed.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)",
      dueDate: addMonths(new Date(), 2),
      administeredDate: subYears(new Date(), 1),
      notes: "Annual booster due soon. Previous vaccine lot #DH-9877. Site: right shoulder. Manufacturer: Zoetis.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Bordetella (Kennel Cough)",
      dueDate: addDays(new Date(), 10),
      administeredDate: subMonths(new Date(), 5),
      notes:
        "Intranasal administration. Required for doggy daycare attendance. Manufacturer: Merck. Administered by technician Sarah.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Leptospirosis",
      dueDate: addMonths(new Date(), 2),
      administeredDate: subMonths(new Date(), 10),
      notes: "Annual vaccine. Important due to hiking near water sources. Lot #LEP-2023-789. Site: left shoulder.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Canine Influenza (H3N8/H3N2)",
      dueDate: addMonths(new Date(), 4),
      administeredDate: subMonths(new Date(), 8),
      notes: "Bivalent vaccine for both strains. Required for boarding. Lot #CI-456-2023. Site: right thigh.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Lyme Disease",
      dueDate: addMonths(new Date(), 3),
      administeredDate: subMonths(new Date(), 9),
      notes:
        "Annual vaccine due to high-tick area. Lot #LYME-2023-112. Site: left thigh. Manufacturer: Boehringer Ingelheim.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Rattlesnake Vaccine",
      dueDate: addMonths(new Date(), 5),
      administeredDate: subMonths(new Date(), 7),
      notes:
        "Initial dose of 2-part series. Second dose needed in 30 days. For hiking in desert areas. Site: right flank.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Rattlesnake Vaccine (Booster)",
      dueDate: addMonths(new Date(), 6),
      administeredDate: subMonths(new Date(), 6),
      notes: "Second dose of initial series. Annual boosters recommended before summer. Site: right flank.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Canine Coronavirus",
      dueDate: addYears(new Date(), 1),
      administeredDate: subYears(new Date(), 2),
      notes: "Optional vaccine requested by owner. Three-year duration. Site: left shoulder. Lot #CCO-2022-887.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Distemper-Measles Combination",
      dueDate: subMonths(new Date(), 54), // Past vaccine from puppy series
      administeredDate: subMonths(new Date(), 59),
      notes:
        "Puppy-specific vaccine from initial series. Not needed as adult. Site: right shoulder. Given at 8 weeks of age.",
      createdAt: new Date(),
    },

    // Luna's vaccinations (Maine Coon) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
      dueDate: addYears(new Date(), 2),
      administeredDate: subYears(new Date(), 1),
      notes:
        "Three-year vaccine. Core feline vaccine. Manufacturer: Boehringer. Lot #FVRCP-2022-445. Site: right shoulder.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Rabies",
      dueDate: addYears(new Date(), 2),
      administeredDate: subYears(new Date(), 1),
      notes:
        "Three-year vaccine. PureVax non-adjuvanted formula for decreased risk of injection site sarcoma. Site: right rear leg.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FeLV (Feline Leukemia Virus)",
      dueDate: addMonths(new Date(), 1),
      administeredDate: subYears(new Date(), 1),
      notes: "Annual booster due soon. Recombinant vaccine. Site: left rear leg. Lot #FLV-2023-112.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FIV (Feline Immunodeficiency Virus)",
      dueDate: addMonths(new Date(), 11),
      administeredDate: subMonths(new Date(), 1),
      notes: "Annual vaccine. Optional but recommended for cats with outdoor access. Site: right thigh.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Bordetella",
      dueDate: addMonths(new Date(), 11),
      administeredDate: subMonths(new Date(), 1),
      notes: "Annual intranasal vaccine. Recommended due to occasional boarding. Lot #FB-2023-009.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Chlamydia",
      dueDate: addMonths(new Date(), 11),
      administeredDate: subMonths(new Date(), 1),
      notes: "Annual vaccine. Part of boarding requirements. Site: left shoulder. Lot #FCH-2023-334.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FVRCP (Initial)",
      dueDate: subYears(new Date(), 2), // Past vaccine from kitten series
      administeredDate: subYears(new Date(), 3),
      notes:
        "First dose of kitten series. Given at 8 weeks of age. Site: right shoulder. Part of initial 3-dose series.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FVRCP (Booster 1)",
      dueDate: subYears(new Date(), 2), // Past vaccine from kitten series
      administeredDate: subYears(new Date(), 3),
      notes:
        "Second dose of kitten series. Given at 12 weeks of age. Site: right shoulder. Part of initial 3-dose series.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FVRCP (Booster 2)",
      dueDate: subYears(new Date(), 2), // Past vaccine from kitten series
      administeredDate: subYears(new Date(), 3),
      notes: "Third dose of kitten series. Given at 16 weeks of age. Site: right shoulder. Completed initial series.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "FeLV (Initial)",
      dueDate: subYears(new Date(), 2), // Past vaccine from kitten series
      administeredDate: subYears(new Date(), 3),
      notes:
        "First dose in kitten series. Given at 8 weeks. Site: left rear leg. Tested negative for FeLV prior to vaccination.",
      createdAt: new Date(),
    },

    // Spike's vaccinations (Bearded Dragon) - limited, as reptiles have fewer routine vaccines
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Fortified Reptile Bacterin",
      dueDate: addYears(new Date(), 1),
      administeredDate: subMonths(new Date(), 6),
      notes:
        "Specialized vaccine for lizards. Protects against bacterial infections including Aeromonas and Pseudomonas. Injectable admin by exotics specialist Dr. Chen.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Herpesvirus Vaccine",
      dueDate: addYears(new Date(), 1),
      administeredDate: subMonths(new Date(), 6),
      notes:
        "Specialized vaccine against reptile herpesvirus. Optional but recommended for reptiles in collections. Administered subcutaneously at base of neck.",
      createdAt: new Date(),
    },
  ]

  // Create sample medications - expanded to ~10 per pet
  const sampleMedications: Medication[] = [
    // Max's medications (Golden Retriever) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Heartgard Plus (Ivermectin/Pyrantel)",
      dosage: "1 chewable tablet (68mcg ivermectin/57mg pyrantel)",
      frequency: "Once monthly",
      startDate: subYears(new Date(), 5), // Lifetime prevention
      endDate: addYears(new Date(), 5),
      notes:
        "Heartworm and intestinal parasite prevention. Give on the 1st of each month. Purchase 12-month supply annually after heartworm test. Store at room temperature.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Nexgard (Afoxolaner)",
      dosage: "1 chewable tablet (28.3mg)",
      frequency: "Once monthly",
      startDate: subYears(new Date(), 4), // Lifetime prevention
      endDate: addYears(new Date(), 5),
      notes:
        "Flea and tick prevention. Administer on the 1st of each month with Heartgard. Purchase 12-month supply annually. For dogs 24.1-60 lbs. Store at room temperature.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Dasuquin Advanced with MSM",
      dosage: "2 tablets",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 8),
      endDate: addYears(new Date(), 3),
      notes:
        "Joint supplement for hip dysplasia. Contains glucosamine, chondroitin, MSM, Boswellia, avocado/soybean unsaponifiables. Give with food to prevent stomach upset. Can break tablets in half if difficulty administering.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Fish Oil (Omega-3)",
      dosage: "1000mg (1 gel capsule)",
      frequency: "Once daily",
      startDate: subYears(new Date(), 1),
      endDate: addYears(new Date(), 3),
      notes:
        "Supplement for skin and coat health. Also supports joint function and heart health. EPA/DHA combined 300mg per capsule. Give with food. Can puncture capsule and mix with food if needed.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Apoquel (Oclacitinib)",
      dosage: "16mg (1 tablet)",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 3),
      endDate: addMonths(new Date(), 1),
      notes:
        "For seasonal allergies. Prescribed for 4-month course during spring/summer. Do not double-dose if missed. Can cause increased thirst and appetite. May be given with or without food.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Cosequin Maximum Strength",
      dosage: "2 tablets",
      frequency: "Once daily",
      startDate: subYears(new Date(), 2),
      endDate: subYears(new Date(), 1),
      notes:
        "Previous joint supplement, replaced with Dasuquin Advanced. Initial loading dose was 3 tablets daily for 4 weeks, then reduced to maintenance dose of 2 tablets daily.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Clavamox (Amoxicillin/Clavulanate)",
      dosage: "375mg (1 tablet)",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 8),
      endDate: subMonths(new Date(), 7),
      notes:
        "Antibiotic prescribed for skin infection. 14-day course. Give with food to prevent stomach upset. Completed full course without side effects. Kept refrigerated.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Metacam (Meloxicam)",
      dosage: "1.5mg/ml solution, 1.5ml",
      frequency: "Once daily",
      startDate: subYears(new Date(), 1),
      endDate: subYears(new Date(), 1),
      notes:
        "NSAID prescribed for acute injury (sprained leg). 7-day course. Given with food. Discontinued after improvement. Temporary medication.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "Proin ER (Phenylpropanolamine)",
      dosage: "38mg (1/2 tablet)",
      frequency: "Once daily",
      startDate: addDays(new Date(), 2), // Future medication
      endDate: addYears(new Date(), 1),
      notes:
        "For urinary incontinence. Prescribed to start after next vet visit. Give with food. May cause restlessness or elevated heart rate. Monitor blood pressure at checkups.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      name: "CBD Oil (Cannabidiol)",
      dosage: "10mg (1ml oral solution)",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 6),
      endDate: addMonths(new Date(), 6),
      notes:
        "Supplemental support for joint comfort and anxiety during thunderstorms. Veterinarian-formulated product with certificate of analysis. Administer under tongue or mixed with small amount of food.",
      createdAt: new Date(),
    },

    // Luna's medications (Maine Coon) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Revolution Plus (Selamectin/Sarolaner)",
      dosage: "1 applicator (0.5ml)",
      frequency: "Once monthly",
      startDate: subYears(new Date(), 3), // Lifetime prevention
      endDate: addYears(new Date(), 5),
      notes:
        "Topical parasite prevention for fleas, ticks, ear mites, roundworms, hookworms, and heartworm. Apply to skin at base of neck where cat cannot lick. Keep cat dry for 24hrs after application. For cats 5.6-11 lbs.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Atenolol",
      dosage: "6.25mg (1/4 of 25mg tablet)",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 3),
      endDate: addYears(new Date(), 1),
      notes:
        "Beta-blocker for heart murmur management. Crush tablet and mix with small amount of wet food. Monitor for lethargy. Regular cardiac checkups required. Pulse should be 160-200bpm.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Methimazole",
      dosage: "5mg (1 tablet)",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 1),
      endDate: addMonths(new Date(), 5),
      notes:
        "For hyperthyroidism trial treatment. Administer 12 hours apart. Can crush and mix with small amount of wet food. Blood work required every 3 weeks to monitor T4 levels. Watch for vomiting or decreased appetite.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Clavamox (Amoxicillin/Clavulanate)",
      dosage: "62.5mg (1/2 tablet)",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 5),
      endDate: subMonths(new Date(), 4),
      notes:
        "Antibiotic prescribed for upper respiratory infection. 14-day course. Give with food. Crushed and mixed with small amount of wet food. Keep refrigerated.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Miralax (Polyethylene Glycol)",
      dosage: "1/8 tsp",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 3),
      endDate: addMonths(new Date(), 9),
      notes:
        "For hairball management and constipation prevention. Mix with wet food. Increase water intake. Can adjust dose based on stool consistency. Long-term preventative.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Cerenia (Maropitant Citrate)",
      dosage: "16mg (1/2 tablet)",
      frequency: "As needed for travel",
      startDate: subMonths(new Date(), 12),
      endDate: addYears(new Date(), 3),
      notes:
        "Anti-nausea medication for car trips to vet. Give 2 hours before travel on empty stomach. Do not give to cats under 16 weeks. Keep unused tablets in original packaging.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Cosequin for Cats",
      dosage: "1 capsule (sprinkled on food)",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 6),
      endDate: addYears(new Date(), 2),
      notes:
        "Joint supplement with glucosamine and chondroitin. Preventative for large breed cat predisposed to joint issues. Initial loading dose was 2 capsules daily for 4 weeks, then reduced to maintenance dose.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Omega-3 Fish Oil",
      dosage: "500mg (1/2 capsule)",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 12),
      endDate: addYears(new Date(), 2),
      notes:
        "Supplement for coat health and hairball reduction. Pierce capsule and squeeze onto wet food. Refrigerate bottle after opening. Wild-caught fish source, molecularly distilled.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Lactulose",
      dosage: "0.5ml oral solution",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 4),
      endDate: subMonths(new Date(), 3),
      notes:
        "Temporary treatment for constipation. Administer orally with syringe. Keep refrigerated. May cause temporary diarrhea. Discontinued after regular bowel movements established.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      name: "Lysine Supplement",
      dosage: "250mg powder",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 6),
      endDate: addMonths(new Date(), 6),
      notes:
        "Immune support supplement. Mix with wet food. Particularly important during stress periods or potential exposure to other cats. Natural amino acid supplement.",
      createdAt: new Date(),
    },

    // Spike's medications (Bearded Dragon) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Calcium with Vitamin D3",
      dosage: "Small pinch (approximately 1/8 tsp)",
      frequency: "5 days per week",
      startDate: subYears(new Date(), 4), // Lifetime supplement
      endDate: addYears(new Date(), 5),
      notes:
        "Essential supplement for reptile bone health. Dust on insects before feeding. Use calcium with D3 for 5 days, plain calcium 2 days per week. Rep-Cal brand, fine powder formula.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Multivitamin Powder",
      dosage: "Small pinch (approximately 1/16 tsp)",
      frequency: "Twice weekly",
      startDate: subYears(new Date(), 4), // Lifetime supplement
      endDate: addYears(new Date(), 5),
      notes:
        "Herptivite brand multivitamin. Dust on insects before feeding. Contains vitamin A as beta carotene, B complex vitamins, and other essential nutrients. Never use with calcium at same feeding.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Fluker's Repta-Aid",
      dosage: "0.5ml oral solution",
      frequency: "Once daily when needed",
      startDate: subMonths(new Date(), 8),
      endDate: subMonths(new Date(), 7),
      notes:
        "Emergency critical care nutrition. Used during period of reduced appetite. Administer via syringe directly into mouth. Contains essential nutrients, electrolytes and calories for recovery.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Baytril (Enrofloxacin)",
      dosage: "5mg/ml solution, 0.1ml",
      frequency: "Once daily",
      startDate: subMonths(new Date(), 8),
      endDate: subMonths(new Date(), 7),
      notes:
        "Antibiotic prescribed for respiratory infection. 14-day course. Injectable form administered by vet, then switched to oral. Completed full course without side effects.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Panacur (Fenbendazole)",
      dosage: "100mg/ml paste, 0.05ml",
      frequency: "Once daily for 3 days",
      startDate: subYears(new Date(), 1),
      endDate: subYears(new Date(), 1),
      notes:
        "Deworming medication. Administered orally via syringe directly into mouth. Repeat treatment in 2 weeks. Used after positive fecal test for pinworms. Kept reptile isolated during treatment.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Carnivore Care",
      dosage: "2ml reconstituted powder",
      frequency: "Twice daily",
      startDate: subYears(new Date(), 2),
      endDate: subYears(new Date(), 2),
      notes:
        "Critical care nutrition during illness. Mix powder with water to create slurry. Administer via syringe. Used during recovery from impaction. Temporary supportive care.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Betadine Solution (Povidone Iodine)",
      dosage: "5ml diluted in 250ml water",
      frequency: "Daily soaks for 10 minutes",
      startDate: subMonths(new Date(), 18),
      endDate: subMonths(new Date(), 17),
      notes:
        "For minor wound treatment. Created pale tea-colored solution for soaking. Used for 7 days after minor skin abrasion. Kept habitat extra clean during treatment period.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Bee Pollen Granules",
      dosage: "Small pinch",
      frequency: "Twice weekly",
      startDate: subMonths(new Date(), 6),
      endDate: addYears(new Date(), 1),
      notes:
        "Natural supplement to support immune function and stimulate appetite. Sprinkle on vegetables or dust on insects. Rich source of vitamins, minerals and amino acids.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Probiotic Powder",
      dosage: "1/16 tsp",
      frequency: "3 times weekly",
      startDate: subMonths(new Date(), 2),
      endDate: addMonths(new Date(), 4),
      notes:
        "Reptile-specific probiotic to support gut health. Sprinkle on vegetables. Used after antibiotic treatment to restore beneficial gut flora. Refrigerate after opening. Contains multiple Lactobacillus strains.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      name: "Silver Sulfadiazine Cream",
      dosage: "Thin layer",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 10),
      endDate: subMonths(new Date(), 9),
      notes:
        "Topical antibiotic cream for minor burn from basking lamp. Apply to affected area after gentle cleaning. Wear gloves during application. Monitor for skin irritation. Temporary treatment.",
      createdAt: new Date(),
    },
  ]

  // Create sample appointments - expanded to ~10 per pet
  const sampleAppointments: Appointment[] = [
    // Max's appointments (Golden Retriever) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Dr. Johnson",
      vetPhone: "555-123-4567",
      date: addDays(new Date(), 14),
      reason: "Annual Wellness Exam",
      notes:
        "Complete checkup including bloodwork, heartworm test, and vaccine boosters as needed. Discuss dental cleaning options and joint supplement options. Bring stool sample collected within 24 hours. Fast from midnight before appointment for blood draw.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Dr. Johnson",
      vetPhone: "555-123-4567",
      date: subYears(new Date(), 1),
      reason: "Annual Wellness Exam",
      notes:
        "Weight: 32.2kg. Temperature: 101.3°F. Heart rate: 85bpm. Respiratory rate: 22rpm. All systems normal. Heartworm test negative. DHPP and rabies boosters administered. Discussed dental care and weight management.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "PetSmart Grooming",
      vetPhone: "555-987-6543",
      date: addWeeks(new Date(), 3),
      reason: "Grooming",
      notes:
        "Full grooming package including bath, brush out, nail trim, ear cleaning, and sanitary trim. Request same groomer as last time (Sarah). Reminder: sensitive to scented shampoos - use hypoallergenic.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Doggy Dental Specialists",
      vetPhone: "555-444-5555",
      date: addMonths(new Date(), 2),
      reason: "Dental Cleaning",
      notes:
        "Professional dental cleaning under anesthesia. Pre-surgical blood work required. Fast from midnight before procedure. Drop off at 7:30am. Will need soft food for 2-3 days after. Discuss tooth brushing techniques during pickup.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Emergency Vet Hospital",
      vetPhone: "555-911-0000",
      date: subMonths(new Date(), 8),
      reason: "Injury",
      notes:
        "Laceration on right front paw from broken glass. Required 4 stitches and antibiotics. Cone of shame for 10 days. Follow-up in 2 weeks for suture removal. Limit activity and keep bandage dry.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Dr. Johnson",
      vetPhone: "555-123-4567",
      date: subMonths(new Date(), 7),
      reason: "Suture Removal",
      notes:
        "Removed stitches from paw laceration. Healing well with no signs of infection. Cleared for normal activity. No longer needs cone or bandage.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Canine Rehabilitation Center",
      vetPhone: "555-789-1234",
      date: addMonths(new Date(), 1),
      reason: "Physical Therapy Consultation",
      notes:
        "Initial assessment for hip dysplasia management. Will evaluate gait, range of motion, and muscle tone. Develop exercise plan for strengthening hind end. Bring recent X-rays if available.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "PetSmart Grooming",
      vetPhone: "555-987-6543",
      date: subMonths(new Date(), 3),
      reason: "Grooming",
      notes:
        "Bath, brush out, nail trim, ear cleaning. No mats found. Nails were very long - recommend more frequent trims. Slight ear redness noted - mentioned to owner for monitoring.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Mobile Vaccination Clinic",
      vetPhone: "555-VAX-PETS",
      date: subMonths(new Date(), 5),
      reason: "Bordetella Vaccine",
      notes:
        "Intranasal Bordetella vaccine administered for upcoming boarding stay. No reaction observed. Technician mentioned slight tartar buildup on teeth.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[0].id,
      vetName: "Happy Tails Boarding",
      vetPhone: "555-222-3333",
      date: addWeeks(new Date(), 8),
      reason: "Boarding",
      notes:
        "1-week boarding stay during family vacation. Bring own food and medications. Drop off Monday 8am, pickup Sunday 5pm. Request daily play group. Separate from cats due to over-excitement.",
      createdAt: new Date(),
    },

    // Luna's appointments (Maine Coon) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez - Feline Specialist",
      vetPhone: "555-456-7890",
      date: addDays(new Date(), 7),
      reason: "Cardiac Checkup",
      notes:
        "Follow-up for heart murmur. Will include echocardiogram and blood pressure measurement. Assess effectiveness of Atenolol. Bring current medication. Use carrier with removable top for easier examination.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez - Feline Specialist",
      vetPhone: "555-456-7890",
      date: subMonths(new Date(), 3),
      reason: "Cardiac Assessment",
      notes:
        "Grade I/VI heart murmur detected. ECG normal. Blood pressure slightly elevated at 165/95. Started on low-dose Atenolol. Weight: 6.8kg - recommend slight weight reduction. Discussed diet options.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Feline Wellness Center",
      vetPhone: "555-222-3333",
      date: subYears(new Date(), 1),
      reason: "Annual Wellness Exam",
      notes:
        "Weight: 7.1kg. Temperature: 101.5°F. Heart rate: 195bpm. All vaccines updated. Slight dental tartar noted. Discussed weight management plan - aim for 6.5kg ideal weight. FeLV/FIV negative.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Kitty Clips Mobile Groomer",
      vetPhone: "555-GROOM-CAT",
      date: addWeeks(new Date(), 2),
      reason: "Grooming",
      notes:
        "Full grooming for long-haired cat. Includes bath, brush out, comb, nail trim, ear cleaning. Request lion cut for summer heat management. Use low-stress handling techniques - cat becomes anxious with clippers.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez - Feline Specialist",
      vetPhone: "555-456-7890",
      date: addMonths(new Date(), 3),
      reason: "Dental Cleaning",
      notes:
        "Schedule professional dental cleaning under anesthesia. Pre-surgical blood work to be performed 1 week prior. Discussed risks of anesthesia. Fast from midnight before procedure. Overnight stay likely required.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez - Feline Specialist",
      vetPhone: "555-456-7890",
      date: subMonths(new Date(), 5),
      reason: "URI Treatment",
      notes:
        "Upper respiratory infection. Symptoms: sneezing, nasal discharge, decreased appetite. Temperature: 103.1°F. Started on Clavamox. Subcutaneous fluids administered. Showed how to administer medications. Isolate from other cats.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez - Feline Specialist",
      vetPhone: "555-456-7890",
      date: subMonths(new Date(), 4),
      reason: "URI Follow-up",
      notes:
        "Significant improvement. No more nasal discharge or sneezing. Appetite returned to normal. Temperature: 101.8°F. Completed antibiotic course. No further treatment needed. Weight stable at 6.9kg.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "The Cat Sitter",
      vetPhone: "555-CAT-SITT",
      date: addMonths(new Date(), 2),
      reason: "Pet Sitting",
      notes:
        "In-home pet sitting for 5 days during vacation. Need 2 visits daily. Feeding schedule: 1/4 cup dry food morning and evening, plus 1/2 can wet food each visit. Medication administration required. Fresh water daily.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Feline Diagnostics Lab",
      vetPhone: "555-888-9999",
      date: addWeeks(new Date(), 1),
      reason: "Thyroid Testing",
      notes:
        "Blood draw for T4/Free T4 testing. Suspected hyperthyroidism due to increased appetite despite stable weight, and occasional vomiting. Fast 8 hours before appointment. Results in 2-3 days.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[1].id,
      vetName: "Emergency Vet Hospital",
      vetPhone: "555-911-0000",
      date: subYears(new Date(), 2),
      reason: "Urinary Blockage",
      notes:
        "Emergency treatment for urinary blockage. Catheterized and hospitalized for 2 days. IV fluids administered. Switched to prescription urinary diet. Discussed importance of water intake. Follow-up in 1 week.",
      createdAt: new Date(),
    },

    // Spike's appointments (Bearded Dragon) - 10 entries
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: addMonths(new Date(), 1),
      reason: "Semi-Annual Wellness Exam",
      notes:
        "Routine exam including weight check, physical assessment, and fecal parasite test. Bring fresh fecal sample in sealed container. Will discuss seasonal adjustments to UVB exposure and diet composition.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subMonths(new Date(), 5),
      reason: "Wellness Exam",
      notes:
        "Weight: 480g. Excellent body condition. No external parasites observed. Fecal float negative. Skin condition and shedding normal. Discussed brumation plans for winter months. Recommended slight increase in calcium supplementation.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subYears(new Date(), 1),
      reason: "Respiratory Issue",
      notes:
        "Presented with open-mouth breathing and decreased appetite. Mild respiratory infection diagnosed. Weight down to 455g. Started on Baytril injections. Instructed to increase ambient humidity and temperature. Administered subcutaneous fluids.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subMonths(new Date(), 11),
      reason: "Follow-up",
      notes:
        "Respiratory infection resolved. Appetite and activity back to normal. Weight recovered to 470g. Completed medication course. Discussed UVB bulb replacement schedule and importance of regular changes.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subMonths(new Date(), 8),
      reason: "Impaction Concern",
      notes:
        "Decreased defecation and appetite. Palpable mass in abdomen. X-ray confirmed substrate impaction. Warm water soaks prescribed 3x daily. Administered oral mineral oil. Temporarily switched to paper towel substrate. Discussed safer substrate options.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subMonths(new Date(), 7),
      reason: "Impaction Follow-up",
      notes:
        "Impaction resolved. Normal defecation resumed. Appetite improved. Weight stable at 475g. Discussed proper substrate options. Recommended reptile carpet or ceramic tile instead of loose substrate.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Chen - Reptile Orthopedics",
      vetPhone: "555-333-4444",
      date: subYears(new Date(), 2),
      reason: "Leg Weakness",
      notes:
        "Consultation for intermittent hind limb weakness. X-rays showed normal bone density. No MBD detected. Blood calcium levels normal. Recommended physical therapy exercises and increased calcium supplementation as preventive measure.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Scales & Tails Boarding",
      vetPhone: "555-REP-TILE",
      date: addMonths(new Date(), 3),
      reason: "Exotic Pet Boarding",
      notes:
        "Boarding reservation for 10 days. Bring own food, supplements, and detailed care instructions. Special requirements: maintain 95-105°F basking spot, UVB lighting 12 hours daily, feed greens morning, insects afternoon.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: subMonths(new Date(), 10),
      reason: "Minor Burn",
      notes:
        "Small burn on back from direct contact with basking lamp. Cleaned and treated with silver sulfadiazine cream. Recommended adjusting lamp fixture to prevent direct contact. Discussed proper basking setup.",
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      petId: samplePets[2].id,
      vetName: "Dr. Lee - Exotic Animal Clinic",
      vetPhone: "555-888-7777",
      date: addWeeks(new Date(), 12),
      reason: "Annual Blood Work",
      notes:
        "Schedule comprehensive blood panel to check organ function and nutritional status. Fast insects for 24 hours before appointment. Will need to restrain for blood draw from ventral tail vein. Results typically available in 3-5 days.",
      createdAt: new Date(),
    },
  ]

  return { samplePets, sampleVaccinations, sampleMedications, sampleAppointments }
}

