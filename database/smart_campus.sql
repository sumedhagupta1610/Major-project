-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_campus
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `link` text,
  `branch` varchar(50) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,'tutorial-1 product design','Q1 amcac\nQ2jjdsac','','ALL','ALL',1,'2026-04-05 05:29:00'),(2,'tutorial1','Q1) explain s/w testing','','ALL','ALL',1,'2026-04-12 15:06:15'),(3,'Software testing MCQ','note these MCQ in the tutorial copy','1776015603798-MCQs.docx','ALL','ALL',1,'2026-04-12 17:40:03'),(4,'flutter','flutter','1776015630543-Flutter.pdf','ALL','ALL',1,'2026-04-12 17:40:30'),(5,'biometric authentication','padh loo','1776094876850-biometric authentication.pptx','ALL','ALL',1,'2026-04-13 15:41:19'),(10,'MCQ','mca of entrepreneurship','1776923904263-MCQs.docx','ALL','ALL',1,'2026-04-23 05:58:24'),(11,'flutter','complete these notes','1777563830515-Flutter.pdf','ALL','ALL',1,'2026-04-30 15:43:50'),(12,'product design','complete all the tutorials','1778427400985-product design tutorial .pdf','ALL','ALL',1,'2026-05-10 15:36:41'),(13,'software testing','complete all the practicals','1778682221273-software testing lab file.pdf','ALL','ALL',1,'2026-05-13 14:23:42');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `branch` varchar(100) NOT NULL,
  `year` varchar(20) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `status` enum('present','absent') NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,3,9,'CS','3','Maths','present','2026-04-16','18:12:01','2026-04-16 12:42:01'),(2,14,9,'CS','3','Maths','present','2026-04-16','18:12:01','2026-04-16 12:42:01'),(3,15,9,'CS','3','Maths','absent','2026-04-16','18:12:01','2026-04-16 12:42:01'),(4,3,9,'CS','3','Maths','present','2026-04-17','11:32:56','2026-04-17 06:02:56'),(5,14,9,'CS','3','Maths','present','2026-04-17','11:32:56','2026-04-17 06:02:56'),(6,15,9,'CS','3','Maths','absent','2026-04-17','11:32:56','2026-04-17 06:02:56'),(7,3,9,'CS','3','General','present','2026-05-10','23:35:26','2026-05-10 18:05:26'),(8,14,9,'CS','3','General','present','2026-05-10','23:35:26','2026-05-10 18:05:26'),(9,15,9,'CS','3','General','present','2026-05-10','23:35:26','2026-05-10 18:05:26'),(10,3,9,'CS','3','General','present','2026-05-13','16:04:51','2026-05-13 10:34:51'),(11,14,9,'CS','3','General','present','2026-05-13','16:04:52','2026-05-13 10:34:52'),(12,15,9,'CS','3','General','present','2026-05-13','16:04:52','2026-05-13 10:34:52');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holiday_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `holiday_date` (`holiday_date`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
INSERT INTO `holidays` VALUES (1,'2026-05-11','sunday','2026-05-11 04:35:42');
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `link` text,
  `branch` varchar(50) DEFAULT 'ALL',
  `year` varchar(20) DEFAULT 'ALL',
  `teacher_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (1,'unit1','product design','','ALL','ALL',1,'2026-04-06 11:28:18'),(2,'complete notes','C++','1775744168021-C++ book.pdf','ALL','ALL',1,'2026-04-09 14:16:08'),(3,'IOT complete notes','IOT','1775836350190-IOT book.pdf','ALL','ALL',1,'2026-04-10 15:52:30'),(4,'model paper','english','1776006398953-English paper iccha.pdf','ALL','ALL',1,'2026-04-12 15:06:38');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `image` text,
  `branch` varchar(50) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (3,'mid term-1 ','test will be started from 7april 2026','','ALL','ALL',1,'2026-03-29 14:39:39'),(4,'Results','5th sem results are out','','ALL','ALL',1,'2026-04-12 15:05:44'),(5,'test','1st test timetable','1776015542571-First Test Time Table.pdf','ALL','ALL',1,'2026-04-12 17:39:02');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `file` text,
  `teacher_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (1,'hello','',1,'2026-04-07 05:14:26'),(2,'first test timetable','',1,'2026-04-08 06:37:37'),(3,'test1 timetable','1775630279643-First Test Time Table.pdf',1,'2026-04-08 06:37:59'),(4,'logo','1776006426041-CodeNexus logo.png',1,'2026-04-12 15:07:06');
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','principal','teacher','student') NOT NULL,
  `branch` varchar(50) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'System Admin','admin@college.com','Admin@123','admin',NULL,NULL,'2026-02-23 23:51:28'),(3,'sumedha gupta','sumedha.gupta505@college.edu','sumedha@123','student','CS',3,'2026-02-26 16:12:12'),(9,'nandita gupta','nandita.gupta382@college.edu','nandita@123','teacher','CS',3,'2026-03-17 18:57:24'),(10,'jay','jay893@college.edu','Temp@2102','teacher','CS',2,'2026-03-18 06:17:10'),(11,'deepak kumar','deepak.kumar613@college.edu','deepak@123','teacher','CS',2,'2026-03-18 06:35:38'),(12,'abhimanyu jain','abhimanyu.jain333@college.edu','Temp@3249','principal',NULL,NULL,'2026-03-18 06:37:07'),(13,'maya jain','maya.jain882@college.edu','Temp@5490','student','CS',2,'2026-04-15 16:46:52'),(14,'author howard','author.howard921@college.edu','Temp@6941','student','CS',3,'2026-04-15 17:04:24'),(15,'khushi sharma','khushi.sharma185@college.edu','Temp@4327','student','CS',3,'2026-04-15 17:14:19'),(16,'manohor sharma','manohor.sharma147@college.edu','Temp@2448','student','CS',2,'2026-04-17 05:58:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14  0:24:33
