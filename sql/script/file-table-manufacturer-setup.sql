-- Configure FileStream Access DB
EXEC sp_configure filestream_access_level, 2
RECONFIGURE
GO

-- Manufacturer File Table
CREATE DATABASE ManufacturerFileTable
ON PRIMARY
(Name = ManufacturerFileTable,
FILENAME = 'C:\ManufacturerFileTable\FTDB.mdf'),
FILEGROUP FTFG CONTAINS FILESTREAM
(NAME = ManufacturerFileTableFS,
FILENAME='C:\ManufacturerFileTable\FS')
LOG ON
(Name = ManufacturerFileTableLog,
FILENAME = 'C:\ManufacturerFileTable\FTDBLog.ldf')
WITH FILESTREAM (NON_TRANSACTED_ACCESS = FULL,
DIRECTORY_NAME = N'ManufacturerFileTable');
GO