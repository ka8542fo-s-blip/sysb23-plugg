export const hospitalSeed = `
PRAGMA foreign_keys = ON;

CREATE TABLE Unit (
    UnitID      INTEGER PRIMARY KEY AUTOINCREMENT,
    UnitNo      CHAR(5) NOT NULL,
    UnitName    VARCHAR(50),
    UnitAddress VARCHAR(100),
    CONSTRAINT UQ_Unit_UnitNo UNIQUE(UnitNo)
);

CREATE TABLE Employee (
    EmployeeID      INTEGER PRIMARY KEY AUTOINCREMENT,
    EmpNo           CHAR(11) NOT NULL,
    EmpName         VARCHAR(50),
    EmpAddress      VARCHAR(100),
    EmpPhoneNumber  CHAR(10),
    EmpSalary       INT,
    UnitID          INTEGER,
    CONSTRAINT UQ_Employee_EmpNo UNIQUE(EmpNo),
    CONSTRAINT FK_Employee_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Patient (
    PatientID       INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientNo       CHAR(11) NOT NULL,
    PatientName     VARCHAR(50) NOT NULL,
    PatientAddress  VARCHAR(100),
    PatientPhoneNumber CHAR(10),
    UnitID          INTEGER,
    CONSTRAINT UQ_Patient_PatientNo UNIQUE(PatientNo),
    CONSTRAINT FK_Patient_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Illness (
    IllnessID       INTEGER PRIMARY KEY AUTOINCREMENT,
    IllnessName     NVARCHAR(50) NOT NULL,
    CONSTRAINT UQ_Illness_IllnessName UNIQUE(IllnessName)
);

CREATE TABLE Examines (
    EmployeeID  INTEGER,
    PatientID   INTEGER,
    CONSTRAINT PK_Examines PRIMARY KEY(EmployeeID, PatientID),
    CONSTRAINT FK_Examines_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID),
    CONSTRAINT FK_Examines_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Suffers (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    StartDate   DATETIME,
    CONSTRAINT PK_Suffers PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_Suffers_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_Suffers_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE HasSuffered (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    CONSTRAINT PK_HasSuffered PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_HasSuffered_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_HasSuffered_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Car (
    CarID           INTEGER PRIMARY KEY AUTOINCREMENT,
    LicenseNo       CHAR(10) NOT NULL,
    Brand           VARCHAR(50),
    Price           INT,
    EmployeeID      INTEGER NULL,
    CONSTRAINT UQ_Car_LicenseNo UNIQUE(LicenseNo),
    CONSTRAINT FK_Car_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
);

INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES
    ('U1', 'General Surgery', 'Hospital road'),
    ('U2', 'Rehabilitation', 'Hospital road'),
    ('U3', 'Trauma', 'Care road');

INSERT INTO Employee (EmpNo, EmpName, EmpAddress, EmpPhoneNumber, EmpSalary, UnitID) VALUES
    ('E1', 'Anna', 'Lund', '111', 25000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E2', 'Eva', 'Eslöv', '222', 55000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E3', 'Anna', 'Lund', '333', 37500, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E4', 'Hans', 'Eslöv', '444', 18000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E5', 'Eva', 'Malmö', '555', 279000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('E6', 'Peter', 'Dalby', '666', 32000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Patient (PatientNo, PatientName, PatientAddress, PatientPhoneNumber, UnitID) VALUES
    ('PP1', 'Anna', 'Lund', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP2', 'Hans', 'Dalby', '777', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP3', 'Bo', 'Lund', '888', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP4', 'Peter', 'Lund', '999', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP5', 'Anna', 'London', '100', (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('PP6', 'Anna', 'Berlin', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Examines (EmployeeID, PatientID) VALUES
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E2'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E2'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4'));

INSERT INTO Illness (IllnessName) VALUES
    ('Insomnia'), ('Love sickness'), ('Cough'), ('Amnesia'), ('Incontinence'), ('Chickenpox');

INSERT INTO Suffers (IllnessID, PatientID, StartDate) VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1'), '1953-01-12'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2'), '2006-10-16'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3'), '1978-01-05'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1'), '2008-08-08'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2'), '2003-01-22'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4'), '1998-06-07'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3'), '1978-05-23'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Incontinence'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'), '1989-11-11'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'), '2010-12-09');

INSERT INTO HasSuffered (IllnessID, PatientID) VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'));

INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES
    ('C1', 'saab', 30000, NULL),
    ('C2', 'saab', 40000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E1')),
    ('C3', 'volvo', 50000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E2')),
    ('C4', 'volvo', 60000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E3')),
    ('C5', 'audi', 70000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E4')),
    ('C6', 'audi', 30000, NULL),
    ('C7', 'saab', 30000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E5'));
`;
