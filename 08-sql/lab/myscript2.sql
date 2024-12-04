-- Drop existing tables if they exist
DROP TABLE IF EXISTS Marks;
DROP TABLE IF EXISTS Assessments;
DROP TABLE IF EXISTS Units;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS DegreePrograms;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS ExamBoards;

-- Create DegreePrograms table
CREATE TABLE DegreePrograms (
    DegreeProgramID SERIAL PRIMARY KEY,
    ProgramName VARCHAR(100) NOT NULL,
    DurationYears INT NOT NULL -- Duration of the program in years
);

-- Create Students table
CREATE TABLE Students (
    StudentID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    DegreeProgramID INT,
    YearOfStudy INT NOT NULL,
    FOREIGN KEY (DegreeProgramID) REFERENCES DegreePrograms(DegreeProgramID)
);

-- Create Units table
CREATE TABLE Units (
    UnitID SERIAL PRIMARY KEY,
    UnitName VARCHAR(100) NOT NULL,
    CreditPoints INT NOT NULL,
    TeachingBlock INT NOT NULL -- E.g., 1 for TB1, 2 for TB2
);

-- Create Enrollments table
CREATE TABLE Enrollments (
    EnrollmentID SERIAL PRIMARY KEY,
    StudentID INT NOT NULL,
    UnitID INT NOT NULL,
    EnrollmentYear INT NOT NULL,
    ResitStatus BOOLEAN DEFAULT FALSE, -- Indicates if the student is resitting
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (UnitID) REFERENCES Units(UnitID),
    UNIQUE(StudentID, UnitID, EnrollmentYear) -- Prevent duplicate enrollments for the same year
);

-- Create Assessments table
CREATE TABLE Assessments (
    AssessmentID SERIAL PRIMARY KEY,
    UnitID INT NOT NULL,
    AssessmentName VARCHAR(100) NOT NULL,
    Weight DECIMAL(5, 2) NOT NULL, -- Weight of the assessment as a percentage
    FOREIGN KEY (UnitID) REFERENCES Units(UnitID)
);

-- Create Marks table
CREATE TABLE Marks (
    MarkID SERIAL PRIMARY KEY,
    EnrollmentID INT NOT NULL,
    AssessmentID INT NOT NULL,
    ActualMark DECIMAL(5, 2) NOT NULL,
    AgreedMark DECIMAL(5, 2) DEFAULT NULL,
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollments(EnrollmentID),
    FOREIGN KEY (AssessmentID) REFERENCES Assessments(AssessmentID)
);

-- Create ExamBoards table
CREATE TABLE ExamBoards (
    ExamBoardID SERIAL PRIMARY KEY,
    UnitID INT NOT NULL,
    MeetingDate DATE NOT NULL,
    FOREIGN KEY (UnitID) REFERENCES Units(UnitID)
);

-- Sample Indexing for Performance Optimization
CREATE INDEX idx_student_enrollment ON Enrollments(StudentID, UnitID);
CREATE INDEX idx_unit_assessments ON Assessments(UnitID);

-- Example Insert Statements
INSERT INTO DegreePrograms (ProgramName, DurationYears) VALUES
('Computer Science MSc', 3),
('Mechanical Engineering BEng', 4);

INSERT INTO Students (FirstName, LastName, DateOfBirth, DegreeProgramID, YearOfStudy) VALUES
('Alice', 'Smith', '2002-01-15', 1, 1),
('Bob', 'Jones', '2001-07-20', 2, 2);

INSERT INTO Units (UnitName, CreditPoints, TeachingBlock) VALUES
('Introduction to Programming', 20, 1),
('Engineering Mathematics', 20, 2);

INSERT INTO Enrollments (StudentID, UnitID, EnrollmentYear, ResitStatus) VALUES
(1, 1, 2024, FALSE),
(2, 2, 2024, TRUE);

INSERT INTO Assessments (UnitID, AssessmentName, Weight) VALUES
(1, 'Programming Coursework', 50),
(1, 'Programming Exam', 50),
(2, 'Math Exam', 100);

INSERT INTO Marks (EnrollmentID, AssessmentID, ActualMark, AgreedMark) VALUES
(1, 1, 75, 75),
(2, 3, 50, 55);
