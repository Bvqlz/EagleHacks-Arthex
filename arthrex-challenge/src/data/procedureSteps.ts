// ACL reconstruction procedure steps — hamstring autograft technique
// Arthrex instruments referenced are real products used in clinical practice.

export interface ProcedureStep {
  id: string;
  title: string;
  surgeonTitle: string;
  patientTitle: string;
  surgeonDescription: string;
  patientDescription: string;
  instruments: string[];
  focusStructures: string[];
  cameraPosition?: [number, number, number];
}

export const procedureSteps: ProcedureStep[] = [
  {
    id: 'step-1',
    title: 'Diagnosis & Examination',
    surgeonTitle: 'Preoperative Diagnosis & Physical Examination',
    patientTitle: 'Understanding Your Injury',
    surgeonDescription:
      'Preoperative evaluation integrates clinical examination findings with advanced imaging to confirm ACL insufficiency and identify concomitant pathology. The Lachman test (sensitivity ~85%, specificity ~94%) and pivot-shift examination are the primary clinical tools; a positive pivot-shift grade II or III correlates strongly with rotational instability and guides graft selection. Weight-bearing radiographs rule out bony pathology and assess posterior tibial slope, while 3-Tesla MRI confirms ACL discontinuity, characterizes bone bruise patterns, and detects meniscal and chondral co-injuries. Surgical timing is optimized once acute inflammation has resolved, full range of motion has been restored, and quadriceps strength index exceeds 70% — typically 3–6 weeks post-injury.',
    patientDescription:
      'Before your surgery, your care team carefully reviews your MRI images and performs hands-on tests to confirm the ACL is torn and to check for any other damage to your knee. Taking time for a thorough diagnosis ensures the surgical plan is tailored to your exact injury, giving you the best possible outcome.',
    instruments: ['MRI Imaging', 'Lachman Test', 'Pivot-Shift Test', 'Stress Radiographs'],
    focusStructures: ['acl', 'medial_meniscus', 'lateral_meniscus', 'articular_cartilage'],
  },
  {
    id: 'step-2',
    title: 'Anesthesia & Portal Placement',
    surgeonTitle: 'Anesthesia, Patient Positioning & Arthroscopic Portal Placement',
    patientTitle: 'Preparing for Surgery',
    surgeonDescription:
      'The patient is positioned supine with a well-padded lateral post and a leg holder that allows the knee to flex freely to 90° or greater, facilitating both arthroscopic access and graft harvest. A proximal thigh tourniquet is inflated to 250–300 mmHg following exsanguination with an Esmarch bandage. Standard anterolateral (AL) and anteromedial (AM) arthroscopic portals are established: the AL portal is placed just lateral to the patellar tendon at the joint line for camera insertion, and the AM portal is established under direct visualization just medial to the patellar tendon, positioned sufficiently inferior to allow an independent femoral drilling angle of ≥120°. An accessory medial portal may be added for dedicated anatomic femoral drilling when the standard AM portal does not provide adequate angle.',
    patientDescription:
      'You will be under anesthesia — most commonly a spinal or general anesthetic — so you will feel nothing during the procedure. Your leg is positioned and two or three small puncture incisions (portals) less than a centimeter long are made around your kneecap to allow the surgical camera and instruments to enter the joint.',
    instruments: ['Leg Holder', 'Tourniquet', 'Arthroscopic Cannulas', 'Spinal Needle (Portal Localization)'],
    focusStructures: ['patella', 'patellar_tendon', 'tibia'],
  },
  {
    id: 'step-3',
    title: 'Diagnostic Arthroscopy & Joint Assessment',
    surgeonTitle: 'Systematic Diagnostic Arthroscopy & Intra-articular Assessment',
    patientTitle: 'Looking Inside Your Knee',
    surgeonDescription:
      'A 30° arthroscope is inserted through the AL portal and a systematic 10-point joint survey is performed: suprapatellar pouch, medial and lateral gutters, patellofemoral joint, medial compartment (medial tibial plateau, medial femoral condyle, medial meniscus — including posterior horn via valgus stress), intercondylar notch with ACL and PCL visualization, and lateral compartment (lateral tibial plateau, lateral femoral condyle, lateral meniscus including posterior root). The ACL tear pattern is documented — complete mid-substance, femoral avulsion, or tibial avulsion — and residual stump tissue is assessed for potential augmentation. Concomitant meniscal tears are addressed at this stage (repair or partial resection per tear morphology and vascularity), and chondral lesions are graded per ICRS classification. Notchplasty is performed with a 5.5 mm full-radius resector or bur only when anatomic landmark visualization is obscured.',
    patientDescription:
      'Your surgeon uses a tiny camera — an arthroscope — to view every part of your knee\'s interior in detail. This step confirms the ACL tear, checks the meniscus pads and cartilage for damage, and allows your surgeon to treat any additional injuries at the same time, all through those small puncture sites.',
    instruments: [
      'Arthrex 30° Arthroscope',
      'Full-Radius Resector (5.5 mm)',
      'Arthroscopic Probe',
      'Suction Punch',
      'Arthroscopic Shaver',
    ],
    focusStructures: ['acl', 'pcl', 'medial_meniscus', 'lateral_meniscus', 'articular_cartilage', 'femur', 'tibia'],
  },
  {
    id: 'step-4',
    title: 'Graft Harvesting',
    surgeonTitle: 'Hamstring Autograft Harvest — Gracilis & Semitendinosus',
    patientTitle: 'Harvesting Your New Ligament',
    surgeonDescription:
      'A 3–4 cm oblique incision is made over the pes anserinus, 2–3 cm distal and medial to the tibial tuberosity. The sartorius fascia is incised, and the gracilis and semitendinosus tendons are identified by palpation and confirmed with a right-angle clamp. Each tendon is released from its musculotendinous junction using an open-end tendon stripper (Arthrex Closed-Loop Tendon Harvester), with the surgeon maintaining distal traction to ensure clean separation of muscular attachments. Harvested tendons are immediately transferred to the Arthrex Hamstring Graft Preparation Board, where they are stripped of muscular tissue, folded to a quadrupled configuration (double gracilis + double semitendinosus), and whip-stitched at both ends with #2 FiberLoop suture using a graft preparation vice. Final graft diameter is measured with a sizing block; a 7–9 mm diameter graft is typical, with target minimum diameter of 8 mm associated with lower rerupture rates in young athletes.',
    patientDescription:
      'Your new ACL is fashioned from two tendons — the gracilis and semitendinosus — taken from the back of your own thigh through a small incision below your knee. These tendons regenerate over time with no meaningful loss of strength, and using your own tissue means the body accepts the graft naturally as it heals into place.',
    instruments: [
      'Arthrex Closed-Loop Tendon Harvester (Tendon Stripper)',
      'Arthrex Hamstring Graft Preparation Board',
      'Graft Preparation Vice',
      '#2 FiberLoop Suture (Arthrex)',
      'Graft Sizing Block',
    ],
    focusStructures: ['tibia', 'patellar_tendon'],
  },
  {
    id: 'step-5',
    title: 'Tibial Tunnel Drilling',
    surgeonTitle: 'Tibial Tunnel Preparation — Anatomic Footprint Targeting',
    patientTitle: 'Creating the Shin Bone Tunnel',
    surgeonDescription:
      'The ACL tibial footprint is debrided to expose the native attachment site in the anterior intercondylar area, centered just anterior to the tibial spine and medial to the lateral tibial spine. The Arthrex ACL Tibial Drill Guide is introduced through the AM portal and seated at the anatomic footprint center, with the guide set to 55° of inclination to produce a tunnel length of 35–45 mm. The guide pin is advanced under fluoroscopic and arthroscopic visualization; arthroscopic confirmation ensures the pin exits within the footprint boundaries and the trajectory is verified to clear the intercondylar roof at full extension (Howell impingement test). A cannulated reamer matching the measured graft diameter is advanced over the guide pin to create the tibial tunnel, and the tunnel aperture is chamfered with a rasp to remove sharp edges that could abrade the graft. The tibial tunnel length and diameter are documented for fixation device selection.',
    patientDescription:
      'Your surgeon drills a carefully angled tunnel through your shin bone using precise guides to make sure it exits exactly where the original ACL was attached. The tunnel\'s angle and position are critical — getting this right ensures your new ligament will sit and function just like the one you were born with.',
    instruments: [
      'Arthrex ACL Tibial Drill Guide (55° Aiming Device)',
      'Arthrex Guide Pin',
      'Cannulated Reamer (diameter-matched to graft)',
      'Tunnel Chamfer Rasp',
      'Arthrex 30° Arthroscope',
    ],
    focusStructures: ['tibia', 'acl', 'femur'],
  },
  {
    id: 'step-6',
    title: 'Femoral Tunnel Drilling',
    surgeonTitle: 'Femoral Tunnel Preparation — FlipCutter Retrograde Technique',
    patientTitle: 'Creating the Thigh Bone Tunnel',
    surgeonDescription:
      'Femoral tunnel preparation targets the anatomic ACL footprint on the posterolateral wall of the intercondylar notch, centered within the native AM and PL bundle origins. With the knee flexed to 120°, an accessory medial portal guide pin is advanced to the femoral footprint center — typically positioned at the 10:30 o\'clock position for the right knee, 1–2 mm anterior to the posterior cortex (resident\'s ridge). The Arthrex FlipCutter is introduced over the guide pin; once the pin exits the lateral femoral cortex, the FlipCutter blade is deployed to create a retrograde socket of defined depth (25–30 mm), preserving the lateral cortical bridge. This technique eliminates the need for a separate lateral extra-articular incision and allows precise socket depth control. For TightRope RT fixation, the lateral cortex is intentionally perforated by the guide pin, and the RetroButton is deployed through this aperture to engage the cortex after graft passage.',
    patientDescription:
      'A second tunnel is created in your thigh bone using a clever reversible drill called a FlipCutter that drills from the inside out, preserving more bone and avoiding an additional incision on the outside of your leg. Precise placement in the thigh bone is just as important as the shin bone tunnel — together they recreate the exact path your original ACL followed.',
    instruments: [
      'Arthrex FlipCutter (Retrograde Reamer)',
      'Arthrex RetroButton Drill Guide',
      'Arthrex ACL Femoral Aiming Device',
      'Cannulated Guide Pin',
      'Depth Gauge',
    ],
    focusStructures: ['femur', 'acl', 'tibia'],
  },
  {
    id: 'step-7',
    title: 'Graft Passage & Fixation',
    surgeonTitle: 'Graft Passage & Cortical Suspensory Fixation — Arthrex TightRope RT',
    patientTitle: 'Securing Your New Ligament',
    surgeonDescription:
      'A passing suture is shuttled through the tibial tunnel, up through the femoral socket, and out the lateral cortex using a Beath pin. The Arthrex ACL TightRope RT — a continuous-loop adjustable cortical fixation device composed of a high-strength FiberTape loop attached to an endobutton-style titanium RetroButton — is looped through the graft\'s femoral end whipstitch sutures and pulled retrograde into position. Once the RetroButton clears the lateral femoral cortex, it is flipped 90° under fluoroscopic confirmation to engage the cortex. The TightRope RT loop is then tensioned using the DogBone tensioning device to cinch the graft proximally into the femoral socket, eliminating toggle. On the tibial side, the graft is tensioned at 20–30 N with the knee cycled 20 times to pre-tension collagen fibers, then fixed at 20° of flexion using an Arthrex Bio-Tenodesis PEEK interference screw (diameter = tunnel diameter, length 23 mm) advanced over a guide wire. Knee range of motion is tested to confirm smooth graft excursion and the absence of flexion-extension impingement.',
    patientDescription:
      'Your new ligament is threaded through both tunnels and locked into place at the thigh bone end using a small titanium button (the TightRope RetroButton) that flips to grip the outer surface of the bone — no large hardware required. The shin bone end is secured with a small biocompatible screw that holds everything firmly while bone gradually grows into the graft over the coming months.',
    instruments: [
      'Arthrex ACL TightRope RT',
      'Arthrex RetroButton',
      'Arthrex DogBone Tensioning Device',
      'Arthrex Bio-Tenodesis PEEK Interference Screw',
      'Beath Pin (Passing Pin)',
      'Cannulated Screwdriver',
      'Graft Tensioning Boot',
    ],
    focusStructures: ['acl', 'femur', 'tibia'],
  },
  {
    id: 'step-8',
    title: 'Final Assessment & Closure',
    surgeonTitle: 'Final Arthroscopic Assessment, Fixation Confirmation & Wound Closure',
    patientTitle: 'Finishing Up & Looking Ahead',
    surgeonDescription:
      'Final arthroscopic inspection confirms satisfactory graft position, appropriate isometry through the range of motion, and absence of notch impingement at full extension and at 90° of flexion. A Lachman and anterior drawer test are performed under anesthesia to verify restoration of anterior tibial stability; residual anterior translation of ≤2 mm compared to the contralateral side is the benchmark. The pivot-shift is reassessed to confirm elimination of rotational instability. Fluoroscopy documents RetroButton cortical apposition and screw position. Portal sites are irrigated, a drain is placed at the surgeon\'s discretion, and the harvest incision is closed in layers with absorbable suture; skin is closed with subcuticular 3-0 Monocryl and Steri-Strips. A hinged knee brace locked in extension is applied, cryotherapy initiated, and the patient transferred to recovery with standardized postoperative rehabilitation protocol initiated at 24–48 hours.',
    patientDescription:
      'Before closing, your surgeon does a final check with the camera and manual tests to confirm your new ACL is stable and moving properly through the full range of motion. Your small incisions are carefully closed, a brace is fitted, and your rehabilitation team begins working with you within the first day or two — the real journey to full recovery starts right here.',
    instruments: [
      'Arthrex 30° Arthroscope',
      'Fluoroscopy (C-arm)',
      'Absorbable Suture (3-0 Monocryl)',
      'Hinged Knee Brace',
      'Cryotherapy Device',
    ],
    focusStructures: ['acl', 'femur', 'tibia', 'medial_meniscus', 'lateral_meniscus', 'articular_cartilage'],
  },
];
