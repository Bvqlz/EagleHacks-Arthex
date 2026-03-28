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
    id: 'step_01_diagnosis',
    title: 'Diagnosis & Examination',
    surgeonTitle: 'Pre-Operative Assessment & Surgical Planning',
    patientTitle: 'Understanding Your Knee Injury',
    surgeonDescription:
      'A thorough pre-operative evaluation is performed to confirm ACL rupture and identify concomitant pathology. Clinical examination includes the Lachman test (most sensitive for ACL integrity), anterior drawer test, and pivot-shift test to quantify rotational instability. Varus/valgus stress testing at 0° and 30° rules out collateral ligament involvement. MRI is reviewed to characterize the ACL tear (complete vs. partial, proximal vs. distal avulsion), assess meniscal integrity, identify chondral lesions, and evaluate for bone bruising patterns characteristic of ACL injury (lateral femoral condyle and posterolateral tibial plateau). Limb alignment and neurovascular status are documented. Surgical timing is planned after resolution of acute hemarthrosis and restoration of full range of motion to reduce the risk of post-operative arthrofibrosis.',
    patientDescription:
      'Before surgery, your surgeon will carefully examine your knee and review your MRI scans to fully understand the extent of your injury. They will perform specific hands-on tests — gently moving your shin bone in different directions — to confirm that your ACL is torn and check whether any other structures like the menisci or other ligaments are also damaged. This step is essential for planning the safest and most effective surgery for your specific injury. Most surgeons will wait until the initial swelling has settled and you have regained good movement in your knee before proceeding, usually 2–6 weeks after the injury.',
    instruments: [
      'MRI Imaging',
      'Lachman Test',
      'Anterior Drawer Test',
      'Pivot-Shift Test',
      'Valgus/Varus Stress Test',
      'Goniometer',
    ],
    focusStructures: ['acl', 'femur', 'tibia', 'medial_meniscus', 'lateral_meniscus'],
    cameraPosition: [0, 2, 6],
  },

  {
    id: 'step_02_anesthesia_portals',
    title: 'Anesthesia & Portal Placement',
    surgeonTitle: 'Anesthetic Induction & Arthroscopic Portal Establishment',
    patientTitle: 'Going to Sleep & Setting Up the Surgery',
    surgeonDescription:
      'The patient is positioned supine on a radiolucent operating table. General or spinal anesthesia is administered in coordination with the anesthesia team; a femoral nerve block or adductor canal block is added for post-operative analgesia. A thigh tourniquet is applied and inflated to 250–300 mmHg after limb exsanguination. The operative extremity is positioned in a leg holder with the knee at 90° of flexion to allow free hanging and facilitate portal access. Standard anterolateral (AL) and anteromedial (AM) portals are established under direct visualization. The AL portal is created just lateral to the patellar tendon at the joint line and serves as the primary viewing portal. The AM portal is placed just medial to the patellar tendon and is used as the primary working portal. An accessory AM portal may be established more medially to achieve the ideal femoral tunnel trajectory.',
    patientDescription:
      'Once you are in the operating room, the anesthesia team will administer medication so you are completely asleep and feel no pain. A nerve block may also be injected near your hip or thigh to provide hours of additional pain relief after surgery. Your leg will be positioned in a special holder to keep your knee at the right angle throughout the procedure. The surgeon will then make two or three small puncture wounds — called portals — around your kneecap, each less than a centimeter wide. These tiny openings are the doorways through which all surgical instruments and the camera will be inserted, meaning no large incisions are needed to access the inside of your knee.',
    instruments: [
      'Tourniquet',
      'Leg Holder',
      'No. 11 Scalpel Blade',
      'Trocar & Cannula',
      'Arthroscope (4mm, 30°)',
      'Spinal Needle',
      'Electrocautery',
    ],
    focusStructures: ['femur', 'tibia', 'patella', 'patellar_tendon'],
    cameraPosition: [0, 1, 7],
  },

  {
    id: 'step_03_diagnostic_arthroscopy',
    title: 'Diagnostic Arthroscopy',
    surgeonTitle: 'Systematic Arthroscopic Evaluation & Concurrent Pathology Management',
    patientTitle: 'Exploring the Inside of Your Knee',
    surgeonDescription:
      'A 4 mm, 30° arthroscope is introduced through the AL portal and a systematic examination of all knee compartments is performed under saline distension. The suprapatellar pouch, medial and lateral gutters, medial compartment (medial femoral condyle, medial tibial plateau, medial meniscus), intercondylar notch, and lateral compartment (lateral femoral condyle, lateral tibial plateau, lateral meniscus) are sequentially evaluated. ACL rupture is confirmed — the torn stump is probed to assess fiber continuity and any residual tissue suitable for augmentation is noted. Meniscal tears are identified and managed prior to ACL reconstruction: repairable tears (vascular zone, longitudinal pattern, stable reduction) are marked for repair; irreparable tears undergo partial meniscectomy using a motorized shaver and basket forceps. Chondral lesions are graded per the ICRS or Outerbridge classification. Notchplasty is performed if significant notch stenosis is present that would impinge the graft.',
    patientDescription:
      'With the camera now inside your knee, your surgeon methodically inspects every part of the joint — much like a guided tour of a small room. The live video feed allows them to directly see your torn ACL, assess the condition of both meniscal cushions, and check the smooth cartilage surfaces on the ends of your bones. If a meniscal tear is found that can be repaired, your surgeon will stitch it back together during this same surgery. Tears that are too damaged to repair are trimmed back to a smooth, stable edge. All of this work is done before the new ligament is placed, ensuring the joint is in the best possible condition to receive the graft.',
    instruments: [
      'Arthroscope (4mm, 30°)',
      'Arthroscopic Probe',
      'Motorized Shaver',
      'Basket Forceps',
      'Meniscal Repair Device',
      'Electrocautery Wand',
      'Saline Irrigation System',
    ],
    focusStructures: ['acl', 'medial_meniscus', 'lateral_meniscus', 'articular_cartilage', 'femur', 'tibia'],
    cameraPosition: [1, 0, 5],
  },

  {
    id: 'step_04_graft_harvest',
    title: 'Graft Harvesting',
    surgeonTitle: 'Autograft Harvest, Preparation & Sizing',
    patientTitle: 'Harvesting the Tendon Used to Replace Your ACL',
    surgeonDescription:
      'For bone-patellar tendon-bone (BPTB) autograft: a 3–4 cm longitudinal incision is made over the patellar tendon. The central third of the tendon (typically 10 mm wide) is harvested with 20–25 mm patellar and tibial bone plugs using an oscillating saw and osteotomes. Harvest sites are filled with bone graft or synthetic substitute. For hamstring autograft (semitendinosus ± gracilis): a 3 cm oblique incision is made over the pes anserinus. The tendons are harvested using a closed tendon stripper, freed of muscle attachments, and doubled or quadrupled. Graft diameter is measured using sizing tubes (typically 8–10 mm). The graft is then prepared on the back table: whipstitch sutures (FiberWire or equivalent) are placed in both ends for tensioning and fixation, bone plugs are shaped to fit the tunnels, and overall graft length is measured to ensure it spans both tunnels with adequate intra-tunnel length for fixation.',
    patientDescription:
      'Since your torn ACL cannot simply be stitched back together, your surgeon needs a replacement tendon to rebuild it. The most common source is your own body — either the middle portion of the patellar tendon (below your kneecap, taken with small bone plugs from each end) or one or two of the hamstring tendons from the back of your thigh. A small 3–4 cm incision is made to access and remove the chosen tendon. Using your own tissue is preferred because it integrates naturally into the bone over time. Once removed, the graft is carefully measured, trimmed, and prepared on a separate table — strong sutures are woven through each end to allow the surgeon to pull and secure it in place during the next stages.',
    instruments: [
      'No. 15 Scalpel Blade',
      'Oscillating Saw',
      'Osteotome & Mallet',
      'Closed Tendon Stripper',
      'Graft Sizing Tubes',
      'Whipstitch Sutures (FiberWire)',
      'Graft Preparation Board',
      'Bone Rongeur',
    ],
    focusStructures: ['patellar_tendon', 'patella', 'tibia'],
    cameraPosition: [0, -1, 6],
  },

  {
    id: 'step_05_tibial_tunnel',
    title: 'Tibial Tunnel Drilling',
    surgeonTitle: 'Tibial Tunnel Creation & Positioning',
    patientTitle: 'Creating the Tunnel in Your Shin Bone',
    surgeonDescription:
      'Precise tibial tunnel placement is critical to restoring native ACL kinematics. The tibial ACL footprint center is identified arthroscopically — located approximately at the junction of the anterior and middle thirds of the tibial plateau, between the tibial spines, using the anterior horn of the lateral meniscus and PCL as landmarks. A tibial tunnel guide (typically set to 55° from the joint line) is positioned through the AM portal with the tip at the center of the native ACL footprint. A guide pin is drilled from the anteromedial tibial cortex to the target point. Correct positioning is confirmed arthroscopically and fluoroscopically in AP and lateral planes. The tunnel is then sequentially reamed over the guide pin to match the graft diameter (typically 8–10 mm). The tunnel edges are chamfered and smoothed with a rasp to prevent graft abrasion. Saline irrigation clears bone debris.',
    patientDescription:
      'Your new ligament needs a tunnel drilled through the shin bone to anchor it in the correct position. Using the arthroscope for guidance, your surgeon places a specialized drill guide through one of the small portals to precisely target the exact spot where your original ACL attached to the tibia. A guide wire is first drilled through from the front of your shin to that internal target point, and its position is confirmed on live X-ray. A larger drill is then passed over the wire to create a tunnel just wide enough to accept your prepared graft. This tunnel becomes the lower anchor point for your new ligament.',
    instruments: [
      'Tibial Tunnel Guide',
      'Guide Pin (Nitinol)',
      'Cannulated Reamer',
      'Fluoroscope (C-Arm)',
      'Curette',
      'Tunnel Rasp',
      'Saline Irrigation',
    ],
    focusStructures: ['tibia', 'acl', 'medial_meniscus', 'lateral_meniscus'],
    cameraPosition: [-1, -2, 5],
  },

  {
    id: 'step_06_femoral_tunnel',
    title: 'Femoral Tunnel Drilling',
    surgeonTitle: 'Femoral Tunnel Creation via Anteromedial Portal Technique',
    patientTitle: 'Creating the Tunnel in Your Thigh Bone',
    surgeonDescription:
      "Anatomic femoral tunnel placement is the most technically demanding aspect of ACL reconstruction. The center of the native ACL femoral footprint is identified at the resident's ridge on the posterolateral wall of the intercondylar notch, at approximately the 10 o'clock position (right knee) or 2 o'clock position (left knee). The anteromedial portal technique allows independent femoral tunnel drilling with the knee hyperflexed to 120°, enabling a more posterior and anatomic tunnel position compared to the transtibial technique. A guide pin is drilled through the accessory AM portal into the center of the femoral footprint, leaving at least a 2 mm posterior wall to prevent blowout. Tunnel depth is typically 30–35 mm, reamed to match graft diameter. Position is confirmed arthroscopically and fluoroscopically. The tunnel aperture is smoothed with a rasp and flexible reamer.",
    patientDescription:
      'A second tunnel is now drilled through the thigh bone — this will be the upper anchor for your new ACL. Getting this tunnel in exactly the right spot is the most technically precise part of the surgery, as it largely determines how closely your rebuilt ligament will replicate the function of your natural one. With your knee bent to a greater angle, your surgeon drills through one of the small portal incisions into the precise location on the inner wall of the thigh bone where your original ACL was attached. The depth and angle of this tunnel are carefully measured to ensure the graft will sit and function just like your original ligament.',
    instruments: [
      'Femoral Aimer / Offset Guide',
      'Guide Pin (Nitinol)',
      'Flexible Cannulated Reamer',
      'Depth Gauge',
      'Fluoroscope (C-Arm)',
      'Arthroscopic Probe',
      'Tunnel Rasp',
    ],
    focusStructures: ['femur', 'acl', 'articular_cartilage'],
    cameraPosition: [1, 2, 4],
  },

  {
    id: 'step_07_graft_passage_fixation',
    title: 'Graft Passage & Fixation',
    surgeonTitle: 'Graft Passage, Tensioning & Bi-Cortical Fixation',
    patientTitle: 'Placing and Securing Your New Ligament',
    surgeonDescription:
      'A passing suture or looped wire is shuttled through the femoral tunnel and retrieved out the tibial tunnel. The graft sutures are loaded onto the passing device and the graft is drawn proximally through the tibial tunnel and into the femoral tunnel under arthroscopic visualization, confirming full seating of the bone plug or the cortical fixation button at the femoral aperture. Femoral fixation is achieved first: for BPTB grafts, an interference screw (titanium or bioabsorbable, sized to match tunnel diameter) is advanced alongside the bone plug; for soft-tissue grafts, an adjustable cortical button (e.g., Endobutton) is flipped on the far cortex and tensioned. The knee is then cycled through 20–25 flexion-extension cycles to eliminate graft creep and pre-tension the collagen fibers. With the knee at 20–30° of flexion and an anterior drawer force applied to the tibia, tibial fixation is performed using an interference screw or staple construct. Graft tension, isometry, and impingement-free ROM are confirmed arthroscopically.',
    patientDescription:
      'With both tunnels prepared, it is now time to pull the new graft into position and lock it in place. A thin wire is threaded through both tunnels to act as a guide rope, and your surgeon uses it to carefully draw the prepared tendon graft up through the shin bone tunnel and into the thigh bone tunnel, watching every millimeter of progress on the arthroscopic camera. Once the graft is fully seated, it is secured inside the femoral tunnel first — usually with a small screw or a button device that flips and locks against the outer surface of the bone. Your knee is then bent and straightened repeatedly to settle the graft, and it is finally locked in the tibia tunnel with another screw at just the right tension. The result is a new ligament held firmly in both bones.',
    instruments: [
      'Graft Passing Wire / Suture Lasso',
      'Interference Screw Driver',
      'Titanium / Bioabsorbable Interference Screws',
      'Adjustable Cortical Button (Endobutton)',
      'Torque-Limiting Screwdriver',
      'Tensioning Boot',
      'Arthroscope (4mm, 30°)',
      'Probe',
    ],
    focusStructures: ['acl', 'femur', 'tibia'],
    cameraPosition: [0, 0, 4],
  },

  {
    id: 'step_08_assessment_closure',
    title: 'Final Assessment & Closure',
    surgeonTitle: 'Final Arthroscopic Assessment, Wound Closure & Post-Operative Protocol',
    patientTitle: 'Final Checks, Wound Closure & Your Recovery Plan',
    surgeonDescription:
      'A final systematic arthroscopic survey confirms graft position, adequate tunnel fill, absence of notch impingement through full ROM (0–130°), and meniscal repair integrity. The Lachman and pivot-shift maneuvers are repeated under anesthesia to confirm restoration of stability compared to the contralateral limb. Any residual bleeding is addressed with electrocautery and the joint is thoroughly irrigated. The tourniquet is deflated and hemostasis confirmed. Portal wounds are closed with absorbable subcuticular sutures or Steri-Strips. The harvest site incision (if applicable) is closed in layers — deep fascia with 0-Vicryl, subcutaneous tissue with 2-0 Vicryl, and skin with 3-0 Monocryl or staples. A compressive dressing and cold therapy device (cryotherapy cuff) are applied. The leg is placed in a hinged knee brace locked in extension for transfer. Post-operative orders include DVT prophylaxis, multimodal analgesia, and immediate weight-bearing as tolerated with crutches. Physiotherapy commences within 24–48 hours focusing on quad activation, swelling management, and range of motion.',
    patientDescription:
      'Before closing, your surgeon takes one final look through the camera to confirm everything is in order — the new ligament is sitting perfectly without catching on any bone during movement, and any meniscal repairs are intact. Stability tests are repeated while you are still asleep to verify the knee is solid. The saline used to inflate the joint is drained, and all instruments are removed. The small portal punctures are closed with a stitch or small adhesive strips, and the tendon harvest incision is carefully closed in multiple layers. A bandage and a cold therapy wrap are applied to your knee to manage swelling, and your leg is placed in a hinged brace. You will be encouraged to begin gentle exercises within the first day or two, and your rehabilitation journey — which is just as important as the surgery itself — begins right away.',
    instruments: [
      'Arthroscope (4mm, 30°)',
      'Electrocautery Wand',
      'Saline Irrigation System',
      'Absorbable Sutures (Vicryl, Monocryl)',
      'Needle Driver & Forceps',
      'Compressive Bandage',
      'Cryotherapy Cuff',
      'Hinged Knee Brace',
    ],
    focusStructures: ['acl', 'femur', 'tibia', 'medial_meniscus', 'lateral_meniscus', 'articular_cartilage'],
    cameraPosition: [0, 1, 6],
  },
];
