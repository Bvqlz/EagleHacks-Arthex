// Anatomy structure descriptions and metadata
// Each entry matches the structure IDs defined in modelMapping.ts

export interface AnatomyStructure {
  id: string;
  label: string;
  category: 'bone' | 'ligament' | 'meniscus' | 'tendon' | 'cartilage';
  color: string;
  surgeonDescription: string;
  patientDescription: string;
  clinicalRelevance: string;
}

export const anatomyData: AnatomyStructure[] = [
  {
    id: 'femur',
    label: 'Femur',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription:
      'The femur is the longest and strongest bone in the body, forming the proximal articular surface of the knee joint via its medial and lateral condyles. The distal femur provides the attachment site for the ACL on the posterolateral aspect of the medial wall of the lateral femoral condyle, a critical landmark during tunnel drilling. Precise identification of the anatomic femoral footprint — centered at the 10–11 o\'clock position (right knee) — is essential for restoring native ACL biomechanics.',
    patientDescription:
      'The femur is your thigh bone — the longest bone in your body — and it forms the top half of your knee joint. During ACL reconstruction, your surgeon creates a small tunnel in the lower end of this bone to anchor your new ligament securely.',
    clinicalRelevance:
      'The femoral condyle footprint of the ACL spans roughly 14–18 mm in length; tunnel placement even 2–3 mm off-center can significantly alter rotational stability, making precise anatomic drilling the single most important technical variable in ACL reconstruction.',
  },
  {
    id: 'tibia',
    label: 'Tibia',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription:
      'The tibia is the primary weight-bearing bone of the lower leg, contributing the distal articular surface of the tibiofemoral joint via its medial and lateral plateaus. The ACL\'s tibial footprint occupies the anterior intercondylar area, just anterior to the tibial spine, measuring approximately 11 mm mediolateral by 17 mm anteroposterior. Tibial tunnel placement is guided to this footprint using an ACL tibial aiming guide set to 55°, with the tunnel aperture positioned to avoid roof impingement at full extension.',
    patientDescription:
      'The tibia is your shin bone, forming the bottom half of your knee joint. Your surgeon drills a small tunnel through this bone as well — together, the femoral and tibial tunnels create the pathway that holds your new ACL in the correct position.',
    clinicalRelevance:
      'Posterior tibial tunnel placement increases risk of PCL impingement, while anterior placement causes roof impingement at extension; the Howell "no-roof-impingement" test — confirming the graft clears the intercondylar roof at 0° — is a mandatory intraoperative checkpoint.',
  },
  {
    id: 'fibula',
    label: 'Fibula',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription:
      'The fibula is a slender non-weight-bearing bone running parallel to the tibia along the lateral lower leg. Its proximal head serves as the principal attachment site for the lateral collateral ligament and the biceps femoris tendon, forming the posterolateral corner complex. While not directly involved in standard ACL reconstruction, the fibular head is a critical landmark when addressing concomitant posterolateral corner injuries.',
    patientDescription:
      'The fibula is the smaller bone on the outer side of your lower leg. It does not bear significant body weight, but it provides important attachment points for ligaments that stabilize the outer side of your knee.',
    clinicalRelevance:
      'The fibular head is the osseous anchor for the lateral collateral ligament — up to 15% of ACL injuries occur alongside posterolateral corner disruptions, and missing this concomitant injury is the most common cause of persistent instability after an otherwise technically successful ACL reconstruction.',
  },
  {
    id: 'patella',
    label: 'Patella',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription:
      'The patella is a sesamoid bone embedded within the quadriceps-patellar tendon mechanism, articulating with the trochlear groove of the distal femur to form the patellofemoral joint. It functions as a mechanical pulley, increasing the moment arm of the quadriceps by up to 50% at 20° of flexion. During ACL reconstruction, the infrapatellar fat pad is encountered during portal placement and must be preserved to avoid postoperative arthrofibrosis and anterior knee pain.',
    patientDescription:
      'Your kneecap (patella) glides up and down in a groove at the front of your femur, acting like a pulley to make your quadriceps muscle far more efficient when you straighten your knee. Protecting it during surgery helps ensure a smooth, pain-free recovery.',
    clinicalRelevance:
      'The patella increases quadriceps mechanical advantage by approximately 50% — yet it is frequently overlooked post-ACL reconstruction; quadriceps inhibition and patellofemoral pain affect up to 30% of patients at one year, making early quad activation a pillar of rehabilitation.',
  },
  {
    id: 'acl',
    label: 'Anterior Cruciate Ligament',
    category: 'ligament',
    color: '#E85D75',
    surgeonDescription:
      'The ACL is an intra-articular, extrasynovial ligament composed of two functional bundles — the anteromedial (AM) and posterolateral (PL) — that together restrain anterior tibial translation and internal rotation. The AM bundle is taut in flexion while the PL bundle is taut in extension, conferring rotational stability critical for cutting and pivoting maneuvers. Native ligament vascularity derives predominantly from the middle geniculate artery, and the synovial envelope limits its intrinsic healing capacity, necessitating surgical reconstruction rather than primary repair in most cases.',
    patientDescription:
      'The ACL is a strong band of tissue inside your knee that acts as the primary brake, preventing your shin bone from sliding forward and your knee from rotating too far. When it tears — often with a sudden pivot or landing — the knee loses stability, which is why surgery is usually needed to restore full function.',
    clinicalRelevance:
      'The ACL is the most frequently reconstructed ligament in orthopedic surgery, with over 200,000 procedures performed annually in the United States alone — yet rerupture rates reach 15–25% in athletes under 25, driving ongoing research into graft selection, tunnel placement, and return-to-sport criteria.',
  },
  {
    id: 'pcl',
    label: 'Posterior Cruciate Ligament',
    category: 'ligament',
    color: '#C0392B',
    surgeonDescription:
      'The PCL is the strongest ligament in the knee, with a cross-sectional area approximately twice that of the ACL, and serves as the primary restraint to posterior tibial translation. It originates from the lateral aspect of the medial femoral condyle and inserts on the posterior tibial sulcus, 1–1.5 cm below the joint line. During ACL reconstruction, the intact PCL functions as a key reference structure for femoral tunnel positioning, and its posterior slope must be avoided when placing the tibial guide wire.',
    patientDescription:
      'The PCL is the knee\'s strongest internal ligament, acting as the main anchor that prevents your shin bone from sliding backward. It sits just behind the ACL, and surgeons use it as an important landmark during ACL reconstruction to make sure everything is positioned correctly.',
    clinicalRelevance:
      'Because the PCL is twice as strong as the ACL and has a better blood supply, isolated PCL tears often heal with non-operative management — a stark contrast to ACL injuries, making accurate diagnosis of which cruciate is injured critical before any surgical planning.',
  },
  {
    id: 'mcl',
    label: 'Medial Collateral Ligament',
    category: 'ligament',
    color: '#E67E22',
    surgeonDescription:
      'The MCL is a broad, multi-layered structure on the medial aspect of the knee consisting of a superficial tibial collateral ligament, a deep capsular ligament, and the posterior oblique ligament. It is the primary restraint to valgus stress and external tibial rotation, with the superficial MCL contributing approximately 78% of valgus resistance at 25° of flexion. Concomitant grade III MCL injuries with ACL tears are typically managed with staged or simultaneous reconstruction depending on the chronicity and residual laxity.',
    patientDescription:
      'The MCL is a wide ligament running down the inside of your knee that protects it from buckling inward. It is often injured alongside the ACL, but because it has a good blood supply, mild to moderate MCL tears frequently heal on their own with bracing and physical therapy.',
    clinicalRelevance:
      'The classic "unhappy triad" — simultaneous injury to the ACL, MCL, and medial meniscus — was originally described by O\'Donoghue in 1950 and remains one of the most recognized patterns in sports medicine, though modern studies show isolated ACL plus medial meniscus tears are actually more common in contact athletes.',
  },
  {
    id: 'lcl',
    label: 'Lateral Collateral Ligament',
    category: 'ligament',
    color: '#D35400',
    surgeonDescription:
      'The LCL (fibular collateral ligament) is a cord-like structure running from the lateral femoral epicondyle to the fibular head, serving as the primary restraint to varus stress. Unlike the MCL, it has no attachment to the lateral meniscus, making it distinguishable by its distinctly separate palpable cord at the lateral joint line. It is a key component of the posterolateral corner, and varus stress radiographs showing >2.7 mm of lateral compartment opening compared to the contralateral limb indicate complete LCL disruption requiring surgical reconstruction.',
    patientDescription:
      'The LCL is a rope-like ligament on the outer side of your knee that prevents it from bowing outward. Unlike the inner ligaments, it does not attach to the cartilage pads in your knee, which is why surgeons can sometimes feel it distinctly as a separate structure on the outside of the joint.',
    clinicalRelevance:
      'The LCL is the only major knee ligament with no meniscal attachment — a fact with direct surgical consequence, since the lateral meniscus is considerably more mobile than the medial meniscus and is therefore injured less frequently despite the lateral compartment sustaining high-energy varus and hyperextension forces.',
  },
  {
    id: 'medial_meniscus',
    label: 'Medial Meniscus',
    category: 'meniscus',
    color: '#27AE60',
    surgeonDescription:
      'The medial meniscus is a C-shaped fibrocartilaginous structure firmly attached peripherally to the joint capsule and the deep MCL, rendering it less mobile than its lateral counterpart. It transmits approximately 50% of the medial compartment load and serves as a secondary stabilizer to anterior tibial translation in the ACL-deficient knee, with the posterior horn bearing the greatest compressive and shear forces. Concomitant medial meniscus tears are present in 30–50% of acute ACL injuries and up to 90% of chronic ACL-deficient knees, and should be addressed at the time of reconstruction whenever technically feasible.',
    patientDescription:
      'The medial meniscus is a C-shaped cushion on the inner side of your knee that absorbs shock and helps distribute your body weight evenly. Because it is firmly anchored to the inner knee capsule, it is more vulnerable to tearing alongside an ACL injury — your surgeon will carefully inspect and repair it during your procedure if needed.',
    clinicalRelevance:
      'The posterior horn of the medial meniscus becomes a secondary ACL substitute in chronically unstable knees — meaning delaying ACL reconstruction significantly increases the rate of medial meniscus tears, which is why early surgical intervention is recommended in active patients.',
  },
  {
    id: 'lateral_meniscus',
    label: 'Lateral Meniscus',
    category: 'meniscus',
    color: '#2ECC71',
    surgeonDescription:
      'The lateral meniscus is a nearly circular fibrocartilaginous disc that covers a larger proportion of the lateral tibial plateau (approximately 75–93%) compared to the medial meniscus, and has fewer peripheral capsular attachments, conferring significantly greater mobility. It is avascular in its inner two-thirds, with healing potential confined to the peripheral vascular zone supplied by the lateral geniculate arteries. Lateral meniscus root tears, which occur at high frequency with acute ACL injuries, require careful probing at arthroscopy as they are easily overlooked and, if untreated, lead to rapid lateral compartment arthrosis.',
    patientDescription:
      'The lateral meniscus is a nearly circular cartilage pad on the outer side of your knee that acts as a shock absorber and helps the joint surfaces glide smoothly. It is more mobile than the inner meniscus and, while it can tear during an ACL injury, many lateral meniscus tears in this setting are repairable.',
    clinicalRelevance:
      'A lateral meniscus root tear — where the posterior root detaches from the tibial plateau — is biomechanically equivalent to a total meniscectomy, converting a normally concave articular surface into a convex one that dramatically accelerates cartilage wear, making prompt recognition and repair critical.',
  },
  {
    id: 'articular_cartilage',
    label: 'Articular Cartilage',
    category: 'cartilage',
    color: '#85C1E9',
    surgeonDescription:
      'Hyaline articular cartilage covers the articular surfaces of the distal femur, proximal tibia, and posterior patella, providing an extremely low-friction, load-bearing surface with a coefficient of friction as low as 0.001. It is aneural and avascular, deriving nutrition from synovial fluid via diffusion, which severely limits its intrinsic repair capacity. Chondral lesions are identified in up to 50% of ACL reconstructions, and the International Cartilage Repair Society (ICRS) grading system (I–IV) is used to characterize defect depth; full-thickness defects (ICRS III–IV) may require concomitant procedures such as microfracture, autologous chondrocyte implantation, or osteochondral autograft transfer.',
    patientDescription:
      'Articular cartilage is the smooth, glassy coating on the ends of your bones that allows your knee to move with almost no friction — like a perfectly lubricated ball bearing. Because it has no blood supply, cartilage cannot heal itself, which is why protecting it during and after surgery is so important for your long-term joint health.',
    clinicalRelevance:
      'Articular cartilage has a coefficient of friction lower than ice on ice — yet it has virtually no ability to regenerate on its own, which is why a single ACL injury, if left untreated for years, can set off a cascade of cartilage breakdown that leads to osteoarthritis decades before it would otherwise occur.',
  },
  {
    id: 'patellar_tendon',
    label: 'Patellar Tendon',
    category: 'tendon',
    color: '#F39C12',
    surgeonDescription:
      'The patellar tendon (ligamentum patellae) spans from the inferior pole of the patella to the tibial tuberosity, transmitting quadriceps forces to extend the knee and serving as the extensor mechanism\'s terminal link. It is the source of the bone-patellar tendon-bone (BTB) autograft, harvested as a central-third graft measuring approximately 10 mm in width with 25 mm bone plugs, which provides immediate rigid fixation and strong cortical-to-cortical bone healing. Donor-site morbidity — including anterior knee pain, patellar fracture, and tendon rupture — affects 10–30% of BTB graft cases, which has contributed to the growing preference for hamstring autograft in many centers.',
    patientDescription:
      'The patellar tendon connects your kneecap to your shin bone and is what allows your quadriceps muscle to straighten your knee. It is one of the possible sources surgeons may use to harvest a graft for ACL reconstruction, though your surgeon will discuss which graft option is best suited for your specific situation and activity level.',
    clinicalRelevance:
      'The patellar tendon withstands forces exceeding 3,000 N during stair climbing and up to 7,700 N during jumping activities — nearly twice the tensile strength of the native ACL — which is why its central third has historically been considered the "gold standard" ACL autograft despite significant donor-site considerations.',
  },
];

export const anatomyById = Object.fromEntries(anatomyData.map((s) => [s.id, s]));
