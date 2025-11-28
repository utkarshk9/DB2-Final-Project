CREATE TABLE public.Patient History (
  history_id integer NOT NULL DEFAULT nextval('"Patient History_history_id_seq"'::regclass),
  history text,
  date date NOT NULL,
  patient_id integer NOT NULL,
  CONSTRAINT Patient History_pkey PRIMARY KEY (history_id),
  CONSTRAINT Patient History_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id)
);
CREATE TABLE public.appointments (
  appointment_id integer NOT NULL DEFAULT nextval('"Appointment_appointment_id_seq"'::regclass),
  visit_type character varying,
  status character varying,
  patient_id integer NOT NULL,
  room_id integer NOT NULL,
  CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id),
  CONSTRAINT Appointment_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id),
  CONSTRAINT Appointment_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id)
);
CREATE TABLE public.billing (
  billing_id integer NOT NULL DEFAULT nextval('"Billing_billing_id_seq"'::regclass),
  amount numeric NOT NULL,
  payment_method character varying NOT NULL,
  payment_status character varying NOT NULL,
  appointment_id integer NOT NULL,
  CONSTRAINT billing_pkey PRIMARY KEY (billing_id),
  CONSTRAINT Billing_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id)
);
CREATE TABLE public.coverage_plan (
  coverage_code integer NOT NULL DEFAULT nextval('"Coverage Plan_coverage_code_seq"'::regclass),
  type character varying NOT NULL,
  provider character varying NOT NULL,
  description text,
  copay numeric,
  policy_number integer NOT NULL,
  policy_expiry date NOT NULL,
  CONSTRAINT coverage_plan_pkey PRIMARY KEY (coverage_code)
);
CREATE TABLE public.daily_schedule (
  appointment_id integer NOT NULL,
  staff_id integer NOT NULL,
  time time without time zone NOT NULL,
  CONSTRAINT daily_schedule_pkey PRIMARY KEY (appointment_id, staff_id),
  CONSTRAINT Daily Schedule_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT Daily Schedule_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id)
);
CREATE TABLE public.delivery_record (
  delivery_id integer NOT NULL DEFAULT nextval('"Delivery Record_delivery_id_seq"'::regclass),
  notes text,
  room_id integer NOT NULL,
  timestamp timestamp with time zone NOT NULL,
  CONSTRAINT delivery_record_pkey PRIMARY KEY (delivery_id),
  CONSTRAINT Delivery Record_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id)
);
CREATE TABLE public.diagnosis (
  diagnosis_id integer NOT NULL DEFAULT nextval('"Diagnosis_diagnosis_id_seq"'::regclass),
  description text NOT NULL,
  treatment_plan character varying NOT NULL,
  notes text,
  CONSTRAINT diagnosis_pkey PRIMARY KEY (diagnosis_id)
);
CREATE TABLE public.diagnosis_item (
  diagnosis_id integer NOT NULL,
  appointment_id integer NOT NULL,
  CONSTRAINT diagnosis_item_pkey PRIMARY KEY (diagnosis_id, appointment_id),
  CONSTRAINT Diagnosis Item_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id),
  CONSTRAINT Diagnosis Item_diagnosis_id_fkey FOREIGN KEY (diagnosis_id) REFERENCES public.diagnosis(diagnosis_id)
);
CREATE TABLE public.drug (
  din_id integer NOT NULL DEFAULT nextval('"Drug_din_id_seq"'::regclass),
  drug_name character varying,
  CONSTRAINT drug_pkey PRIMARY KEY (din_id)
);
CREATE TABLE public.invoice (
  invoice_id integer NOT NULL DEFAULT nextval('"Invoice_invoice_id_seq"'::regclass),
  issue_date date NOT NULL,
  billing_id integer NOT NULL,
  CONSTRAINT invoice_pkey PRIMARY KEY (invoice_id),
  CONSTRAINT Invoice_billing_id_fkey FOREIGN KEY (billing_id) REFERENCES public.billing(billing_id)
);
CREATE TABLE public.lab_log (
  lab_log_id integer NOT NULL DEFAULT nextval('"Lab Log_lab_log_id_seq"'::regclass),
  lab_log_date date NOT NULL,
  lab_order_id integer NOT NULL,
  CONSTRAINT lab_log_pkey PRIMARY KEY (lab_log_id),
  CONSTRAINT Lab Log_lab_order_id_fkey FOREIGN KEY (lab_order_id) REFERENCES public.lab_test(lab_order_id)
);
CREATE TABLE public.lab_test (
  lab_order_id integer NOT NULL DEFAULT nextval('"Lab Test_lab_order_id_seq"'::regclass),
  test_name character varying NOT NULL,
  result character varying NOT NULL,
  notes text,
  timestamp time without time zone NOT NULL,
  appointment_id integer NOT NULL,
  CONSTRAINT lab_test_pkey PRIMARY KEY (lab_order_id),
  CONSTRAINT Lab Test_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id)
);
CREATE TABLE public.patient (
  patient_id integer NOT NULL DEFAULT nextval('"Patient_patient_id_seq"'::regclass),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  date_of_birth date NOT NULL,
  phone_number bigint,
  street_number integer,
  street_name character varying,
  city character varying,
  country character varying,
  postal_code character varying,
  time_in time without time zone,
  time_out time without time zone,
  insurance_info text,
  patient_history text,
  CONSTRAINT patient_pkey PRIMARY KEY (patient_id)
);
CREATE TABLE public.patient_coverage (
  patient_id integer NOT NULL,
  coverage_code integer NOT NULL,
  CONSTRAINT patient_coverage_pkey PRIMARY KEY (patient_id, coverage_code),
  CONSTRAINT Patient Coverage_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id),
  CONSTRAINT Patient Coverage_coverage_code_fkey FOREIGN KEY (coverage_code) REFERENCES public.coverage_plan(coverage_code)
);
CREATE TABLE public.prescription (
  prescription_id integer NOT NULL DEFAULT nextval('"Prescription_prescription_id_seq"'::regclass),
  issued_date date NOT NULL,
  appointment_id integer NOT NULL,
  CONSTRAINT prescription_pkey PRIMARY KEY (prescription_id),
  CONSTRAINT Prescription_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id)
);
CREATE TABLE public.prescription_item (
  din_id integer NOT NULL,
  prescription_id integer NOT NULL,
  quantity integer NOT NULL,
  dosage_instructions text,
  CONSTRAINT prescription_item_pkey PRIMARY KEY (din_id, prescription_id),
  CONSTRAINT Prescription Item_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id),
  CONSTRAINT Prescription Item_din_id_fkey FOREIGN KEY (din_id) REFERENCES public.drug(din_id)
);
CREATE TABLE public.recovery_room_entry (
  recovery_id integer NOT NULL DEFAULT nextval('"Recovery Room Entry_recovery_id_seq"'::regclass),
  admit_timestamp time without time zone NOT NULL,
  discharge_timestamp time without time zone NOT NULL,
  notes text,
  room_id integer NOT NULL,
  staff_id integer NOT NULL,
  CONSTRAINT recovery_room_entry_pkey PRIMARY KEY (recovery_id),
  CONSTRAINT Recovery Room Entry_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id),
  CONSTRAINT Recovery Room Entry_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id)
);
CREATE TABLE public.recovery_room_observation (
  observation_id integer NOT NULL DEFAULT nextval('"Recovery Room Observation_observation_id_seq"'::regclass),
  observation_timestamp time without time zone NOT NULL,
  notes text,
  recovery_id integer NOT NULL,
  CONSTRAINT recovery_room_observation_pkey PRIMARY KEY (observation_id),
  CONSTRAINT Recovery Room Observation_recovery_id_fkey FOREIGN KEY (recovery_id) REFERENCES public.recovery_room_entry(recovery_id)
);
CREATE TABLE public.room (
  room_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  room_number integer,
  room_type_id integer NOT NULL,
  CONSTRAINT room_pkey PRIMARY KEY (room_id),
  CONSTRAINT Room_room_type_id_fkey FOREIGN KEY (room_type_id) REFERENCES public.room_type(room_type_id)
);
CREATE TABLE public.room_type (
  room_type_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  description text,
  CONSTRAINT room_type_pkey PRIMARY KEY (room_type_id)
);
CREATE TABLE public.staff (
  staff_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  role character varying,
  specialization text,
  CONSTRAINT staff_pkey PRIMARY KEY (staff_id)
);
CREATE TABLE public.weekly_staff_calendar (
  calendar_id integer NOT NULL DEFAULT nextval('"Weekly Staff Calendar_calendar_id_seq"'::regclass),
  week_start date NOT NULL,
  week_end date NOT NULL,
  on_call boolean DEFAULT false,
  staff_id integer NOT NULL,
  CONSTRAINT weekly_staff_calendar_pkey PRIMARY KEY (calendar_id),
  CONSTRAINT Weekly Staff Calendar_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id)
);

------------------------------------------------------------
-- Resetting everything just in case. 
------------------------------------------------------------
TRUNCATE TABLE
    appointments,
    billing,
    coverage_plan,
    daily_schedule,
    delivery_record,
    diagnosis,
    diagnosis_item,
    drug,
    invoice,
    lab_log,
    lab_test,
    patient,
    patient_coverage,
    "Patient History",
    prescription,
    prescription_item,
    recovery_room_entry,
    recovery_room_observation,
    room,
    room_type,
    staff,
    weekly_staff_calendar
RESTART IDENTITY CASCADE;

------------------------------------------------------------
-- ROOMS / ROOM TYPES
------------------------------------------------------------
INSERT INTO room_type (description) VALUES
('Examination Room'),          
('Surgery / Procedure Room'),  
('Delivery Room'),             
('Recovery Room'),             
('Lab'),                       
('Pharmacy'),                  
('Office');                    

INSERT INTO room (room_number, room_type_id) VALUES
(101,1),(102,1),(103,1),(104,1),(105,1),
(106,1),(107,1),(108,1),(109,1),(110,1),
(111,1),(112,1),(113,1),(114,1),(115,1),
(201,2),(301,3),(401,4),(501,5),(601,6);

------------------------------------------------------------
-- STAFF 
------------------------------------------------------------
INSERT INTO staff (first_name, last_name, role, specialization) VALUES
('Emily','Chan','Physician','Family Medicine'),
('Marcus','Reid','Physician','Internal Medicine'),
('Sarah','Nguyen','Physician','Pediatrics'),
('Daniel','Khan','Physician','General Practice'),
('Priya','Patel','Physician','Women''s Health'),
('Olivia','Stone','Nurse Practitioner','Primary Care'),
('Liam','Grant','Nurse Practitioner','Primary Care'),
('Hannah','Lopez','Registered Nurse','Immunizations & Vaccines'),
('James','Olsen','Registered Nurse','Treatment Room'),
('Chloe','Mitchell','Midwife','Prenatal & Delivery'),
('Laura','Bennett','Midwife','Prenatal & Delivery'),
('Victor','Lopez','Pharmacist','Community Pharmacy'),
('Ethan','Foster','Medical Technician','Diagnostics & Lab'),
('Jade','Morgan','Office Administrator',NULL),
('Aisha','Rahman','Receptionist',NULL),
('Owen','Clark','Bookkeeper','Part-time');

------------------------------------------------------------
-- PATIENTS
------------------------------------------------------------
INSERT INTO patient
(first_name,last_name,date_of_birth,phone_number,
 street_number,street_name,city,country,postal_code,
 time_in,time_out,insurance_info,patient_history)
VALUES
('Emily','Tran','1990-04-12',4035511201,12,'Maple St','Calgary','Canada','T2A1B3','09:00','09:45','Aetna Basic','Annual checkup'),
('Marcus','Reid','1985-09-23',4035551202,88,'Oak Dr','Calgary','Canada','T2B2C2','10:00','10:20','BlueCross Premium','Follow-up hypertension'),
('Sarah','Nguyen','2018-12-24',4035551203,54,'River Rd','Calgary','Canada','T2C3D4','11:00','11:30','Alberta Health Only','Pediatric vaccinations'),
('Daniel','Khan','1978-03-10',4035551204,72,'Pine Ave','Calgary','Canada','T2E5F6','09:15','09:45','Manulife Gold','Type 2 diabetes'),
('Priya','Patel','1995-08-21',4035551205,110,'Cedar Blvd','Calgary','Canada','T2G7H1','14:00','14:20','SunLife Silver','Women''s health visit'),
('Olivia','Stone','1989-06-23',4035551206,23,'Birch Pl','Calgary','Canada','T2H6J2','13:00','13:30','Employer Plan Bronze','Asthma follow-up'),
('James','Olsen','1991-03-15',4035551207,45,'Elm St','Calgary','Canada','T2J9L3','11:00','11:15','BlueCross Basic','Back pain'),
('Hannah','Kim','1987-08-19',4035551208,89,'Arbour Rd','Calgary','Canada','T2M1A8','15:00','15:30','Self-Pay','Anxiety, no prior history'),
('Victor','Lopez','1993-01-05',4035551209,61,'Spruce Dr','Calgary','Canada','T2N7Q4','10:00','10:30','Manulife Gold','Hyperlipidemia'),
('Laura','Bennett','1994-06-28',4035551210,80,'Willow Ln','Calgary','Canada','T2P3S7','09:30','09:45','Aetna Basic','Hypothyroidism'),
('Chloe','Mitchell','1996-10-30',4035551211,72,'Poplar Pl','Calgary','Canada','T2R5V1','14:00','14:20','Private Maternity Plan','Prenatal care'),
('Nora','Singh','1988-07-14',4035551212,18,'Beech St','Calgary','Canada','T2S3H1','13:00','13:30','Alberta Health Only','Migraine'),
('Leo','Wright','1999-09-09',4035551213,15,'16 Ave NW','Calgary','Canada','T2A8K2','12:00','12:20','Student Health Plan','Upper respiratory infection'),
('Isla','Parker','1986-12-01',4035551214,33,'Southland Dr','Calgary','Canada','T2C5B1','09:45','10:00','Employer Plan Silver','GERD'),
('Aria','Woods','1992-03-22',4035551215,99,'Centre St N','Calgary','Canada','T2B9H9','08:30','09:00','BlueCross Premium','Annual physical'),
('Mason','Hill','1985-11-23',4035551216,20,'7 Ave SE','Calgary','Canada','T2N8T4','10:00','10:30','Self-Pay','Acute low back strain'),
('Ella','Grant','1990-01-02',4035551217,47,'10 St NW','Calgary','Canada','T2G1P1','14:30','14:45','SunLife Silver','Thyroid follow-up'),
('Nova','Carson','1997-02-17',4035551218,8,'Briar Hill Rd','Calgary','Canada','T2L9J2','13:00','13:20','Student Health Plan','Asthma review'),
('Ethan','Jones','1984-05-13',4035551219,112,'Sage Hill Dr','Calgary','Canada','T3R1K7','15:00','15:30','Employer Plan Bronze','Hypertension'),
('Ruby','Knight','1993-09-16',4035551220,67,'Harvest Hills Blvd','Calgary','Canada','T3K2M8','16:00','16:20','Self-Pay','Dental infection');

------------------------------------------------------------
-- 4. COVERAGE PLANS + PATIENT-COVERAGE
------------------------------------------------------------
INSERT INTO coverage_plan (type, provider, description, copay, policy_number, policy_expiry) VALUES
('Government', 'Alberta Health Care Insurance Plan', 'Provincial base coverage (physician services, hospital)',       0,   100001, '2026-12-31'),
('Private',    'BlueCross',                           'BlueCross Premium – low copay, broad drug coverage',          10,  200101, '2026-06-30'),
('Private',    'BlueCross',                           'BlueCross Basic – higher copay, limited drugs',               30,  200102, '2025-12-31'),
('Private',    'Manulife',                            'Manulife Gold – comprehensive extended health & dental',      10,  210201, '2026-11-30'),
('Private',    'Manulife',                            'Manulife Flex – mid-tier family coverage',                    20,  210202, '2026-05-31'),
('Private',    'SunLife',                             'SunLife Silver – employer extended health',                   20,  220301, '2026-04-30'),
('Private',    'Aetna',                               'Aetna Basic – standard group benefits',                       25,  230401, '2025-10-31'),
('Private',    'CampusCare',                          'Student Health Plan – prescriptions and limited physio',      15,  240501, '2025-08-31'),
('Private',    'Private Maternity Ins.',              'Maternity package – prenatal & delivery fees',                15,  250601, '2026-02-28'),
('Self-Pay',   'Self-Pay',                            'No third-party coverage; patient pays full amount',          100,  900000, '2099-12-31');

INSERT INTO patient_coverage (patient_id, coverage_code) VALUES
(1, 7),
(2, 2),
(3, 1),
(4, 4),
(5, 6),
(6, 7),
(7, 3),
(8,10),
(9, 4),
(10,7),
(11,9),
(12,1),
(13,8),
(14,6),
(15,2),
(16,10),
(17,6),
(18,8),
(19,5),
(20,10);

------------------------------------------------------------
--  APPOINTMENTS 
------------------------------------------------------------
INSERT INTO appointments (visit_type, status, patient_id, room_id) VALUES
('Consult',       'completed',  1,  1),  
('Follow-up',     'completed',  2,  2),  
('Immunization',  'completed',  3,  3),  
('Consult',       'completed',  4,  4),  
('Prenatal',      'completed', 11, 15),  
('Consult',       'completed',  5,  5),  
('Asthma Review', 'completed',  6,  6),  
('Consult',       'completed',  7,  7),  
('Consult',       'cancelled',  8,  8),  
('Consult',       'completed',  9,  9),  
('Consult',       'completed', 10, 10),  
('Migraine',      'completed', 12, 11),  
('URI',           'completed', 13, 12),  
('GERD',          'completed', 14, 13),  
('Annual',        'completed', 15, 14),  
('Back Pain',     'no_show',   16,  1),  
('Asthma Review', 'completed', 18,  2),  
('Hypertension',  'completed', 19,  3), 
('Dental',        'completed', 20,  4),  
('Prenatal',      'scheduled', 11, 15);  

------------------------------------------------------------
-- DAILY SCHEDULE 
------------------------------------------------------------
INSERT INTO daily_schedule (appointment_id, staff_id, time) VALUES
(1,  1, '09:00'),  
(2,  2, '09:30'),
(3,  9, '10:00'), 
(4,  2, '10:30'),
(5, 11, '11:00'),  
(6,  5, '11:30'),
(7,  6, '13:00'),  
(8,  3, '13:30'),
(9,  6, '14:00'),
(10, 4,'14:30'),
(11, 1,'15:00'),
(12, 3,'15:30'),
(13, 4,'16:00'),
(14, 5,'16:30'),
(15, 1,'09:15'),
(16, 7,'10:15'),  
(17, 2,'11:15'),
(18, 4,'13:15'),
(19, 1,'14:15'),
(20,11,'15:15');  

------------------------------------------------------------
-- DIAGNOSES + LINK TABLE
------------------------------------------------------------
INSERT INTO diagnosis (description, treatment_plan, notes) VALUES
('Annual physical exam', 'Lifestyle counseling, routine screening labs', 'Otherwise healthy adult'),
('Essential hypertension', 'Continue ACE inhibitor; low-salt diet; follow BP in 3 months', 'Home BP log reviewed'),
('Routine child vaccination', 'Administer age-appropriate vaccines per schedule', 'No contraindications'),
('Type 2 diabetes mellitus without complications', 'Titrate metformin; reinforce diet and exercise; A1c q3–6 months', 'Mildly elevated A1c'),
('Uncomplicated pregnancy, second trimester', 'Prenatal visits q4 weeks; routine labs and ultrasound', 'No obstetric risk factors'),
('Mild persistent asthma', 'Adjust inhaled corticosteroid; rescue inhaler PRN', 'Uses inhaler weekly'),
('Hyperlipidemia', 'Start statin; lipid panel in 3 months', '10-year CV risk >10%'),
('Mechanical low back pain', 'NSAIDs PRN; stretching; physio referral', 'No red flags'),
('Migraine without aura', 'Trial triptan; headache diary; lifestyle triggers', 'No neuro deficits'),
('Gastroesophageal reflux disease', 'PPI trial; dietary modifications', 'Symptoms mostly nocturnal'),
('Hypothyroidism', 'Maintain levothyroxine; TSH in 6 months', 'Clinically euthyroid'),
('Major depressive disorder, mild', 'Start SSRI; follow-up in 4 weeks', 'No suicidal ideation'),
('Upper respiratory tract infection, viral', 'Supportive care; no antibiotics', 'Afebrile, clear lungs'),
('Dental abscess', 'Start antibiotics; urgent dental referral', 'Localized swelling'),
('Obesity, class I', 'Nutrition counseling; exercise program; weight check in 3 months', 'Interested in lifestyle changes'),
('Anxiety disorder, generalized', 'CBT referral; consider SSRI if symptoms persist', 'GAD-7 elevated'),
('Allergic rhinitis', 'Intranasal steroid; oral antihistamine PRN', 'Seasonal pattern'),
('Chronic kidney disease stage 2', 'BP and glycemic control; avoid nephrotoxins; monitor eGFR', 'Mildly decreased eGFR'),
('COPD exacerbation, mild', 'Short-course steroids and antibiotics; inhaler technique review', 'No hospitalization needed'),
('Postpartum follow-up', 'Screen for mood disorders; assess healing and infant feeding', 'Uncomplicated delivery');

INSERT INTO diagnosis_item (diagnosis_id, appointment_id) VALUES
(1,  1),
(2,  2),
(3,  3),
(4,  4),
(5,  5),
(6,  7),
(7,  9),
(8, 16),
(9, 12),
(10,14),
(11,10),
(12,11),
(13,13),
(14,19),
(15,15),
(16, 8),
(17, 9),
(18,18),
(19,20),
(20, 5);

------------------------------------------------------------
-- DRUGS, PRESCRIPTIONS, PRESCRIPTION ITEMS
------------------------------------------------------------
INSERT INTO drug (din_id, drug_name) VALUES
(10012345, 'Amoxicillin 500 mg capsule'),
(10023456, 'Azithromycin 250 mg tablet'),
(10034567, 'Atorvastatin 20 mg tablet'),
(10045678, 'Metformin 500 mg tablet'),
(10056789, 'Lisinopril 10 mg tablet'),
(10067890, 'Hydrochlorothiazide 25 mg tablet'),
(10078901, 'Omeprazole 20 mg capsule'),
(10089012, 'Ibuprofen 400 mg tablet'),
(10100123, 'Acetaminophen 500 mg tablet'),
(10111234, 'Salbutamol 100 mcg inhaler'),
(10122345, 'Fluticasone 50 mcg nasal spray'),
(10133456, 'Insulin glargine 100 U/mL'),
(10144567, 'Sertraline 50 mg tablet'),
(10155678, 'Levothyroxine 50 mcg tablet'),
(10166789, 'Warfarin 5 mg tablet'),
(10177890, 'Clopidogrel 75 mg tablet'),
(10188901, 'Simvastatin 40 mg tablet'),
(10199012, 'Amlodipine 5 mg tablet'),
(10200123, 'Prednisone 10 mg tablet'),
(10211234, 'Amoxicillin–clavulanate 875/125 mg tablet');

INSERT INTO prescription (issued_date, appointment_id) VALUES
('2025-01-02',  1),
('2025-01-03',  2),
('2025-01-04',  4),
('2025-01-05',  6),
('2025-01-06',  7),
('2025-01-07',  9),
('2025-01-08', 10),
('2025-01-09', 11),
('2025-01-10', 12),
('2025-01-11', 13),
('2025-01-12', 14),
('2025-01-13', 15),
('2025-01-14', 16),
('2025-01-15', 17),
('2025-01-16', 18),
('2025-01-17', 19),
('2025-01-18', 20),
('2025-01-19',  3),
('2025-01-20',  5),
('2025-01-21',  8);

INSERT INTO prescription_item (din_id, prescription_id, quantity, dosage_instructions) VALUES
(10056789, 1, 30, 'Take 1 tablet once daily'),
(10045678, 2, 60, 'Take 1 tablet twice daily with meals'),
(10078901, 3, 30, 'Take 1 capsule once daily before breakfast'),
(10034567, 4, 30, 'Take 1 tablet at bedtime'),
(10111234, 5, 1,  'Inhale 2 puffs every 4–6 hours as needed for wheeze'),
(10122345, 6, 1,  'Spray 1–2 sprays into each nostril once daily'),
(10155678, 7, 30, 'Take 1 tablet once daily on empty stomach'),
(10144567, 8, 30, 'Take 1 tablet once daily'),
(10100123, 9, 40, 'Take 1–2 tablets every 6 hours as needed (max 8/day)'),
(10089012,10,30, 'Take 1 tablet every 8 hours with food as needed'),
(10012345,11,21, 'Take 1 capsule three times daily for 7 days'),
(10211234,12,14, 'Take 1 tablet twice daily with food for 7 days'),
(10166789,13,30, 'Take 1 tablet once daily; adjust per INR results'),
(10177890,14,30, 'Take 1 tablet once daily'),
(10188901,15,30, 'Take 1 tablet once daily in the evening'),
(10199012,16,30, 'Take 1 tablet once daily'),
(10133456,17,1,  'Inject 10 units subcutaneously at bedtime'),
(10200123,18,21, '3 tablets daily x3 days, then 2 daily x3 days, then 1 daily x3'),
(10023456,19,6,  'Take 2 tablets on day 1, then 1 daily on days 2–5'),
(10012345,20,21, 'Take 1 capsule three times daily for 7 days');

------------------------------------------------------------
-- LAB TESTS + LAB LOG
------------------------------------------------------------
INSERT INTO lab_test (test_name, result, notes, timestamp, appointment_id) VALUES
('Complete Blood Count',        'Normal',       'Screening at annual physical',          '09:30', 1),
('Basic Metabolic Panel',       'Mildly high',  'Slightly elevated glucose',            '10:15', 4),
('Lipid Panel',                 'High LDL',     'Supports statin therapy',              '11:00', 9),
('HbA1c',                       '7.4%',         'Above target for T2DM',                '11:15', 4),
('TSH',                         'Normal',       'Stable thyroid function',              '09:45',10),
('Urine Microalbumin',          'Normal',       'No nephropathy',                       '10:30', 4),
('CRP',                         'Normal',       'Non-specific inflammation screen',     '13:00',13),
('Throat Swab',                 'Negative',     'No strep growth',                      '13:30',13),
('Serum Creatinine',            'Slightly high','CKD stage 2 pattern',                  '14:00',18),
('Electrolytes',                'Normal',       'On antihypertensives',                 '14:15',19),
('Fasting Glucose',             'Impaired',     'Prediabetic range',                    '09:10', 2),
('Iron Studies',                'Low ferritin', 'Mild iron deficiency',                 '10:40',12),
('Vitamin D',                   'Low',          'Recommend supplementation',            '11:20',15),
('INR',                         '2.3',          'Therapeutic on warfarin',              '15:10',17),
('Beta-hCG',                    'Normal rise',  'Prenatal monitoring',                  '11:30', 5),
('Group B Strep Screen',        'Negative',     'Third trimester screen',               '11:45',20),
('Chest X-ray (reported as lab)','Clear',       'COPD baseline imaging',                '15:30',19),
('Rapid Antigen Test (COVID)',  'Negative',     'URI symptoms',                         '12:10',13),
('Urinalysis',                  'Normal',       'Screening',                             '09:20', 1),
('Liver Function Tests',        'Mildly high',  'Statin follow-up',                      '16:00', 9);

INSERT INTO lab_log (lab_log_date, lab_order_id)
SELECT
  CURRENT_DATE - ((row_number() OVER () - 1)::int) AS lab_log_date,
  lab_order_id
FROM lab_test
ORDER BY lab_order_id;

------------------------------------------------------------
-- RECOVERY ROOM (room_id = 18 is Recovery Room)
------------------------------------------------------------
INSERT INTO recovery_room_entry
(admit_timestamp, discharge_timestamp, notes, room_id, staff_id) VALUES
('10:00','11:30','Post-procedure observation – colonoscopy',        18, 2),
('12:00','13:15','Post-delivery recovery, uncomplicated',           18,11),
('09:30','10:45','Post-minor surgery observation',                  18, 3),
('14:00','15:10','Sedation recovery after endoscopy',               18, 4),
('11:00','12:00','Short observation after asthma exacerbation',     18, 6),
('15:00','16:00','Post-procedure observation – joint injection',    18, 1),
('08:30','09:30','Monitoring after syncopal episode',               18, 2),
('13:00','14:00','Observation for chest pain workup (ruled out)',   18, 5),
('10:15','11:15','Recovery after laceration repair',                18, 7),
('16:00','17:00','Post-IV iron infusion observation',               18, 9),
('09:00','10:00','Post-procedural monitoring – skin biopsy',        18, 1),
('11:30','12:30','Recovery after D&C',                              18,11),
('13:30','14:30','Observation post-bronchoscopy',                   18, 4),
('15:30','16:30','Post-endoscopy observation',                      18, 2),
('10:45','11:45','Post-procedure sedation recovery',                18, 3),
('08:15','09:15','Short recovery after IV contrast imaging',        18, 6),
('12:45','13:45','Monitoring after allergic reaction treatment',    18, 5),
('14:45','15:45','Post-delivery recovery, uncomplicated',           18,10),
('16:15','17:15','Post-procedure observation – minor ortho',        18, 2),
('11:15','12:15','Recovery after syncope workup',                   18, 1);

INSERT INTO recovery_room_observation (observation_timestamp, notes, recovery_id) VALUES
('10:15','Vitals stable, patient drowsy',   1),
('10:45','Ambulating with assistance',      1),
('12:15','Pain controlled, breastfeeding',  2),
('09:45','No nausea, vitals stable',        3),
('14:20','Oxygen saturation improved',      4),
('11:15','Tolerating oral fluids',          5),
('15:15','Discharge teaching completed',    6),
('08:45','Blood pressure normalized',       7),
('13:15','Chest pain resolved',             8),
('10:30','Wound dressing dry and intact',   9),
('16:15','No adverse reaction to iron',    10),
('09:20','Site clean, no bleeding',        11),
('11:45','Bleeding minimal, pain 3/10',   12),
('13:45','Peak flow improved',            13),
('15:45','Tolerating diet',              14),
('11:00','Alert and oriented',            15),
('08:30','Vitals within normal limits',   16),
('13:00','Itching resolved',             17),
('15:00','Lochia normal, ambulating',    18),
('16:30','Stable for discharge',         19);

------------------------------------------------------------
-- 11. BILLING + INVOICE
------------------------------------------------------------
INSERT INTO billing (amount, payment_method, payment_status, appointment_id) VALUES
(180.00,'Direct Bill Insurance','paid',        1),
(160.00,'Direct Bill Insurance','paid',        2),
( 50.00,'Direct Bill Insurance','paid',        3),
(220.00,'Direct Bill Insurance','pending',     4),
(200.00,'Direct Bill Insurance','pending',     5),
(140.00,'Direct Bill Insurance','paid',        6),
(160.00,'Direct Bill Insurance','paid',        7),
(130.00,'Cash','unpaid',                       8),
(190.00,'Direct Bill Insurance','paid',        9),
(210.00,'Direct Bill Insurance','paid',       10),
(160.00,'Direct Bill Insurance','pending',    11),
(120.00,'Direct Bill Insurance','paid',       12),
(110.00,'Direct Bill Insurance','paid',       13),
(250.00,'Direct Bill Insurance','pending',    14),
(130.00,'Direct Bill Insurance','paid',       15),
(115.00,'Cash','unpaid',                      16),
(175.00,'Direct Bill Insurance','paid',       17),
(230.00,'Direct Bill Insurance','pending',    18),
(220.00,'Cash','paid',                        19),
(195.00,'Direct Bill Insurance','scheduled', 20); 

INSERT INTO invoice (issue_date, billing_id)
SELECT
  CURRENT_DATE - ((row_number() OVER () - 1)::int) AS issue_date,
  billing_id
FROM billing
ORDER BY billing_id;

------------------------------------------------------------
--  DELIVERY ROOM (room_id = 17)
------------------------------------------------------------
INSERT INTO delivery_record (notes, room_id, timestamp) VALUES
('Spontaneous vaginal delivery, healthy term infant',    17, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('Induced labour, epidural, no complications',           17, CURRENT_TIMESTAMP - INTERVAL '12 days'),
('Elective induction, G2P1, uncomplicated',              17, CURRENT_TIMESTAMP - INTERVAL '20 days'),
('Precipitous labour, both mother and baby well',        17, CURRENT_TIMESTAMP - INTERVAL '27 days'),
('Vacuum-assisted delivery, minor perineal tear',        17, CURRENT_TIMESTAMP - INTERVAL '34 days');

------------------------------------------------------------
 --WEEKLY STAFF CALENDAR (rotating on-call physicians)
------------------------------------------------------------
INSERT INTO weekly_staff_calendar (week_start, week_end, on_call, staff_id)
SELECT
  (DATE '2025-01-06' + (7 * (gs-1))) AS week_start,
  (DATE '2025-01-06' + (7 * (gs-1)) + 6) AS week_end,
  (gs % 2 = 0) AS on_call,
  ((gs - 1) % 5) + 1         
FROM generate_series(1,20) AS gs;