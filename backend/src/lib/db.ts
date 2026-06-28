import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In production (Railway), the persistent volume is mounted at /data.
// In development, fall back to the local ./data folder.
// You can also override this entirely with the DB_PATH environment variable.
const DB_PATH = process.env.DB_PATH ?? (
  process.env.NODE_ENV === "production"
    ? "/data/pis.db"
    : path.resolve(__dirname, "../../data/pis.db")
);

console.log(`[db] Opening database at: ${DB_PATH}`);
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery_categories (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    url           TEXT    NOT NULL,
    caption       TEXT,
    type          TEXT    NOT NULL DEFAULT 'image',
    category      TEXT    NOT NULL DEFAULT 'General',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    body        TEXT    NOT NULL,
    image_url   TEXT,
    published   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    event_date  TEXT    NOT NULL,
    location    TEXT,
    published   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_texts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    key        TEXT    UNIQUE NOT NULL,
    label      TEXT    NOT NULL,
    value      TEXT    NOT NULL,
    updated_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_info (
    id         INTEGER PRIMARY KEY,
    phone1     TEXT NOT NULL DEFAULT '+234 809 570 0591',
    phone2     TEXT NOT NULL DEFAULT '+234 906 421 9878',
    email      TEXT NOT NULL DEFAULT 'pis.abuja@gmail.com',
    address    TEXT NOT NULL DEFAULT '16 & 18 2nd Avenue, Gwarinpa Estate, Abuja, FCT, Nigeria',
    hours      TEXT NOT NULL DEFAULT 'Monday – Friday, 8:00am – 4:00pm',
    map_url    TEXT,
    facebook   TEXT DEFAULT 'https://www.facebook.com/profile.php?id=61557487567907&mibextid=ZbWKwL',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS hero_content (
    id         INTEGER PRIMARY KEY,
    headline   TEXT NOT NULL DEFAULT 'Prudential International School',
    subtext    TEXT NOT NULL DEFAULT 'British rigour meets Nigerian identity. Established in Gwarinpa, Abuja since 2014.',
    badge      TEXT NOT NULL DEFAULT 'Discipline · Excellence · Integrity · Respect',
    btn1_text  TEXT NOT NULL DEFAULT 'Apply for Admission',
    btn2_text  TEXT NOT NULL DEFAULT 'Discover Our Story',
    stat1_num  TEXT NOT NULL DEFAULT '11+',
    stat1_label TEXT NOT NULL DEFAULT 'Years of Excellence',
    stat2_num  TEXT NOT NULL DEFAULT '700+',
    stat2_label TEXT NOT NULL DEFAULT 'Students Enrolled',
    stat3_num  TEXT NOT NULL DEFAULT '2',
    stat3_label TEXT NOT NULL DEFAULT 'Curricula Offered',
    cta_badge  TEXT NOT NULL DEFAULT 'Admissions Open — 2026/2027',
    cta_heading TEXT NOT NULL DEFAULT 'Ready to Give Your Child the Best Start?',
    cta_body   TEXT NOT NULL DEFAULT 'Join hundreds of families who''ve trusted Prudential International School since 2014. Spaces fill fast — don''t miss your child''s spot.',
    cta_btn1   TEXT NOT NULL DEFAULT 'Apply for Admission →',
    cta_btn2   TEXT NOT NULL DEFAULT 'Learn More About Us',
    bg_image   TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS homepage_features (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS campus_section (
    id          INTEGER PRIMARY KEY,
    heading     TEXT NOT NULL DEFAULT 'Come See the Campus',
    subtext     TEXT NOT NULL DEFAULT 'We''re right in the heart of Abuja — Gwarinpa Estate. The facilities speak for themselves, but you really should come in person.',
    bullet1     TEXT NOT NULL DEFAULT 'Fully Equipped Science Laboratories',
    bullet2     TEXT NOT NULL DEFAULT 'Sports Complex & Athletics Track',
    bullet3     TEXT NOT NULL DEFAULT 'Modern, Well-Resourced Classrooms',
    bullet4     TEXT NOT NULL DEFAULT 'Art, Music & Drama Studios',
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS student_life_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    image_url    TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS student_clubs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS portal_links (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    tag          TEXT NOT NULL DEFAULT 'Students',
    url          TEXT NOT NULL,
    color        TEXT NOT NULL DEFAULT '#003366',
    display_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS academics_content (
    id           INTEGER PRIMARY KEY,
    curriculum_heading TEXT NOT NULL DEFAULT 'Two Curricula. One Classroom.',
    curriculum_body    TEXT NOT NULL DEFAULT 'Most schools pick one and stick with it. We didn''t.',
    curriculum_image   TEXT,
    science_heading    TEXT NOT NULL DEFAULT 'Science & Practical Learning',
    science_body       TEXT NOT NULL DEFAULT 'We don''t just teach students about experiments — they actually run them.',
    science_image      TEXT,
    updated_at         TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS about_content (
    id         INTEGER PRIMARY KEY,
    story1     TEXT NOT NULL DEFAULT '',
    story2     TEXT NOT NULL DEFAULT '',
    story3     TEXT NOT NULL DEFAULT '',
    mission    TEXT NOT NULL DEFAULT '',
    vision     TEXT NOT NULL DEFAULT '',
    img1       TEXT,
    img2       TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS school_values (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL,
    body          TEXT    NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    updated_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS school_goals (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    body          TEXT    NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    updated_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS academic_divisions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL,
    age_range     TEXT    NOT NULL,
    body          TEXT    NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    updated_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    key   TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name    TEXT,
    student_age     TEXT,
    student_gender  TEXT,
    current_class   TEXT,
    desired_class   TEXT,
    parent_name     TEXT,
    phone           TEXT,
    email           TEXT,
    relationship    TEXT,
    prev_school     TEXT,
    performance     TEXT,
    subject         TEXT,
    message         TEXT    NOT NULL,
    notes           TEXT,
    read            INTEGER DEFAULT 0,
    created_at      TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS staff_members (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    title         TEXT    NOT NULL,
    department    TEXT,
    image_url     TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rules_regulations (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    category      TEXT    NOT NULL,
    content       TEXT    NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS version_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name  TEXT    NOT NULL,
    record_id   INTEGER NOT NULL,
    field       TEXT    NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    changed_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url     TEXT    NOT NULL,
    caption       TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published     INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT    DEFAULT (datetime('now')),
    updated_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS anthem_content (
    id           INTEGER PRIMARY KEY,
    school_title TEXT NOT NULL DEFAULT 'Prudential International School Anthem',
    school_audio TEXT DEFAULT '/anthem.mp3',
    school_lyrics TEXT NOT NULL DEFAULT '',
    national_title TEXT NOT NULL DEFAULT 'Nigerian National Anthem',
    national_audio TEXT DEFAULT '/national-anthem.mp3',
    national_lyrics TEXT NOT NULL DEFAULT '',
    updated_at   TEXT DEFAULT (datetime('now'))
  );


  CREATE TABLE IF NOT EXISTS admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT UNIQUE,
    student_first_name TEXT,
    student_last_name TEXT,
    date_of_birth TEXT,
    gender TEXT,
    nationality TEXT,
    religion TEXT,
    class_applying TEXT,
    entry_date TEXT,
    prev_school TEXT,
    last_class TEXT,
    year_left TEXT,
    reason_leaving TEXT,
    parent_name TEXT,
    relationship TEXT,
    phone TEXT,
    email TEXT,
    occupation TEXT,
    hear_about_us TEXT,
    message TEXT,
    filename TEXT,
    read INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrations
const migrateCol = (table: string, col: string, def: string) => {
  const exists = db.prepare(`SELECT * FROM pragma_table_info('${table}') WHERE name='${col}'`).get();
  if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
};

migrateCol("gallery_items", "category", "TEXT NOT NULL DEFAULT 'General'");
migrateCol("contact_info", "hours", "TEXT NOT NULL DEFAULT 'Monday – Friday, 8:00am – 4:00pm'");
migrateCol("hero_content", "stat1_num", "TEXT NOT NULL DEFAULT '11+'");
migrateCol("hero_content", "stat1_label", "TEXT NOT NULL DEFAULT 'Years of Excellence'");
migrateCol("hero_content", "stat2_num", "TEXT NOT NULL DEFAULT '700+'");
migrateCol("hero_content", "stat2_label", "TEXT NOT NULL DEFAULT 'Students Enrolled'");
migrateCol("hero_content", "stat3_num", "TEXT NOT NULL DEFAULT '2'");
migrateCol("hero_content", "stat3_label", "TEXT NOT NULL DEFAULT 'Curricula Offered'");
migrateCol("hero_content", "cta_badge", "TEXT NOT NULL DEFAULT 'Admissions Open — 2026/2027'");
migrateCol("hero_content", "cta_heading", "TEXT NOT NULL DEFAULT 'Ready to Give Your Child the Best Start?'");
migrateCol("hero_content", "cta_body", "TEXT NOT NULL DEFAULT 'Join hundreds of families who''ve trusted Prudential International School since 2014.'");
migrateCol("hero_content", "cta_btn1", "TEXT NOT NULL DEFAULT 'Apply for Admission →'");
migrateCol("hero_content", "cta_btn2", "TEXT NOT NULL DEFAULT 'Learn More About Us'");

// Seed
const seed = db.transaction(() => {
  if (!db.prepare("SELECT 1 FROM contact_info LIMIT 1").get()) {
    db.prepare(`INSERT INTO contact_info (id,phone1,phone2,email,address,hours,map_url,facebook) VALUES
      (1,'+234 809 570 0591','+234 906 421 9878','pis.abuja@gmail.com',
      '16 & 18 2nd Avenue, Gwarinpa Estate, Abuja, FCT, Nigeria',
      'Monday – Friday, 8:00am – 4:00pm',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8!2d7.4167!3d9.0833',
      'https://www.facebook.com/profile.php?id=61557487567907&mibextid=ZbWKwL')`).run();
  }
  if (!db.prepare("SELECT 1 FROM hero_content LIMIT 1").get()) {
    db.prepare(`INSERT INTO hero_content
      (id,headline,subtext,badge,btn1_text,btn2_text,
       stat1_num,stat1_label,stat2_num,stat2_label,stat3_num,stat3_label,
       cta_badge,cta_heading,cta_body,cta_btn1,cta_btn2) VALUES
      (1,'Prudential International School',
      'British rigour meets Nigerian identity. Established in Gwarinpa, Abuja since 2014.',
      'Discipline · Excellence · Integrity · Respect',
      'Apply for Admission','Discover Our Story',
      '11+','Years of Excellence','700+','Students Enrolled','2','Curricula Offered',
      'Admissions Open — 2026/2027','Ready to Give Your Child the Best Start?',
      'Join hundreds of families who''ve trusted Prudential International School since 2014. Spaces fill fast — don''t miss your child''s spot.',
      'Apply for Admission →','Learn More About Us')`).run();
  }
  if (!db.prepare("SELECT 1 FROM homepage_features LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO homepage_features (title,body,display_order) VALUES (?,?,?)");
    [
      ["Two Curricula, One School","British rigour meets Nigerian identity. Our students don't have to choose between global standards and their roots — they get both.",1],
      ["Character Before Certificates","Grades matter, but so does who you are when nobody's watching. Discipline, honesty, and respect aren't extras here — they're the foundation.",2],
      ["More Than Just Academics","Sport, science fairs, drama, debate — we want every student to find the thing they're genuinely good at. Not every gift fits inside a textbook.",3],
      ["Teachers Who Actually Care","Small class sizes mean no student gets lost in the crowd. Our teachers know their students by name — and by what they struggle with.",4],
      ["Built for the Real World","We've sent students to UNILAG, ABU, UK universities, and US colleges. We know the paths and we prepare for all of them.",5],
      ["A Safe, Structured Environment","The school runs on clear rules, consistently enforced. Parents tell us this is the thing they notice first — and value most.",6],
    ].forEach(([t,b,o]) => ins.run(t,b,o));
  }
  if (!db.prepare("SELECT 1 FROM campus_section LIMIT 1").get()) {
    db.prepare(`INSERT INTO campus_section (id,heading,subtext,bullet1,bullet2,bullet3,bullet4) VALUES
      (1,'Come See the Campus',
      'We''re right in the heart of Abuja — Gwarinpa Estate. The facilities speak for themselves, but you really should come in person.',
      'Fully Equipped Science Laboratories','Sports Complex & Athletics Track',
      'Modern, Well-Resourced Classrooms','Art, Music & Drama Studios')`).run();
  }
  if (!db.prepare("SELECT 1 FROM student_life_items LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO student_life_items (title,body,image_url,display_order) VALUES (?,?,?,?)");
    [
      ["Sports & Athletics","Football, basketball, track — we take sports seriously at Prudential. Inter-house competitions run every term. But beyond the results, we use sport to teach something harder to measure: how to handle losing, lead a team, and push through when you're tired.","https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778264/image_1769822857117_j4d5wu.png",1],
      ["Clubs & Societies","JET Science Club meets Tuesdays. Debate Society, Thursdays. The Press Club puts out a termly newsletter that students write, edit, and print themselves. These aren't ticked boxes — they're real activities students actually show up for.","https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778440/image_1769823730253_ze7zst.png",2],
      ["Arts & Culture","Literacy Week every term. Cultural day with student performances. The arts here aren't squeezed into Friday afternoons — they're on the timetable. Nigerian heritage isn't a theme; it's in the curriculum.","https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778578/WhatsApp_Image_2026-01-30_at_10.54.49_PM__1__1769822959981_qqom0r.jpg",3],
      ["Community Service","We visit care homes. We run termly charity drives. Students who leave Prudential have a sense of responsibility outside their own lives — not because we told them to, but because it was part of their normal school year.","https://res.cloudinary.com/dagt2a1w0/image/upload/v1773779862/image_1769826755575_zlclvn.png",4],
      ["Competitions & Events","Science fairs, inter-school quizzes, prize-giving day, graduation — the school calendar is full of moments that matter. These events are how students learn to perform under pressure and take pride in what they've earned.","https://res.cloudinary.com/dagt2a1w0/image/upload/v1773779034/image_1769904570224_ufbkqj.png",5],
    ].forEach(([t,b,i,o]) => ins.run(t,b,i,o));
  }
  if (!db.prepare("SELECT 1 FROM student_clubs LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO student_clubs (name,display_order) VALUES (?,?)");
    ["JET Club (Science)","Press & Reading Club","Debate & Literary Society","Music & Drama Club","Art Club","Dance","Visual Arts"]
      .forEach((n,i) => ins.run(n,i+1));
  }
  if (!db.prepare("SELECT 1 FROM portal_links LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO portal_links (title,description,tag,url,color,display_order) VALUES (?,?,?,?,?,?)");
    [
      ["Student Portal","Access your timetable, results, assignments, and academic records.","Students","https://login.edumgrsolutions.com/login.html","#003366",1],
      ["Parent Portal","Monitor your child's attendance, fees, and school communications.","Parents","https://login.edumgrsolutions.com/parent.html","#cc0000",2],
      ["Staff Portal","Manage classes, upload results, submit reports, and access admin tools.","Staff","https://login.edumgrsolutions.com/staff.html","#15803d",3],
    ].forEach(([t,d,g,u,c,o]) => ins.run(t,d,g,u,c,o));
  }
  if (!db.prepare("SELECT 1 FROM academics_content LIMIT 1").get()) {
    db.prepare(`INSERT INTO academics_content
      (id,curriculum_heading,curriculum_body,curriculum_image,science_heading,science_body,science_image) VALUES
      (1,'Two Curricula. One Classroom.',
      'Most schools pick one and stick with it. We didn''t. At Prudential, students follow both the British National Curriculum and the Nigerian Curriculum together. The result is a student who can sit IGCSE, WAEC, or walk into an international school without skipping a beat.',
      'https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778448/image_1769826604686_vnwemo.png',
      'Science & Practical Learning',
      'We don''t just teach students about experiments — they actually run them. Physics, Chemistry, Biology: every concept our students encounter in theory, they test with their own hands.',
      'https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778460/image_1769904588613_t4x7qq.png')`).run();
  }
  if (!db.prepare("SELECT 1 FROM about_content LIMIT 1").get()) {
    db.prepare(`INSERT INTO about_content (id,story1,story2,story3,mission,vision,img1,img2) VALUES
      (1,
      'Prudential International School commenced operations on September 22, 2014, at Plot 18, 2nd Avenue, Gwarinpa Estate, Abuja. It was founded by Dr. Patrick Essien Ngasso and his wife, Mrs. Mountoujoum Ngoutane Mariama — two education enthusiasts with a shared conviction: that Nigerian children deserved far better than what the existing system was offering.',
      'Owing to consistent growth, the school expanded in September 2018 to an additional site at Plot 16, 2nd Avenue, Gwarinpa Estate — now providing a full continuum of education from Crèche and Nursery through Primary and Secondary school, serving children from 6 months to 17 years of age.',
      'Our motto — Making a Difference — is not decoration on a crest. It is the standard we hold ourselves to every day: in the classroom, on the field, and in the character of every student who passes through our gates.',
      'To provide a stimulating, inclusive, and high-quality learning environment where every student achieves their full potential — academically, morally, and socially — and is equipped to make a positive impact on their generation.',
      'To be the most trusted international school in Nigeria — recognised for academic rigour, innovative teaching, and the holistic development of well-rounded, globally-minded young people who lead with integrity.',
      'https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778605/WhatsApp_Image_2026-01-30_at_10.54.50_PM_1769822959983_xp9i1w.jpg',
      'https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778594/WhatsApp_Image_2026-01-30_at_10.54.51_PM_1769822959983_ct51xn.jpg')`).run();
  }
  if (!db.prepare("SELECT 1 FROM school_values LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO school_values (title,body,display_order) VALUES (?,?,?)");
    [
      ["Discipline","Order and self-control in everything we do.",1],
      ["Excellence","Striving for the highest standard in all pursuits.",2],
      ["Integrity","Honesty and strong moral principles always.",3],
      ["Respect","Treating every person with dignity and honour.",4],
      ["Innovation","Embracing new ideas and creative thinking.",5],
      ["Global Mindset","Preparing students for a connected world.",6],
    ].forEach(([t,b,o]) => ins.run(t,b,o));
  }
  if (!db.prepare("SELECT 1 FROM school_goals LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO school_goals (body,display_order) VALUES (?,?)");
    [
      ["To challenge and support learners to provide them with skill for a successful future",1],
      ["To develop learners' understanding of self and others, enabling everyone to make positive, healthy choices",2],
      ["To promote effective working partnership with parents and the wider community",3],
      ["To involve all learners in the decision-making of the school, enabling them to make a positive contribution now and in the future",4],
      ["To provide a safe, caring environment",5],
      ["To provide a creative, dynamic curriculum allowing children to enjoy learning and achieve success",6],
      ["To provide positive learning experiences in a nurturing environment",7],
    ].forEach(([b,o]) => ins.run(b,o));
  }
  if (!db.prepare("SELECT 1 FROM academic_divisions LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO academic_divisions (title,age_range,body,display_order) VALUES (?,?,?,?)");
    [
      ["Early Years", "Ages 2–4", `At Prudential International School, our Early Years Program provides a stimulating, nurturing, and secure environment where young children develop a lifelong love for learning. Drawing from the best practices of the British Early Years Foundation Stage (EYFS) alongside key elements of the Nigerian curriculum, we offer a balanced educational experience that prepares children for future academic success.\n\nOur programme focuses on the holistic development of every child through play-based and inquiry-driven learning. Children are encouraged to explore, question, create, and develop confidence in their abilities while building essential literacy, numeracy, communication, and social skills.\n\nWhat makes our Early Years Programme unique is the integration of foundational international learning approaches that promote critical thinking, creativity, problem-solving, and independence from an early age. Through carefully planned activities, children develop strong language skills, emotional intelligence, physical coordination, and positive social relationships.\n\nOur experienced and caring educators work closely with parents to ensure that each child receives the support, guidance, and encouragement needed to thrive academically, socially, and emotionally.\n\nBy the time our children transition into Primary School, they possess the confidence, curiosity, and foundational skills required for successful lifelong learning.`, 1],
      ["Primary School", "Ages 5–10", `The Primary School at Prudential International School offers a dynamic blend of the Nigerian and British curricula designed to develop confident, knowledgeable, and well-rounded learners. Our curriculum combines academic rigour with practical learning experiences that encourage curiosity, innovation, and independent thinking.\n\nWe provide a broad and balanced education covering English Language, Mathematics, Science, ICT, Social Studies, Creative Arts, French, Physical Education, and other core subjects. Lessons are delivered through engaging, learner-centred approaches that promote active participation and deep understanding.\n\nBeyond academic excellence, we place strong emphasis on character development, leadership, teamwork, communication skills, and moral values. Through project-based learning, educational excursions, clubs, and extracurricular activities, pupils are encouraged to apply classroom knowledge to real-life situations.\n\nOur Primary School programme equips pupils with strong literacy and numeracy foundations while nurturing critical thinking, creativity, and problem-solving abilities. We prepare learners not only for a successful transition into Secondary School but also for future opportunities in an increasingly global and technology-driven world.\n\nAt Prudential International School, every child is challenged to achieve their full potential while developing the confidence and character needed to become responsible global citizens.`, 2],
      ["Secondary School", "Ages 11–18", `The Secondary School at Prudential International School provides a comprehensive and future-focused education that combines the strengths of the Nigerian and British educational systems. Our programme is designed to prepare students for success in national and international examinations, higher education, and professional careers.\n\nStudents engage in a challenging curriculum that promotes academic excellence across the Sciences, Technology, Engineering, Mathematics (STEM), Humanities, Social Sciences, Languages, and Creative Arts. Through innovative teaching methods, practical laboratory experiences, research projects, and technology-enhanced learning, students develop the knowledge and skills required for success in the 21st century.\n\nBeyond academics, we are committed to developing confident leaders with strong moral values, integrity, and social responsibility. Students are encouraged to participate in leadership programmes, entrepreneurship initiatives, sports, community service, clubs, and various co-curricular activities that foster personal growth and resilience.\n\nOur focus on critical thinking, creativity, communication, collaboration, and digital literacy ensures that graduates are well-equipped to compete and excel in universities and workplaces around the world.\n\nAt Prudential International School, we do not simply prepare students for examinations — we prepare them for life, empowering them to become innovative thinkers, responsible citizens, and future leaders capable of making meaningful contributions to society.`, 3],
    ].forEach(([t, a, b, o]) => ins.run(t, a, b, o));
  }
  if (!db.prepare("SELECT 1 FROM staff_members LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO staff_members (name,title,department,image_url,display_order) VALUES (?,?,?,?,?)");
    [
      ["Dr. Essien N. Patrick","CEO / Managing Director","Leadership","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/1_Dr._Essien_N._Patrick_CEO_Managing_Director_pqodaz.jpg",1],
      ["Ngoutane M. Mariama","Proprietress / Supervisor","Leadership","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/2_Ngoutane_M_Mariama_Proprietress_Supervisor_dw0jdg.jpg",2],
      ["Santana Tumo","Head Admin","Administration","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/3_Santana_Tumo_Head_Admin_bwhjgh.jpg",3],
      ["Obanubi Olusegun Taiwo","Examination Officer / Coordinator","Administration","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414015/4_Obanubi_Olusegun_Taiwo_Coordinator_Examination_Officer_tcepng.jpg",4],
      ["Laha Terence Ternenge","Principal","Leadership","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414019/5_Laha_Terence_Ternenge_Principal_idhgj1.jpg",5],
      ["Murna Aba","Head of Primary School","Academic","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/6_Murna_Aba_Head_of_Primary_School_dmgjfc.jpg",6],
      ["Maureen Onichakwe","Head of Early Years","Academic","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414018/7_Maureen_Onichakwe_Head_of_Early_Years_ctswb6.jpg",7],
      ["Paul Msughther","HOD Science","Academic","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/8_Paul_Msughther_HOD_Science_r5dupo.jpg",8],
      ["Chinonso Frank","Vice Principal / HOD Arts","Academic","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/Chinonso_Frank_Vice_Principal_HOD_Arts_nrqdme.jpg",9],
      ["Essien Beckline","Head of Logistics","Administration","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/10_Essien_Beckline_Head_of_Lodgistics_isldic.jpg",10],
      ["Afolabi Rhoda","Accountant","Administration","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414017/11_Afolabi_Rhoda_Accountant_x0ylkk.jpg",11],
      ["Juvert Essien","Procurement Officer","Administration","https://res.cloudinary.com/dagt2a1w0/image/upload/v1781414016/12_Juvert_Essien_Procurement_Officer_qct6wq.jpg",12],
    ].forEach(([n,t,d,i,o]) => ins.run(n,t,d,i,o));
  }
  if (!db.prepare("SELECT 1 FROM rules_regulations LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO rules_regulations (category,content,display_order) VALUES (?,?,?)");
    const rules = [
      ["Uniform Policy", JSON.stringify(["Students must wear the complete official school uniform at all times.","All shirts, trousers, skirts, and sportswear must be approved by the school.","Uniforms must be clean, neat, and properly worn.","Students must wear their official school neck tie correctly.","Only school-approved cardigans, sweaters, and jackets may be worn."]), 1],
      ["Appearance & Grooming", JSON.stringify(["Students must maintain a neat and decent appearance.","Hair must be clean, tidy, and moderate in style.","Hairstyles extending beyond the base of the neck are not permitted.","Extreme hairstyles, coloured hair, and inappropriate haircuts are prohibited.","Fingernails should be kept short and clean.","Excessive makeup, artificial nails, and jewelry are not allowed."]), 2],
      ["Footwear", JSON.stringify(["Students must wear approved school shoes.","Slides, slippers, sandals, and other inappropriate footwear are prohibited.","On sports days, only approved white sneakers or white canvas shoes may be worn."]), 3],
      ["Sports Day Regulations", JSON.stringify(["Only the official school sports jersey and sports shorts may be worn.","Students must wear approved sports footwear.","Unauthorized sportswear is not permitted.","Students who are not properly dressed for sports activities may not participate."]), 4],
      ["Religious Accommodation", JSON.stringify(["Muslim students may wear approved hijabs.","Hijabs must not cover the face or conceal the school logo.","Approved hijab colours are white, black, or navy blue.","Head coverings must be neat and comply with school guidelines."]), 5],
      ["Punctuality & Attendance", JSON.stringify(["Students must arrive at school before 8:00 a.m.","Morning activities begin promptly and all students are expected to participate.","Repeated lateness may attract disciplinary measures.","Students must attend all classes unless officially excused."]), 6],
      ["Academic Conduct", JSON.stringify(["Students must complete assignments and projects on time.","Examination malpractice and cheating are strictly prohibited.","Students must participate actively in classroom activities.","Academic honesty is expected at all times."]), 7],
      ["Respect & Behaviour", JSON.stringify(["Students must show respect to teachers, staff, visitors, and fellow students.","Bullying, harassment, intimidation, and fighting are prohibited.","Students must use appropriate language at all times.","Any form of discrimination or abusive behaviour is not tolerated."]), 8],
      ["School Property", JSON.stringify(["Students must protect and care for school property.","Damage to school facilities, furniture, books, or equipment may result in disciplinary action and replacement costs.","Vandalism is strictly prohibited."]), 9],
      ["Mobile Phones & Electronic Devices", JSON.stringify(["Mobile phones may only be brought to school if permitted by school policy.","Unauthorized use of phones during lessons is prohibited.","Electronic devices that disrupt learning may be confiscated."]), 10],
      ["Safety & Security", JSON.stringify(["Students must follow all safety instructions issued by the school.","Dangerous objects, weapons, fireworks, or harmful substances are strictly prohibited.","Students must immediately report accidents, injuries, or safety concerns."]), 11],
      ["Cleanliness & Environment", JSON.stringify(["Students must help maintain a clean school environment.","Littering is prohibited.","Waste should be disposed of in designated bins.","Classrooms and school facilities should be kept tidy."]), 12],
      ["Integrity & Responsibility", JSON.stringify(["Students are expected to be honest, responsible, and accountable for their actions.","Theft, dishonesty, and forgery are serious offenses.","Lost property should be reported to the appropriate school authority."]), 13],
      ["Disciplinary Measures", JSON.stringify(["Verbal warning.","Written warning.","Parent/guardian notification.","Detention or corrective measures.","Suspension.","Other disciplinary actions as determined by school management."]), 14],
    ];
    rules.forEach(([c,ct,o]) => ins.run(c,ct,o));
  }
  if (!db.prepare("SELECT 1 FROM anthem_content LIMIT 1").get()) {
    db.prepare(`INSERT INTO anthem_content
      (id,school_title,school_lyrics,school_audio,national_title,national_lyrics,national_audio)
      VALUES (1,?,?,?,?,?,?)`).run(
      "Prudential International School Anthem",
      "",
      "",
      "Nigerian National Anthem",
      `Stanza 1\nNigeria we hail thee,\nOur own dear native land,\nThough tribe and tongue may differ,\nIn brotherhood, we stand,\nNigerians all, and proud to serve\nOur sovereign Motherland.\n\nStanza 2\nOur flag shall be a symbol\nThat truth and justice reign,\nIn peace or battle honour'd,\nAnd this we count as gain,\nTo hand on to our children\nA banner without stain.\n\nStanza 3\nO God of all creation,\nGrant this our one request,\nHelp us to build a nation\nWhere no man is oppressed,\nAnd so with peace and plenty\nNigeria may be blessed.`,
      "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781555362/The_City_Choir_-_The_National_Anthem_CeeNaija.com__1_rbbzfs.mp3"
    );
  }
  if (!db.prepare("SELECT 1 FROM testimonials LIMIT 1").get()) {
    const ins = db.prepare("INSERT INTO testimonials (image_url,caption,display_order,published) VALUES (?,?,?,1)");
    [
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961575/1-5_jyawkr.jpg", "Mr. Alexander Ebute — \"An Amazing School\"", 1],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961587/2-5_cgzqjy.jpg", "Alh Ibrahim Abdullahi & Haj Maryam O. Ibrahim — \"You Guys Are 100%\"", 2],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961642/3-5_zuigzo.jpg", "Mrs Fatima Abimbola — \"A Conducive Learning Environment\"", 3],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961653/4-1_gxmytc.jpg", "Ugbede Johan Hussaini — \"Top Notch Secularity of School's Curriculum and Programs\"", 4],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961667/5-1_wubvno.jpg", "Mrs Idris Husseina — \"Unique\"", 5],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961684/5-2_qbieio.jpg", "Okorie-Njoku Princess — \"Known for Quality Education\"", 6],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961696/6-1_feyjru.jpg", "David Adeniken PhD, FCA — \"There Is Practically No Dull Moment\"", 7],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961992/7-1_crmqru.jpg", "Comfort Bavoushia Gaiya — \"We Have Been Here Since 2015\"", 8],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961964/7-2_m4wcdn.jpg", "Mrs Adeji Ifeoma — \"Dedicated in Bringing Out the Best in Children\"", 9],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961722/9_yoc4kc.jpg", "Mrs Saratu Yunusa Bashir — \"An Overwhelming Experience\"", 10],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961724/Splited_awafnd.jpg", "Barr. Sadiq Abubakar Maikobi — \"A Fun Way of Learning and Flexible Style\"", 11],
    ].forEach(([u,c,o]) => ins.run(u,c,o));
  }
  {
    // Categories: insert any from this list that don't already exist by name,
    // instead of skipping entirely just because the table already has *some* rows.
    // This means a partially-seeded or previously-broken database heals itself
    // on the next deploy, rather than staying stuck with old/incomplete data.
    const insCat = db.prepare("INSERT OR IGNORE INTO gallery_categories (name, display_order) VALUES (?, ?)");
    [
      "Anti-Bullying Campaign", "Anti-Drugs Abuse Campaign", "Art & Music Fiesta",
      "Children's Day", "Football Club", "Graduation",
      "Independence Day", "Inter-house Sport Competition", "Nursery Fruit Day",
      "School Prefects", "Science Day Event", "Staff Parties & Awards",
    ].forEach((name, i) => insCat.run(name, i));
  }
  {
    // Gallery items: same self-healing approach. Each row is checked by its
    // unique Cloudinary URL — if that exact URL is already in the table, skip it;
    // if not, insert it. Safe to run on every boot, on an empty table or a
    // partially-filled one, without ever creating duplicates.
    const exists = db.prepare("SELECT 1 FROM gallery_items WHERE url = ?");
    const ins = db.prepare("INSERT INTO gallery_items (url,caption,type,category,display_order) VALUES (?,?,?,?,?)");
    [
      // Anti-Bullying Campaign
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960940/FB_IMG_1711223507801_hxuk9u.jpg","Anti-Bullying Day assembly","image","Anti-Bullying Campaign",1],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960939/FB_IMG_1711223533136_ycxafo.jpg","Students rallying against bullying","image","Anti-Bullying Campaign",2],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960946/FB_IMG_1711223512232_knvlnh.jpg","\"Stop Bullying\" student group","image","Anti-Bullying Campaign",3],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961029/FB_IMG_1711223485623_rmvyri.jpg","Student with anti-bullying poster","image","Anti-Bullying Campaign",4],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973066/FB_IMG_1711223514887_arvb14.jpg",null,"image","Anti-Bullying Campaign",14],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973106/FB_IMG_1711223519470_hf023y.jpg",null,"image","Anti-Bullying Campaign",15],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973141/FB_IMG_1711223483148_qreodr.jpg",null,"image","Anti-Bullying Campaign",16],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973185/FB_IMG_1711223495706_frxujj.jpg",null,"image","Anti-Bullying Campaign",17],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973226/FB_IMG_1711223498544_pcgmg0.jpg",null,"image","Anti-Bullying Campaign",18],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973279/FB_IMG_1711223503038_adf8rq.jpg",null,"image","Anti-Bullying Campaign",19],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973318/FB_IMG_1711223510192_qsimum.jpg",null,"image","Anti-Bullying Campaign",20],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973352/FB_IMG_1711223526337_pn249s.jpg",null,"image","Anti-Bullying Campaign",21],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973387/FB_IMG_1711223538586_yeqlmq.jpg",null,"image","Anti-Bullying Campaign",22],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973013/FB_IMG_1711223488777_kyvlwy.jpg",null,"image","Anti-Bullying Campaign",23],
      // Anti-Drugs Abuse Campaign
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961335/FB_IMG_1711222277144_flbanx.jpg","Anti-Drugs Abuse Campaign group","image","Anti-Drugs Abuse Campaign",1],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961335/FB_IMG_1711222288548_usjvtq.jpg","\"Say No To Drugs\" student group","image","Anti-Drugs Abuse Campaign",2],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781971909/FB_IMG_1711222285990_bk7vbe.jpg",null,"image","Anti-Drugs Abuse Campaign",6],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781971957/FB_IMG_1711222291053_s7ryry.jpg",null,"image","Anti-Drugs Abuse Campaign",7],
      // Art & Music Fiesta
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147277/WhatsApp_Video_2026-06-22_at_4.52.33_PM_b8uycr.mp4",null,"video","Art & Music Fiesta",13],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147279/WhatsApp_Video_2026-06-22_at_4.52.51_PM_mezmm7.mp4",null,"video","Art & Music Fiesta",14],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147263/WhatsApp_Video_2026-06-22_at_4.52.32_PM_vatvzo.mp4",null,"video","Art & Music Fiesta",15],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_2_aotbjl.jpg",null,"image","Art & Music Fiesta",62],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_3_zclfek.jpg",null,"image","Art & Music Fiesta",63],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_4_rgwatl.jpg",null,"image","Art & Music Fiesta",64],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.29_PM_bf1mb1.jpg",null,"image","Art & Music Fiesta",65],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.31_PM_1_fo3gsv.jpg",null,"image","Art & Music Fiesta",66],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147260/WhatsApp_Image_2026-06-22_at_4.52.31_PM_3_nbukn9.jpg",null,"image","Art & Music Fiesta",67],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147260/WhatsApp_Image_2026-06-22_at_4.52.31_PM_p3wgx0.jpg",null,"image","Art & Music Fiesta",68],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.31_PM_2_rgjto0.jpg",null,"image","Art & Music Fiesta",69],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.32_PM_gfut2t.jpg",null,"image","Art & Music Fiesta",70],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.28_PM_us1mrq.jpg",null,"image","Art & Music Fiesta",71],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.29_PM_1_i99d1l.jpg",null,"image","Art & Music Fiesta",72],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_2_qtlswx.jpg",null,"image","Art & Music Fiesta",73],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_1_zsnnqo.jpg",null,"image","Art & Music Fiesta",74],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_jhqjua.jpg",null,"image","Art & Music Fiesta",75],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.14_PM_hfqq8v.jpg",null,"image","Art & Music Fiesta",76],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.13_PM_hgks6l.jpg",null,"image","Art & Music Fiesta",77],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.14_PM_1_j9bla4.jpg",null,"image","Art & Music Fiesta",78],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781974172/download_1_slkr7a.jpg",null,"image","Art & Music Fiesta",79],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.13_PM_1_go2avm.jpg",null,"image","Art & Music Fiesta",80],
      // Children's Day 
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066616/VID-20260621-WA0010_1_sttzyz.mp4",null,"video","Children's Day ",5],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066617/VID-20260621-WA0009_2_s1wtec.mp4",null,"video","Children's Day ",6],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066621/VID-20260621-WA0011_1_b9rxa4.mp4",null,"video","Children's Day ",7],
      // Football Club 
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782194530/WhatsApp_Video_2026-06-23_at_6.58.44_AM_vteszp.mp4",null,"video","Football Club ",23],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782194532/WhatsApp_Video_2026-06-23_at_6.58.41_AM_yokde5.mp4",null,"video","Football Club ",24],
      // Graduation
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961442/VID-20250713-WA0003_2_okivzk.mp4","Graduation — student dance performance","video","Graduation",1],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961422/VID-20250713-WA0004_2_teg9t8.mp4","Graduation — cap & gown stage line-up","video","Graduation",2],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961450/VID-20250713-WA0024_2_doiyaz.mp4","Graduation — second performance number","video","Graduation",3],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961426/VID-20250713-WA0025_2_woaooh.mp4","Graduation — gowns, wide angle","video","Graduation",4],
      // Independence Day 
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.41_PM_p249l4.jpg",null,"image","Independence Day ",53],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.43_PM_xsdga9.jpg",null,"image","Independence Day ",54],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.41_PM_1_pycntb.jpg",null,"image","Independence Day ",55],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.40_PM_db5j7l.jpg",null,"image","Independence Day ",56],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.42_PM_1_bukgrl.jpg",null,"image","Independence Day ",57],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.42_PM_2_czc32i.jpg",null,"image","Independence Day ",58],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.42_PM_3_iyaqd2.jpg",null,"image","Independence Day ",59],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.43_PM_1_rc18tr.jpg",null,"image","Independence Day ",60],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.42_PM_yqe2fo.jpg",null,"image","Independence Day ",61],
      // Inter-house Sport Competition
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066789/VID-20260621-WA0013_zz5qoh.mp4",null,"video","Inter-house Sport Competition",8],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066808/VID-20260621-WA0012_vgdymz.mp4",null,"video","Inter-house Sport Competition",9],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066828/VID-20260621-WA0015_ash1jc.mp4",null,"video","Inter-house Sport Competition",10],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066828/VID-20260621-WA0015_ash1jc.mp4",null,"video","Inter-house Sport Competition",11],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066834/VID-20260621-WA0014_dlufcp.mp4",null,"video","Inter-house Sport Competition",12],
      // Nursery Fruit Day
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019279/IMG_20230626_093328_428_xgqoc1.jpg",null,"image","Nursery Fruit Day",28],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018827/IMG_20230626_093202_834_w1q1wg.jpg",null,"image","Nursery Fruit Day",29],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018793/IMG_20230626_095247_385_yl6evg.jpg",null,"image","Nursery Fruit Day",30],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018935/IMG_20230626_095318_916_r4puna.jpg",null,"image","Nursery Fruit Day",31],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018883/IMG_20230626_095137_905_rrqt0g.jpg",null,"image","Nursery Fruit Day",32],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019481/IMG_20230626_095226_072_etkbdd.jpg",null,"image","Nursery Fruit Day",33],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019699/IMG_20230626_095357_538_dt8rzi.jpg",null,"image","Nursery Fruit Day",34],
      // School Prefects
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960656/FB_IMG_1711223575509_d9s0wk.jpg","Prefects' Investiture — full group","image","School Prefects",1],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960770/FB_IMG_1711223599976_ewmpsp.jpg","Prefects' Investiture — formal group portrait","image","School Prefects",2],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960727/FB_IMG_1711223580230_cxarkj.jpg","Investiture handshake moment","image","School Prefects",3],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960728/FB_IMG_1711223573522_nmp7sl.jpg","Sport Prefect","image","School Prefects",4],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960726/FB_IMG_1711223582182_fh7puw.jpg","Regulatory Prefect","image","School Prefects",5],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972099/FB_IMG_1711223563716_pjahzw.jpg","Labour Prefect","image","School Prefects",8],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972179/FB_IMG_1711223566345_a3brct.jpg","Social Prefect","image","School Prefects",9],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972303/FB_IMG_1711223593642_n7mbvw.jpg","Senior Prefect Girl","image","School Prefects",11],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972241/FB_IMG_1711223571589_tzoihe.jpg","Health Prefect ","image","School Prefects",24],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972383/FB_IMG_1711223588107_yrl6qe.jpg","Senior Prefect Boy ","image","School Prefects",26],
      // Science Day Event 
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191710/WhatsApp_Video_2026-06-23_at_6.07.34_AM_1_kgcgqv.mp4",null,"video","Science Day Event ",20],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191718/WhatsApp_Video_2026-06-23_at_6.07.17_AM_omikka.mp4",null,"video","Science Day Event ",21],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191723/WhatsApp_Video_2026-06-23_at_6.07.34_AM_nx9whj.mp4",null,"video","Science Day Event ",22],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189056/WhatsApp_Image_2026-06-22_at_9.39.04_PM_1_pgucj6.jpg",null,"image","Science Day Event ",96],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.06_PM_ixppwm.jpg",null,"image","Science Day Event ",97],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.02_PM_lkx3uy.jpg",null,"image","Science Day Event ",98],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.03_PM_mp22u3.jpg",null,"image","Science Day Event ",99],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.03_PM_1_th3izo.jpg",null,"image","Science Day Event ",100],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.06_PM_1_hechaq.jpg",null,"image","Science Day Event ",101],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.05_PM_1_bicl0f.jpg",null,"image","Science Day Event ",102],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.05_PM_3_jltczy.jpg",null,"image","Science Day Event ",103],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.05_PM_2_epnmju.jpg",null,"image","Science Day Event ",104],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.04_PM_f54xik.jpg",null,"image","Science Day Event ",105],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.05_PM_yju7tx.jpg",null,"image","Science Day Event ",106],
      // Staff Parties & Awards
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148018/WhatsApp_Video_2026-06-22_at_5.00.34_PM_ymljpk.mp4",null,"video","Staff Parties & Awards",16],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148020/WhatsApp_Video_2026-06-22_at_5.00.58_PM_ckhwve.mp4",null,"video","Staff Parties & Awards",17],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148026/WhatsApp_Video_2026-06-22_at_5.00.51_PM_qcnvpr.mp4",null,"video","Staff Parties & Awards",18],
      ["https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148030/WhatsApp_Video_2026-06-22_at_5.00.42_PM_kcjiuy.mp4",null,"video","Staff Parties & Awards",19],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0024_ylpvhj.jpg",null,"image","Staff Parties & Awards",39],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065722/IMG-20260621-WA0025_k6j9kj.jpg",null,"image","Staff Parties & Awards",40],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.31_PM_2_uin8ms.jpg",null,"image","Staff Parties & Awards",41],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065842/IMG-20260621-WA0026_vzghx1.jpg",null,"image","Staff Parties & Awards",42],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065723/IMG-20260621-WA0017_aofsci.jpg",null,"image","Staff Parties & Awards",43],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065724/IMG-20260621-WA0019_cr2exu.jpg",null,"image","Staff Parties & Awards",44],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065724/IMG-20260621-WA0018_kcwtce.jpg",null,"image","Staff Parties & Awards",45],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065725/IMG-20260621-WA0020_kut9jl.jpg",null,"image","Staff Parties & Awards",46],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065763/IMG-20260621-WA0027_pvlvhj.jpg",null,"image","Staff Parties & Awards",47],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065764/IMG-20260621-WA0028_pkf8dg.jpg",null,"image","Staff Parties & Awards",48],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065795/IMG-20260621-WA0029_bsgwsv.jpg",null,"image","Staff Parties & Awards",49],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0023_kscvol.jpg",null,"image","Staff Parties & Awards",50],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0022_zq7ta9.jpg",null,"image","Staff Parties & Awards",51],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065720/IMG-20260621-WA0021_htdjcx.jpg",null,"image","Staff Parties & Awards",52],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_2_u5f3ti.jpg",null,"image","Staff Parties & Awards",81],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_3_rabe7j.jpg",null,"image","Staff Parties & Awards",82],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_1_vlw1oe.jpg",null,"image","Staff Parties & Awards",83],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.30_PM_1_fp5lze.jpg",null,"image","Staff Parties & Awards",84],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_u4suij.jpg",null,"image","Staff Parties & Awards",85],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_3_vh3afj.jpg",null,"image","Staff Parties & Awards",86],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_2_nsj9tb.jpg",null,"image","Staff Parties & Awards",87],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.31_PM_1_deymnz.jpg",null,"image","Staff Parties & Awards",88],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.31_PM_v6vgut.jpg",null,"image","Staff Parties & Awards",89],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148014/WhatsApp_Image_2026-06-22_at_5.00.31_PM_4_mma5pz.jpg",null,"image","Staff Parties & Awards",90],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.32_PM_1_bo0pmw.jpg",null,"image","Staff Parties & Awards",91],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.32_PM_2_ikkyai.jpg",null,"image","Staff Parties & Awards",92],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148016/WhatsApp_Image_2026-06-22_at_5.00.32_PM_w78psj.jpg",null,"image","Staff Parties & Awards",93],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148016/WhatsApp_Image_2026-06-22_at_5.00.52_PM_iz8pvv.jpg",null,"image","Staff Parties & Awards",94],
      ["https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148017/WhatsApp_Image_2026-06-22_at_5.00.53_PM_idnmc6.jpg",null,"image","Staff Parties & Awards",95],
    ].forEach(([u,c,t,cat,o]) => { if (!exists.get(u)) ins.run(u,c,t,cat,o); });
  }
});
seed();

// Version history helper
export function logVersion(tableName: string, recordId: number, field: string, oldValue: string | null, newValue: string | null) {
  db.prepare(
    "INSERT INTO version_history (table_name,record_id,field,old_value,new_value) VALUES (?,?,?,?,?)"
  ).run(tableName, recordId, field, oldValue, newValue);
}

export default db;
