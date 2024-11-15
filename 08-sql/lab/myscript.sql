CREATE TABLE MEMBER (
    member_id INTEGER PRIMARY KEY,
    email CHAR(50) UNIQUE NOT NULL,
    name CHAR(20) NOT NULL,
    student_number INTEGER,
    riding_skill_level INTEGER DEFAULT 0
);

CREATE TABLE COMMITTEE (
    role CHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    PRIMARY KEY (role, year),
    FOREIGN KEY (member_id) REFERENCES MEMBER(member_id)
);

CREATE TABLE EVENT (
    event_id INTEGER PRIMARY KEY,
    name CHAR(50) NOT NULL,
    date DATE NOT NULL,
    location CHAR(50) NOT NULL,
    description CHAR(100),
    organiser_id INTEGER NOT NULL,
    UNIQUE (date, location),
    FOREIGN KEY (organiser_id) REFERENCES MEMBER(member_id)
);

CREATE TABLE ATTENDANCE (
    attendance_id INTEGER PRIMARY KEY,
    event_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES EVENT(event_id),
    FOREIGN KEY (member_id) REFERENCES MEMBER(member_id)
);

-- 插入 MEMBER 數據
INSERT INTO MEMBER (member_id, email, name, student_number, riding_skill_level) 
VALUES (1, 'john.doe@example.com', 'John Doe', 123456, 5),
       (2, 'jane.smith@example.com', 'Jane Smith', NULL, 3);

-- 插入 COMMITTEE 數據
INSERT INTO COMMITTEE (role, year, member_id) 
VALUES ('President', 2024, 1),
       ('Treasurer', 2024, 2);

-- 插入 EVENT 數據
INSERT INTO EVENT (event_id, name, date, location, description, organiser_id) 
VALUES (1, 'Welcome Party', '2024-11-20', 'Student Union', 'Meet and greet', 1),
       (2, 'Skill Workshop', '2024-812-05', 'Sports Hall', 'Advanced skills training', 2);

-- 插入 ATTENDANCE 數據
INSERT INTO ATTENDANCE (attendance_id, event_id, member_id) 
VALUES (1, 1, 1),
       (2, 1, 2),
       (3, 2, 2);
