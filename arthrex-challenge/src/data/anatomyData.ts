export interface AnatomyStructure {
  id: string;
  label: string;
  category: 'bone' | 'ligament' | 'meniscus' | 'tendon' | 'cartilage' | 'muscle';
  color: string;
  surgeonDescription: string;
  patientDescription: string;
  clinicalRelevance: string;
}

export const anatomyData: AnatomyStructure[] = [
  // ── Bones ──────────────────────────────────────────────────────────────
  {
    id: 'femur',
    label: 'Femur',
    category: 'bone',
    color: '#E8D5B7',
    surgeonDescription: 'The femur is the longest and strongest bone in the body, forming the proximal articulation of the knee joint. The distal femur features medial and lateral condyles that articulate with the tibial plateau, and the trochlear groove which guides patellar tracking.',
    patientDescription: 'The femur is your thigh bone — the large bone that runs from your hip down to your knee. The rounded bottom end of the femur forms the top half of your knee joint.',
    clinicalRelevance: 'Distal femur fractures, osteochondral lesions of the femoral condyles, and trochlear dysplasia are common pathologies. Femoral tunnel placement is critical in ACL reconstruction, and alignment of the femoral shaft affects overall knee biomechanics.',
  },
  {
    id: 'tibia',
    label: 'Tibia',
    category: 'bone',
    color: '#E8D5B7',
    surgeonDescription: 'The tibia is the primary weight-bearing bone of the lower leg. The proximal tibia forms the tibial plateau — comprising medial and lateral compartments — which articulates with the femoral condyles. The tibial tubercle serves as the insertion point for the patellar tendon.',
    patientDescription: 'The tibia is your shin bone — the main bone in your lower leg that bears your body weight. The flat top of the tibia forms the bottom half of your knee joint.',
    clinicalRelevance: 'Tibial plateau fractures, proximal tibial osteotomies for alignment correction, and tibial tunnel placement in ligament reconstruction are key surgical considerations. Posterior tibial slope influences ACL and PCL tension.',
  },
  {
    id: 'fibula',
    label: 'Fibula',
    category: 'bone',
    color: '#EAD9BC',
    surgeonDescription: 'The fibula is the slender non-weight-bearing bone running parallel to the tibia on the lateral side of the lower leg. The fibular head serves as an attachment point for the LCL and biceps femoris tendon, forming part of the posterolateral corner complex.',
    patientDescription: 'The fibula is the smaller bone on the outer side of your lower leg. While it does not bear much of your body weight, it provides important anchor points for ligaments that stabilize the outer part of your knee.',
    clinicalRelevance: 'The fibular head is a key landmark for posterolateral corner reconstruction. Proximal fibula fractures can accompany knee dislocations and LCL injuries. The common peroneal nerve wraps around the fibular neck and is at risk in lateral knee surgery.',
  },
  {
    id: 'patella',
    label: 'Patella',
    category: 'bone',
    color: '#E8D5B7',
    surgeonDescription: 'The patella is a sesamoid bone embedded within the quadriceps tendon. It articulates with the trochlear groove of the distal femur, forming the patellofemoral joint. It improves the mechanical advantage of the quadriceps by increasing the moment arm of the extensor mechanism.',
    patientDescription: 'The patella is your kneecap — the small, round bone at the front of your knee. It sits in a groove on the end of your thigh bone and acts like a pulley to make it easier for your thigh muscles to straighten your leg.',
    clinicalRelevance: 'Patellar instability, maltracking, and patellofemoral pain syndrome are common conditions. Patellar fractures disrupt the extensor mechanism. Chondromalacia patellae involves degeneration of the posterior patellar cartilage. TT-TG distance guides surgical decision-making for realignment procedures.',
  },

  // ── Ligaments ───────────────────────────────────────────────────────────
  {
    id: 'acl',
    label: 'ACL',
    category: 'ligament',
    color: '#FF6B6B',
    surgeonDescription: 'The anterior cruciate ligament (ACL) originates from the posteromedial aspect of the lateral femoral condyle and inserts on the anterior tibial plateau between the tibial spines. It comprises two functional bundles — anteromedial and posterolateral — and primarily resists anterior tibial translation and rotational forces.',
    patientDescription: 'The ACL (anterior cruciate ligament) is one of the main stabilizing ligaments inside your knee. It runs diagonally through the center of the joint and prevents your shin bone from sliding too far forward and your knee from rotating excessively.',
    clinicalRelevance: 'One of the most commonly injured ligaments in sport. ACL tears present with a pop, acute hemarthrosis, and positive Lachman/anterior drawer tests. Reconstruction typically uses patellar tendon, hamstring, or quadriceps tendon autografts. Anatomic tunnel placement and graft tensioning are critical to restoring stability.',
  },
  {
    id: 'pcl',
    label: 'PCL',
    category: 'ligament',
    color: '#FF8E53',
    surgeonDescription: 'The posterior cruciate ligament (PCL) originates from the anterolateral aspect of the medial femoral condyle and inserts on the posterior tibial plateau, approximately 1 cm distal to the joint line. It is the primary restraint to posterior tibial translation and has anterolateral and posteromedial bundles.',
    patientDescription: 'The PCL (posterior cruciate ligament) is a strong ligament inside your knee that works as a partner to the ACL. It prevents your shin bone from sliding too far backward and is one of the strongest ligaments in the body.',
    clinicalRelevance: 'PCL injuries often result from dashboard injuries or hyperflexion. Isolated PCL tears may be managed conservatively; combined injuries (e.g., with PLC) typically require surgical reconstruction. Posterior sag sign and posterior drawer test are key clinical findings.',
  },
  {
    id: 'mcl',
    label: 'MCL',
    category: 'ligament',
    color: '#4ECDC4',
    surgeonDescription: 'The medial collateral ligament (MCL) consists of superficial and deep layers. The superficial MCL runs from the medial femoral epicondyle to the proximal medial tibia. The deep MCL blends with the medial joint capsule and medial meniscus. It is the primary restraint to valgus stress and external rotation.',
    patientDescription: 'The MCL (medial collateral ligament) is a broad ligament on the inner side of your knee. It connects your thigh bone to your shin bone and prevents your knee from buckling inward when force is applied to the outside of the knee.',
    clinicalRelevance: "The most commonly injured knee ligament. Grade I–II injuries are typically managed non-operatively with bracing; Grade III tears with concurrent ACL/PCL injuries may require repair or reconstruction. The MCL's attachment to the medial meniscus means combined injuries are common.",
  },
  {
    id: 'lcl',
    label: 'LCL',
    category: 'ligament',
    color: '#45B7D1',
    surgeonDescription: 'The lateral collateral ligament (LCL), or fibular collateral ligament, runs from the lateral femoral epicondyle to the fibular head. It is the primary restraint to varus stress and is a key component of the posterolateral corner (PLC) along with the popliteus tendon and popliteofibular ligament.',
    patientDescription: 'The LCL (lateral collateral ligament) is a cord-like ligament on the outer side of your knee. It runs from the bottom of your thigh bone to the top of the smaller bone in your lower leg and helps prevent your knee from bowing outward.',
    clinicalRelevance: 'Isolated LCL injuries are rare; they most often occur as part of posterolateral corner injuries or multi-ligament knee injuries. Varus stress testing at 0° and 30° helps differentiate involvement. Missed PLC injuries lead to failure of ACL/PCL reconstruction.',
  },

  // ── Menisci ──────────────────────────────────────────────────────────────
  {
    id: 'medial_meniscus',
    label: 'Medial Meniscus',
    category: 'meniscus',
    color: '#96CEB4',
    surgeonDescription: 'The medial meniscus is a C-shaped fibrocartilaginous structure firmly attached to the joint capsule and deep MCL. It occupies approximately 50–60% of the medial compartment. It deepens the tibial plateau to improve congruity, transmits load, provides shock absorption, and serves as a secondary stabilizer against anterior tibial translation in ACL-deficient knees.',
    patientDescription: 'The medial meniscus is a C-shaped cushion of tough cartilage on the inner side of your knee. It sits between your thigh bone and shin bone, acting like a shock absorber and helping distribute your body weight evenly across the knee.',
    clinicalRelevance: 'The most commonly torn meniscus. Tears are classified by pattern (radial, horizontal, vertical, complex) and vascularity (red-red, red-white, white-white zones). Meniscal preservation via repair is preferred over partial meniscectomy to reduce long-term osteoarthritis risk. Root tears destabilize the meniscal hoop and dramatically increase joint contact pressures.',
  },
  {
    id: 'lateral_meniscus',
    label: 'Lateral Meniscus',
    category: 'meniscus',
    color: '#88D8A3',
    surgeonDescription: 'The lateral meniscus is a near-circular structure that covers a greater percentage of the lateral tibial plateau (approximately 70–80%) compared to the medial meniscus. It has more freedom of movement due to its loose capsular attachments and popliteal hiatus. It transmits a greater proportion of load in the lateral compartment.',
    patientDescription: 'The lateral meniscus is a nearly circular cushion of tough cartilage on the outer side of your knee. Like its counterpart on the inner side, it acts as a shock absorber and helps protect the surfaces of your knee joint during movement.',
    clinicalRelevance: 'Lateral meniscus tears frequently accompany ACL injuries. Discoid lateral meniscus is a common anatomical variant prone to tearing. The popliteal hiatus must be identified during repair to avoid trapping the popliteal tendon. Lateral meniscus allograft transplantation is an option following total meniscectomy.',
  },

  // ── Cartilage ────────────────────────────────────────────────────────────
  {
    id: 'articular_cartilage',
    label: 'Articular Cartilage',
    category: 'cartilage',
    color: '#A8E6CF',
    surgeonDescription: 'Hyaline articular cartilage covers the articulating surfaces of the distal femur, proximal tibia, and posterior patella. It is avascular, aneural, and alymphatic, relying on synovial fluid for nutrition. It consists of chondrocytes within an extracellular matrix of type II collagen and proteoglycans, organized into superficial, transitional, deep, and calcified zones.',
    patientDescription: 'Articular cartilage is the smooth, slippery white tissue that covers the ends of your bones inside the knee joint. It acts like a frictionless coating that allows your bones to glide over one another effortlessly and absorbs impact with every step.',
    clinicalRelevance: 'Cartilage has limited intrinsic healing capacity. Focal defects are treated with microfracture, osteochondral autograft (OATS), osteochondral allograft, or autologous chondrocyte implantation (ACI/MACI) based on defect size and patient factors. Untreated chondral lesions progress to osteoarthritis. Outerbridge and ICRS grading systems classify defect severity.',
  },

  // ── Tendon ───────────────────────────────────────────────────────────────
  {
    id: 'patellar_tendon',
    label: 'Patellar Tendon',
    category: 'tendon',
    color: '#FFD93D',
    surgeonDescription: 'The patellar tendon (ligament) connects the inferior pole of the patella to the tibial tubercle, forming the distal portion of the extensor mechanism. It is approximately 4–5 cm in length and 2–3 cm wide. The central third is a common autograft source for ACL reconstruction due to its robust mechanical properties and bony attachment sites.',
    patientDescription: 'The patellar tendon is a strong band of tissue that connects your kneecap to the front of your shin bone. It is the final link in the chain that allows your thigh muscles to straighten your knee when you walk, run, jump, or climb stairs.',
    clinicalRelevance: "Patellar tendinopathy (\"jumper's knee\") is common in jumping athletes, typically affecting the inferior pole. Acute rupture disrupts the extensor mechanism and requires prompt surgical repair. The central-third bone-patellar tendon-bone (BPTB) autograft is a gold-standard ACL reconstruction graft, though harvest-site morbidity and anterior knee pain are considerations.",
  },

  // ── Muscles ───────────────────────────────────────────────────────────────
  {
    id: 'quadriceps',
    label: 'Quadriceps',
    category: 'muscle',
    color: '#E57373',
    surgeonDescription: 'The quadriceps femoris group — comprising rectus femoris, vastus lateralis, vastus medialis, and vastus intermedius — is the primary knee extensor. The vastus medialis oblique (VMO) fibre orientation is critical for patellar tracking. Articularis genus retracts the suprapatellar bursa during extension.',
    patientDescription: 'Your quadriceps are the four large muscles at the front of your thigh that straighten your knee. They are the most important muscle group for returning to activity after ACL surgery — strong quads protect the new graft and restore normal walking and running mechanics.',
    clinicalRelevance: 'Quadriceps weakness and inhibition (arthrogenic muscle inhibition) are the most common deficits after ACL injury and reconstruction. Early quad activation exercises are the cornerstone of post-operative rehabilitation. Quad strength symmetry (LSI ≥90%) is a key return-to-sport criterion.',
  },
  {
    id: 'hamstrings',
    label: 'Hamstrings',
    category: 'muscle',
    color: '#C62828',
    surgeonDescription: 'The hamstring group — semimembranosus, semitendinosus, and biceps femoris (long and short heads) — flexes the knee and decelerates tibial rotation. The semitendinosus and gracilis are harvested as a quadrupled graft (four-strand ST/G) for hamstring autograft ACL reconstruction. The pes anserinus is their common tibial insertion.',
    patientDescription: 'Your hamstrings are the muscles at the back of your thigh that bend your knee and help control how your leg rotates. If your surgeon chooses a hamstring graft for your ACL reconstruction, one or two of these tendons will be used to build your new ligament — they naturally regrow over time.',
    clinicalRelevance: 'Hamstring autograft (semitendinosus ± gracilis) is one of the most commonly used ACL graft sources. Post-harvest, hamstring strength may be temporarily reduced by 10–20%. Hamstring co-contraction during loading is a key dynamic stabiliser of the ACL-deficient and reconstructed knee.',
  },
  {
    id: 'gastrocnemius',
    label: 'Gastrocnemius',
    category: 'muscle',
    color: '#EF6C00',
    surgeonDescription: 'The gastrocnemius (medial and lateral heads) originates from the posterior femoral condyles and inserts via the Achilles tendon. It is the primary plantar flexor of the ankle and a secondary knee flexor. The plantaris runs alongside the lateral head and may be used as a minor graft source. Both heads cross the knee joint and influence posterior tibial translation under load.',
    patientDescription: 'Your gastrocnemius is the large calf muscle that forms the back of your lower leg. While it is mainly responsible for pushing off when you walk or run, it also crosses the knee joint and helps stabilise it — making calf strengthening an important part of ACL rehabilitation.',
    clinicalRelevance: 'Gastrocnemius tightness increases posterior tibial translation and ACL loading during activities. Calf flexibility and eccentric strength are assessed during rehabilitation. The medial gastrocnemius can be used as a local flap for wound coverage in complex knee revision surgery.',
  },
  {
    id: 'other_muscles',
    label: 'Deep Knee Muscles',
    category: 'muscle',
    color: '#7B1FA2',
    surgeonDescription: 'The popliteus, sartorius, and gracilis are the deep stabilisers of the knee. The popliteus is the primary dynamic restraint to external tibial rotation and "unlocks" the knee from full extension. Sartorius and gracilis converge at the pes anserinus on the medial tibia. Gracilis is commonly harvested alongside semitendinosus for hamstring autograft.',
    patientDescription: 'These smaller, deeper muscles work behind the scenes to fine-tune your knee\'s rotation and stability. They are especially important for activities that involve pivoting and changing direction. The gracilis muscle in particular is sometimes used by surgeons as part of the tendon graft to rebuild your ACL.',
    clinicalRelevance: 'The popliteus is a key component of the posterolateral corner (PLC). Its dysfunction contributes to rotatory instability and failure of ACL reconstruction if not addressed. Gracilis and sartorius tendons are frequently harvested for ligament reconstruction procedures throughout the lower limb.',
  },
];

export const anatomyById = Object.fromEntries(anatomyData.map((s) => [s.id, s]));
