const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hospitalsData = [
  {
    "name": "Doon Medical College & Hospital",
    "district": "Dehradun",
    "subdistrict": "Dehradun",
    "latitude": 30.3244,
    "longitude": 78.0416,
    "phone": "0135-2726020",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Amit Sharma", "experience": 12, "qualification": "MD Medicine" },
          { "name": "Dr. Neha Verma", "experience": 8, "qualification": "MBBS, MD" }
        ],
        "services": [
          { "name": "OPD Consultation (Gen. Med.)", "charge": 50 },
          { "name": "Follow-up Visit (Gen. Med.)", "charge": 20 }
        ]
      },
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Rajesh Singh", "experience": 10, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Bone Consultation", "charge": 60 },
          { "name": "Fracture Checkup", "charge": 80 }
        ]
      },
      {
        "name": "Pediatrics",
        "doctors": [
          { "name": "Dr. Pooja Joshi", "experience": 7, "qualification": "MD Pediatrics" }
        ],
        "services": [
          { "name": "Child Specialist OPD", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Haridwar",
    "district": "Haridwar",
    "subdistrict": "Haridwar",
    "latitude": 29.9457,
    "longitude": 78.1642,
    "phone": "01334-226222",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Sandeep Kumar", "experience": 9, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 30 }
        ]
      },
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Ritu Saxena", "experience": 11, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Women's Health OPD", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "Civil Hospital Roorkee",
    "district": "Haridwar",
    "subdistrict": "Roorkee",
    "latitude": 29.8660,
    "longitude": 77.8920,
    "phone": "01332-265111",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Vivek Chauhan", "experience": 6, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Joint Pain Consultation", "charge": 50 }
        ]
      }
    ]
  },
  {
    "name": "Base Hospital Haldwani",
    "district": "Nainital",
    "subdistrict": "Haldwani",
    "latitude": 29.2183,
    "longitude": 79.5130,
    "phone": "05946-234415",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Cardiology",
        "doctors": [
          { "name": "Dr. Anil Pandey", "experience": 14, "qualification": "DM Cardiology" }
        ],
        "services": [
          { "name": "Heart Checkup", "charge": 100 }
        ]
      },
      {
        "name": "Neurology",
        "doctors": [
          { "name": "Dr. Kavita Rawat", "experience": 10, "qualification": "DM Neurology" }
        ],
        "services": [
          { "name": "Neuro Consultation", "charge": 120 }
        ]
      }
    ]
  },
  {
    "name": "Sushila Tiwari Government Hospital",
    "district": "Nainital",
    "subdistrict": "Haldwani",
    "latitude": 29.2155,
    "longitude": 79.5085,
    "phone": "05946-282828",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Deepak Bisht", "experience": 8, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 50 }
        ]
      },
      {
        "name": "Emergency",
        "doctors": [
          { "name": "Dr. Manoj Negi", "experience": 9, "qualification": "MBBS, Emergency Care" }
        ],
        "services": [
          { "name": "Emergency Care", "charge": 0 }
        ]
      }
    ]
  },
  {
    "name": "JLN District Hospital Rudrapur",
    "district": "Udham Singh Nagar",
    "subdistrict": "Rudrapur",
    "latitude": 28.9800,
    "longitude": 79.4000,
    "phone": "05944-242333",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Pediatrics",
        "doctors": [
          { "name": "Dr. Meena Bora", "experience": 6, "qualification": "MD Pediatrics" }
        ],
        "services": [
          { "name": "Child OPD", "charge": 30 }
        ]
      }
    ]
  },
  {
    "name": "Base Hospital Srinagar",
    "district": "Pauri Garhwal",
    "subdistrict": "Srinagar",
    "latitude": 30.2227,
    "longitude": 78.7844,
    "phone": "01346-252111",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Shalini Rawat", "experience": 10, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Pregnancy Checkup", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Almora",
    "district": "Almora",
    "subdistrict": "Almora",
    "latitude": 29.6050,
    "longitude": 79.6600,
    "phone": "05962-230111",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Mohit Tiwari", "experience": 7, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 30 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Pithoragarh",
    "district": "Pithoragarh",
    "subdistrict": "Pithoragarh",
    "latitude": 29.5828,
    "longitude": 80.2182,
    "phone": "05964-225222",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Ajay Karki", "experience": 9, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Fracture Treatment", "charge": 60 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Champawat",
    "district": "Champawat",
    "subdistrict": "Champawat",
    "latitude": 29.3364,
    "longitude": 80.0911,
    "phone": "05967-222333",
    "emergencyServices": true,
    "departments": [
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Sunita Joshi", "experience": 8, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Women's Health OPD", "charge": 30 }
        ]
      }
    ]
  },
  {
    "name": "CHC / PHC Dwarahat",
    "district": "Almora",
    "subdistrict": "Dwarahat",
    "latitude": 29.7820,
    "longitude": 79.4310,
    "phone": "05966-244222",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Ramesh Chandra", "experience": 7, "qualification": "MBBS, Medical Officer" },
          { "name": "Dr. Preeti Bisht", "experience": 5, "qualification": "MBBS, Medical Officer" }
        ],
        "services": [
          { "name": "OPD Consultation & First Aid", "charge": 10 },
          { "name": "General Health Checkup", "charge": 10 }
        ]
      },
      {
        "name": "Pediatrics",
        "doctors": [
          { "name": "Dr. Harish Pandey", "experience": 6, "qualification": "MBBS, DCH" }
        ],
        "services": [
          { "name": "Immunization & Child OPD", "charge": 10 }
        ]
      },
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Manisha Negi", "experience": 8, "qualification": "MBBS, DGO" }
        ],
        "services": [
          { "name": "Maternal & Antenatal Care (ANC)", "charge": 10 }
        ]
      }
    ]
  },
  {
    "name": "CHC Chaukhutiya",
    "district": "Almora",
    "subdistrict": "Chaukhutiya",
    "latitude": 29.8700,
    "longitude": 79.3500,
    "phone": "05966-248108",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Virendra Rawat", "experience": 9, "qualification": "MBBS, MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 10 },
          { "name": "Emergency & Trauma Care", "charge": 0 }
        ]
      },
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Anjali Bhatt", "experience": 6, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Delivery & Maternal Care", "charge": 10 }
        ]
      }
    ]
  },
  {
    "name": "PHC Someshwar",
    "district": "Almora",
    "subdistrict": "Someshwar",
    "latitude": 29.7780,
    "longitude": 79.6000,
    "phone": "05962-243100",
    "emergencyServices": false,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Kamal Arya", "experience": 5, "qualification": "MBBS, Medical Officer" }
        ],
        "services": [
          { "name": "Primary OPD & Immunization", "charge": 10 }
        ]
      }
    ]
  },
  {
    "name": "Govind Singh Mahara CHC Ranikhet",
    "district": "Almora",
    "subdistrict": "Ranikhet",
    "latitude": 29.6430,
    "longitude": 79.4320,
    "phone": "05966-220555",
    "emergencyServices": true,
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Narendra Mehra", "experience": 11, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 20 }
        ]
      },
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Bhupendra Singh", "experience": 8, "qualification": "MS Ortho" }
        ],
        "services": [
          { "name": "Bone & Joint Care", "charge": 30 }
        ]
      }
    ]
  }
];

async function main() {
  console.log("Cleaning up existing data...");
  // Use a transaction to clear everything
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.timeSlot.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.service.deleteMany(),
    prisma.hospital.deleteMany(),
  ]);
  console.log("Cleanup complete.");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  for (const hData of hospitalsData) {
    console.log(`Creating hospital: ${hData.name}`);
    
    const hospital = await prisma.hospital.create({
      data: {
        name: hData.name,
        address: hData.subdistrict,
        city: hData.district,
        latitude: hData.latitude,
        longitude: hData.longitude,
        phone: hData.phone,
        emergencyServices: hData.emergencyServices,
        isGovernment: true,
        status: "APPROVED",
      }
    });

    for (const dept of hData.departments) {
      // Create Services (Departments/Procedures)
      for (const serviceData of dept.services) {
        await prisma.service.create({
          data: {
            name: `${dept.name} - ${serviceData.name}`,
            price: serviceData.charge * 100, // Charge in paise
            hospitalId: hospital.id,
          }
        });
      }

      // Create Doctors
      for (const docData of dept.doctors) {
        const doctor = await prisma.doctor.create({
          data: {
            name: docData.name,
            specialty: dept.name, // Use department as specialty
            hospitalId: hospital.id,
          }
        });

        // Create Time Slots for today and tomorrow for each doctor
        const timeSlots = [];
        const dates = [today, tomorrow];
        
        for (const date of dates) {
          for (let hour = 9; hour < 17; hour++) {
            const start = new Date(date);
            start.setUTCHours(hour, 0, 0, 0);
            const end = new Date(date);
            end.setUTCHours(hour, 30, 0, 0);

            timeSlots.push({
              hospitalId: hospital.id,
              doctorId: doctor.id,
              startTime: start,
              endTime: end,
              isBooked: false,
            });

            const start2 = new Date(date);
            start2.setUTCHours(hour, 30, 0, 0);
            const end2 = new Date(date);
            end2.setUTCHours(hour + 1, 0, 0, 0);

            timeSlots.push({
              hospitalId: hospital.id,
              doctorId: doctor.id,
              startTime: start2,
              endTime: end2,
              isBooked: false,
            });
          }
        }

        await prisma.timeSlot.createMany({
          data: timeSlots,
        });
      }
    }
  }

  console.log("Seeding complete successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
